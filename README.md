# Wanted Games Admin UI

Frontend admin interface for the Wanted Games web application. Provides content management for games, gallery, and about sections.

## Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Radix UI for accessible components
- Axios for API requests
- React Dropzone for file uploads
- SortableJS for drag-and-drop reordering

## Prerequisites
- Node.js (v18+)
- npm

## Quick Start

1. **Clone & Install:**
   ```bash
   git clone git@github.com:yaminmomo15/wanted-games-admin-ui.git
   cd wanted-games-admin-ui
   npm install
   ```

2. **Configure:**
   - Copy `.env.example` to `.env`
   - Update environment variables:
     ```
     VITE_API_URL=http://localhost:3000/api
     VITE_AUTH_TOKEN=your_jwt_token
     ```

3. **Run:**
   ```bash
   npm run dev     # Start dev server at http://localhost:5173
   npm run build   # Build for production
   npm run lint    # Run ESLint checks
   ```
