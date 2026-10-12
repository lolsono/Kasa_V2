import nextJest from "next/jest.js";

// next/jest charge la config Next (CSS modules, SWC, variables .env…)
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // Alias "@/..." (si tu as un dossier src/, remplace <rootDir>/$1 par <rootDir>/src/$1)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
