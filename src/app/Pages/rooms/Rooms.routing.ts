import { Routes } from '@angular/router';

import { RoomsListComponent } from './RoomsList/RoomsList.component';
import { RoomDetailComponent } from './DetailPage/RoomDetail.component';
import { BookDetailComponent } from './BookPage/BookDetail.component';
import { BookReceiptComponent } from './BookComplete/BookReceipt.component';

export const RoomsRoutes: Routes = [
	{
		path: '',
		component: RoomsListComponent
	},
	{
		path: 'search',
		component: RoomsListComponent
	},
	{
		path: 'detail',
		component: RoomDetailComponent
	},
	{
		path: 'booking',
		component: BookDetailComponent
	},
	{
		path: 'reservations/:reservId',
		component: BookReceiptComponent
	},
	{
		path: ':type',
		component: RoomsListComponent
	}
]