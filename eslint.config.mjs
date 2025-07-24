import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "**/*.d.ts",
    "**/node_modules/",
    "src/server/docs/"
]), {
    files: ["**/*.ts"],

    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:prettier/recommended",
    ),

    rules: {
        indent: ["off", 2],
        "linebreak-style": "off",

        quotes: ["error", "single", {
            avoidEscape: true,
            allowTemplateLiterals: true,
        }],

        semi: ["error", "never"],
        "array-callback-return": ["error"],
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-empty-function": 0,
        // "@typescript-eslint/ban-types": "error", // Deprecated
        "@typescript-eslint/no-unused-vars": 0,
        "@angular-eslint/no-host-metadata-property": 0,
        "@angular-eslint/no-empty-lifecycle-method": 0,
        "@angular-eslint/no-output-native": 0,
        "@angular-eslint/template/eqeqeq": 0,
        "@angular-eslint/component-class-suffix": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "@angular-eslint/prefer-standalone": 0,
        "prettier/prettier": "error", 
        "@angular-eslint/prefer-inject": 0
    },
}, {
    files: ["**/*.html"],
    extends: compat.extends("plugin:@angular-eslint/template/recommended"),
    rules: {},
}, {
    files: ["**/*.html"],
    ignores: ["**/*inline-template-*.component.html"],
    extends: compat.extends("plugin:prettier/recommended"),

    rules: {
        "prettier/prettier": ["error", {
            parser: "angular",
        }],
    },
}, {
    files: ["**/*.less"],
    ignores: ["**/*inline-template-*.component.less"],
    extends: compat.extends("eslint:recommended", "plugin:prettier/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        prettier,
    },

    rules: {
        "prettier/prettier": ["error", {
            parser: "@typescript-eslint/parser",
        }],
    },
}]);
