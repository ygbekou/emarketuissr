import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, Service, ServiceDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-service',
  templateUrl: './Service.component.html',
  styleUrls: ['./Service.component.scss']
})

export class ServiceComponent extends BaseComponent implements OnInit {

  messages = '';
  service: Service;

  @Output() saveEvent = new EventEmitter<Service>();

  constructor(
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public appService: AppService) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getDescriptions(params.id);
      }
    });

  }

  clearMessages($event) {
    this.messages = '';
  }

  setIngredient($event) {
    this.service = $event;
  }

  clear() {
    this.service = new Service();
    this.service.serviceDescriptions = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const ttd = new ServiceDescription();
      ttd.language = lang;
      ttd.name = '';
      this.service.serviceDescriptions.push(ttd);
    }
  }

  getDescriptions(serviceId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (serviceId != null) {
      parameters.push('e.service.id = |serviceId|' + serviceId + '|Integer');
    }
    this.appService.getAllByCriteria('ServiceDescription', parameters)
      .subscribe((data: ServiceDescription[]) => {

        if (data !== null && data.length > 0) {
          this.service = data[0].service;
          this.service.serviceDescriptions = data;

        }
      },
        error => console.log(error),
        () => console.log('Get all Service Description complete'));
  }

  setToggles() {
    this.service.status = (this.service.status == null
      || this.service.status.toString() === 'false'
      || this.service.status.toString() === '0') ? 0 : 1;
  }

  cleanDescriptions(service: Service) {
    service.serviceDescriptions.forEach(element => {
       element.service = undefined;
       const language = element.language;
       element.language = new Language();
       element.language.id = language.id;    });
  }

  save() {
    this.messages = '';
    try {
      this.setToggles();
      const thisService = {...this.service};
      this.cleanDescriptions(thisService);

      this.appService.save(thisService, 'Service')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.service, null);
            this.service = {...result};
            this.saveEvent.emit(this.service);
            this.clear();
            console.log(this.service)
          }
        });

    } catch (e) {
      console.log(e);
    }
  }


}
