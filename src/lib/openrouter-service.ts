import { z } from "zod";
import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";

/**
 * Configuration interface for the OpenRouter service.
 * @interface OpenRouterConfig
 */
export interface OpenRouterConfig {
  apiKey: string;
  endpoint: string;
  modelName: string;
  modelParams: {
    temperature: number;
    max_tokens: number;
    [key: string]: number;
  };
  systemMessage: string;
  responseFormat?: {
    type: "json_schema";
    schema: z.ZodType;
  };
}

export interface ChatResponse {
  answer: string;
  source: string;
}

interface Message {
  role: "system" | "user";
  content: string;
}

/** @internal */
interface Payload {
  messages: Message[];
  model: string;
  response_format: OpenRouterConfig["responseFormat"];
  [key: string]: unknown; // Using unknown instead of any
}

interface OpenRouterErrorResponse {
  error: {
    code: number;
    message: string;
    metadata?: {
      provider_name?: string;
      reasons?: string[];
      flagged_input?: string;
      raw?: unknown;
    };
  };
}

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

export class ValidationError extends OpenRouterError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class ApiError extends OpenRouterError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown // Using unknown instead of any
  ) {
    super(message, "API_ERROR");
    this.name = "ApiError";
  }
}

export const flashcardSchema = z.object({
  flashcards: z.array(
    z.object({
      przod: z.string(),
      tyl: z.string(),
    })
  ),
});

export type FlashcardResponse = z.infer<typeof flashcardSchema>;

export const openRouterResponseSchema = z.object({
  choices: z
    .array(
      z
        .object({
          message: z
            .object({
              content: z.string(),
              role: z.string().optional(),
            })
            .or(
              z.object({
                function_call: z.unknown(),
              })
            ),
        })
        .or(
          z.object({
            text: z.string(),
          })
        )
    )
    .min(1),
  model: z.string().optional(),
  id: z.string().optional(),
  object: z.string().optional(),
  created: z.number().optional(),
  usage: z
    .object({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
      total_tokens: z.number(),
    })
    .optional(),
});

export class OpenRouterService {
  private readonly client: AxiosInstance;
  private requestTimestamps: number[] = [];
  private readonly maxRequestsPerMinute = 60;
  private readonly maxRetries = 3;
  private readonly retryDelay = 60000; // 1 second

  constructor(private readonly config: OpenRouterConfig) {
    console.log("22222");
    // this.validateConfig();
    console.log("3434444");
    this.client = axios.create({
      baseURL: config.endpoint,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "HTTP-Referer": "https://localhost",
        "X-Title": "OpenRouter Service",
      },
    });
    console.log("555555");
  }

  private validateConfig(): void {
    const configSchema = z.object({
      apiKey: z.string().min(1),
      endpoint: z.string().url(),
      modelName: z.string().min(1),
      modelParams: z
        .object({
          temperature: z.number().min(0).max(2),
          max_tokens: z.number().positive(),
        })
        .passthrough(),
      systemMessage: z.string(),
      responseFormat: z.object({
        type: z.literal("json_schema"),
        json_schema: z.object({
          name: z.string(),
          strict: z.boolean(),
          schema: z.record(z.any()),
        }),
      }),
    });

    configSchema.parse(this.config);
  }

  /**
   * Sends a chat message to the OpenRouter API
   * @param {string} userMessage - The user's message to send
   * @returns {Promise<ChatResponse>} The model's response
   * @throws {OpenRouterError} When the request fails
   * @throws {ValidationError} When response validation fails
   * @throws {ApiError} When the API returns an error
   * @example
   * ```typescript
   * const service = new OpenRouterService({...config});
   * const response = await service.sendChatMessage("Hello, how are you?");
   * console.log(response.answer);
   * ```
   */
  public async sendChatMessage(userMessage: string): Promise<ChatResponse> {
    try {
      await this.checkRateLimit();
      const payload = this.createPayload(userMessage);

      for (let attempt = 0; attempt < this.maxRetries; attempt++) {
        try {
          console.log("");
          console.log("");
          console.log("");
          console.log("");
          console.log("1", payload);
          const response = await this.client.post("/api/v1/chat/completions", payload);
          console.log("2");
          console.log("");
          return this.validateResponse(response.data);
        } catch (error) {
          if (this.shouldRetry(error, attempt)) {
            await this.delay(attempt);
            continue;
          }
          throw this.handleAxiosError(error as AxiosError);
        }
      }

      throw new OpenRouterError("Max retries exceeded", "MAX_RETRIES");
    } catch (error) {
      if (error instanceof OpenRouterError) {
        throw error;
      }
      throw new OpenRouterError((error as Error).message || "Unknown error", "INTERNAL_ERROR");
    }
  }

  /** @internal */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    this.requestTimestamps = this.requestTimestamps.filter((t) => t > oneMinuteAgo);

    if (this.requestTimestamps.length >= this.maxRequestsPerMinute) {
      const waitTime = 60000 - (now - this.requestTimestamps[0]);
      throw new OpenRouterError(
        `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`,
        "RATE_LIMIT"
      );
    }

    this.requestTimestamps.push(now);
  }

  /** @internal */
  private createPayload(userMessage: string): Payload {
    return {
      messages: [
        { role: "system", content: this.config.systemMessage },
        { role: "user", content: userMessage },
      ],
      model: this.config.modelName,
      response_format: this.config.responseFormat,
      ...this.config.modelParams,
    };
  }

  /** @internal */
  private validateResponse(data: unknown): ChatResponse {
    try {
      // First try the standard OpenAI format
      const responseSchema = z.object({
        choices: z
          .array(
            z
              .object({
                message: z
                  .object({
                    content: z.string(),
                    role: z.string().optional(),
                  })
                  .or(
                    z
                      .object({
                        function_call: z.unknown(),
                      })
                      .or(
                        z.object({
                          text: z.string(),
                        })
                      )
                  ),
              })
              .or(
                z.object({
                  text: z.string(),
                })
              )
          )
          .min(1),
        model: z.string().optional(),
        id: z.string().optional(),
        object: z.string().optional(),
        created: z.number().optional(),
        usage: z
          .object({
            prompt_tokens: z.number(),
            completion_tokens: z.number(),
            total_tokens: z.number(),
          })
          .optional(),
      });

      const validated = responseSchema.parse(data);

      // Handle both message.content and text formats
      const firstChoice = validated.choices[0];
      const content =
        "message" in firstChoice
          ? (firstChoice.message as { content?: string }).content
          : (firstChoice as { text: string }).text;

      if (!content) {
        throw new ValidationError("Response contains no content");
      }

      return {
        answer: content,
        source: this.config.modelName,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Response validation failed:", error.errors);
        throw new ValidationError(
          `Invalid response format from OpenRouter API: ${error.errors.map((e) => e.message).join(", ")}\nReceived: ${JSON.stringify(data, null, 2)}`
        );
      }
      throw error;
    }
  }

  private shouldRetry(error: unknown, attempt: number): boolean {
    if (!(error instanceof AxiosError) || attempt >= this.maxRetries - 1) {
      return false;
    }

    const status = error.response?.status;
    return !status || status >= 500;
  }

  private async delay(attempt: number): Promise<void> {
    const delay = this.retryDelay * Math.pow(2, attempt);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private handleAxiosError(error: AxiosError): never {
    if (error.response) {
      const data = error.response.data as OpenRouterErrorResponse;
      const status = error.response.status;
      const message = data?.error?.message || error.message;
      const metadata = data?.error?.metadata;

      switch (status) {
        case 400:
          throw new ApiError(
            `Bad Request: ${message} (Check if your parameters are valid and CORS settings are correct)`,
            status,
            metadata
          );
        case 401:
          throw new ApiError(
            `Authentication failed: ${message} (Check if your API key is valid and not expired)`,
            status,
            metadata
          );
        case 402:
          throw new ApiError(`Insufficient credits: ${message} (Add more credits to continue)`, status, metadata);
        case 403:
          throw new ApiError(
            `Content moderation failed: ${message} ${metadata?.reasons ? `(Reasons: ${metadata.reasons.join(", ")})` : ""}`,
            status,
            metadata
          );
        case 404:
          throw new ApiError(
            `Not Found: ${message} (Check if the model name and endpoint URL are correct)`,
            status,
            metadata
          );
        case 408:
          throw new ApiError(`Request timeout: ${message} (The model took too long to respond)`, status, metadata);
        case 429:
          throw new ApiError(
            `Rate limit exceeded: ${message} (Please wait before making more requests)`,
            status,
            metadata
          );
        case 502:
          throw new ApiError(`Model error: ${message} (The selected model is currently unavailable)`, status, metadata);
        case 503:
          throw new ApiError(
            `Service unavailable: ${message} (No available model provider meets your requirements)`,
            status,
            metadata
          );
        default:
          throw new ApiError(`API Error (${status}): ${message}`, status, metadata);
      }
    }
    throw new OpenRouterError(
      `Network Error: ${error.message} (Check your internet connection and the API endpoint)`,
      "NETWORK_ERROR"
    );
  }

  private validateJsonResponse<T>(data: unknown, schema: z.ZodType<T>): T {
    try {
      return schema.parse(JSON.parse(data as string));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`JSON schema validation failed: ${error.errors.map((e) => e.message).join(", ")}`);
      }
      throw error;
    }
  }

  public async sendStructuredChatMessage<T>(userMessage: string, responseSchema: z.ZodType<T>): Promise<T> {
    const response = await this.sendChatMessage(userMessage);
    return this.validateJsonResponse(response.answer, responseSchema);
  }
}
