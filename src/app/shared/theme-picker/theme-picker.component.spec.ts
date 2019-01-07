import { async, TestBed } from '@angular/core/testing';
import { ThemePickerComponent, ThemePickerModule } from './theme-picker.component';
import { AppTestingModule } from '../../testing/testing.module';

describe('ThemePicker', () => {
  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      imports: [ThemePickerModule, AppTestingModule]
    }).compileComponents();
  }));

  it('should install theme based on href', async () => {
    const fixture = TestBed.createComponent(ThemePickerComponent);
    const component = fixture.componentInstance;
    const href = 'dark-pink-bluegrey.css';
    spyOn(component.styleManager, 'setStyle');
    component.installTheme({
      primary: '#E91E63',
      accent: '#607D8B',
      href
    });
    await expect(component.styleManager.setStyle).toHaveBeenCalled();
    await expect(component.styleManager.setStyle).toHaveBeenCalledWith('theme', `assets/${href}`);
  });
});
