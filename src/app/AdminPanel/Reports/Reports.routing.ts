import { Routes } from '@angular/router';
import { ReportsComponent } from './Reports/Reports.component';
import { FinancesComponent } from './Finances/Finances.component';

export const ReportsRoutes: Routes = [
	{
		path      : '',
		component : ReportsComponent
	},
	{
		path      : 'finances',
		component : FinancesComponent
	}
];
