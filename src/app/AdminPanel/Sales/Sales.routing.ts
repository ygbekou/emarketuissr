import { Routes } from '@angular/router';
import { OrdersComponent } from './Orders/Orders.component';
import { OrderViewComponent } from './Orders/OrderView.component';
import { ReturnsComponent } from './Returns/Returns.component';
import { ReturnComponent } from './Returns/Return.component';
import { AuthGuardService } from 'src/app/Services/auth-guard.service';
import { RoleGuardService } from 'src/app/Services/role-guard.service';
import { AdminReviewsComponent } from './Reviews/AdminReviews.component';
import { ReviewComponent } from 'src/app/Global/Review/Review.component';

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
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'orderView/:id',
            component: OrderViewComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'returns',
            component: ReturnsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'reviews',
            component: AdminReviewsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: ':reviewType/:reviewTypeId/review/:reviewId',
            component: ReviewComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'return/:id',
            component: ReturnComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         }
      ]
   }
];
