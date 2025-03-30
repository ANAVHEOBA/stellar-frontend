import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Fix unused vars warnings
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      // Fix React Hook dependency warnings
      "react-hooks/exhaustive-deps": "warn",
      // Fix unescaped entities
      "react/no-unescaped-entities": "off",
      // Allow any type in specific cases
      "@typescript-eslint/no-explicit-any": ["warn", {
        "ignoreRestArgs": true
      }]
    }
  }
];

export default eslintConfig;
