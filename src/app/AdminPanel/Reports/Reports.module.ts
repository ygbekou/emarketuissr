import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './Reports/Reports.component';
import { ReportsRoutes } from './Reports.routing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
	MatIconModule,
	MatButtonModule,
	MatCardModule,
	MatTableModule,
	MatSelectModule,
	MatOptionModule,
	MatMenuModule,
	MatDividerModule,
	MatPaginatorModule,
	MatTabsModule,
	MatChipsModule
} from '@angular/material';
import { WidgetModule } from '../Widget/Widget.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FinancesComponent } from './Finances/Finances.component';

@NgModule({
	declarations: [ReportsComponent, FinancesComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(ReportsRoutes),
		TranslateModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatTableModule,
		MatMenuModule,
		MatDividerModule,
		WidgetModule,
		MatSelectModule,
		MatOptionModule,
		MatTabsModule,
		MatChipsModule,
		MatPaginatorModule,
		FlexLayoutModule
	],
	exports: [ReportsComponent, FinancesComponent]
})
export class ReportsModule { }
