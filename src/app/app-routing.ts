import { Routes } from '@angular/router';

import { MainComponent } from './Main/Main.component';
import { HomeoneComponent } from './Pages/Home/HomeOne/HomeOne.component';
import { HomeTwoComponent } from './Pages/Home/HomeTwo/HomeTwo.component';
import { HomeThreeComponent } from './Pages/Home/HomeThree/HomeThree.component';
import { CartComponent } from './Pages/Cart/Cart.component';
import { NotFoundComponent } from './Pages/NotFound/NotFound.component';

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

/*
@NgModule({
   imports: [RouterModule.forRoot(AppRoutes)],
   exports: [RouterModule]
})
export class AppRoutingModule {
   constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private appService: AppService,
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
            console.log(appService.ssImage);
            console.log(appService.ssTitle);
            console.log(appService.ssUrl);
            this.titleService.setTitle(appService.ssTitle);
            const tag = { name: 'description', content: appService.ssTitle };
            const attributeSelector = 'name="description"';
            this.metaService.removeTag(attributeSelector);
            this.metaService.addTag(tag, false);

const descTag = { property: 'og:description', content: 'Voici une description' };
      const descSel = 'property="og:description"';
      this.metaService.removeTag(descSel);
      this.metaService.addTag(descTag, false);

      const imgTag = {
         property: 'og:image', content: 'https://www.kekouda.com/assets/images/products/219/product_219_0.jpg'
      };
      const imgSel = 'property="og:image"';
      this.metaService.removeTag(imgSel);
      this.metaService.addTag(imgTag, false);

      const urlTag = { property: 'og:url', content: 'https://www.kekouda.com/#/products/dtl/219/321' };
      const urlSel = 'property="og:url"';
      this.metaService.removeTag(urlSel);
      this.metaService.addTag(urlTag, false);



         });
   }

}
 */