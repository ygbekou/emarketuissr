import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputFileModule } from 'ngx-input-file';
import {
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatTableModule,
  MatListModule,
  MatDividerModule,
  MatPaginatorModule,
  MatSortModule,
  MatCheckboxModule,
  MatTabsModule,
  MatGridListModule,
  MatRadioModule,
  MatButtonToggleModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatStepperModule,
  MatChipsModule,
  MatBadgeModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalModule } from '../../Global/Global.module';
import { TransactionTypeComponent } from './TransactionType/TransactionType.component';
import { TransactionTypesComponent } from './TransactionTypes/TransactionTypes.component';
import { FundTypeComponent } from './FundType/FundType.component';
import { FundTypesComponent } from './FundTypes/FundTypes.component';
import { FinancesRoutes } from './Finances.routing';
import { SupplierComponent } from './Suppliers/Supplier.component';
import { SuppliersComponent } from './Suppliers/Suppliers.component';
import { BillComponent } from './Billings/Bill.component';
import { BillDetailsComponent } from './Billings/BillDetails.component';
import { BillsComponent } from './Billings/Bills.component';
import { ServiceComponent } from './Service/Service.component';
import { ServicesComponent } from './Services/Services.component';
import { StoreServiceComponent } from './StoreServices/StoreService.component';
import { StoreServicesComponent } from './StoreServices/StoreServices.component';
import { UserBillComponent } from './Billings/UserBill.component';
import { BillPaymentComponent } from './Billings/BillPayment.component';
import { AdminWalletsComponent } from './Wallets/AdminWallets.component';
import { AdminWalletComponent } from './Wallets/AdminWallet.component';
import { AdminDiscountCardsComponent } from './DiscountCards/AdminDiscountCards.component';
import { AdminDiscountCardComponent } from './DiscountCards/AdminDiscountCard.component';
import { AdminDCDetailsComponent } from './DiscountCards/AdminDCDetails.component';

@NgModule({
  declarations: [
    FundTypeComponent,
    FundTypesComponent,
    TransactionTypeComponent,
    TransactionTypesComponent,
    SupplierComponent,
    SuppliersComponent,
    BillComponent,
    BillDetailsComponent,
    BillPaymentComponent,
    BillsComponent,
    UserBillComponent,
    ServiceComponent,
    ServicesComponent,
    StoreServiceComponent,
    StoreServicesComponent,
    AdminWalletsComponent,
    AdminWalletComponent,
    AdminDiscountCardsComponent,
    AdminDiscountCardComponent,
    AdminDCDetailsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatOptionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatRadioModule,
    MatDividerModule,
    MatListModule,
    RouterModule.forChild(FinancesRoutes),
    TranslateModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    GlobalModule,
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,
    MatInputModule,
    MatAutocompleteModule,
    InputFileModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatChipsModule,
    MatBadgeModule,
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

  exports: [
    BillsComponent,
    StoreServicesComponent,
    AdminDiscountCardComponent
  ]
})
export class FinancesModule { }
