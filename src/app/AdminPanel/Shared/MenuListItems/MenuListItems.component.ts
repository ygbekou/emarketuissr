import { Component, OnInit } from '@angular/core';
import { AdminMenuItems } from '../../Core/Menu/MenuItems/MenuItems';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
	selector: 'app-menu-list-items',
	templateUrl: './MenuListItems.component.html',
	styleUrls: ['./MenuListItems.component.scss']
})

export class MenuListItemsComponent implements OnInit {
	lang = 'fr';
	constructor(public menuItems: AdminMenuItems,
		private router: Router,
		private appService: AppService,
		private activatedRoute: ActivatedRoute,
		public translate: TranslateService) {
		let lang = navigator.language;
		if (lang) {
			lang = lang.substring(0, 2);
		}
		if (this.appService.appInfoStorage.language) {
			this.lang = this.appService.appInfoStorage.language.code;
		} else {
			this.lang = lang;
		}
	}

	ngOnInit() {

	}

}
