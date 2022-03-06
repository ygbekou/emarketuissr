import { Component, OnInit } from '@angular/core';
import { 
  ReservationSearchCriteria, ReservationVO } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-open-reservations',
  templateUrl: './Open-reservations.component.html',
  styleUrls: ['./Open-reservations.component.scss']
})
export class OpenReservationsComponent extends BaseComponent implements OnInit {
  messages = '';
  searchCriteria: ReservationSearchCriteria;
  reservations: ReservationVO[] = [];
  popupResponse: any;

  constructor(public appService: AppService,
    public router: Router,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    if (!this.appService.tokenStorage.getUserId()) {
      console.log('navigating.. to signin');
      this.router.navigate(['/session/signin'],
        { queryParams: { fromPage: '/account/open-reservations' } });
    } else {
      this.getOpenReservations();
    }
  }

  getOpenReservations() {
    this.messages = '';
    this.searchCriteria = new ReservationSearchCriteria();
    // this.searchCriteria.statuses = [1, 2, 3, 4, 5];
    this.searchCriteria.userId = +this.appService.tokenStorage.getUserId();
    this.searchCriteria.langId = this.appService.appInfoStorage.language.id;

    this.appService.saveWithUrl('/service/hospitality/reservationWithRooms', this.searchCriteria)
          .subscribe((data: any[]) => {
            this.reservations = data;
          },
            error => console.log(error),
            () => console.log('Get Reservations complete'));
  }


  public cancel() {
    this.router.navigate(['/checkout']);
  }

}
