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
  categories: CategoryDescription[] = [];
  categoryImages: any[] = [];
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
        this.getCategory(params.id);
      }
    });
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |langCode|' + this.appService.appInfoStorage.language.id + '|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.CategoryDescription', parameters,
      ' order by e.category.sortOrder ')
      .subscribe((data: CategoryDescription[]) => {
        this.categories = data;
      },
        error => console.log(error),
        () => console.log('Get all CategoryDescription complete'));
  }

   compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }

  clear() {
    this.category = new Category();
    this.catDescs = [];
    this.refreshLangObjects();
  }
  onMainTabChanged($event) {
    console.log('Selectd main = ' + this.selectedMainTabIndex);
    this.messages = '';
    if (this.selectedMainTabIndex === 1) {
      this.selectedTab = 0;
    }
  }
  getCatDescs(categoryId: number) {
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

  saveCategory(type: number) {
    if (type === 2 && this.category.id > 0) {
      this.saveCategoryDesc();
    } else {
      this.messages = '';
      this.errors = '';
      try {
        let nbFiles = 0;
        for (const img of this.categoryImages) {
          nbFiles++;
          this.formData.append('file[]', img.file, 'picture.jpg');
        }
        console.log(this.category);
        this.category.status = (this.category.status == null
          || this.category.status.toString() === 'false'
          || this.category.status.toString() === '0') ? 0 : 1;
        this.category.top = (this.category.top == null
          || this.category.top.toString() === 'false'
          || this.category.top.toString() === '0') ? 0 : 1;

        this.category.showInDropDown = (this.category.showInDropDown == null
          || this.category.showInDropDown.toString() === 'false'
          || this.category.showInDropDown.toString() === '0') ? 0 : 1;

        this.category.showInMenu = (this.category.showInMenu == null
          || this.category.showInMenu.toString() === 'false'
          || this.category.showInMenu.toString() === '0') ? 0 : 1;

        this.category.showInFooter = (this.category.showInFooter == null
          || this.category.showInFooter.toString() === 'false'
          || this.category.showInFooter.toString() === '0') ? 0 : 1;

        this.category.showInSearch = (this.category.showInSearch == null
          || this.category.showInSearch.toString() === 'false'
          || this.category.showInSearch.toString() === '0') ? 0 : 1;

        this.category.showInKitchen = (this.category.showInKitchen == null
          || this.category.showInKitchen.toString() === 'false'
          || this.category.showInKitchen.toString() === '0') ? 0 : 1;

        this.category.showInMobile = (this.category.showInMobile == null
          || this.category.showInMobile.toString() === 'false'
          || this.category.showInMobile.toString() === '0') ? 0 : 1;

        if (this.categoryImages.length > 0) {
          this.appService.saveWithFile(this.category, 'Category', this.formData, 'saveWithFile')
            .subscribe(result => {
              if (result.id > 0) {
                console.log('saveWithFile');
                this.category = result;
                if (type === 2) {
                  this.saveCategoryDesc();
                }
                this.categoryImages = [];
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
          this.appService.save(this.category, 'Category')
            .subscribe(result => {
              if (result.id > 0) {
                this.category = result;
                if (type === 2) {
                  this.saveCategoryDesc();
                }
                console.log('Saved');
                this.categoryImages = [];
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
  saveCategoryDesc() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      this.catDesc.category = this.category;
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
              this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

}
