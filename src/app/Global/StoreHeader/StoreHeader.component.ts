import { Component, OnInit, Input } from '@angular/core';
import { Store } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-store-header',
  templateUrl: './StoreHeader.component.html',
  styleUrls: ['./StoreHeader.component.scss']
})
export class StoreHeaderComponent implements OnInit {

  @Input() store: Store;
  backgroundImg: any;

  constructor(private appService: AppService,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    if (this.store) {
      console.log(this.store);
      if (this.store.storeFrontImage) {
        this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle('url(' +
          '/assets/images/stores/' + this.store.id + '/' + this.store.storeFrontImage + ')');
      } else {
        this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle('url(/assets/images/page-title-bar.jpg)');
      }
      for (const cat of this.appService.appInfoStorage.storeCategories) {
        if (this.store.storeCat.id === cat.storeCat.id) {
          this.store.catName = cat.name;
          break;
        }
      }
    } else {
      this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle('url(/assets/images/page-title-bar.jpg)');
    }
  }

}
