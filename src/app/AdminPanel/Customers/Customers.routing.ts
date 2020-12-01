import { Routes } from '@angular/router';
import { UsersComponent } from './Customers/Users.component';
import { UserComponent } from './Customers/User.component';
import { StoresComponent } from './Customers/Stores.component';
import { StoreComponent } from './Customers/Store.component';

export const CustomersRoutes: Routes = [
   {
      path: '',
      redirectTo: 'UsersComponent',
      pathMatch: 'full'
   },
   {
      path: '',
      children: [
         {
            path: 'users',
            component: UsersComponent
         },
         {
            path: 'user/:id',
            component: UserComponent
         },
         {
            path: 'stores/list',
            component: StoresComponent
         },
         {
            path: 'store/:id',
            component: StoreComponent
         }
      ]
   }
];
