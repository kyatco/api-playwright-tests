import { Before, After } from '@cucumber/cucumber';
import { CustomWorld } from './world';

Before(async function (this: CustomWorld) {
  await this.initRequest();
});

After(async function (this: CustomWorld) {
  if (this.requestContext) {
    await this.requestContext.dispose();
  }
});
