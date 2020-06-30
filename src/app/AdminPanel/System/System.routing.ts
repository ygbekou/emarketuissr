import { Routes } from '@angular/router';
import { LanguagesComponent } from './Languages/Languages.component';

export const SystemRoutes: Routes = [
   {
      path: '',
      redirectTo: 'LanguagesComponent',
      pathMatch: 'full'
   },
   {
      path: '',
      children: [
         {
            path: 'languages',
            component: LanguagesComponent
         }
      ]
   }
];
