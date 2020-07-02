import { Component, OnInit } from '@angular/core';
import { Category, CategoryDescription, Language } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-category',
  templateUrl: './Category.component.html',
  styleUrls: ['./Category.component.scss']
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'lang', 'actions'];
  category: Category = new Category();
  catDesc: CategoryDescription = new CategoryDescription();
  catDescs: CategoryDescription[] = [];
  formData = new FormData();
  categoryImages: any[] = [];
  messages = '';
  lang = 'fr';
  selectedTab = 0;
  selectedMainTabIndex = 0;
  constructor(public appService: AppService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService) { }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id == 0) {
        this.clear();
      } else {
        this.getAll(params.id);
        this.getCategory(params.id);
      }
    });
  }

  clear() {
    this.category = new Category();
    this.catDescs = [];
    this.refreshLangObjects();
  }
  onMainTabChanged() {
    console.log('Selectd main = ' + this.selectedMainTabIndex);
    this.messages = '';
    if (this.selectedMainTabIndex === 1) {
      this.selectedTab = 0;
    }
  }
  getAll(categoryId: number) {
    const parameters: string[] = [];
    if (categoryId != null) {
      parameters.push('e.category.id = |categoryId|' + categoryId + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.CategoryDescription', parameters)
      .subscribe((data: CategoryDescription[]) => {
        this.catDescs = data;
        this.refreshLangObjects();
      },
        error => console.log(error),
        () => console.log('Get all Category Item complete'));
  }

  refreshLangObjects() {
    let first = true;
    this.appService.appInfoStorage.languages.forEach(language => {
      console.log('Refresh = ' + language.name);
      let found = false;
      this.catDescs.forEach(aCatDesc => {
        if (aCatDesc.language.code === language.code) {
          found = true;
          if (first) {
            this.catDesc = aCatDesc;
            console.log(this.catDesc);
            first = false;
          }
        }
      });
      if (!found) {
        const a = new CategoryDescription();
        a.language = language;
        a.category = this.category;
        this.catDescs.push(a);
        if (first) {
          this.catDesc = a;
          first = false;
        }
      }
    });
    console.log(this.catDescs);
  }

  public remove(category: CategoryDescription) {
    this.messages = '';
    this.appService.delete(category.id, 'com.softenza.emarket.model.CategoryDescription')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {

        } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
          this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
          });
        } else {
          this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.ERROR_OCCURRED'];
          });
        }
      });
  }


  getCategory(categoryId: number) {
    if (categoryId > 0) {
      this.appService.getOne(categoryId, 'com.softenza.emarket.model.Category')
        .subscribe(result => {
          if (result.id > 0) {
            this.category = result;
          } else {
            this.category = new Category();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  onLangChanged(event) {
    console.log('Selected lang =' + event.tab.textLabel);
    this.catDescs.forEach(aCatDesc => {
      if (aCatDesc.language.name === event.tab.textLabel) {
        this.catDesc = aCatDesc;
      }
    });
  }

  saveCategory() {
    this.messages = '';
    try {
      let nbFiles = 0;
      for (const img of this.categoryImages) {
        nbFiles++;
        this.formData.append('file[]', img.file, 'picture.jpg');
      }

      this.category.status = (this.category.status == null || this.category.status.toString() === 'false') ? 0 : 1;
      this.category.top = (this.category.top == null || this.category.top.toString() === 'false') ? 0 : 1;
      console.log(this.category);
      if (this.categoryImages.length > 0) {
        this.appService.saveWithFile(this.category, 'Category', this.formData, 'saveWithFile')
          .subscribe(result => {
            if (result.id > 0) {
              console.log('saveWithFile');
              this.category = result;
              this.saveCategoryDesc();
              this.categoryImages = [];
              this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_SUCCESS'];
              });
            } else {
              this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
              });
            }
          });
      } else {
        this.appService.save(this.category, 'Category')
          .subscribe(result => {
            if (result.id > 0) {
              this.category = result;
              this.saveCategoryDesc();
              console.log('Saved');
              this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_SUCCESS'];
              });
            } else {
              this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
              });
            }
          });
      }

    } catch (e) {
      console.log(e);
    }
  }

  edit(si: CategoryDescription) {
    this.catDesc = si;
    this.selectedTab = 1;
  }
  saveCategoryDesc() {
    this.messages = '';
    try {
      this.messages = '';
      this.catDesc.category = this.category;
      console.log(this.catDesc);
      console.log(this.catDescs);
      const index: number = this.catDescs.indexOf(this.catDesc);
      this.appService.save(this.catDesc, 'CategoryDescription')
        .subscribe(result => {
          if (result.id > 0) {
            this.catDesc = result;
            this.catDescs.splice(index, 1);
            this.catDescs.push(result);
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

}
