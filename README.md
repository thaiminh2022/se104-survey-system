# SE104 Survey System

This survey system is a university project for our class: SE104 using nextjs and supabase backend

## Dependencies

- **For running supabase locally related activities**: Docker desktop

## Getting Started

### 1. Clone the project

```bash
git clone https://github.com/thaiminh2022/se104-survey-system
```

### 2. Install all dependencies

```bash
pnpm install
```

### 3. Run the database

1. Confirm that you have Docker Desktop running
2. Run supabase locally

```bash
pnpm supabase start
```

Note: To stop the database later:

```bash
pnpm supabase stop --all
```

### 4. Copy the environment variables

1. Rename .env.example to .env.local (file at root folder)
2. Open supabase studio localhost

This path is usually the default:

```
http://localhost:54323
```

3. Click connect button on top left
4. Go to app frameworks
5. Copy **the values** in to .env.local

```
NEXT_PUBLIC_SUPABASE_URL=Your supabase NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=Your supabase NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 5. Run the development server

You can run this project using npm, pnpm, yarn or bun, but **the project is first configured with pnpm**
To install pnpm, make sure you have nodejs, then run:

```bash
npm install -g pnpm@next-11
```

```bash
pnpm dev # <---- Prefer
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Developing as COLLABORATORS

### Working with git

- Branch `master` will be the main branch for final updates
- Your feature will be in another branch
- To submit feature, make a pull request to `master` branch

#### Add a feature

1. Create a branch for your feature

```bash
git switch -c "YOUR BRANCH NAME"
```

2. Do your works
3. Before pushing, make sure to commit everything

```bash
git add . # In case you miss something
git push -u origin "YOUR BRANCH NAME"
```

4. Go to github and create a pull request to master branch
5. Fix merge conflict if occurs, wait for code review before merge (Send a message to Thaiminh2022)

### Dev tools

- This project is configured with pnpm as recommended by nextjs docs
- Supabase will be run locally using supabase cli

### Add a table to database (Create migration)

- Do it in your hosted supabase studio
- Add a migration

```bash
npx supabase migration new add_table
```

### Update local database to match

```bash
pnpm supabase migration up
```

### Component library

- This project use shadcn for component library.
- Preset: Vega
- Theme: Base

To add a component, the component will be added under components/ui:

```bash
pnpm dlx shadcn@latest add YOUR_COMPONENT
```

Checkout their [documentation](https://ui.shadcn.com/docs) for more info

### App UI

- Styling will be done with tailwind
