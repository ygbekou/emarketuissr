import { Component, OnInit, ViewChild } from '@angular/core';
import { Section, SectionItem } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  dataSource: MatTableDataSource<SectionItem>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  section: Section = new Section();
  menus = [{ name: 'SERVICES' }, { name: 'EXPERTISE' }];
  sectionItem: SectionItem = new SectionItem();
  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];
  formData = new FormData();
  flag: any;
  sectionImages: any;
  messages = '';
  selectedTab = 1;
  selectedMainTabIndex = 1;
  icons: string[] = ['build', 'add', 'add_circle', 'cancel', 'trending_up', 'business',
    'school', 'record_voice_over', 'search', 'dashboard', 'radio', 'touch_app', 'movie',
    'person', 'people', 'addchart', 'extension', 'language', 'psychology', 'wb_sunny', 'highlight',
    'thumbs_up_down', 'share', 'public', 'science', 'self_improvement', 'model_training',
    'headset', 'hearing', 'headset_mic', 'biotech', 'miscellaneous_services', 'analytics'];
  constructor(public appService: AppService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService) { }

  ngOnInit() {
    this.setLang();
    this.activatedRoute.params.subscribe(params => {
      if (params.id == 0) {
        this.section = new Section();
        this.section.language = this.flag.code;
        this.sectionItem = new SectionItem();
        this.dataSource = new MatTableDataSource();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.getAll(params.id);
        this.getSection(params.id);
      }
    });
  }
  public changeLang(flag) {
    this.flag = flag;
    if (this.section === null) {
      this.section = new Section();
    }
    this.section.language = flag.code;
  }

  setLang() {
    let lang = navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    if (Cookie.get('lang')) {
      lang = Cookie.get('lang');
      console.log('Using cookie lang=' + Cookie.get('lang'));
    } else if (lang) {
      console.log('Using browser lang=' + lang);
      // this.translate.use(lang);
    } else {
      lang = 'fr';
      console.log('Using default lang=fr');
    }
    if (lang === 'fr') {
      this.flag = this.flags[0];
    } else {
      this.flag = this.flags[1];
    }
  }

  onMainTabChanged($event) {
    console.log('Selectd main = ' + this.selectedMainTabIndex);
    this.messages = '';
    if (this.selectedMainTabIndex === 1) {
      this.selectedTab = 0;
    }
  }
  getAll(sectionId: number) {
    const parameters: string[] = [];
    if (sectionId != null) {
      parameters.push('e.section.id = |sectionId|' + sectionId + '|Long');
    }
    this.appService.getAllByCriteria('com.wack.model.website.SectionItem', parameters)
      .subscribe((data: SectionItem[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all Section Item complete'));
  }

  public remove(section: SectionItem) {
    this.messages = '';
    this.appService.delete(section.id, 'com.wack.model.website.SectionItem')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(section);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<SectionItem>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
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

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getSection(sectionId: number) {
    if (sectionId > 0)
      this.appService.getOne(sectionId, 'com.wack.model.website.Section')
        .subscribe(result => {
          if (result.id > 0) {
            this.section = result;
            if (this.section.language === 'fr') {
              this.flag = this.flags[0];
            } else {
              this.flag = this.flags[1];
            }
          } else {
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {

              this.messages = res['MESSAGE.READ_FAILED'];

            });
          }
        });
  }

  clear() {
    this.section = new Section();
    this.section.language = this.flag.code;
    this.sectionItem = new SectionItem();
    this.dataSource = new MatTableDataSource();
  }

  addSectionItem() {
    this.selectedTab = 1;
    this.sectionItem = new SectionItem();
  }
  saveSection() {
    this.messages = '';
    try {
      let nbFiles = 0;
      for (const img of this.sectionImages) {
        nbFiles++;
        this.formData.append('file[]', img.file, 'picture.jpg');
      }
      console.log('Lang == ' + this.section.language);
      if (this.section.language == null || this.section.language == '' ||
        this.section.language == 'undefined') {
        this.section.language = this.flag.code;
      }
      this.section.status = (this.section.status == null || this.section.status.toString() === 'false') ? 0 : 1;
      this.section.showInMenu = (this.section.showInMenu == null || this.section.showInMenu.toString() === 'false') ? 0 : 1;

      if (this.sectionImages.length > 0) {
        this.appService.saveWithFile(this.section, 'Section', this.formData, 'saveWithFile')
          .subscribe(result => {
            if (result.id > 0) {
              console.log('saveWithFile');
              this.section = result;
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
        this.appService.save(this.section, 'Section')
          .subscribe(result => {
            if (result.id > 0) {
              this.section = result;
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

  edit(si: SectionItem) {
    this.sectionItem = si;
    this.selectedTab = 1;
  }
  saveSectionItem() {
    this.messages = '';
    try {
      this.messages = '';
      this.sectionItem.section = this.section;
      this.sectionItem.language = this.section.language;
      const index: number = this.dataSource.data.indexOf(this.sectionItem);
      this.sectionItem.status = (this.sectionItem.status == null || this.sectionItem.status.toString() === 'false') ? 0 : 1;
      this.sectionItem.showInMenu = (this.sectionItem.showInMenu == null || this.sectionItem.showInMenu.toString() === 'false') ? 0 : 1;
      this.appService.save(this.sectionItem, 'SectionItem')
        .subscribe(result => {
          if (result.id > 0) {
            this.sectionItem = new SectionItem();
            this.selectedTab = 0;
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<SectionItem>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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