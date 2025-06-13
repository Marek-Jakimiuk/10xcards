# 10x-cards

## Table of Contents
- [10x-cards](#10x-cards)
  - [Table of Contents](#table-of-contents)
  - [Project Name](#project-name)
  - [Project Description](#project-description)
  - [Tech Stack](#tech-stack)
  - [Getting Started Locally](#getting-started-locally)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Available Scripts](#available-scripts)
  - [Project Scope](#project-scope)
  - [Project Status](#project-status)
  - [License](#license)

## Project Name
10x-cards

## Project Description
10x-cards is a web-based application designed to help users quickly create and manage educational flashcards. The application leverages AI to generate flashcards from any given text, streamlining the creation process. Users can also manually create, edit, and delete flashcards, while benefiting from integrated spaced repetition sessions. It also includes basic user authentication to ensure secure, personalized access to each user's flashcards.

## Tech Stack
- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind 4, Shadcn/ui
- **Backend:** Supabase (Authentication & PostgreSQL)
- **AI Integration:** OpenRouter.ai API for LLM-based flashcard generation
- **CI/CD & Hosting:** GitLab Actions, Docker
- **Tooling:** ESLint, Prettier

## Getting Started Locally
### Prerequisites
- Node.js version **22.14.0** (as specified in the `.nvmrc` file)
- npm or yarn package manager

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the displayed URL (typically http://localhost:3000).

## Available Scripts
- `npm run dev` - Starts the Astro development server.
- `npm run build` - Builds the project for production.
- `npm run preview` - Serves the production build.
- `npm run astro` - Executes Astro CLI commands.
- `npm run lint` - Lints the codebase using ESLint.
- `npm run lint:fix` - Automatically fixes linting issues.
- `npm run format` - Formats the codebase using Prettier.

## Project Scope
The 10x-cards project focuses on providing an efficient platform for managing educational flashcards. Key features include:
- **Automatic Flashcard Generation:** Convert provided text into AI-generated flashcards.
- **Manual Management:** Create, edit, or delete flashcards as needed.
- **User Authentication:** Secure registration, login, and account management.
- **Learning Sessions:** Integration with a spaced repetition algorithm for effective studying.
- **Statistical Insights:** Monitor generated flashcards and user engagement.

This scope is aligned with the MVP requirements, ensuring a focus on core functionalities with potential for future enhancements.

## Project Status
The project is currently in the MVP stage, with ongoing development to enhance features and overall performance.

## License
This project is licensed under the MIT License.
