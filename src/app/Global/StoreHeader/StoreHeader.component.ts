import { Component, OnInit, Input } from '@angular/core';
import { Store } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-store-header',
  templateUrl: './StoreHeader.component.html',
  styleUrls: ['./StoreHeader.component.scss']
})
export class StoreHeaderComponent implements OnInit  {

  @Input() store: Store;
  @Input() backgroundImg: any;

  constructor(private appService: AppService) {
  }

/*   ngAfterViewChecked() {
    console.log('ngAfterViewChecked');
  }
  ngAfterContentChecked() {
    console.log('ngAfterContentChecked');
  }
 */
  ngOnInit() {
    if (this.store) {
      console.log(this.store);
      for (const cat of this.appService.appInfoStorage.storeCategories) {
        if (this.store.storeCat.id === cat.storeCat.id) {
          this.store.catName = cat.name;
          break;
        }
      }
    }
  }

}
