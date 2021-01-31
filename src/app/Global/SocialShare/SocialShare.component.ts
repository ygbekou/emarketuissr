import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'embryo-SocialShare',
  templateUrl: './SocialShare.component.html',
  styleUrls: ['./SocialShare.component.scss']
})
export class SocialShareComponent implements OnInit {

  @Input() url: string;
  constructor() { }

  ngOnInit() {
  }

}
