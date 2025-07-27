interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // (list any other VITE_… variables here)
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
