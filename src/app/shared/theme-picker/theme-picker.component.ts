import {
  ChangeDetectionStrategy, Component, Inject, NgModule, PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  MatButtonModule, MatGridListModule, MatIconModule, MatIconRegistry, MatMenuModule,
  MatTooltipModule
} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { AppTheme, ThemeStorage } from './theme-storage/theme-storage';
import { environment } from '../../../environments/environment';
import { StyleManager } from '../style-manager/style-manager';

@Component({
  selector: 'app-theme-picker',
  templateUrl: 'theme-picker.component.html',
  styleUrls: ['theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: use-host-property-decorator
  host: {'aria-hidden': 'true'}
})
export class ThemePickerComponent {
  currentTheme;

  themes = [
    { primary: '#212121', accent: '#FFC107', href: 'light-grey-amber.css', isDark: false, isDefault: true },
    { primary: '#212121', accent: '#FFC107', href: 'dark-grey-amber.css', isDark: true },
    { primary: '#3F51B5', accent: '#E91E63', href: 'light-indigo-pink.css', isDark: false },
    { primary: '#E91E63', accent: '#607D8B', href: 'dark-pink-bluegrey.css', isDark: true },
    { primary: '#673AB7', accent: '#FFC107', href: 'light-deeppurple-amber.css', isDark: false },
    { primary: '#9C27B0', accent: '#4CAF50', href: 'dark-purple-green.css', isDark: true }
  ];

  constructor(
    public styleManager: StyleManager,
    private _themeStorage: ThemeStorage,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    const domain = (isPlatformBrowser(this.platformId)) ? '' : environment.origin;

    this.iconRegistry
    .addSvgIcon('logo', this.sanitizer.bypassSecurityTrustResourceUrl(`${domain}/assets/img/favicons/safari-pinned-tab.svg`))
    .addSvgIcon('github',
      this.sanitizer.bypassSecurityTrustResourceUrl(`${domain}/assets/img/vendors/github-circle-white-transparent.svg`));

    const currentTheme = this._themeStorage.getStoredTheme();
    if (currentTheme) {
      this.installTheme(currentTheme);
    }
  }

  installTheme(theme: AppTheme): void {
    this.currentTheme = this._getCurrentThemeFromHref(theme.href);

    if (theme.isDefault) {
      this.styleManager.removeStyle('theme');
    } else {
      this.styleManager.setStyle('theme', `assets/${theme.href}`);
    }

    if (this.currentTheme) {
      this._themeStorage.storeTheme(this.currentTheme);
    }
  }

  private _getCurrentThemeFromHref(href: string): AppTheme {
    return this.themes.find(theme => theme.href === href);
  }
}

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatTooltipModule,
    CommonModule,
    TranslateModule.forChild()
  ],
  exports: [ThemePickerComponent],
  declarations: [ThemePickerComponent],
  providers: [StyleManager, ThemeStorage]
})
export class ThemePickerModule { }
