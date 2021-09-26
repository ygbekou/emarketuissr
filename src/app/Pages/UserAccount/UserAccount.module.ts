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
import { AmenityComponent } from './amenities/Amenity.component';
import { AmenitiesComponent } from './amenities/Amenities.component';
import { RoomTypeAmenityComponent } from './roomTypes/RoomTypeAmenity.component';

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
    OrderHistoryComponent,
    GridProductComponent,
    SellProductComponent,
    MyProductsComponent,
    SalesDashboardComponent,
    SalesFinanceDashboardComponent,
    SalesOrdersComponent,
    SellerSalesSummariesComponent,
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
    AmenityComponent,
    AmenitiesComponent,
    RoomTypeAmenityComponent
  ],
  exports: [
    StoresComponent,
    EditProfileComponent
  ]
})
export class UserAccountModule { }
