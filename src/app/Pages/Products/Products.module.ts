import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgAisModule } from 'angular-instantsearch';
import { FormsModule } from '@angular/forms';

import { ProductsRoutes } from './Products.routing';
import { ProductsListComponent } from './ProductsList/ProductsList.component';
import { DetailPageComponent } from './DetailPage/DetailPage.component';
import { GlobalModule } from '../../Global/Global.module';
import { TemplatesModule } from '../../Templates/Templates.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
	MatButtonModule,
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
	MatPaginatorModule,
	MatSlideToggleModule
} from '@angular/material';
import { ViewAllComponent } from './ViewAll/ViewAll.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ProductsRoutes),
		FlexLayoutModule,
		MatCardModule,
		MatButtonModule,
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
		GlobalModule,
		TemplatesModule,
		NgAisModule,
		FormsModule,
		MatPaginatorModule,
		PipesModule,
		TranslateModule,
		MatSliderModule,
		SlickCarouselModule,
		MatSlideToggleModule,
		MatDialogModule,
		PipesModule
	],
	declarations: [
		ProductsListComponent,
		DetailPageComponent,
		ViewAllComponent
	],
	entryComponents: [

   ],
   exports: [

   ]
})
export class ProductsModule { }
