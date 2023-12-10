import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieModule } from 'ngx-cookie';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
   MatButtonModule,
   MatCardModule,
   MatMenuModule,
   MatToolbarModule,
   MatIconModule,
   MatInputModule,
   MatButtonToggleModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatProgressSpinnerModule,
   MatTableModule,
   MatExpansionModule,
   MatSelectModule,
   MatSnackBarModule,
   MatTooltipModule,
   MatChipsModule,
   MatListModule,
   MatSidenavModule,
   MatTabsModule,
   MatProgressBarModule,
   MatCheckboxModule,
   MatSliderModule,
   MatRadioModule,
   MatDialogModule,
   MatGridListModule,
   MatPaginatorModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ToastaModule } from 'ngx-toasta';
import { BidiModule } from '@angular/cdk/bidi';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { environment } from '../environments/environment';

import { AppRoutes } from './app-routing';
import { GlobalModule } from './Global/Global.module';
import { TemplatesModule } from './Templates/Templates.module';
import { MenuItems } from './Core/menu/menu-items/menu-items';

import { AppService } from './Services/app.service';

import { AppComponent } from './app.component';
import { MainComponent } from './Main/Main.component';
import { HeaderOneComponent } from './Layouts/Header/HeaderOne/HeaderOne.component';
import { HeaderTwoComponent } from './Layouts/Header/HeaderTwo/HeaderTwo.component';
import { HeaderThreeComponent } from './Layouts/Header/HeaderThree/HeaderThree.component';
import { FooterOneComponent } from './Layouts/Footer/FooterOne/FooterOne.component';
import { FooterTwoComponent } from './Layouts/Footer/FooterTwo/FooterTwo.component';
import { MenuComponent } from './Layouts/Menu/Menu/Menu.component';
import { HomeoneComponent } from './Pages/Home/HomeOne/HomeOne.component';
import { HomeTwoComponent } from './Pages/Home/HomeTwo/HomeTwo.component';
import { HomeThreeComponent } from './Pages/Home/HomeThree/HomeThree.component';
import { NotFoundComponent } from './Pages/NotFound/NotFound.component';
import { SideBarMenuComponent } from './Layouts/Menu/SidebarMenu/SidebarMenu.component';
import { PaymentDetailSideBarComponent } from './Layouts/PaymentDetailSideBar/PaymentDetailSideBar.component';
import { FixedHeaderComponent } from './Layouts/Header/FixedHeader/FixedHeader.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AdminPanelModule } from './AdminPanel/admin-panel.module';
import { AppInfoStorage } from './app.info.storage';
import { TokenStorage } from './token.storage';
import { InputFileConfig, InputFileModule } from 'ngx-input-file';
import { FooterComponent } from './Layouts/Footer/Footer/Footer.component';
import { CartModule } from './Pages/Cart/Cart.module';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { LangComponent } from './Layouts/lang/lang.component';
import { AuthGuardService } from './Services/auth-guard.service';
import { JwtModule } from '@auth0/angular-jwt';
import { RoleGuardService } from './Services/role-guard.service';
import { LocaleService } from './Services/locale.service';
import { AppInterceptor } from './Global/utils/app-interceptor';

const config: InputFileConfig = {
   fileAccept: '*'
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
   suppressScrollX: true
};

/********** Custom option for ngx-translate ******/
export function createTranslateLoader(http: HttpClient) {
   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter() {
   return localStorage.getItem('access_token');
}

@NgModule({
   declarations: [
      AppComponent,
      MainComponent,
      HomeoneComponent,
      HeaderOneComponent,
      FooterOneComponent,
      MenuComponent,
      SideBarMenuComponent,
      NotFoundComponent,
      PaymentDetailSideBarComponent,
      HomeTwoComponent,
      HeaderTwoComponent,
      FooterTwoComponent,
      HomeThreeComponent,
      HeaderThreeComponent,
      FixedHeaderComponent,
      LangComponent,
      FooterComponent
   ],
   imports: [
      BrowserTransferStateModule,
      BrowserModule.withServerTransition({ appId: 'angssr' }),
      BrowserAnimationsModule,
      RouterModule.forRoot(AppRoutes, { useHash: false, onSameUrlNavigation: 'reload', anchorScrolling: 'enabled' }),
      GlobalModule,
      TemplatesModule,
      MatButtonModule,
      MatButtonToggleModule,
      FlexLayoutModule,
      MatCardModule,
      MatMenuModule,
      MatToolbarModule,
      MatIconModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatProgressSpinnerModule,
      MatTableModule,
      MatExpansionModule,
      MatSelectModule,
      MatSnackBarModule,
      MatTooltipModule,
      MatChipsModule,
      MatListModule,
      MatSidenavModule,
      MatTabsModule,
      MatProgressBarModule,
      MatCheckboxModule,
      MatSliderModule,
      MatRadioModule,
      MatDialogModule,
      MatGridListModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      LoadingBarRouterModule,
      LoadingBarModule,
      AngularFireModule.initializeApp(environment.firebase, 'embryo'),
      AngularFirestoreModule,
      AngularFireDatabaseModule,
      ToastaModule.forRoot(),
      BidiModule,
      MatPaginatorModule,
      TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
         }
      }),
      SlickCarouselModule,
      PerfectScrollbarModule,
      DeviceDetectorModule.forRoot(),
      InputFileModule.forRoot(config),
      AdminPanelModule,
      CartModule,
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter
         },
      }),
      CookieModule.forRoot()

   ],
   providers: [
      TokenStorage,
      AppInfoStorage,
      MenuItems,
      AppService,
      AuthGuardService,
      RoleGuardService,
      { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
      {
         provide: PERFECT_SCROLLBAR_CONFIG,
         useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
      },
      {
         provide: LocationStrategy,
         useClass:  PathLocationStrategy
      },
      {
         provide: LOCALE_ID,
         useFactory: (localeService: LocaleService) => localeService.getLocale(),
         deps: [LocaleService]
      }
   ],
   exports: [
      RouterModule,
      ToastaModule
   ],

   bootstrap: [AppComponent]
})
export class AppModule { }
