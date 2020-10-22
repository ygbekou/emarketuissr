import { Routes } from '@angular/router';

import { AccountComponent } from './Account/Account.component';
import { ProfileComponent } from './Profile/Profile.component';
import { EditProfileComponent } from './EditProfile/EditProfile.component';
import { CardsComponent } from './Cards/Cards.component';
import { OrderHistoryComponent } from './OrderHistory/OrderHistory.component';
import { GridProductComponent } from './GridProduct/GridProduct.component';
import { StoresComponent } from './Stores/Stores.component';
import { SellProductComponent } from './SellProduct/SellProduct.component';
import { MyProductsComponent } from './MyProducts/MyProducts.component';
import { AddressesComponent } from 'src/app/Global/Addresses/Addresses.component';

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
            component: CardsComponent
         },
         {
            path: 'addresses',
            component: AddressesComponent
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
         }
      ]
   }
];
