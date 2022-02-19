import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../../Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MediaObserver } from '@angular/flex-layout';
import { RoomTypeVO, ReservationVO } from '../../../app.models';
import { BaseComponent } from '../../../../app/AdminPanel/baseComponent';


declare var Stripe: any;

@Component({
   selector: 'app-book-receipt',
   templateUrl: './BookReceipt.component.html',
   styleUrls: ['./BookReceipt.component.scss']
})
export class BookReceiptComponent extends BaseComponent implements OnInit {

   roomsColumns: string[] = ['roomTypeName', 'price', 'actions'];
   roomsDatasource: MatTableDataSource<RoomTypeVO>;
   @ViewChild('MatPaginatorRooms', { static: true }) roomsPaginator: MatPaginator;
   @ViewChild(MatSort, { static: true }) roomsSort: MatSort;

   backgroundColor = '#4c76b2';
   color = '#fff';

   reservId: number;
   reserv: ReservationVO;

   constructor(public appService: AppService,
      public translate: TranslateService,
      public mediaObserver: MediaObserver,
      private activatedRoute: ActivatedRoute) {
      super(translate);
   }

   ngOnInit() {
      this.activatedRoute.params.subscribe(params => {

         if (params.reservId) {
            this.reservId = params.reservId;
            this.getReserv();
         }
      });

   }

   getReserv() {
    this.messages = '';
    if (this.reservId) {
      this.appService.saveWithUrl("/service/hospitality/reservationWithRooms", 
      { reservationId: this.reservId})
        .subscribe((data: ReservationVO[]) => {
          if (data && data.length > 0) {
            this.reserv = data[0];
            console.log(this.reserv);
            // this.getBillDtls();

            // const images: any[] = [];
            // const image = {
            //   link: 'assets/images/pohdrs/' + this.bill.id + '/' + this.bill.image,
            //   preview: 'assets/images/pohdrs/' + this.bill.id + '/' + this.bill.image
            // };
            // images.push(image);
            // this.picture = images;

          } else {
            this.reserv = new ReservationVO();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } 
  }


   setDataSource(data: RoomTypeVO[]) {
      this.roomsDatasource = new MatTableDataSource(data);
      this.roomsDatasource.paginator = this.roomsPaginator;
      this.roomsDatasource.sort = this.roomsSort;
   }


}
