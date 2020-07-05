import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-user-profile',
  templateUrl: './HeaderUserProfileDropdown.component.html',
  styleUrls: ['./HeaderUserProfileDropdown.component.scss']
})
export class HeaderUserProfileDropdownComponent implements OnInit {

  constructor(public appService: AppService,
    public router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.appService.tokenStorage.clearAuthData();
    this.router.navigate(['/']);
  }
}
