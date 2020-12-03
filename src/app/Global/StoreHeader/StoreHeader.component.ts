import { Component, OnInit, Input } from '@angular/core';
import { Store } from 'src/app/app.models';

@Component({
  selector: 'app-store-header',
  templateUrl: './StoreHeader.component.html',
  styleUrls: ['./StoreHeader.component.scss']
})
export class StoreHeaderComponent implements OnInit {

  @Input() store: Store;

  constructor() { }

  ngOnInit() {
  }

}
