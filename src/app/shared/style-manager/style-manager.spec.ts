import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { StyleManager } from './style-manager';

describe('StyleManager', () => {
  let styleManager: StyleManager;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [StyleManager]
  }));

  beforeEach(inject([StyleManager], (sm: StyleManager) => {
    styleManager = sm;
  }));

  afterEach(() => {
    const links = document.head.querySelectorAll('link');
    for (const link of Array.prototype.slice.call(links)) {
      if (link.className.includes('style-manager-')) {
        document.head.removeChild(link);
      }
    }
  });

  it('should add stylesheet to head', async () => {
    styleManager.setStyle('test', 'test.css');
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const styleEl = document.head.querySelector('.style-manager-test') as HTMLLinkElement;
    await expect(styleEl).not.toBeNull();
    await expect(styleEl.href.endsWith('test.css')).toBe(true);
  });

  it('should change existing stylesheet', async () => {
    styleManager.setStyle('test', 'test.css');
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const styleEl = document.head.querySelector('.style-manager-test') as HTMLLinkElement;
    await expect(styleEl).not.toBeNull();
    await expect(styleEl.href.endsWith('test.css')).toBe(true);

    styleManager.setStyle('test', 'new.css');
    await expect(styleEl.href.endsWith('new.css')).toBe(true);
  });

  it('should remove existing stylesheet', async () => {
    styleManager.setStyle('test', 'test.css');
    // tslint:disable-next-line: no-unnecessary-type-assertion
    let styleEl = document.head.querySelector('.style-manager-test') as HTMLLinkElement;
    await expect(styleEl).not.toBeNull();
    await expect(styleEl.href.endsWith('test.css')).toBe(true);

    styleManager.removeStyle('test');
    // tslint:disable-next-line: no-unnecessary-type-assertion
    styleEl = document.head.querySelector('.style-manager-test') as HTMLLinkElement;
    await expect(styleEl).toBeNull();
  });
});
