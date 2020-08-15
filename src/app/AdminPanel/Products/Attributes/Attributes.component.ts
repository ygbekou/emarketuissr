import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AttributeDescription, AttributeGroup } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { AttributeComponent } from '../Attribute/Attribute.component';

@Component({
  selector: 'app-attributes',
  templateUrl: './Attributes.component.html',
  styleUrls: ['./Attributes.component.scss']
})
export class AttributesComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['name', 'sortOrder', 'actions'];
  dataSource: MatTableDataSource<AttributeDescription>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';

  @ViewChild(AttributeComponent, { static: false }) attributeView: AttributeComponent;

  @Input() attributeGroup: AttributeGroup;
  @Input() attributeGroupId: number;

  constructor(public appService: AppService,
    public translate: TranslateService) {
      super(translate);
    }

  ngOnInit() {
    this.getAttributes();
  }

  getAttributes() {
    
    const parameters: string[] = [];
    parameters.push('e.language.id = |languageId|' + this.appService.appInfoStorage.language.id + '|Integer');
    parameters.push('e.attribute.attributeGroup.id = |attributeGroupId|' + this.attributeGroupId + '|Integer');

    this.appService.getAllByCriteria('AttributeDescription', parameters)
      .subscribe((data: AttributeDescription[]) => {

        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
        error => console.log(error),
        () => console.log('Get AttributeDescription Items for AttributeGroup complete'));
  }

  public remove(attrGrpDesc: AttributeDescription) {
    this.messages = '';
    this.appService.delete(attrGrpDesc.id, 'com.softenza.emarket.model.AttributeDescription')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(attrGrpDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<AttributeDescription>(this.dataSource.data);
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

  onAttributeSave($event) {
    const attribute = $event;

    attribute.attributeDescriptions.forEach(element => {
        if (element.language.id === this.appService.appInfoStorage.language.id) {
          attribute.attributeDescriptions[0].attribute = attribute;
          this.dataSource.data.push(attribute.attributeDescriptions[0]);
          this.dataSource = new MatTableDataSource(this.dataSource.data);
        }
    });
  }
}
