import { Component, OnInit } from '@angular/core';
import { Marketing, MarketingDescription, Language } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-marketing',
  templateUrl: './Marketing.component.html',
  styleUrls: ['./Marketing.component.scss']
})
export class MarketingComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'lang', 'actions'];
  sections = [{ id: 1, name: 'Banner' },
  { id: 2, name: 'Featured Products' },
  { id: 3, name: 'Lightening Deals' },
  { id: 4, name: 'Top Products' }];
  marketing: Marketing = new Marketing();
  markDesc: MarketingDescription = new MarketingDescription();
  markDescs: MarketingDescription[] = [];
  formData = new FormData();
  marketings: MarketingDescription[] = [];
  marketingImages: any[] = [];
  messages = '';
  errors = '';
  lang = 'fr';
  picker: any;
  selectedTab = 0;
  selectedMainTabIndex = 0;
  constructor(public appService: AppService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService) { }
  ngOnInit() {
    this.getAll();
    this.activatedRoute.params.subscribe(params => {
      if (params.id == 0) {
        this.clear();
      } else {
        this.getMarkDescs(params.id);
        this.getMarketing(params.id);
      }
    });
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |langCode|' + this.appService.appInfoStorage.language.id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.MarketingDescription', parameters,
      ' order by e.marketing.sortOrder ')
      .subscribe((data: MarketingDescription[]) => {
        this.marketings = data;
      },
        error => console.log(error),
        () => console.log('Get all MarketingDescription complete'));
  }

  clear() {
    this.marketing = new Marketing();
    this.markDescs = [];
    this.refreshLangObjects();
  }
  onMainTabChanged($event) {
    console.log('Selectd main = ' + this.selectedMainTabIndex);
    this.messages = '';
    if (this.selectedMainTabIndex === 1) {
      this.selectedTab = 0;
    }
  }
  getMarkDescs(marketingId: number) {
    const parameters: string[] = [];
    if (marketingId != null) {
      parameters.push('e.marketing.id = |marketingId|' + marketingId + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.MarketingDescription', parameters)
      .subscribe((data: MarketingDescription[]) => {
        this.markDescs = data;
        this.refreshLangObjects();
      },
        error => console.log(error),
        () => console.log('Get all Marketing Item complete'));
  }

  refreshLangObjects() {
    let first = true;
    this.appService.appInfoStorage.languages.forEach(language => {
      console.log('Refresh = ' + language.name);
      let found = false;
      this.markDescs.forEach(aMarkDesc => {
        if (aMarkDesc.language.code === language.code) {
          found = true;
          if (first) {
            this.markDesc = aMarkDesc;
            console.log(this.markDesc);
            first = false;
          }
        }
      });
      if (!found) {
        const a = new MarketingDescription();
        a.language = language;
        a.marketing = this.marketing;
        this.markDescs.push(a);
        if (first) {
          this.markDesc = a;
          first = false;
        }
      }
    });
  }


  getMarketing(marketingId: number) {
    if (marketingId > 0) {
      this.appService.getOne(marketingId, 'com.softenza.emarket.model.Marketing')
        .subscribe(result => {
          if (result.id > 0) {
            this.marketing = result;
          } else {
            this.marketing = new Marketing();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  onLangChanged(event) {
    console.log('Selected lang =' + event.tab.textLabel);
    this.markDescs.forEach(aMarkDesc => {
      if (aMarkDesc.language.name === event.tab.textLabel) {
        this.markDesc = aMarkDesc;
      }
    });
  }

  saveMarketing(type: number) {
    if (type === 2 && this.marketing.id > 0) {
      this.saveMarketingDesc();
    } else {
      this.messages = '';
      this.errors = '';
      try {
        let nbFiles = 0;
        for (const img of this.marketingImages) {
          nbFiles++;
          this.formData.append('file[]', img.file, 'picture.jpg');
        }
        console.log(this.marketing);
        this.marketing.status = (this.marketing.status == null
          || this.marketing.status.toString() === 'false'
          || this.marketing.status.toString() === '0') ? 0 : 1;

        this.marketing.scope = (this.marketing.scope == null
          || this.marketing.scope.toString() === 'false'
          || this.marketing.scope.toString() === '0') ? 0 : 1;

        if (this.marketingImages.length > 0) {
          this.appService.saveWithFile(this.marketing, 'Marketing', this.formData, 'saveWithFile')
            .subscribe(result => {
              if (result.id > 0) {
                console.log('saveWithFile');
                this.marketing = result;
                if (type === 2) {
                  this.saveMarketingDesc();
                }
                this.marketingImages = [];
                this.formData = new FormData();
                this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.SAVE_SUCCESS'];
                });
              } else {
                this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
                });
              }
            });
        } else {
          this.appService.save(this.marketing, 'Marketing')
            .subscribe(result => {
              if (result.id > 0) {
                this.marketing = result;
                if (type === 2) {
                  this.saveMarketingDesc();
                }
                console.log('Saved');
                this.marketingImages = [];
                this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.SAVE_SUCCESS'];
                });
              } else {
                this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                  this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
                });
              }
            });
        }

      } catch (e) {
        console.log(e);
      }
    }
  }
  saveMarketingDesc() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      this.markDesc.marketing = this.marketing;
      const index: number = this.markDescs.indexOf(this.markDesc);
      this.appService.save(this.markDesc, 'MarketingDescription')
        .subscribe(result => {
          if (result.id > 0) {
            this.markDesc = result;
            this.markDescs.splice(index, 1);
            this.markDescs.push(result);
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

}
