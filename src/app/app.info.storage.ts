import { Injectable } from '@angular/core';
import { Language, CategoryDescription, Menu, Company, Country, Zone, StoreCategoryDesc } from './app.models';
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
  public returnStatuses: any = [];
  public returnReasons: any = [];
  public returnActions: any = [];
  public activeStatuses: any = [];
  public USER_GROUPS: any = [];
  public language: Language;
  public searchCategories: CategoryDescription[] = [];
  public storeCategories: StoreCategoryDesc[] = [];
  public selectedSearchCategory: CategoryDescription;
  public mainMenus: Menu[] = [];
  public footerMenus: Menu[] = [];
  public manufacturers: any = [];
  public attributeGroups: any = [];
  public optionTypes: any = ['Select', 'Radio', 'Checkbox', 'Text', 'Textarea', 'Date', 'Time', 'Date & Time'];
  public optionPrefixes: any = ['+', '-'];

  public companies: Company[] = [];
  public company: Company = new Company();
  public countries: Country[] = [];
  public zones: Zone[] = [];

  constructor(private translate: TranslateService) {

    this.updateInfo();

    this.activeStatuses.push({ 'id': 1, 'label': 'Actif' });
    this.activeStatuses.push({ 'id': 0, 'label': 'Inactif' });
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

  public setCountries(countries: Country[]) {
    this.countries = countries;
  }

  public getCountries() {
    return this.countries;
  }

  public setZones(zones: Zone[]) {
    this.zones = zones;
  }

  public getZones() {
    return this.zones;
  }
}
