// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import fs from 'fs';

const alias: Record<string, string> = {};

// 🔁 REACT TOOLBOX
if (process.env.DEVELOP_REACT_TOOLBOX === 'true') {
  const reactToolboxPath = path.resolve(__dirname, '../react-toolbox/src');

  if (fs.existsSync(reactToolboxPath)) {
    console.log(`✅ Loading @jasperoosthoek/react-toolbox from ${reactToolboxPath}`);
    Object.assign(alias, { '@jasperoosthoek/react-toolbox': reactToolboxPath });
  } else {
    console.warn('❌ Failed to locate @jasperoosthoek/react-toolbox at', reactToolboxPath);
  }
}

// 🔁 ZUSTAND CRUD REGISTRY
if (process.env.DEVELOP_ZUSTAND_CRUD_REPOSITORY === 'true') {
  const zustandCrudPath = path.resolve(__dirname, '../zustand-crud-registry/src');

  if (fs.existsSync(zustandCrudPath)) {
    console.log(`✅ Loading @jasperoosthoek/zustand-crud-registry from ${zustandCrudPath}`);
    Object.assign(alias, { '@jasperoosthoek/zustand-crud-registry': zustandCrudPath });
  } else {
    console.warn('❌ Failed to locate @jasperoosthoek/zustand-crud-registry at', zustandCrudPath);
  }
}

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias,
    preserveSymlinks: false, // equivalent to webpack's `symlinks: false`
  },
});
