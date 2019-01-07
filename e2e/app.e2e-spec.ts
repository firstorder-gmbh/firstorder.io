import { AppPage } from './app.po';

describe('app', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display header title', async () => {
    await page.navigateTo('/');
    await expect(page.getElementText('.header-title')).toEqual('Home');
  });
});
