import { Routes, Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';

import { MainComponent } from './Main/Main.component';
import { HomeoneComponent } from './Pages/Home/HomeOne/HomeOne.component';
import { HomeTwoComponent } from './Pages/Home/HomeTwo/HomeTwo.component';
import { HomeThreeComponent } from './Pages/Home/HomeThree/HomeThree.component';
import { CartComponent } from './Pages/Cart/Cart.component';
import { NotFoundComponent } from './Pages/NotFound/NotFound.component';
import { TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routes } from './pages/terms-conditions/terms-conditions.module';

export const AppRoutes: Routes = [
   {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
   },
   {
      path: '',
      component: MainComponent,
      children: [
         {
            path: 'home-one',
            component: HomeoneComponent
         },
         {
            path: 'home',
            component: HomeTwoComponent
         },
         {
            path: 'home-three',
            component: HomeThreeComponent
         },
         {
            path: 'products', loadChildren: () =>
               import('./Pages/Products/Products.module').then(m => m.ProductsModule)
         },
         {
            path: 'cart',
            component: CartComponent
         },
         {
            path: 'not-found',
            component: NotFoundComponent
         },
         {
            path: 'session', loadChildren: () =>
               import('./Pages/Session/Session.module').then(m => m.SessionModule)
         },
         {
            path: 'checkout', loadChildren: () =>
               import('./Pages/Checkout/Checkout.module').then(m => m.CheckoutModule)
         },
         {
            path: '', loadChildren: () =>
               import('./Pages/About/About.module').then(m => m.AboutModule)
         },
         {
            path: 'blogs', loadChildren: () =>
               import('./Pages/Blogs/Blogs.module').then(m => m.BlogsModule)
         },
         {
            path: 'account', loadChildren: () =>
               import('./Pages/UserAccount/UserAccount.module').then(m => m.UserAccountModule)
         },
         {
            path: 'terms-conditions', loadChildren: () => import('./pages/terms-conditions/terms-conditions.module')
               .then(m => m.TermsConditionsModule)
         }
      ]
   },
   {
      path: '**',
      redirectTo: 'not-found'
   }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
   constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private translateService: TranslateService,
      private titleService: Title,
      private metaService: Meta
   ) {
      this.router.events
         .filter(event => event instanceof NavigationEnd)
         .map(() => this.activatedRoute)
         .map(route => {
            while (route.firstChild) { route = route.firstChild; }
            return route;
         })
         .filter(route => route.outlet === 'primary')
         .mergeMap(route => route.data)
         .subscribe((event) => {
            console.log('What is happening *****************');
            translateService.get(event['titleTranslationPath'])
               .subscribe((res: string) => {
                  this.titleService.setTitle(res);
               });
            translateService.get(event['metaDescriptionTranslationPath'])
               .subscribe((res: string) => {
                  const tag = { name: 'description', content: res };
                  const attributeSelector = 'name="description"';
                  this.metaService.removeTag(attributeSelector);
                  this.metaService.addTag(tag, false);
               });
         });
   }

}
