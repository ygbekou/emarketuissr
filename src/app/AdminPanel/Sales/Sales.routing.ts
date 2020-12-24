import { Routes } from '@angular/router';
import { OrdersComponent } from './Orders/Orders.component';
import { OrderViewComponent } from './Orders/OrderView.component';
import { ReturnsComponent } from './Returns/Returns.component';
import { ReturnComponent } from './Returns/Return.component';
import { AuthGuardService } from 'src/app/Services/auth-guard.service';
import { RoleGuardService } from 'src/app/Services/role-guard.service';

export const SalesRoutes: Routes = [
   {
      path: '',
      redirectTo: 'OrdersComponent',
      pathMatch: 'full'
   },
   {
      path: '',
      children: [
          {
            path: 'orders',
            component: OrdersComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'orderView/:id',
            component: OrderViewComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'returns',
            component: ReturnsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'return/:id',
            component: ReturnComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         }
      ]
   }
];
