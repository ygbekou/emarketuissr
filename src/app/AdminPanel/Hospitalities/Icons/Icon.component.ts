import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, Icon, IconDesc } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-icon',
  templateUrl: './Icon.component.html',
  styleUrls: ['./Icons.component.scss']
})

export class IconComponent extends BaseComponent implements OnInit {

  messages = '';
  icon: Icon;

  @Output() saveEvent = new EventEmitter<Icon>();

  constructor(
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public appService: AppService) {
    super(translate);
  }

  ngOnInit() {
    console.log('ttttttttttttttttttt');
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getDescs(params.id);
      }
    });

  }

  clearMessages($event) {
    this.messages = '';
  }

  setIcon($event) {
    this.icon = $event;
  }

  clear() {
    this.icon = new Icon();
    this.icon.iconDescs = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const id = new IconDesc();
      id.language = lang;
      id.name = '';
      this.icon.iconDescs.push(id);
    }
  }

  getDescs(id: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (id != null) {
      parameters.push('e.icon.id = |iconId|' + id + '|Integer');
    }
    this.appService.getAllByCriteria('IconDesc', parameters)
      .subscribe((data: IconDesc[]) => {

        if (data !== null && data.length > 0) {
          this.icon = data[0].icon;
          this.icon.iconDescs = data;

        }
      },
        error => console.log(error),
        () => console.log('Get all Icon Description complete'));
  }

  setToggles() {
    this.icon.status = (this.icon.status == null
      || this.icon.status.toString() === 'false'
      || this.icon.status.toString() === '0') ? 0 : 1;
  }

  cleanDescs(icon: Icon) {
    icon.iconDescs.forEach(element => {
       element.icon = undefined;
       const language = element.language;
       element.language = new Language();
       element.language.id = language.id;    });
  }

  save() {
    this.messages = '';
    try {
      this.setToggles();
      const thisIcon = {...this.icon};
      this.cleanDescs(thisIcon);

      this.appService.save(thisIcon, 'Icon')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.icon, null);
            this.icon = {...result};
            this.saveEvent.emit(this.icon);
            this.clear();
          }
        });

    } catch (e) {
      console.log(e);
    }
  }


}
