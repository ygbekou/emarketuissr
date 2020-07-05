import { Component, OnInit } from '@angular/core';
import { Information, InformationDescription, Language, SeoUrl } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-information',
  templateUrl: './Information.component.html',
  styleUrls: ['./Information.component.scss']
})
export class InformationComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'sortOrder', 'status', 'actions'];
  information: Information = new Information();
  seoUrl: SeoUrl = new SeoUrl();
  infoDesc: InformationDescription = new InformationDescription();
  infoDescs: InformationDescription[] = [];
  formData = new FormData();
  informations: InformationDescription[] = [];
  informationImages: any[] = [];
  messages = '';
  errors = '';
  lang = 'fr';
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
        this.getCatDescs(params.id);
        this.getInformation(params.id);
      }
    });
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.language.code = |langCode|' + this.appService.appInfoStorage.language.code + '|String');
    this.appService.getAllByCriteria('com.softenza.emarket.model.InformationDescription', parameters,
      ' order by e.information.sortOrder ')
      .subscribe((data: InformationDescription[]) => {
        this.informations = data;
      },
        error => console.log(error),
        () => console.log('Get all InformationDescription complete'));
  }

  clear() {
    this.information = new Information();
    this.infoDescs = [];
    this.refreshLangObjects();
  }
  onMainTabChanged() {
    console.log('Selectd main = ' + this.selectedMainTabIndex);
    this.messages = '';
    if (this.selectedMainTabIndex === 1) {
      this.selectedTab = 0;
    }
  }
  getCatDescs(informationId: number) {
    const parameters: string[] = [];
    if (informationId != null) {
      parameters.push('e.information.id = |informationId|' + informationId + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.InformationDescription', parameters)
      .subscribe((data: InformationDescription[]) => {
        this.infoDescs = data;
        this.refreshLangObjects();
      },
        error => console.log(error),
        () => console.log('Get all Information Item complete'));
  }

  refreshLangObjects() {
    let first = true;
    this.appService.appInfoStorage.languages.forEach(language => {
      console.log('Refresh = ' + language.name);
      let found = false;
      this.infoDescs.forEach(aCatDesc => {
        if (aCatDesc.language.code === language.code) {
          found = true;
          if (first) {
            this.infoDesc = aCatDesc;
            console.log(this.infoDesc);
            first = false;
          }
        }
      });
      if (!found) {
        const a = new InformationDescription();
        a.language = language;
        a.information = this.information;
        this.infoDescs.push(a);
        if (first) {
          this.infoDesc = a;
          first = false;
        }
      }
    });
  }


  getInformation(informationId: number) {
    if (informationId > 0) {
      this.appService.getOne(informationId, 'com.softenza.emarket.model.Information')
        .subscribe(result => {
          if (result.id > 0) {
            this.information = result;
          } else {
            this.information = new Information();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  onLangChanged(event) {
    console.log('Selected lang =' + event.tab.textLabel);
    this.infoDescs.forEach(aCatDesc => {
      if (aCatDesc.language.name === event.tab.textLabel) {
        this.infoDesc = aCatDesc;
      }
    });
  }

  saveInformation(type: number) {
    if (type === 2 && this.information.id > 0) {
      this.saveInformationDesc();
    } else {
      this.messages = '';
      this.errors = '';
      try {
        let nbFiles = 0;
        for (const img of this.informationImages) {
          nbFiles++;
          this.formData.append('file[]', img.file, 'picture.jpg');
        }

        this.information.status = (this.information.status == null || this.information.status.toString() === 'false') ? 0 : 1;
        this.information.bottom = (this.information.bottom == null || this.information.bottom.toString() === 'false') ? 0 : 1;
        console.log(this.information);
        if (this.informationImages.length > 0) {
          this.appService.saveWithFile(this.information, 'Information', this.formData, 'saveWithFile')
            .subscribe(result => {
              if (result.id > 0) {
                console.log('saveWithFile');
                this.information = result;
                if (type === 2) {
                  this.saveInformationDesc();
                }
                this.informationImages = [];
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
          this.appService.save(this.information, 'Information')
            .subscribe(result => {
              if (result.id > 0) {
                this.information = result;
                if (type === 2) {
                  this.saveInformationDesc();
                }
                console.log('Saved');
                this.informationImages = [];
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
  saveInformationDesc() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      this.infoDesc.information = this.information;
      console.log(this.infoDesc);
      console.log(this.infoDescs);
      const index: number = this.infoDescs.indexOf(this.infoDesc);
      this.appService.save(this.infoDesc, 'InformationDescription')
        .subscribe(result => {
          if (result.id > 0) {
            this.infoDesc = result;
            this.infoDescs.splice(index, 1);
            this.infoDescs.push(result);
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
