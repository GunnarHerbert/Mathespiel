# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Database
SQLite command for filling tasks34, tasks56, tasks78 table:

```sql 
WITH RECURSIVE numbers AS (
    SELECT 1 AS num
    UNION ALL
    SELECT num + 1 FROM numbers WHERE num < 2
)
INSERT INTO tasks56 (id, solution, difficulty, year)
SELECT 560000 - 1 + num, 'A', '3', 2005 FROM numbers;

WITH RECURSIVE numbers AS (
    SELECT 1 AS num
    UNION ALL
    SELECT num + 1 FROM numbers WHERE num < 1
)
INSERT INTO tasks56 (id, solution, difficulty, year)
SELECT 560000 - 1 + 2 + num, 'A', '4', 2005 FROM numbers;

WITH RECURSIVE numbers AS (
    SELECT 1 AS num
    UNION ALL
    SELECT num + 1 FROM numbers WHERE num < 2
)
INSERT INTO tasks56 (id, solution, difficulty, year)
SELECT 560000 - 1 + 3 + num, 'A', '5', 2005 FROM numbers;
```
