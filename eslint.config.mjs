import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
  {
    // The image studio renders static, dev-only scenes that are captured to
    // images; its small inline helpers never hold state.
    files: ["app/(studio)/**/*.tsx"],
    rules: { "react-hooks/static-components": "off" },
  },
]);
