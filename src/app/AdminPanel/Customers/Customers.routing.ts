import { Routes } from '@angular/router';
import { UsersComponent } from './Customers/Users.component';
import { UserComponent } from './Customers/User.component';
import { StoresComponent } from './Customers/Stores.component';
import { StoreComponent } from './Customers/Store.component';
import { AuthGuardService } from 'src/app/Services/auth-guard.service';
import { RoleGuardService } from 'src/app/Services/role-guard.service';

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
            component: UsersComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'user/:id',
            component: UserComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'stores/list',
            component: StoresComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'store/:id',
            component: StoreComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         }
      ]
   }
];
