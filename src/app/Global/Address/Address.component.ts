import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User, Address, Country, Zone } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import CardUtils from 'src/app/Services/cardUtils';
import { Location, Appearance } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
declare var google: any;

@Component({
   selector: 'app-address',
   templateUrl: './Address.component.html',
   styleUrls: ['./Address.component.scss']
})
export class AddressComponent implements OnInit {
   address: Address = new Address();
   user: User = new User();
   messages: string;
   errors: string;
   addressTypes: any[];
   @Output()
   addressSaveEvent = new EventEmitter<Address>();
   public countries: Country[] = [];
   public zones: Zone[] = [];
   @Input()
   userId;
   @Input()
   selectedAddressType: number;
   public marker: any;
   public showForm = false;
   public paceDescription: string;
   public map: any;
   /*    public autocomplete: { input: string; };
      public autocompleteItems: any[]; */
   public location: any;
   public placeid: any;
   public locationEnabled = true;
   public locationAuthorized = true;
   public latitude = 0;
   public longitude = 0;
   public gpsClicked = false;
   public hasError = false;
   constructor(
      public appService: AppService,
      public translate: TranslateService) {
      this.addressTypes = CardUtils.getAddressTypes();
   }

   ngOnInit() {
      this.loadMap();
      this.getCountries();
      this.appService.getCountries();
      if (this.userId === undefined) {
         this.userId = Number(this.appService.tokenStorage.getUserId());
      }
      this.getUser(this.userId);
   }

   public getUser(userId: number) {
      this.appService.getOneWithChildsAndFiles(userId, 'User')
         .subscribe((result) => {
            if (result.id > 0) {
               this.user = result;
            } else {
               console.log('get user failed');
            }
         });
   }
   public getCountries() {
      const parameters: string[] = [];
      this.appService.getAllByCriteria('com.softenza.emarket.model.Country', parameters)
         .subscribe((data: Country[]) => {
            this.countries = data;
         },
            (error) => console.log(error),
            () => console.log('Get all Countries complete'));
   }

   public compareWithC(o1: Country, o2: Country): boolean {
      // console.log(o1.id + ' -C- ' + o2.id);
      return o1 && o2 ? (o1.id === o2.id) : false;
   }
   public compareWithZ(o1: Zone, o2: Zone): boolean {
      // console.log(o1.id + ' -Z- ' + o2.id);
      return o1 && o2 ? (o1.id === o2.id) : false;
   }

   public getZones(country: Country) {
      if (country) {
         const parameters: string[] = [];
         parameters.push('e.country.id = |countryId|' + country.id + '|Integer');
         parameters.push('e.status = |xyz|1|Integer');
         this.appService.getAllByCriteria('com.softenza.emarket.model.Zone', parameters)
            .subscribe((data: Zone[]) => {
               this.zones = data;
            },
               (error) => console.log(error),
               () => console.log('Get all GeoZone complete'));
      }
   }

   public setZoneForAddress(country: Country, address: Address) {
      if (country) {
         const parameters: string[] = [];
         parameters.push('e.country.id = |countryId|' + country.id + '|Integer');
         parameters.push('e.status = |xyz|1|Integer');
         this.appService.getAllByCriteria('com.softenza.emarket.model.Zone', parameters)
            .subscribe((data: Zone[]) => {
               this.zones = data;
               if (this.zones) {
                  for (const z of this.zones) {
                     if (z.code === address.zone.code) {
                        address.zone = z;
                        break;
                     }
                  }
               }
            },
               (error) => console.log(error),
               () => console.log('Get all GeoZone complete'));
      }
   }


   public getZoneForAddress(country: Country, address: Address) {
      if (country) {
         const parameters: string[] = [];
         parameters.push('e.country.id = |countryId|' + country.id + '|Integer');
         parameters.push('e.status = |xyz|1|Integer');
         this.appService.getAllByCriteria('com.softenza.emarket.model.Zone', parameters)
            .subscribe((data: Zone[]) => {
               this.zones = data;
               this.address = address;
               console.log(address);
               if (this.address.longitude > 0 || this.address.latitude > 0) {
                  this.longitude = this.address.longitude;
                  this.latitude = this.address.latitude;
                  this.setLongLat(this.address);
               } else {
                  this.getLongLat();
               }
            },
               (error) => console.log(error),
               () => console.log('Get all GeoZone complete'));
      }
   }

   public async save() {
      console.log('Save called : ' + this.gpsClicked);
       this.hasError = false;
      if (!this.gpsClicked) {
         this.messages = '';
         this.hasError = false;
         if (!this.address.name || !this.address.firstName
            || !this.address.lastName
            || !this.address.city
            || !this.address.address1) {
            this.hasError = true;
            this.translate.get(['MESSAGE.FILL_ALL_REQUIRED_FIELD', 'COMMON.SUCCESS']).subscribe((res) => {
               this.messages = res['MESSAGE.FILL_ALL_REQUIRED_FIELD'];
            });
         } else {
            if (!this.address.user) {
               this.address.user = new User();
               this.address.user.id = Number(this.appService.tokenStorage.getUserId());
            }

            if (this.marker) {
               this.address.longitude = this.marker.getPosition().lng();
               this.address.latitude = this.marker.getPosition().lat();
            }

            if (this.address.countryCode && this.address.phone
               && !this.address.phone.startsWith(this.address.countryCode)) {
               this.address.phone = this.address.countryCode + this.address.phone;
            }
            console.log('this.address.longitude = ' + this.address.longitude
               + ', this.address.latitude =' + this.address.latitude);
            console.log(this.address);

            console.log('Before calling set address');
            this.appService.saveWithUrl('/service/catalog/findOrCreateAddress/', this.address)
               .subscribe(async (addr: Address) => {
                  if (addr) {
                     this.address = addr;
                     this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe((res) => {
                        this.messages = res['MESSAGE.SAVE_SUCCESS'];
                     });
                     this.updateAddress(addr);
                  } else {
                     this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe((res) => {
                        this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
                        this.hasError = true;
                     });
                  }
                  console.log('Address updated');
               }, (error) => {
                  console.log(error);
                  console.log('Error Changing updateAddress');
               },
                  () => {
                     console.log('Changing updateAddress complete');
                  });
         }
      }
   }

   isNotAddressTypePreSelected() {
      return this.selectedAddressType === undefined;
   }

   getAddress(addressId: number) {
      this.appService.getOne(addressId, 'com.softenza.emarket.model.Address')
         .subscribe((data: Address) => {
            this.address = data;
            this.getZones(this.address.country);
            this.setLongLat(this.address);
            this.showForm = true;
            //  this.appService.getZones(this.address.country);
         },
            error => console.log(error),
            () => console.log('Get address complete for addressId=' + addressId));
   }

   clear() {
      this.address = new Address();
   }

   public updateAddress(address: Address) {
      address.addressType = 2;
      this.user.billingAddress = address;
      address.user = new User();
      address.user.id = this.user.id;
      this.appService.saveWithUrl('/service/catalog/setShipPayAddress/', address)
         .subscribe(() => {
            address.addressType = 1;
            this.user.shippingAddress = address;
            address.user = new User();
            address.user.id = this.user.id;
            this.appService.saveWithUrl('/service/catalog/setShipPayAddress/', address)
               .subscribe(() => {
                  console.log('Address updated');
                  this.addressSaveEvent.emit(address);
                  this.address = new Address();
               }, (error) => console.log(error),
                  () => console.log('Changing Bill complete'));
         }, (error) => console.log(error),
            () => console.log('Changing Bill complete'));
   }

   // LOADING THE MAP HAS 2 PARTS.
   public loadMap() {
      // FIRST GET THE LOCATION FROM THE DEVICE.
      console.log('Calling load map');
      this.appService.navigator.geolocation.getCurrentPosition((resp) => {
         const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
         this.map = new google.maps.Map(document.getElementById('map'), {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
         });
         console.log(latLng);
         this.marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.BOUNCE,
            position: this.map.getCenter(),
            draggable: true,
            icon: {
               url: 'assets/images/company/map-marker.png',
               size: new google.maps.Size(38, 52),
               scaledSize: new google.maps.Size(38, 52),
            },
            label: {
               text: (this.appService.appInfoStorage.language &&
                  this.appService.appInfoStorage.language.code === 'en') ? 'Deliver here' : 'Delivrer ici',
               color: '#371BB1',
               fontSize: '24px',
               x: '200',
               y: '400',
            },
         });
         google.maps.event.addListener(this.marker, 'dragend', function () {
            console.log('getCoordinates addListenercalled');
            this.addresse = '';
            // console.log('Moved Position changed: ' + this.latitude + ', ' + this.longitude);
         });
      });
   }

   public loadDefaultMap() {
      // FIRST GET THE LOCATION FROM THE DEVICE.
      console.log('Calling load Default map - IPNET');
      const latLng = new google.maps.LatLng(6.2024767, 1.1942214);
      this.map = new google.maps.Map(document.getElementById('map'), {
         center: latLng,
         zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      this.marker = new google.maps.Marker({
         map: this.map,
         animation: google.maps.Animation.BOUNCE,
         position: this.map.getCenter(),
         draggable: true,
         icon: {
            url: 'assets/images/company/map-marker.png',
            size: new google.maps.Size(38, 52),
            scaledSize: new google.maps.Size(38, 52),
         },
         label: {
            text: (this.appService.appInfoStorage.language &&
               this.appService.appInfoStorage.language.code === 'en') ? 'Deliver here' : 'Delivrer ici',
            color: '#371BB1',
            fontSize: '24px',
            x: '200',
            y: '400',
         },
      });
      google.maps.event.addListener(this.marker, 'dragend', function () {
         console.log('getCoordinates addListenercalled');
         this.addresse = '';
         // console.log('Moved Position changed: ' + this.latitude + ', ' + this.longitude);
      });
   }

   onAutocompleteSelected(item: PlaceResult) {
      console.log('onAutocompleteSelected: ', item);
      this.placeid = item.place_id;
      this.paceDescription = item.name;
      this.showForm = true;
      this.reverseGeoCodePlace();
   }

   onLocationSelected(location: Location) {
      console.log('onLocationSelected: ', location);
      this.latitude = location.latitude;
      this.longitude = location.longitude;
      this.showForm = true;
   }

   public SelectSearchResult(item) {

      this.reverseGeoCodePlace();
   }

   public async reverseGeoCodePlace() {
      return new Promise((resolve, reject) => {
         const geocoder = new google.maps.Geocoder();
         geocoder.geocode(
            { placeId: this.placeid },
            async (
               results: google.maps.GeocoderResult[],
               status: google.maps.GeocoderStatus,
            ) => {
               if (status === 'OK') {
                  if (results[0]) {
                     console.log(results[0]);
                     this.moveMarkerToPlace(results[0].geometry.location);
                     // const address = new Address();
                     this.address.address1 = '';
                     for (const comp of results[0].address_components) {
                        if (comp.types[0] === 'street_number') {
                           this.address.address1 = comp.long_name;
                        }
                        if (comp.types[0] === 'route') {
                           this.address.address1 += ' ' + comp.long_name;
                        }
                        if (!this.address.address1 || this.address.address1.includes('Unnamed Road')) {
                           this.address.address1 = this.paceDescription;
                        }

                        if (comp.types[0] === 'locality') {
                           this.address.city = comp.long_name;
                        }

                        if (comp.types[0] === 'administrative_area_level_1') { // zone
                           const z = new Zone();
                           z.name = comp.long_name;
                           z.code = comp.short_name;
                           this.address.zone = z;
                        }

                        if (comp.types[0] === 'administrative_area_level_2') { // zone
                           this.address.address2 = comp.long_name;
                        }

                        if (comp.types[0] === 'country') { // country
                           const c = new Country();
                           c.name = comp.long_name;
                           c.isoCode2 = comp.short_name;
                           this.address.country = c;
                        }

                        if (comp.types[0] === 'postal_code') {
                           this.address.postCode = comp.long_name;
                        }

                     }
                     if (!this.address.user || !(this.address.user.id > 0)) {
                        this.address.user = new User();
                        this.address.user.id = this.user.id;
                     }
                     if (!this.address.firstName) {
                        this.address.firstName = this.user.firstName;
                     }
                     if (!this.address.lastName) {
                        this.address.lastName = this.user.lastName;
                     }
                     if (!this.address.phone) {
                        this.address.phone = this.user.mobilePhone;
                     }

                     if (!this.address.city) {
                        this.address.city = this.address.address2;
                     }
                     if (this.address.address1) {
                        this.address.address2 = '';
                     }
                     if (!this.address.name) {
                        this.address.name = this.paceDescription;
                     }

                     this.address.longitude = this.longitude;
                     this.address.latitude = this.latitude;
                     this.address.gPlaceId = this.placeid;
                     this.setCountryCode();
                     console.log(this.address);
                  } else {
                     reject(false);
                     console.log('No results found');
                  }
               } else {
                  reject(false);
                  console.log('Geocoder failed due to: ' + status);
               }
            },
         );
      });
   }

   public setCountryCode() {
      console.log('Setting country code');
      if (this.address && this.countries.length > 0) {
         for (const country of this.countries) {
            if (country.isoCode2 === this.address.country.isoCode2) {
               this.address.countryCode = country.code ? ('+' + country.code) : '';
               console.log('Country code = ' + this.address.countryCode);
               this.address.country = country;
               this.setZoneForAddress(country, this.address);
               break;
            }
         }
      }
   }

   public getLongLat() {
      console.log('get long lat called');
      if (this.appService.navigator.geolocation) {
         console.log('navigator.geolocation = true');
         navigator.geolocation.getCurrentPosition(
            (position: Position) => {
               this.latitude = position.coords.latitude;
               this.longitude = position.coords.longitude;
               this.map = new google.maps.Map(document.getElementById('map'), {
                  center: { lat: position.coords.latitude, lng: position.coords.longitude },
                  zoom: 15,
               });
               // this.reverseGeoCode();
               this.marker = new google.maps.Marker({
                  map: this.map,
                  animation: google.maps.Animation.DROP,
                  position: this.map.getCenter(),
                  draggable: true,
                  icon: {
                     url: 'assets/images/company/map-marker.png',
                     size: new google.maps.Size(38, 52),
                     scaledSize: new google.maps.Size(38, 52),
                  },
                  label: {
                     text: (this.appService.appInfoStorage.language &&
                        this.appService.appInfoStorage.language.code === 'en') ? 'Deliver here' : 'Delivrer ici',
                     color: '#371BB1',
                     fontSize: '24px',
                     x: '200',
                     y: '200',
                  },
               });
               google.maps.event.addListener(this.marker, 'dragend', function () {
                  console.log('getCoordinates addListenercalled');
                  console.log('Moved Position changed: ' + this.latitude + ', ' + this.longitude);
               });

            },
            () => {
               console.log('Error 1');
               // handleLocationError(true, infoWindow, map.getCenter()!);
            },
         );
      } else {
         console.log('Browser doesn\'t support Geolocation');
         // Browser doesn't support Geolocation
         // handleLocationError(false, infoWindow, map.getCenter()!);
      }
   }

   public setLongLat(addr: Address) {
      console.log('set long lat called: this.latitude =' + addr.latitude + ', this.longitude = ' + addr.longitude);
      this.paceDescription = addr.name ? addr.name : addr.address1;
      if (this.appService.navigator.geolocation && addr.longitude && addr.latitude) {
         this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: addr.latitude, lng: addr.longitude },
            zoom: 15,
         });
         this.marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.BOUNCE,
            position: this.map.getCenter(),
            draggable: true,
            icon: {
               url: 'assets/images/company/map-marker.png',
               size: new google.maps.Size(38, 52),
               scaledSize: new google.maps.Size(38, 52),
            },
            label: {
               text: (this.appService.appInfoStorage.language &&
                  this.appService.appInfoStorage.language.code === 'en') ? 'Deliver here' : 'Delivrer ici',
               color: '#371BB1',
               fontSize: '24px',
               x: '200',
               y: '200',
            },
         });
         google.maps.event.addListener(this.marker, 'dragend', function () {
            console.log('getCoordinates addListenercalled');
         });
      } else {
         this.loadMap();
      }
   }

   public moveMarkerToPlace(loc) {
      console.log('moveMarkerToPlace called');
      // this.reverseGeoCode();
      this.marker = new google.maps.Marker({
         map: this.map,
         animation: google.maps.Animation.BOUNCE,
         position: loc,
         draggable: true,
         icon: {
            url: 'assets/images/company/map-marker.png',
            size: new google.maps.Size(38, 52),
            scaledSize: new google.maps.Size(38, 52),
         },
         label: {
            text: (this.appService.appInfoStorage.language &&
               this.appService.appInfoStorage.language.code === 'en') ? 'Deliver here' : 'Delivrer ici',
            color: '#371BB1',
            fontSize: '24px',
            x: '200',
            y: '400',
         },
      });
      this.map.setCenter(loc);
      this.latitude = Number(this.marker.getPosition().lat()) + 0;
      this.longitude = Number(this.marker.getPosition().lng()) + 0;
      this.address.longitude = this.longitude;
      this.address.latitude = this.latitude;
      google.maps.event.addListener(this.marker, 'dragend', function () {
         console.log('getCoordinates addListenercalled');
         console.log('Moved Position changed: ' + this.latitude + ', ' + this.longitude);
      });
   }

   public userGPS() {
      this.gpsClicked = true;
      console.log('userGPS() called');
      if (this.marker) {
         this.latitude = Number(this.marker.getPosition().lat()) + 0;
         this.longitude = Number(this.marker.getPosition().lng()) + 0;
      }
      if ((!this.address.country || !this.address.country.isoCode2) ||
         (this.longitude !== this.address.longitude
            || this.latitude !== this.address.latitude)
      ) {
         this.reverseGeoCode();
      }
      this.showForm = true;
   }

   public async reverseGeoCode() {
      return new Promise((resolve, reject) => {
         console.log('Reverse geocode called');
         console.log(this.marker);
         if (this.marker) {
            this.latitude = Number(this.marker.getPosition().lat()) + 0;
            this.longitude = Number(this.marker.getPosition().lng()) + 0;
            const latlng = {
               lat: this.latitude,
               lng: this.longitude,
            };
            console.log('this.latitude = ' + this.latitude + ', this.longitude = ' + this.longitude);
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
               { location: latlng },
               async (
                  results: google.maps.GeocoderResult[],
                  status: google.maps.GeocoderStatus,
               ) => {
                  if (status === 'OK') {
                     if (results[0]) {
                        console.log(results[0]);
                        // this.paceDescription = results[0].formatted_address;
                        // document.getElementById('reversedAddress').innerHTML = results[0].formatted_address;
                        console.log(results[0].formatted_address);
                        // const address = new Address();
                        this.address.address1 = '';
                        for (const comp of results[0].address_components) {
                           if (comp.types[0] === 'street_number') {
                              this.address.address1 = comp.long_name;
                           }
                           if (comp.types[0] === 'route') {
                              this.address.address1 += ' ' + comp.long_name;
                           }
                           if (!this.address.address1 || this.address.address1.includes('Unnamed Road')) {
                              this.address.address1 = 'Position GPS';
                           }

                           if (comp.types[0] === 'locality') {
                              this.address.city = comp.long_name;
                           }

                           if (comp.types[0] === 'administrative_area_level_1') { // zone
                              const z = new Zone();
                              z.name = comp.long_name;
                              z.code = comp.short_name;
                              this.address.zone = z;
                           }

                           if (comp.types[0] === 'administrative_area_level_2') { // zone
                              this.address.address2 = comp.long_name;
                           }

                           if (comp.types[0] === 'country') { // country
                              const c = new Country();
                              c.name = comp.long_name;
                              c.isoCode2 = comp.short_name;
                              this.address.country = c;
                           }

                           if (comp.types[0] === 'postal_code') {
                              this.address.postCode = comp.long_name;
                           }

                        }
                        if (!this.address.user || !(this.address.user.id > 0)) {
                           this.address.user = new User();
                           this.address.user.id = this.user.id;
                        }
                        if (!this.address.firstName) {
                           this.address.firstName = this.user.firstName;
                        }
                        if (!this.address.lastName) {
                           this.address.lastName = this.user.lastName;
                        }
                        if (!this.address.phone) {
                           this.address.phone = this.user.mobilePhone;
                        }

                        if (!this.address.city) {
                           this.address.city = this.address.address2;
                        }
                        if (this.address.address1) {
                           this.address.address2 = '';
                        }
                        if (!this.address.name) {
                           this.address.name = this.address.address1;
                        }

                        if (!this.address.city) {
                           this.address.city = this.address.address2;
                        }
                        if (this.address.address1) {
                           this.address.address2 = '';
                        }
                        this.address.longitude = this.longitude;
                        this.address.latitude = this.latitude;
                        this.setCountryCode();
                        console.log(this.address);
                     } else {
                        reject(false);
                        console.log('No results found');
                     }
                  } else {
                     reject(false);
                     console.log('Geocoder failed due to: ' + status);
                  }
               },
            );
         } else {
            reject(false);
         }
      });
   }
}
