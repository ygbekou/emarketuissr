import { Component, OnInit } from '@angular/core';
import { Category, CategoryDescription, Language } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
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
  categoryImages: any;
  messages = '';
  lang = 'fr';
  selectedTab = 1;
  selectedMainTabIndex = 1;
  constructor(public appService: AppService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService) { }
  ngOnInit() {
    this.setLang();
    this.activatedRoute.params.subscribe(params => {
      if (params.id == 0) {
        this.category = new Category();
        this.category.parent = new Category();
        this.catDesc = new CategoryDescription();
        this.catDesc.category = this.category;
        this.catDesc.language = new Language();
      } else {
        this.getAll(params.id);
        this.getCategory(params.id);
      }
    });
  }
  

  onMainTabChanged($event) {
    console.log('Selectd main = ' + this.selectedMainTabIndex);
    this.messages = '';
    if (this.selectedMainTabIndex === 1) {
      this.selectedTab = 0;
    }
  }
  getAll(categoryId: number) {
    const parameters: string[] = [];
    if (categoryId != null) {
      parameters.push('e.category.id = |categoryId|' + categoryId + '|Long');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.CategoryDescription', parameters)
      .subscribe((data: CategoryDescription[]) => {
        this.catDescs = data;
      },
        error => console.log(error),
        () => console.log('Get all Category Item complete'));
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
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {

              this.messages = res['MESSAGE.READ_FAILED'];

            });
          }
        });
    }
  }

  clear() {
    this.category = new Category();
    this.category.language = new Language();
    this.catDesc = new CategoryDescription();
  }

  addCategoryItem() {
    this.selectedTab = 1;
    this.catDesc = new CategoryDescription();
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

      if (this.categoryImages.length > 0) {
        this.appService.saveWithFile(this.category, 'Category', this.formData, 'saveWithFile')
          .subscribe(result => {
            if (result.id > 0) {
              console.log('saveWithFile');
              this.category = result;
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
  saveCategoryItem() {
    this.messages = '';
    try {
      this.messages = '';
      this.catDesc.category = this.category;
      this.catDesc.status = (this.catDesc.status == null || this.catDesc.status.toString() === 'false') ? 0 : 1;
      this.appService.save(this.catDesc, 'CategoryDescription')
        .subscribe(result => {
          if (result.id > 0) {
            this.catDesc = new CategoryDescription();
            this.selectedTab = 0;

            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.selectedTab = 1;
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
