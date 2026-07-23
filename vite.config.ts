// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import fs from 'fs';

const alias: Record<string, string> = {};
const localModulePaths: string[] = [];
const optimizeDepsExclude: string[] = [];

// Helper to register a local module for development
const registerLocalModule = (
  envVar: string,
  packageName: string,
  relativePath: string
) => {
  if (process.env[envVar] !== 'true') return;

  const localPath = path.resolve(__dirname, relativePath);

  if (fs.existsSync(localPath)) {
    console.log(`✅ Loading ${packageName} from ${localPath}`);
    alias[packageName] = localPath;
    localModulePaths.push(path.dirname(localPath)); // Parent dir of src/
    optimizeDepsExclude.push(packageName);
  } else {
    console.warn(`❌ Failed to locate ${packageName} at`, localPath);
  }
};

// Build fs.allow list only when local modules are used
const getFsAllow = () => {
  if (localModulePaths.length === 0) return undefined;
  return [
    __dirname, // dashboard-demo/
    path.resolve(__dirname, 'node_modules'), // dashboard-demo/node_modules
    ...localModulePaths,
  ];
};

// 🔁 Register local modules
registerLocalModule('DEVELOP_REACT_TOOLBOX', '@jasperoosthoek/react-toolbox', '../react-toolbox/src');
registerLocalModule('DEVELOP_TANSTACK_QUERY_CRUD', '@jasperoosthoek/tanstack-query-crud', '../tanstack-query-crud/src');

const fsAllow = getFsAllow();

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias,
  },
  optimizeDeps: optimizeDepsExclude.length > 0 ? {
    exclude: optimizeDepsExclude,
  } : undefined,
  server: {
    fs: fsAllow ? { allow: fsAllow } : undefined,
  },
  define: {
    __USE_MOCKS__: JSON.stringify(process.env.VITE_USE_MOCKS === 'true'),
  },
});
