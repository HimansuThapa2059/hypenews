import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import drizzlePlugin from "eslint-plugin-drizzle";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      "@typescript-eslint": tseslint.plugin,
      drizzle: drizzlePlugin,
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
    },
    rules: {
      "drizzle/enforce-delete-with-where": "error",
      "drizzle/enforce-update-with-where": "error",
    },
  },

  // TypeScript defaults
  tseslint.configs.recommended,
]);
