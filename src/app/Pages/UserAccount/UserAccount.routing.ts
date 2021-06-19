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
import { SalesOrdersComponent } from './Sales-orders/Sales-orders.component';
import { OrderDetailComponent } from './Order-detail/Order-detail.component';
import { ClientDashboardComponent } from './Client-dashboard/Client-dashboard.component';
import { OpenOrdersComponent } from './Open-orders/Open-orders.component';
import { AuthGuardService } from 'src/app/Services/auth-guard.service';
import { RoleGuardService } from 'src/app/Services/role-guard.service';
import { OrderCancelComponent } from './OrderCancel/OrderCancel.component';
import { ReportsComponent } from './Reports/Reports.component';
import { ShippingZonesComponent } from './ShippingZones/ShippingZones.component';
import { DeliveriesComponent } from './Deliveries/Deliveries.component';
import { SellerSalesSummariesComponent } from './Sales-summaries/SellerSalesSummaries.component';
import { SellerPayoutsComponent } from './Sales-payouts/SellerPayouts.component';
import { StoreIngredientsComponent } from './SellerIngredients/StoreIngredients.component';
import { StoreMenusComponent } from './SellerMenus/StoreMenus.component';
import { PurchaseOrdersComponent } from './SellerPurchaseOrders/PurchaseOrders.component';

export const UserAccountRoutes: Routes = [
   {
      path: '',
      component: AccountComponent,
      children: [
         {
            path: 'profile',
            component: ProfileComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'deliveries',
            component: DeliveriesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'cards',
            component: PaymentChangeModelComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'addresses',
            component: PaymentChangeAddressComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'order-history',
            component: OrderHistoryComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'profile/edit',
            component: EditProfileComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'grid-product',
            component: GridProductComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'stores',
            component: StoresComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'sell-item',
            component: SellProductComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'my-items',
            component: MyProductsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'sales-dashboard',
            component: SalesDashboardComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'sales-orders',
            component: SalesOrdersComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'sales-summaries',
            component: SellerSalesSummariesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'payouts/:id',
            component: SellerPayoutsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'allpayouts',
            component: SellerPayoutsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'order-detail/:id',
            component: OrderDetailComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'order-cancel/:orderId',
            component: OrderCancelComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'client-dashboard',
            component: ClientDashboardComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'open-orders',
            component: OpenOrdersComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'reports',
            component: ReportsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'shipping-zones',
            component: ShippingZonesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'store-ingredients',
            component: StoreIngredientsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'store-menus',
            component: StoreMenusComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'purchase-orders',
            component: PurchaseOrdersComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         }
      ]
   }
];
