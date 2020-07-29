import { Injectable } from '@angular/core';
import { Language, CategoryDescription, Menu } from './app.models';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class AppInfoStorage {

  public CURRENCY_MASK_INTEGER;
  public CURRENCY_MASK_DECIMAL;
  public CURRENCY_FORMAT;
  public languages: Language[] = [];
  public taxClasses: any = [];
  public stockStatuses: any = [];
  public weightClasses: any = [];
  public lengthClasses: any = [];
  public language: Language;
  public searchCategories: CategoryDescription[] = [];
  public mainMenus: Menu[] = [];
  public footerMenus: Menu[] = [];
  public manufacturers: any = [];
  public attributeGroups: any = [];


  constructor(private translate: TranslateService) {

    this.updateInfo();
  }

  updateInfo() {
    this.translate.get('CURRENCY_MASK.INTEGER').subscribe(() => {
      if (this.translate.currentLang === 'en') {
        this.CURRENCY_MASK_INTEGER = { prefix: '', thousands: ',', precision: 0, allowNegative: false };
        this.CURRENCY_MASK_DECIMAL = { prefix: '', thousands: ',', precision: 2, decimal: '.', allowNegative: false };
      } else if (this.translate.currentLang === 'fr') {
        this.CURRENCY_MASK_INTEGER = { prefix: '', thousands: ' ', precision: 0, allowNegative: false };
        this.CURRENCY_MASK_DECIMAL = { prefix: '', thousands: ' ', precision: 2, decimal: ',', allowNegative: false };
      }
      this.CURRENCY_FORMAT = '| currency: \' \':\'symbol\':\'1.0-0\':\'' + this.translate.currentLang + '\'';
    });
  }


  filterAttributeGroups(languageId: number) {
    return this.attributeGroups.filter((item) => item.language.id === languageId);
  }
}
