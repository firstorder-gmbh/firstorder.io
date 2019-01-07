import { browser, by, element, promise } from 'protractor';

export class AppPage {
  getElementText(selector: string): promise.Promise<string> {
    return element(by.css(selector)).getText();
  }

  navigateTo(destination): promise.Promise<any> {
    return browser.get(destination);
  }
}
