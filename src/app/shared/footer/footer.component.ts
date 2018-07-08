import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { FooterService } from './../footer/footer.service';
import { LanguageService } from './../translate/language.service';
import { ThemePickerModule } from './../theme-picker/theme-picker.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  availableLanguages: Array<string> = this.languageService.availableLanguages;
  currentLanguage: string = this.languageService.getLanguage();
  dir: Direction;
  footerClass: string;
  language: string;

  constructor(
      private footerService: FooterService,
      private languageService: LanguageService
  ) {
    this.footerService.footerClass.subscribe((footerClass: string) => {
      this.footerClass = footerClass;
    });

    this.language = this.languageService.getLanguage();
    this.languageService.dir.next(this.language === 'ar' ? 'rtl' : 'ltr');
    this.languageService.dir.subscribe(dir => {
      this.dir = dir;
    });
  }

  setLanguage(locale: string): void {
    this.languageService.setLanguage(locale);
    this.currentLanguage = locale;
    this.languageService.dir.next(locale === 'ar' ? 'rtl' : 'ltr');
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ThemePickerModule,
    TranslateModule.forChild()
  ],
  exports: [FooterComponent],
  declarations: [FooterComponent]
})
export class FooterModule {}
