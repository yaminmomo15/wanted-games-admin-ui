/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_TOKEN: string
  // Add other env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 