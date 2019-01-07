import { ThemeStorage } from './theme-storage';

const testStorageKey = ThemeStorage.storageKey;
const testTheme = {
  primary: '#000000',
  accent: '#ffffff',
  href: 'test/path/to/theme'
};
const createTestData = () => {
  window.localStorage[testStorageKey] = JSON.stringify(testTheme);
};
const clearTestData = () => {
  window.localStorage.clear();
};

describe('ThemeStorage Service', () => {
  const service = new ThemeStorage(null);
  const getCurrTheme = () => JSON.parse(window.localStorage.getItem(testStorageKey));
  const secondTestTheme = {
    primary: '#666666',
    accent: '#333333',
    href: 'some/cool/path'
  };

  beforeEach(createTestData);
  afterEach(clearTestData);

  it('should set the current theme', async () => {
    await expect(getCurrTheme()).toEqual(testTheme);
    service.storeTheme(secondTestTheme);
    await expect(getCurrTheme()).toEqual(secondTestTheme);
  });

  it('should get the current theme', async () => {
    const theme = service.getStoredTheme();
    await expect(theme).toEqual(testTheme);
  });

  it('should clear the stored theme data', async () => {
    await expect(getCurrTheme()).not.toBeNull();
    service.clearStorage();
    await expect(getCurrTheme()).toBeNull();
  });

  it('should emit an event when setTheme is called', async () => {
    spyOn(service.onThemeUpdate, 'emit');
    service.storeTheme(secondTestTheme);
    await expect(service.onThemeUpdate.emit).toHaveBeenCalled();
    await expect(service.onThemeUpdate.emit).toHaveBeenCalledWith(secondTestTheme);
  });
});
