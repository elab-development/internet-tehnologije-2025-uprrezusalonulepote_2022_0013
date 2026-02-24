import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
};

export default config;