import { Component, OnInit } from '@angular/core';
import { LengthClass, LengthClassDescription, Language } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-length-class',
  templateUrl: './LengthClass.component.html',
  styleUrls: ['./LengthClass.component.scss']
})
export class LengthClassComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'lang', 'actions'];
  lengthClass: LengthClass = new LengthClass();
  lengthClassDesc: LengthClassDescription = new LengthClassDescription();
  lengthClassDescs: LengthClassDescription[] = [];
  formData = new FormData();
  lengthClasses: LengthClassDescription[] = [];
  lengthClassImages: any[] = [];
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
        this.getLengthClass(params.id);
      }
    });
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.language.code = |langCode|' + this.appService.appInfoStorage.language.code + '|String');
    this.appService.getAllByCriteria('com.softenza.emarket.model.LengthClassDescription', parameters,
      ' order by e.lengthClass.sortOrder ')
      .subscribe((data: LengthClassDescription[]) => {
        this.lengthClasses = data;
      },
        error => console.log(error),
        () => console.log('Get all LengthClassDescription complete'));
  }

  clear() {
    this.lengthClass = new LengthClass();
    this.lengthClassDescs = [];
    this.refreshLangObjects();
  }
  onMainTabChanged($event) {
    console.log('Selectd main = ' + this.selectedMainTabIndex);
    this.messages = '';
    if (this.selectedMainTabIndex === 1) {
      this.selectedTab = 0;
    }
  }
  getCatDescs(lengthClassId: number) {
    const parameters: string[] = [];
    if (lengthClassId != null) {
      parameters.push('e.lengthClass.id = |lengthClassId|' + lengthClassId + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.LengthClassDescription', parameters)
      .subscribe((data: LengthClassDescription[]) => {
        this.lengthClassDescs = data;
        this.refreshLangObjects();
      },
        error => console.log(error),
        () => console.log('Get all LengthClass Item complete'));
  }

  refreshLangObjects() {
    let first = true;
    this.appService.appInfoStorage.languages.forEach(language => {
      console.log('Refresh = ' + language.name);
      let found = false;
      this.lengthClassDescs.forEach(aCatDesc => {
        if (aCatDesc.language.code === language.code) {
          found = true;
          if (first) {
            this.lengthClassDesc = aCatDesc;
            console.log(this.lengthClassDesc);
            first = false;
          }
        }
      });
      if (!found) {
        const a = new LengthClassDescription();
        a.language = language;
        a.lengthClass = this.lengthClass;
        this.lengthClassDescs.push(a);
        if (first) {
          this.lengthClassDesc = a;
          first = false;
        }
      }
    });
  }


  getLengthClass(lengthClassId: number) {
    if (lengthClassId > 0) {
      this.appService.getOne(lengthClassId, 'com.softenza.emarket.model.LengthClass')
        .subscribe(result => {
          if (result.id > 0) {
            this.lengthClass = result;
          } else {
            this.lengthClass = new LengthClass();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  onLangChanged(event) {
    console.log('Selected lang =' + event.tab.textLabel);
    this.lengthClassDescs.forEach(aCatDesc => {
      if (aCatDesc.language.name === event.tab.textLabel) {
        this.lengthClassDesc = aCatDesc;
      }
    });
  }

  saveLengthClass(type: number) {
    if (type === 2 && this.lengthClass.id > 0) {
      this.saveLengthClassDesc();
    } else {
      this.messages = '';
      this.errors = '';
      try {
        let nbFiles = 0;
        for (const img of this.lengthClassImages) {
          nbFiles++;
          this.formData.append('file[]', img.file, 'picture.jpg');
        }

          console.log(this.lengthClass);
        if (this.lengthClassImages.length > 0) {
          this.appService.saveWithFile(this.lengthClass, 'LengthClass', this.formData, 'saveWithFile')
            .subscribe(result => {
              if (result.id > 0) {
                console.log('saveWithFile');
                this.lengthClass = result;
                if (type === 2) {
                  this.saveLengthClassDesc();
                }
                this.lengthClassImages = [];
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
          this.appService.save(this.lengthClass, 'LengthClass')
            .subscribe(result => {
              if (result.id > 0) {
                this.lengthClass = result;
                if (type === 2) {
                  this.saveLengthClassDesc();
                }
                console.log('Saved');
                this.lengthClassImages = [];
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
  saveLengthClassDesc() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      this.lengthClassDesc.lengthClass = this.lengthClass;
      console.log(this.lengthClassDesc);
      console.log(this.lengthClassDescs);
      const index: number = this.lengthClassDescs.indexOf(this.lengthClassDesc);
      this.appService.save(this.lengthClassDesc, 'LengthClassDescription')
        .subscribe(result => {
          if (result.id > 0) {
            this.lengthClassDesc = result;
            this.lengthClassDescs.splice(index, 1);
            this.lengthClassDescs.push(result);
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
