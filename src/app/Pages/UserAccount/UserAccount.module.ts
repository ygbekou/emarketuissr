import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgAisModule } from 'angular-instantsearch';
import {
  MatButtonModule,
  MatBadgeModule,
  MatButtonToggleModule,
  MatCardModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatExpansionModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatChipsModule,
  MatListModule,
  MatSidenavModule,
  MatTabsModule,
  MatProgressBarModule,
  MatCheckboxModule,
  MatSliderModule,
  MatRadioModule,
  MatDialogModule,
  MatGridListModule,
  MatTreeModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatPaginatorModule,
  MatAutocompleteModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserAccountRoutes } from './UserAccount.routing';
import { AccountComponent } from './Account/Account.component';
import { ProfileComponent } from './Profile/Profile.component';
import { EditProfileComponent } from './EditProfile/EditProfile.component';
import { StoresComponent } from './Stores/Stores.component';
import { OrderHistoryComponent } from './OrderHistory/OrderHistory.component';
import { GridProductComponent } from './GridProduct/GridProduct.component';
import { TranslateModule } from '@ngx-translate/core';
import { InputFileModule } from 'ngx-input-file';
import { QuillModule } from 'ngx-quill';
import { SellProductComponent } from './SellProduct/SellProduct.component';
import { TemplatesModule } from 'src/app/Templates/Templates.module';
import { MyProductsComponent } from './MyProducts/MyProducts.component';
import { GlobalModule } from 'src/app/Global/Global.module';
import { SalesDashboardComponent } from './Sales-dashboard/Sales-dashboard.component';
import { ReportsModule } from 'src/app/AdminPanel/Reports/Reports.module';
import { SalesOrdersComponent } from './Sales-orders/Sales-orders.component';
import { SalesModule } from 'src/app/AdminPanel/Sales/Sales.module';
import { OrderDetailComponent } from './Order-detail/Order-detail.component';
import { ClientDashboardComponent } from './Client-dashboard/Client-dashboard.component';
import { OpenOrdersComponent } from './Open-orders/Open-orders.component';
import { OrderCancelComponent } from './OrderCancel/OrderCancel.component';
import { ProductsModule } from 'src/app/AdminPanel/Products/Products.module';
import { ReportsComponent } from './Reports/Reports.component';
import { ShippingZonesComponent } from './ShippingZones/ShippingZones.component';
import { DeliveriesComponent } from './Deliveries/Deliveries.component';
import { SellerSalesSummariesComponent } from './Sales-summaries/SellerSalesSummaries.component';
import { SellerDeliveriesSummariesComponent } from './Deliveries-summaries/SellerDeliveriesSummaries.component';
import { SellerPayoutsComponent } from './Sales-payouts/SellerPayouts.component';
import { StoreIngredientComponent } from './SellerIngredients/StoreIngredient.component';
import { StoreIngredientsComponent } from './SellerIngredients/StoreIngredients.component';
import { StoreMenuComponent } from './SellerMenus/StoreMenu.component';
import { StoreMenusComponent } from './SellerMenus/StoreMenus.component';
import { PurchaseOrderComponent } from './SellerPurchaseOrders/PurchaseOrder.component';
import { PurchaseOrdersComponent } from './SellerPurchaseOrders/PurchaseOrders.component';
import { PurchaseOrderDetailsComponent } from './SellerPurchaseOrders/PurchaseOrderDetails.component';
import { TransactionComponent } from './SellerTransactions/Transaction.component';
import { TransactionsComponent } from './SellerTransactions/Transactions.component';
import { SellerBillsComponent } from './SellerBillings/SellerBills.component';
import { FinancesModule } from 'src/app/AdminPanel/Finances/Finances.module';
import { MyShippersComponent } from './MyShippers/MyShippers.component';
import { SalesFinanceDashboardComponent } from './Sales-finance-dashboard/Sales-finance-dashboard.component';
import { BuildingComponent } from './Buildings/Building.component';
import { BuildingsComponent } from './Buildings/Buildings.component';
import { RoomComponent } from './rooms/Room.component';
import { RoomsComponent } from './rooms/Rooms.component';
import { RoomTypeComponent } from './roomTypes/RoomType.component';
import { RoomTypesComponent } from './roomTypes/RoomTypes.component';
import { RoomTypeAmenityComponent } from './roomTypes/RoomTypeAmenity.component';
import { SalesReservationsComponent } from './Sales-reservations/Sales-reservations.component';
import { HospitalitiesModule } from 'src/app/AdminPanel/Hospitalities/Hospitalities.module';
import { ReservationDetailComponent } from './Reservation-detail/Reservation-detail.component';
import { ProductTransferComponent } from './SellerTransfers/ProductTransfer.component';
import { TransfersComponent } from './SellerTransfers/Transfers.component';
import { IngredientTransferComponent } from './SellerTransfers/IngredientTransfer.component';
import { TransferHistoriesComponent } from './SellerTransferHistories/TransferHistories.component';
import { PrdTransferHistoriesComponent } from './SellerTransferHistories/PrdTransferHistories.component';
import { IngTransferHistoriesComponent } from './SellerTransferHistories/IngTransferHistories.component';
import { FundComponent } from './SellerFunds/Fund.component';
import { FundsComponent } from './SellerFunds/Funds.component';
import { BldgImagesComponent } from './Buildings/BldgImages.component';
import { TranlogsComponent } from './Sales-audit/Tranlogs.component';
import { TranlogComponent } from './Sales-audit/Tranlog.component';
import { OpenReservationsComponent } from './Open-reservations/Open-reservations.component';
import { CancelReservationsComponent } from './Open-reservations/Cancel-reservations.component';
import { ComboProductComponent } from 'src/app/AdminPanel/Products/ProductLink/ComboProduct.component';
import { DeliveriesModule } from 'src/app/AdminPanel/Deliveries/Deliveries.module';
import { WalletsComponent } from './Wallets/Wallets.component';
import { WalletComponent } from './Wallets/Wallet.component';
import { RewardsComponent } from './Rewards/Rewards.component';
import { StoresRewardsComponent } from './Store-Rewards/Stores-rewards.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserAccountRoutes),
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatExpansionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatListModule,
    MatSidenavModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSliderModule,
    MatRadioModule,
    MatDialogModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTreeModule,
    MatSlideToggleModule,
    InputFileModule,
    NgAisModule,
    MatStepperModule,
    GlobalModule,
    TemplatesModule,
    ReportsModule,
    SalesModule,
    DeliveriesModule,
    HospitalitiesModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    ProductsModule,
    FinancesModule,
    QuillModule.forRoot({
      theme: 'snow',
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],               // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],      // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }],          // outdent/indent
          [{ direction: 'rtl' }],                       // text direction
          [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ['clean'],                                         // remove formatting button
          ['link', 'image', 'newsVideo']                         // link and image, newsVideo
        ]
      }
    })
  ],
  declarations: [
    AccountComponent,
    ProfileComponent,
    EditProfileComponent,
    StoresComponent,
    WalletComponent,
    WalletsComponent,
    OrderHistoryComponent,
    GridProductComponent,
    SellProductComponent,
    MyProductsComponent,
    SalesDashboardComponent,
    SalesFinanceDashboardComponent,
    SalesOrdersComponent,
    SellerSalesSummariesComponent,
    SellerDeliveriesSummariesComponent,
    SellerPayoutsComponent,
    OrderDetailComponent,
    ClientDashboardComponent,
    OpenOrdersComponent,
    OrderCancelComponent,
    ReportsComponent,
    ShippingZonesComponent,
    DeliveriesComponent,
    StoreIngredientComponent,
    StoreIngredientsComponent,
    StoreMenuComponent,
    StoreMenusComponent,
    PurchaseOrderComponent,
    PurchaseOrdersComponent,
    PurchaseOrderDetailsComponent,
    TransactionComponent,
    TransactionsComponent,
    SellerBillsComponent,
    MyShippersComponent,
    BuildingComponent,
    BuildingsComponent,
    RoomComponent,
    RoomsComponent,
    RoomTypeComponent,
    RoomTypesComponent,
    RoomTypeAmenityComponent,
    SalesReservationsComponent,
    ReservationDetailComponent,
    TransfersComponent,
    ProductTransferComponent,
    IngredientTransferComponent,
    TransferHistoriesComponent,
    PrdTransferHistoriesComponent,
    IngTransferHistoriesComponent,
    FundComponent,
    FundsComponent,
    BldgImagesComponent,
    TranlogsComponent,
    TranlogComponent,
    BldgImagesComponent,
    OpenReservationsComponent,
    CancelReservationsComponent,
    ComboProductComponent,
    RewardsComponent,
    StoresRewardsComponent
  ],
  exports: [
    StoresComponent,
    WalletComponent,
    WalletsComponent,
    EditProfileComponent
  ]
})
export class UserAccountModule { }
