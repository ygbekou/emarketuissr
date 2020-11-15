import { Routes } from '@angular/router';

import { SigninComponent } from './Signin/Signin.component';
import { PaymentComponent } from './Payment/Payment.component';
import { FinalReceiptComponent } from './FinalReceipt/FinalReceipt.component';
import { PaymentChangeModelComponent } from 'src/app/Global/PaymentChangeModel/PaymentChangeModel.component';
import { PaymentChangeAddressComponent } from 'src/app/Global/PaymentChangeAddress/PaymentChangeAddress.component';

export const CheckoutRoutes: Routes = [
   {
      path : '',
      component: SigninComponent
   },
   {
      path: 'signin',
      component: SigninComponent
   },
	{
		path: 'payment',
		component: PaymentComponent
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
      path: 'final-receipt',
      component: FinalReceiptComponent
   }
];