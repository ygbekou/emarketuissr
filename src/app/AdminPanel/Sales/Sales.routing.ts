import { Routes } from '@angular/router';
import { OrdersComponent } from './Orders/Orders.component';
import { OrderViewComponent } from './Orders/OrderView.component';

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
            component: OrdersComponent
         },
         {
            path: 'orderView/:id',
            component: OrderViewComponent
         }
      ]
   }
];
