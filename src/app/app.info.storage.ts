import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AdminPanelServiceService } from './AdminPanel/Service/AdminPanelService.service';
import { TaxClass, Language, StockStatus, GenericResponse, GenericVO } from './app.models';


@Injectable()
export class AppInfoStorage {

  public CURRENCY_MASK_INTEGER;
  public CURRENCY_MASK_DECIMAL; 
  public CURRENCY_FORMAT;
  public languages: any = [];
  public taxClasses: any = [];
  public stockStatuses: any = [];
  public weightClasses: any = [];
  public lengthClasses: any = [];

  constructor(
    public translate: TranslateService
  ) {

    this.updateInfo();
  }

  
  updateInfo() {

    this.translate.get('CURRENCY_MASK.INTEGER').subscribe((res: string) => {
        if (this.translate.currentLang === 'en') {
          this.CURRENCY_MASK_INTEGER = { prefix: '', thousands: ',', precision: 0, allowNegative: false };
          this.CURRENCY_MASK_DECIMAL = { prefix: '', thousands: ',', precision: 2, decimal: '.', allowNegative: false };
        } else if (this.translate.currentLang === 'fr') {
          this.CURRENCY_MASK_INTEGER = { prefix: '', thousands: ' ', precision: 0, allowNegative: false };
          this.CURRENCY_MASK_DECIMAL = { prefix: '', thousands: ' ', precision: 2, decimal: ',', allowNegative: false };
        }
        this.CURRENCY_FORMAT = "| currency: ' ':'symbol':'1.0-0':'" + this.translate.currentLang + "'";
    });
  }

  
}
