import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule,
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
   MatSlideToggleModule,
	MatProgressBarModule,
	MatCheckboxModule,
	MatSliderModule,
	MatRadioModule,
	MatDialogModule,
	MatGridListModule,
   MatStepperModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'ngx-card/ngx-card';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CheckoutRoutes } from './Checkout.routing';
import { PaymentComponent } from './Payment/Payment.component';
import { SigninComponent } from './Signin/Signin.component';
import { FinalReceiptComponent } from './FinalReceipt/FinalReceipt.component';

import { GlobalModule } from '../../Global/Global.module';
import { TranslateModule } from '@ngx-translate/core';
import { CartModule } from '../Cart/Cart.module';
import { PaymentCurrencyComponent } from './Payment/PaymentCurrency.component';
import { PaymentDeliveryStepper } from './Payment/PaymentDeliveryStepper.component';


@NgModule({
   imports: [
      CommonModule,
      MatButtonModule,
      MatButtonToggleModule,
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
      MatSlideToggleModule,
      MatStepperModule,
      RouterModule.forChild(CheckoutRoutes),
      GlobalModule,
      FormsModule,
      ReactiveFormsModule,
      TranslateModule,
      CardModule,
      CartModule
   ],
   declarations: [
      PaymentComponent,
      SigninComponent,
      FinalReceiptComponent,
      PaymentCurrencyComponent,
      PaymentDeliveryStepper
   ]
})
export class CheckoutModule { }
