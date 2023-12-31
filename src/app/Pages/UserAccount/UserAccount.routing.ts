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
import { TransactionsComponent } from './SellerTransactions/Transactions.component';
import { SellerBillsComponent } from './SellerBillings/SellerBills.component';
import { MyShippersComponent } from './MyShippers/MyShippers.component';
import { SalesFinanceDashboardComponent } from './Sales-finance-dashboard/Sales-finance-dashboard.component';
import { BuildingsComponent } from './Buildings/Buildings.component';
import { RoomTypesComponent } from './roomTypes/RoomTypes.component';
import { SalesReservationsComponent } from './Sales-reservations/Sales-reservations.component';
import { ReservationDetailComponent } from './Reservation-detail/Reservation-detail.component';
import { TransfersComponent } from './SellerTransfers/Transfers.component';
import { TransferHistoriesComponent } from './SellerTransferHistories/TransferHistories.component';
import { FundsComponent } from './SellerFunds/Funds.component';
import { TranlogsComponent } from './Sales-audit/Tranlogs.component';
import { OpenReservationsComponent } from './Open-reservations/Open-reservations.component';
import { CancelReservationsComponent } from './Open-reservations/Cancel-reservations.component';
import { SellerDeliveriesSummariesComponent } from './Deliveries-summaries/SellerDeliveriesSummaries.component';
import { WalletsComponent } from './Wallets/Wallets.component';
import { RewardsComponent } from './Rewards/Rewards.component';
import { StoresRewardsComponent } from './Store-Rewards/Stores-rewards.component';

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
            path: 'wallets',
            component: WalletsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'rewards',
            component: RewardsComponent,
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
            path: 'sales-finance-dashboard',
            component: SalesFinanceDashboardComponent,
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
            path: 'deliveries-summaries',
            component: SellerDeliveriesSummariesComponent,
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
            path: 'reports/:rptType',
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
         },
         {
            path: 'transactions',
            component: TransactionsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'funds',
            component: FundsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'seller-bills',
            component: SellerBillsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'my-shippers',
            component: MyShippersComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'room-types',
            component: RoomTypesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'rooms',
            component: BuildingsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'sales-reservations',
            component: SalesReservationsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'reservationdetail/:id',
            component: ReservationDetailComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'transfers',
            component: TransfersComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'transferHistories',
            component: TransferHistoriesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'sales-audit',
            component: TranlogsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'open-reservations',
            component: OpenReservationsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'reservation-cancel/:reservationId',
            component: CancelReservationsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         },
         {
            path: 'stores-rewards',
            component: StoresRewardsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Buyer', 'Seller', 'Administrator']
            }
         }
      ]
   }
];
