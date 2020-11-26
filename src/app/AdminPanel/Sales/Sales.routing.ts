import { Routes } from '@angular/router';
import { OrdersComponent } from './Orders/Orders.component';
import { OrderViewComponent } from './Orders/OrderView.component';
import { ReturnsComponent } from './Returns/Returns.component';
import { ReturnComponent } from './Returns/Return.component';

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
         },
         {
            path: 'returns',
            component: ReturnsComponent
         },
         {
            path: 'return/:id',
            component: ReturnComponent
         }
      ]
   }
];
