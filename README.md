# Magrev

[![CI status](https://github.com/ciffelia/magrev/actions/workflows/ci.yaml/badge.svg)](https://github.com/ciffelia/magrev/actions/workflows/ci.yaml)

## Development

```sh
# Start development server
pnpm run dev

# Generate TypeScript types for Cloudflare Worker bindings
pnpm run cf-typegen

# Generate a new migration file from schema
pnpm run migration:generate

# Apply migrations locally
pnpm run migration:apply:local
```

## Linting

```sh
# Typecheck
pnpm run typecheck

# Lint
pnpm run lint

# Auto-fix linting issues
pnpm run fix
```

## Deployment

```sh
# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Deploy to Cloudflare
# Make sure to run `pnpm run build` first
pnpm run deploy

# Apply migrations to production database
pnpm run migration:apply:remote
```
