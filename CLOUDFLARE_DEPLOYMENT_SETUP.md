# Cloudflare Pages Deployment Setup

## Overview

This project has been configured for deployment on Cloudflare Pages using GitHub Actions for continuous integration and deployment.

## Changes Made

### 1. Astro Configuration (`astro.config.mjs`)

- **Adapter**: Changed from `@astrojs/node` to `@astrojs/cloudflare`
- **Platform Proxy**: Enabled for local development compatibility
- **TailwindCSS**: Fixed type compatibility issue with type assertion

### 2. GitHub Actions Workflow (`.github/workflows/main.yml`)

- **Latest Action Versions**: Using the most up-to-date major versions:
  - `actions/checkout@v4`
  - `actions/setup-node@v4` 
  - `cloudflare/wrangler-action@v3` (replaced deprecated `pages-action@v1`)
- **Node.js Version**: Uses Node.js 22.14.0 (from `.nvmrc`)
- **Build Process**: Includes linting, testing, and coverage
- **Environment Variables**: Properly scoped to build step
- **Deployment**: Uses modern Wrangler CLI for Pages deployment

## Required Environment Variables

Create the following secrets in your GitHub repository settings:

### Supabase Configuration
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon/public key

### OpenAI Configuration
- `OPENAI_API_KEY` - Your OpenAI API key for flashcard generation

### Cloudflare Configuration
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with "Cloudflare Pages - Edit" permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## Cloudflare Setup Instructions

### 1. Create API Token

1. Log in to Cloudflare Dashboard
2. Go to "My Profile" → "API Tokens"
3. Click "Create Token"
4. Use "Custom Token" with these permissions:
   - **Account**: `Cloudflare Pages:Edit`
   - **Zone Resources**: Include specific zones if needed
5. Copy the generated token

### 2. Find Account ID

Your Account ID can be found in:
- Cloudflare Dashboard → Right sidebar under "API"
- Or from Pages URL: `https://dash.cloudflare.com/<ACCOUNT_ID>/pages`

### 3. Create Cloudflare Pages Project

1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project"
3. Choose "Connect to Git" (if not using direct upload)
4. Set project name to: `10x0-cards-2`
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave empty)

### 4. Environment Variables in Cloudflare

In your Cloudflare Pages project settings, add these environment variables:
- `SUPABASE_URL`
- `SUPABASE_KEY` 
- `OPENAI_API_KEY`

## Deployment Workflow

The GitHub Actions workflow will trigger on:
- **Push to main branch**: Deploys to production
- **Pull requests**: Can be configured for preview deployments

### Workflow Steps:
1. **Checkout**: Gets the latest code
2. **Setup Node.js**: Installs Node.js 22.14.0 with npm cache
3. **Install Dependencies**: Runs `npm ci` for faster, reliable installs
4. **Lint**: Runs ESLint to check code quality
5. **Test**: Runs unit tests (`npm run test:run`)
6. **Coverage**: Generates test coverage report
7. **Build**: Builds the project with environment variables
8. **Deploy**: Deploys to Cloudflare Pages using Wrangler v3

## Local Development

For local development with Cloudflare compatibility:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Notes

- **E2E Tests**: Excluded from CI/CD as requested
- **Wrangler v3**: Using the latest stable version
- **Security**: All secrets are properly managed through GitHub Secrets
- **Caching**: npm cache is enabled for faster builds
- **Branch Strategy**: Configured for `main` branch deployment

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check environment variables are set correctly
2. **Deployment Errors**: Verify Cloudflare API token permissions
3. **Type Errors**: The TailwindCSS type assertion may need adjustment for future versions

### Useful Commands:

```bash
# Check Wrangler authentication
npx wrangler whoami

# List Pages projects
npx wrangler pages project list

# Deploy manually
npx wrangler pages deploy dist --project-name=10x0-cards-2
```

## Migration from Previous Setup

If migrating from a different deployment setup:

1. Update any hardcoded URLs to use Cloudflare Pages domains
2. Update CORS settings in Supabase if domain changes
3. Test all authentication flows with new domain
4. Update any external service configurations (webhooks, etc.)
