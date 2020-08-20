import { Routes } from '@angular/router';

import { ProductsListComponent } from './ProductsList/ProductsList.component';
import { DetailPageComponent } from './DetailPage/DetailPage.component';
import { ViewAllComponent } from './ViewAll/ViewAll.component';

export const ProductsRoutes: Routes = [
	{
		path: '',
		component: ProductsListComponent
	},
	{
		path: 'viewAll',
		component: ViewAllComponent
	},
	{
		path: 'dtl/:prdId/:ptsId',
		component: DetailPageComponent
	},
	{
		path: ':type',
		component: ProductsListComponent
	}
]