import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgAisModule } from 'angular-instantsearch';
import {
  MatButtonModule,
  MatBadgeModule,
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
  MatPaginatorModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserAccountRoutes } from './UserAccount.routing';
import { AccountComponent } from './Account/Account.component';
import { ProfileComponent } from './Profile/Profile.component';
import { EditProfileComponent } from './EditProfile/EditProfile.component';
import { CardsComponent } from './Cards/Cards.component';
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
import { AddressesComponent } from './Addresses/Addresses.component';
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

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserAccountRoutes),
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
    ProductsModule,
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
    CardsComponent,
    StoresComponent,
    OrderHistoryComponent,
    GridProductComponent,
    SellProductComponent,
    AddressesComponent,
    MyProductsComponent,
    SalesDashboardComponent,
    SalesOrdersComponent,
    OrderDetailComponent,
    ClientDashboardComponent,
    OpenOrdersComponent,
    OrderCancelComponent,
    ReportsComponent
  ],
  exports: [
    CardsComponent,
    StoresComponent,
    EditProfileComponent
  ]
})
export class UserAccountModule { }
