import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { User } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User = new User();
  error: string;
  iconSize = 'lg';
  iconColor = '';
  constructor(public appService: AppService, public translate: TranslateService) { }

  ngOnInit() {
    this.getUser(Number(this.appService.tokenStorage.getUserId()));
  }

  getUser(userId: number) {
    this.appService.getOneWithChildsAndFiles(userId, 'User')
      .subscribe(result => {
        if (result.id > 0) {
          this.user = result;
        } else {
          this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
            this.error = res['MESSAGE.READ_FAILED'];
          });
        }
      });

  }

}
