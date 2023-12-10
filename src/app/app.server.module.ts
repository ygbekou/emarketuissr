import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CookieBackendModule } from 'ngx-cookie-backend';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { TranslateUniversalLoader } from './Services/translate-universal-loader.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppInterceptor } from './Global/utils/app-interceptor';

export function translateFactory() {
   return new TranslateUniversalLoader('./dist/assets/i18n', '.json');
}


@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    HttpClientModule,
    FlexLayoutServerModule,
    ServerTransferStateModule,
    CookieBackendModule.forRoot(),
    TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useFactory: translateFactory
         }
    })
  ],
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
   ],
  bootstrap: [ AppComponent ],
})
export class AppServerModule {}
