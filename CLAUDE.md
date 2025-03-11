# Development Guidelines for RWZB

## Commands
- Build: `npm run build` (vue-tsc -b && vite build)
- Dev server: `npm run dev` (vite)
- Preview build: `npm run preview` (vite preview)

## Stack
- Vue 3 (Composition API with `<script setup>`)
- TypeScript (strict mode)
- Vite
- TailwindCSS
- Axios for API requests

## Style Guidelines
- Use TypeScript interfaces for all data structures
- Follow Vue 3 Composition API style with `<script setup>`
- Group component code: props → refs → computed → methods → lifecycle
- Use async/await for asynchronous operations
- Handle API errors with try/catch and provide user feedback
- Use Tailwind utility classes, avoid custom CSS when possible
- Keep components small and focused on a single responsibility
- Use PascalCase for component names, camelCase for variables/functions
- Environment values should use .env files, not hardcoded
- Prefer const over let, avoid var completely