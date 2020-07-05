import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';

@Component({
	selector: 'admin-header-user-profile',
	templateUrl: './HeaderUserProfileDropdown.component.html',
	styleUrls: ['./HeaderUserProfileDropdown.component.scss']
})

export class HeaderUserProfileDropdownComponent implements OnInit {

	constructor(public router: Router, private appService: AppService) { }

	ngOnInit() {
	}
	
	//log out method 
	logOut() {
		document.getElementById('html').classList.remove("admin");
		this.appService.tokenStorage.clearAuthData();
		this.router.navigate(['/session/signin']);
	}
}
