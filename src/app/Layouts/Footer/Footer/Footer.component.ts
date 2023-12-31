import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CompanyLocation, Menu, Language } from 'src/app/app.models';
import { TokenStorage } from 'src/app/token.storage';
import { AppService } from 'src/app/Services/app.service';

@Component({
    selector: 'app-footer',
    templateUrl: './Footer.component.html',
    styleUrls: ['./Footer.component.scss']
})
export class FooterComponent implements OnInit {
    locations: CompanyLocation[] = [];
    // @Input('menuParentId') menuParentId;
    public mainMenus: Menu[] = [];
    location: CompanyLocation = new CompanyLocation();
    iconSize = 'lg';
    iconColor = '';
    lang = 'fr';
    constructor(public translate: TranslateService,
        protected tokenStorage: TokenStorage,
        public appService: AppService) {



    }

    ngOnInit() {
        const parameters: string[] = [];
        this.appService.getAllByCriteria('com.softenza.emarket.model.Language', parameters,
            ' order by e.sortOrder ')
            .subscribe((data: Language[]) => {
                let lang = this.appService.navigator.language;
                if (lang) {
                    lang = lang.substring(0, 2);
                }
                // if (this.cookieService.get('lang')) {
                //     lang = this.cookieService.get('lang');
                //     console.log('Using cookie lang=' + this.cookieService.get('lang'));
                // } else if (lang) {
                //     console.log('Using browser lang=' + lang);
                //     // this.translate.use(lang);
                // } else {
                //     lang = 'fr';
                //     console.log('Using default lang=fr');
                // }
                data.forEach(language => {
                    if (language.code === lang) {
                        this.appService.getMenus(language.id, 2)
                            .subscribe((menus: Menu[]) => {
                                let i = 0;
                                menus.forEach(menu => {
                                    if (menu.children && menu.children.length > 0) {
                                        menu.children.forEach(sub => {

                                            if (++i < 5) {
                                                this.mainMenus.push(sub);
                                            }
                                        })
                                    }
                                });
                            },
                                error => console.log(error),
                                () => console.log('Get all Main menus complete'));
                    }
                });

            }, error => console.log(error),
                () => console.log('Get Languages complete'));

        this.appService.getAllByCriteria('Location', parameters, 'order by e.rank ')
            .subscribe((data: CompanyLocation[]) => {
                this.locations = data;
                if (this.locations && this.locations.length > 0) {
                    this.location = this.locations[0];
                }
            },
                error => console.log(error),
                () => console.log('Get locatioms complete'));
    }

}
