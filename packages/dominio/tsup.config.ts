import { defineConfig } from 'tsup';

// Compila el paquete en dos formatos: CommonJS (lo usa la API) y ESM (lo usa la web),
// más los archivos de tipos (.d.ts) para que TypeScript lo entienda desde fuera.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
});
