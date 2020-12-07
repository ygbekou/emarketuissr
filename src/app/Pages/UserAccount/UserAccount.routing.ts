import { Routes } from '@angular/router';

import { AccountComponent } from './Account/Account.component';
import { ProfileComponent } from './Profile/Profile.component';
import { EditProfileComponent } from './EditProfile/EditProfile.component';
import { OrderHistoryComponent } from './OrderHistory/OrderHistory.component';
import { GridProductComponent } from './GridProduct/GridProduct.component';
import { StoresComponent } from './Stores/Stores.component';
import { SellProductComponent } from './SellProduct/SellProduct.component';
import { MyProductsComponent } from './MyProducts/MyProducts.component';
import { PaymentChangeModelComponent } from 'src/app/Global/PaymentChangeModel/PaymentChangeModel.component';
import { PaymentChangeAddressComponent } from 'src/app/Global/PaymentChangeAddress/PaymentChangeAddress.component';
import { SalesDashboardComponent } from './Sales-dashboard/Sales-dashboard.component';

export const UserAccountRoutes: Routes = [
   {
      path: '',
      component: AccountComponent,
      children: [
         {
            path: 'profile',
            component: ProfileComponent
         },
         {
            path: 'cards',
            component: PaymentChangeModelComponent
         },
         {
            path: 'addresses',
            component: PaymentChangeAddressComponent
         },
         {
            path: 'order-history',
            component: OrderHistoryComponent
         },
         {
            path: 'profile/edit',
            component: EditProfileComponent
         },
         {
            path: 'grid-product',
            component: GridProductComponent
         },
         {
            path: 'stores',
            component: StoresComponent
         },
         {
            path: 'sell-item',
            component: SellProductComponent
         },
         {
            path: 'my-items',
            component: MyProductsComponent
         },
         {
            path: 'sales-dashboard',
            component: SalesDashboardComponent
         }
      ]
   }
];
