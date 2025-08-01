import { Config } from "jest"

const config: Config = {
  
  bail: true,
    preset: "ts-jest",                
    testEnvironment: "node",

    transform: {
        "^.+\\.tsx?$": ["ts-jest", { useESM: true }]  
    },
    

    extensionsToTreatAsEsm: [".ts"],  
    
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"   
    },

    testMatch: ["**/*.spec.ts"],


  clearMocks: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

};

export default config;