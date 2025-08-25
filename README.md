## API Playwright Tests 🚀

End-to-end API testing framework built with Playwright

```
- Cucumber
- TypeScript.
  This project supports BDD-style tests with .feature files and step definitions.

📂 Project Structure
api-playwright-tests/
├── features/ # Gherkin feature files
│ └── products.feature
├── steps/ # Step definitions
│ └── products.steps.ts
├── support/ # Custom World, hooks, etc.
│ └── world.ts
├── cucumber.js # Cucumber configuration
├── package.json
└── tsconfig.json
```

## 🛠️ Setup

### 1. Install Dependencies

```
   npm install
```

### 2. Run Tests

```
   npx cucumber-js
```

## Cucumber will pick up .feature files and run them using Playwright.

```
⚙️ Configuration
cucumber.js
module.exports = {
default: {
require: [
"steps/**/*.ts",
"support/**/*.ts"
],
requireModule: ["ts-node/register"],
format: ["progress"],
publishQuiet: true
}
};
```

## VS Code IntelliSense (💡 Fix yellow lines in .feature files)

Create .vscode/settings.json:

```
{
"cucumberautocomplete.steps": [
"steps/**/*.ts",
"src/steps/**/*.ts",
"tests/steps/**/*.ts",
"src/test/steps/**/*.ts"
],
"cucumberautocomplete.syncfeatures": "features/\*_/_.feature",
"cucumberautocomplete.strictGherkinCompletion": true,
"files.associations": {
"\*.feature": "cucumber"
},
"typescript.tsdk": "node_modules/typescript/lib"
}
```

Then reload VS Code (Ctrl+Shift+P → Developer: Reload Window).

### 🧪 Example Test

Feature: features/products.feature

```
Feature: Products API

Scenario: Get all products list
When I send a GET request to "/productsList"
Then the response status should be 200
And the response should contain "products"

Step Definition: steps/products.steps.ts
import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
```

```
When('I send a GET request to {string}', async function (this: CustomWorld, endpoint: string) {
this.response = await this.requestContext.get(endpoint);
});

Then('the response status should be {int}', async function (this: CustomWorld, statusCode: number) {
expect(this.response.status()).toBe(statusCode);
});

Then('the response should contain {string}', async function (this: CustomWorld, key: string) {
const body = await this.response.json();
expect(body).toHaveProperty(key);
console.log("✅ Products count:", body[key]?.length);
});
```
