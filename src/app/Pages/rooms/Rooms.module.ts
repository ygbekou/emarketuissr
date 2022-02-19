import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgAisModule } from 'angular-instantsearch';
import { FormsModule } from '@angular/forms';

import { GlobalModule } from '../../Global/Global.module';
import { TemplatesModule } from '../../Templates/Templates.module';
import { SessionModule } from '../Session/Session.module';

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
	MatGridListModule,
	MatPaginatorModule, 
	MatSlideToggleModule,
	MatDialogModule,
	MatAutocompleteModule,
	MatButtonToggleModule
} from '@angular/material';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { RoomsRoutes } from './Rooms.routing';
import { RoomsListComponent } from './RoomsList/RoomsList.component';
import { RoomDetailComponent } from './DetailPage/RoomDetail.component';
import { BookDetailComponent } from './BookPage/BookDetail.component';
import { BookReceiptComponent } from './BookComplete/BookReceipt.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(RoomsRoutes),
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
		SessionModule,
		TemplatesModule,
		NgAisModule,
		FormsModule,
		MatPaginatorModule,
		PipesModule,
		TranslateModule,
		MatSliderModule,
		SlickCarouselModule,
		MatSlideToggleModule,
		PipesModule,
		  MatAutocompleteModule,
		  MatButtonToggleModule
	],
	declarations: [
		RoomsListComponent,
		RoomDetailComponent,
		BookDetailComponent,
		BookReceiptComponent
	],
	entryComponents: [ 
   ],
   exports: [
   ]
})
export class RoomsModule { }
