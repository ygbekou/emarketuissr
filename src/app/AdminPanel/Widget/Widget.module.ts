import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule,
			MatInputModule, 
			MatFormFieldModule,
			MatIconModule,
			MatCardModule,
			MatButtonModule,
			MatProgressSpinnerModule,
			MatCheckboxModule,
			MatMenuModule,
			MatDialogModule,
			MatDatepickerModule,
			MatTableModule
		 } from '@angular/material';
import { ChartsModule } from 'ng2-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';;
import { FlexLayoutModule } from '@angular/flex-layout';

import { TitleComponent } from './TitleComponent/TitleComponent.component';
import { TopsideMenuComponent } from './Menu/TopsideMenu/TopsideMenu.component';
import { DeleteListDialogComponent } from './PopUp/DeleteListDialog/DeleteListDialog.component';
import { BuySellChartComponent } from './Charts/BuySellChart/BuySellChart.component';
import { SeeListDialogComponent } from './PopUp/SeeListDialog/SeeListDialog.component';
import { AddNewUserComponent } from './PopUp/AddNewUser/AddNewUser.component';
import { HeaderUserProfileDropdownComponent } from './HeaderUserProfileDropdown/HeaderUserProfileDropdown.component';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
		TitleComponent,
		TopsideMenuComponent,
		DeleteListDialogComponent,
		BuySellChartComponent,
		SeeListDialogComponent,
		AddNewUserComponent,
		HeaderUserProfileDropdownComponent
	],
	imports: [
		CommonModule,
		MatSelectModule,
		MatInputModule,
		MatFormFieldModule,
		FormsModule,
		ChartsModule,
		MatIconModule,
		MatCardModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		PerfectScrollbarModule,
		TranslateModule,
		MatCheckboxModule,
		MatMenuModule,
		MatDialogModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatTableModule,  
		FlexLayoutModule,
		RouterModule
	],
	exports : [
		TitleComponent,
		TopsideMenuComponent,
		BuySellChartComponent,
		HeaderUserProfileDropdownComponent
	],
	entryComponents: [
      DeleteListDialogComponent,
      SeeListDialogComponent,
      AddNewUserComponent
   ]
})
export class WidgetModule { }
