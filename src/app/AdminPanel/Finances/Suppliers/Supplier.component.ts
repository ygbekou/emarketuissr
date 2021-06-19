import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Supplier, Store } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';
import { MatStepper } from '@angular/material';
import { Location } from "@angular/common";


@Component({
  selector: 'app-supplier',
  templateUrl: './Supplier.component.html',
  styleUrls: ['./Suppliers.component.scss']
})
export class SupplierComponent  extends BaseComponent implements OnInit {

  messages = '';
  supplier: Supplier = new Supplier();
  constants: Constants = new Constants();
  stores: Store[] = [];
  formData: FormData;
  picture: any[] = [];
  @Output() saveEvent = new EventEmitter<any>();

  @Input() isAdminPage = false;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
      super(translate);
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {

      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.supplier.id = params.id;
        this.clear();
        this.getSupplier(params.id);
      }
    });

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });
  }

  clear() {
    this.supplier = new Supplier();
    this.supplier.status = 1;
  }

  getSupplier(supplierId: number) {
    if (supplierId > 0) {
      this.appService.getOneWithChildsAndFiles(supplierId, 'Supplier')
        .subscribe(result => {
          if (result.id > 0) {
            this.supplier = result;
          } else {
            this.supplier = new Supplier();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } else {
      this.clear();
    }
  }

  save() {
    this.messages = '';
    this.supplier.modifiedBy = +this.appService.tokenStorage.getUserId();
    try {

      this.appService.save(this.supplier, 'Supplier')
        .subscribe(data => {
          this.processResult(data, this.supplier, null);
          this.supplier = data;
          this.saveEvent.emit(this.supplier);
        });

    } catch (e) {
      console.log(e);
    }
  }


  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }

}
