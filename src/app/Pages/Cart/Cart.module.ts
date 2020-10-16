import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule, 
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
	MatGridListModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'ngx-card/ngx-card';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CartRoutes } from './Cart.routing';

import { GlobalModule } from '../../Global/Global.module';
import { TranslateModule } from '@ngx-translate/core';
import { CartComponent } from './Cart.component';


@NgModule({
   imports: [
      CommonModule,
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
      RouterModule.forChild(CartRoutes),
      GlobalModule,
      FormsModule,
      ReactiveFormsModule,
      TranslateModule,
      CardModule
   ],
   declarations: [
      CartComponent
   ],
   exports: [
      CartComponent
   ]
})
export class CartModule { }
