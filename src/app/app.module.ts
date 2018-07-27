import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, TransferState } from '@angular/platform-browser';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { LayoutModule } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule
} from '@angular/material';

// App
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { ImprintComponent } from './pages/imprint/imprint.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ShopService } from './pages/shop/shop.service';

// Shared
import { FooterModule } from './shared/footer/footer.component';
import { FooterService } from './shared/footer/footer.service';
import { HeaderModule } from './shared/header/header.component';
import { HeaderService } from './shared/header/header.service';
import { LanguageService } from './shared/translate/language.service';
import { ProductService } from './shared/product/product.service';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { SidenavService } from './shared/sidenav/sidenav.service';
import { StyleManager } from './shared/style-manager/style-manager';
import { ThemePickerModule } from './shared/theme-picker/theme-picker.component';
import { ThemeStorage } from './shared/theme-picker/theme-storage/theme-storage';
import { TranslateBrowserLoader } from './shared/translate/translate-browser-loader.service';

// AoT requires an exported function for factories
export function exportTranslateStaticLoader(http: HttpClient, transferState: TransferState): TranslateBrowserLoader {
  return new TranslateBrowserLoader('/assets/i18n/', '.json', transferState, http);
}

/**
 * NgModule that includes all Material modules that are required to serve the app.
 */
@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    LayoutModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,

    // Material
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
  ]
})
export class MaterialModule { }

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ImprintComponent,
    ShopComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: environment.firebase.projectId}),
    AngularFireModule.initializeApp(environment.firebase, environment.firebase.projectId), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FooterModule,
    HeaderModule,
    FormsModule,
    HttpClientJsonpModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    ThemePickerModule,
    TransferHttpCacheModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: exportTranslateStaticLoader,
        deps: [HttpClient, TransferState]
      }
    })
  ],
  providers: [
    FooterService,
    HeaderService,
    LanguageService,
    ProductService,
    ShopService,
    SidenavService,
    StyleManager,
    ThemeStorage,
    TransferState,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
