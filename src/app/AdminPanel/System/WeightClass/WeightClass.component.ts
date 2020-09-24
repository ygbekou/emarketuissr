import { Component, OnInit } from '@angular/core';
import { WeightClass, WeightClassDescription, Language } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-weight-class',
  templateUrl: './WeightClass.component.html',
  styleUrls: ['./WeightClass.component.scss']
})
export class WeightClassComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'lang', 'actions'];
  weightClass: WeightClass = new WeightClass();
  weightClassDesc: WeightClassDescription = new WeightClassDescription();
  weightClassDescs: WeightClassDescription[] = [];
  formData = new FormData();
  weightClasses: WeightClassDescription[] = [];
  weightClassImages: any[] = [];
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
        this.getWeightClass(params.id);
      }
    });
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.language.code = |langCode|' + this.appService.appInfoStorage.language.code + '|String');
    this.appService.getAllByCriteria('com.softenza.emarket.model.WeightClassDescription', parameters,
      ' order by e.weightClass.sortOrder ')
      .subscribe((data: WeightClassDescription[]) => {
        this.weightClasses = data;
      },
        error => console.log(error),
        () => console.log('Get all WeightClassDescription complete'));
  }

  clear() {
    this.weightClass = new WeightClass();
    this.weightClassDescs = [];
    this.refreshLangObjects();
  }
  onMainTabChanged($event) {
    console.log('Selectd main = ' + this.selectedMainTabIndex);
    this.messages = '';
    if (this.selectedMainTabIndex === 1) {
      this.selectedTab = 0;
    }
  }
  getCatDescs(weightClassId: number) {
    const parameters: string[] = [];
    if (weightClassId != null) {
      parameters.push('e.weightClass.id = |weightClassId|' + weightClassId + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.WeightClassDescription', parameters)
      .subscribe((data: WeightClassDescription[]) => {
        this.weightClassDescs = data;
        this.refreshLangObjects();
      },
        error => console.log(error),
        () => console.log('Get all WeightClass Item complete'));
  }

  refreshLangObjects() {
    let first = true;
    this.appService.appInfoStorage.languages.forEach(language => {
      console.log('Refresh = ' + language.name);
      let found = false;
      this.weightClassDescs.forEach(aCatDesc => {
        if (aCatDesc.language.code === language.code) {
          found = true;
          if (first) {
            this.weightClassDesc = aCatDesc;
            console.log(this.weightClassDesc);
            first = false;
          }
        }
      });
      if (!found) {
        const a = new WeightClassDescription();
        a.language = language;
        a.weightClass = this.weightClass;
        this.weightClassDescs.push(a);
        if (first) {
          this.weightClassDesc = a;
          first = false;
        }
      }
    });
  }


  getWeightClass(weightClassId: number) {
    if (weightClassId > 0) {
      this.appService.getOne(weightClassId, 'com.softenza.emarket.model.WeightClass')
        .subscribe(result => {
          if (result.id > 0) {
            this.weightClass = result;
          } else {
            this.weightClass = new WeightClass();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  onLangChanged(event) {
    console.log('Selected lang =' + event.tab.textLabel);
    this.weightClassDescs.forEach(aCatDesc => {
      if (aCatDesc.language.name === event.tab.textLabel) {
        this.weightClassDesc = aCatDesc;
      }
    });
  }

  saveWeightClass(type: number) {
    if (type === 2 && this.weightClass.id > 0) {
      this.saveWeightClassDesc();
    } else {
      this.messages = '';
      this.errors = '';
      try {
        let nbFiles = 0;
        for (const img of this.weightClassImages) {
          nbFiles++;
          this.formData.append('file[]', img.file, 'picture.jpg');
        }

        if (this.weightClassImages.length > 0) {
          this.appService.saveWithFile(this.weightClass, 'WeightClass', this.formData, 'saveWithFile')
            .subscribe(result => {
              if (result.id > 0) {
                console.log('saveWithFile');
                this.weightClass = result;
                if (type === 2) {
                  this.saveWeightClassDesc();
                }
                this.weightClassImages = [];
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
          this.appService.save(this.weightClass, 'WeightClass')
            .subscribe(result => {
              if (result.id > 0) {
                this.weightClass = result;
                if (type === 2) {
                  this.saveWeightClassDesc();
                }
                console.log('Saved');
                this.weightClassImages = [];
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
  saveWeightClassDesc() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      this.weightClassDesc.weightClass = this.weightClass;
      console.log(this.weightClassDesc);
      console.log(this.weightClassDescs);
      const index: number = this.weightClassDescs.indexOf(this.weightClassDesc);
      this.appService.save(this.weightClassDesc, 'WeightClassDescription')
        .subscribe(result => {
          if (result.id > 0) {
            this.weightClassDesc = result;
            this.weightClassDescs.splice(index, 1);
            this.weightClassDescs.push(result);
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
