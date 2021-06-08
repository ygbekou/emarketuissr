import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, Menu, MenuDescription, ProductMenu } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-menu',
  templateUrl: './Menu.component.html',
  styleUrls: ['./Menu.component.scss']
})

export class MenuComponent extends BaseComponent implements OnInit {

  messages = '';
  menu: ProductMenu;
  
  @Output() menuSaveEvent = new EventEmitter<ProductMenu>();

  constructor(
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public appService: AppService) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getMenuDescriptions(params.id);
      }
    });

  }

  clearMessages($event) {
    this.messages = '';
  }

  setImage($event) {
    console.log('Setting image' + $event);
    this.menu.image = $event;
  }

  setIngredient($event) {
    this.menu = $event;
  }

  clear() {
    this.menu = new ProductMenu();
    this.menu.menuDescriptions = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const md = new MenuDescription();
      md.language = lang;
      md.name = '';
      this.menu.menuDescriptions.push(md);
    }
  }

  getMenuDescriptions(menuId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (menuId != null) {
      parameters.push('e.menu.id = |menuId|' + menuId + '|Integer');
    }
    this.appService.getAllByCriteria('MenuDescription', parameters)
      .subscribe((data: MenuDescription[]) => {

        if (data !== null && data.length > 0) {
          this.menu = data[0].menu;
          this.menu.menuDescriptions = data;

        }
      },
        error => console.log(error),
        () => console.log('Get all Menu Description complete'));
  }

  setMenuToggles() {
    this.menu.status = (this.menu.status == null
      || this.menu.status.toString() === 'false'
      || this.menu.status.toString() === '0') ? 0 : 1;
  }

  cleanMenuDescriptions(menu: ProductMenu) {
    menu.menuDescriptions.forEach(element => {
       element.menu = undefined;
       const language = element.language;
       element.language = new Language();
       element.language.id = language.id;    });
  }

  save() {
    this.messages = '';
    try {
      const thisMenu = {...this.menu};
      this.cleanMenuDescriptions(thisMenu);

      this.appService.save(thisMenu, 'Menu')
        .subscribe(result => {
          if (result.id > 0) {
            this.menu.id = result.id;
            this.processResult(result, this.menu, null);
            this.menuSaveEvent.emit(this.menu);
            this.clear();
          }
        });

    } catch (e) {
      console.log(e);
    }
  }


}
