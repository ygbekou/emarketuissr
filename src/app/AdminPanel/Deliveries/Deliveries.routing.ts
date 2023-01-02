import { Routes } from '@angular/router';
import { AuthGuardService } from './../../Services/auth-guard.service';
import { RoleGuardService } from './../../Services/role-guard.service';
import { DeliveriesSummariesComponent } from './Summaries/DeliveriesSummaries.component';
import { DeliveryPayoutsComponent } from './Payouts/DeliveryPayouts.component';

export const DeliveriesRoutes: Routes = [
   {
      path: '',
      redirectTo: 'OrdersComponent',
      pathMatch: 'full'
   },
   {
      path: '',
      children: [
         {
            path: 'deliv/summaries',
            component: DeliveriesSummariesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'deliv/payouts/:id',
            component: DeliveryPayoutsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         }
      ]
   }
];
