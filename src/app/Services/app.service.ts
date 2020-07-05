import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig, MatSidenav } from '@angular/material';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { ReviewPopupComponent } from '../Global/ReviewPopup/ReviewPopup.component';
import { ConfirmationPopupComponent } from '../Global/ConfirmationPopup/ConfirmationPopup.component';
import { TokenStorage } from '../token.storage';
import { catchError } from 'rxjs/operators';
import { GenericResponse, User, AuthToken, SearchAttribute, TaxClass, Language, StockStatus, GenericVO } from '../app.models';
import { Constants } from '../app.constants';
import { AppInfoStorage } from '../app.info.storage';
import { TranslateService } from '@ngx-translate/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

interface Response {
   data: any;
}

@Injectable()
export class AppService {

   sidenavOpen = false;
   paymentSidenavOpen = false;
   isDirectionRtl = false;
   featuredProductsSelectedTab: any = 0;
   newArrivalSelectedTab: any = 0;

   /**** Get currency code:- https://en.wikipedia.org/wiki/ISO_4217 *****/
   currency = 'USD';
   language = 'en';

   shipping = 12.95;
   tax = 27.95;

   products: AngularFireObject<any>;

   localStorageCartProducts: any;
   localStorageWishlist: any;
   navbarCartCount = 0;
   navbarWishlistProdCount = 0;
   buyUserCartProducts: any;

   // Custom
   private headers: HttpHeaders;
   appInfoStorage: AppInfoStorage;

   constructor(private http: HttpClient,
      private dialog: MatDialog,
      private db: AngularFireDatabase,
      private toastyService: ToastaService,
      private toastyConfig: ToastaConfig,
      public tokenStorage: TokenStorage,
      private translate: TranslateService
   ) {

      this.toastyConfig.position = 'top-right';
      this.toastyConfig.theme = 'material';
      this.calculateLocalWishlistProdCounts();
      localStorage.removeItem('user');
      localStorage.removeItem('byProductDetails');

      this.db.object('products').valueChanges().subscribe(res => { this.setCartItemDefaultValue(res['gadgets'][1]); });

      // Custom
      this.headers = new HttpHeaders();
      if (this.tokenStorage.hasToken()) {
         this.headers = this.headers.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
      }
      this.headers = this.headers.set('Content-Type', 'application/json');
      this.headers = this.headers.set('Accept', 'application/json');
      // this.initCompany();


      this.appInfoStorage = new AppInfoStorage(this.translate);
   }

   public setCartItemDefaultValue(setCartItemDefaultValue) {
      let products: any;
      products = JSON.parse(localStorage.getItem('cart_item')) || [];
      const found = products.some(function (el, index) {
         if (el.name == setCartItemDefaultValue.name) {
            return true;
         }
      });
      if (!found) { products.push(setCartItemDefaultValue); }

      localStorage.setItem('cart_item', JSON.stringify(products));
      this.calculateLocalCartProdCounts();
   }

   public reviewPopup(singleProductDetails, reviews) {
      let review: MatDialogRef<ReviewPopupComponent>;
      const dialogConfig = new MatDialogConfig();
      if (this.isDirectionRtl) {
         dialogConfig.direction = 'rtl';
      } else {
         dialogConfig.direction = 'ltr';
      }

      review = this.dialog.open(ReviewPopupComponent, dialogConfig);
      review.componentInstance.singleProductDetails = singleProductDetails;
      review.componentInstance.reviews = reviews;

      return review.afterClosed();
   }

   public confirmationPopup(message: string) {
      let confirmationPopup: MatDialogRef<ConfirmationPopupComponent>;
      confirmationPopup = this.dialog.open(ConfirmationPopupComponent);
      confirmationPopup.componentInstance.message = message;

      return confirmationPopup.afterClosed();
   }

   public getProducts() {
      this.products = this.db.object('products');
      return this.products;
   }

   /*
      ----------  Cart Product Function  ----------
   */

   // Adding new Product to cart in localStorage
   public addToCart(data: any, type: any = '') {
      let products: any;
      products = JSON.parse(localStorage.getItem('cart_item')) || [];
      const productsLength = products.length;

      const toastOption: ToastOptions = {
         title: 'Adding Product To Cart',
         msg: 'Product adding to the cart',
         showClose: true,
         timeout: 1000,
         theme: 'material'
      };

      const found = products.some(function (el, index) {
         if (el.name == data.name) {
            if (!data.quantity) { data.quantity = 1; }
            products[index]['quantity'] = data.quantity;
            return true;
         }
      });
      if (!found) { products.push(data); }

      if (productsLength == products.length) {
         toastOption.title = 'Product Already Added';
         toastOption.msg = 'You have already added this product to cart list';
      }

      if (type == 'wishlist') {
         this.removeLocalWishlistProduct(data);
      }

      this.toastyService.wait(toastOption);
      setTimeout(() => {
         localStorage.setItem('cart_item', JSON.stringify(products));
         this.calculateLocalCartProdCounts();
      }, 500);
   }

   public buyNow(data: any) {
      let products: any;
      products = JSON.parse(localStorage.getItem('cart_item')) || [];

      const found = products.some(function (el, index) {
         if (el.name == data.name) {
            if (!data.quantity) { data.quantity = 1; }
            products[index]['quantity'] = data.quantity;
            return true;
         }
      });
      if (!found) { products.push(data); }

      localStorage.setItem('cart_item', JSON.stringify(products));
      this.calculateLocalCartProdCounts();
   }

   public updateAllLocalCartProduct(products: any) {
      localStorage.removeItem('cart_item');

      localStorage.setItem('cart_item', JSON.stringify(products));
   }

   // returning LocalCarts Product Count
   public calculateLocalCartProdCounts() {
      this.localStorageCartProducts = null;
      this.localStorageCartProducts = JSON.parse(localStorage.getItem('cart_item')) || [];
      this.navbarCartCount = +((this.localStorageCartProducts).length);
   }

   // Removing cart from local
   public removeLocalCartProduct(product: any) {
      const products: any = JSON.parse(localStorage.getItem('cart_item'));

      for (let i = 0; i < products.length; i++) {
         if (products[i].id === product.id) {
            products.splice(i, 1);
            break;
         }
      }

      const toastOption: ToastOptions = {
         title: 'Remove Product From Cart',
         msg: 'Product removing from cart',
         showClose: true,
         timeout: 1000,
         theme: 'material'
      };

      this.toastyService.wait(toastOption);
      setTimeout(() => {
         // ReAdding the products after remove
         localStorage.setItem('cart_item', JSON.stringify(products));
         this.calculateLocalCartProdCounts();
      }, 500);
   }

   /*
      ----------  Wishlist Product Function  ----------
   */

   // Adding new Product to Wishlist in localStorage
   public addToWishlist(data: any) {
      const toastOption: ToastOptions = {
         title: 'Adding Product To Wishlist',
         msg: 'Product adding to the wishlist',
         showClose: true,
         timeout: 1000,
         theme: 'material'
      };

      let products: any;
      products = JSON.parse(localStorage.getItem('wishlist_item')) || [];
      const productsLength = products.length;

      const found = products.some(function (el, index) {
         if (el.name == data.name) {
            if (!data.quantity) { data.quantity = 1; }
            products[index]['quantity'] = data.quantity;
            return true;
         }
      });
      if (!found) { products.push(data); }

      if (productsLength == products.length) {
         toastOption.title = 'Product Already Added';
         toastOption.msg = 'You have already added this product to wishlist';
      }

      this.toastyService.wait(toastOption);
      setTimeout(() => {
         localStorage.setItem('wishlist_item', JSON.stringify(products));
         this.calculateLocalWishlistProdCounts();
      }, 500);

   }

   // returning LocalWishlist Product Count
   public calculateLocalWishlistProdCounts() {

      this.localStorageWishlist = null;
      this.localStorageWishlist = JSON.parse(localStorage.getItem('wishlist_item')) || [];
      this.navbarWishlistProdCount = +((this.localStorageWishlist).length);
   }

   // Removing Wishlist from local
   public removeLocalWishlistProduct(product: any) {
      const products: any = JSON.parse(localStorage.getItem('wishlist_item'));

      for (let i = 0; i < products.length; i++) {
         if (products[i].productId === product.productId) {
            products.splice(i, 1);
            break;
         }
      }

      const toastOption: ToastOptions = {
         title: 'Remove Product From Wishlist',
         msg: 'Product removing from wishlist',
         showClose: true,
         timeout: 1000,
         theme: 'material'
      };


      this.toastyService.wait(toastOption);
      setTimeout(() => {
         // ReAdding the products after remove
         localStorage.setItem('wishlist_item', JSON.stringify(products));
         this.calculateLocalWishlistProdCounts();
      }, 500);

   }

   public addAllWishListToCart(dataArray: any) {
      let a: any;
      a = JSON.parse(localStorage.getItem('cart_item')) || [];

      for (const singleData of dataArray) {
         a.push(singleData);
      }

      const toastOption: ToastOptions = {
         title: 'Adding All Product To Cart',
         msg: 'Products adding to the cart',
         showClose: true,
         timeout: 1000,
         theme: 'material'
      };

      this.toastyService.wait(toastOption);
      setTimeout(() => {
         localStorage.removeItem('wishlist_item');
         localStorage.setItem('cart_item', JSON.stringify(a));
         this.calculateLocalCartProdCounts();
         this.calculateLocalWishlistProdCounts();
      }, 500);

   }

   /**
    * getBlogList used to get the blog list.
    */
   public getBlogList() {
      let blogs: any;
      blogs = this.db.list('blogs');
      return blogs;
   }

   /**
    * getContactInfo used to get the contact infomation.
    */
   public getContactInfo() {
      let contact: any;
      contact = this.db.object('contact');
      return contact;
   }

   /**
    * getTermCondition used to get the term and condition.
    */
   public getTermCondition() {
      let termCondition: any;
      termCondition = this.db.list('term_condition');
      return termCondition;
   }

   /**
    * getPrivacyPolicy used to get the privacy policy.
    */
   public getPrivacyPolicy() {
      let privacyPolicy: any;
      privacyPolicy = this.db.list('privacy_policy');
      return privacyPolicy;
   }

   /**
    * getFaq used to get the faq.
    */
   public getFaq() {
      let faq: any;
      faq = this.db.object('faq');
      return faq;
   }

   /**
    * getProductReviews used to get the product review.
    */
   public getProductReviews() {
      let review: any;
      review = this.db.list('product_reviews');
      return review;
   }

   /**
    * Buy Product functions
    */
   public addBuyUserDetails(formdata) {
      localStorage.setItem('user', JSON.stringify(formdata));

      const product = JSON.parse(localStorage.getItem('cart_item'));
      localStorage.setItem('byProductDetails', JSON.stringify(product));
      this.buyUserCartProducts = JSON.parse(localStorage.getItem('byProductDetails'));

      localStorage.removeItem('cart_item');
      this.calculateLocalCartProdCounts();
   }

   public removeBuyProducts() {
      localStorage.removeItem('byProductDetails');
      this.buyUserCartProducts = JSON.parse(localStorage.getItem('byProductDetails'));
   }

   /**
    * getTeam used to get the team data.
    */
   public getTeam() {
      let team: any;
      team = this.db.list('team');
      return team;
   }

   /**
    * getTestimonial used to get the testimonial data.
    */
   public getTestimonial() {
      let testimonial: any;
      testimonial = this.db.object('testimonial');
      return testimonial;
   }

   /**
    * getMissionVision used to get the Mission and Vision data.
    */
   public getMissionVision() {
      let mission_vision: any;
      mission_vision = this.db.list('mission_vision');
      return mission_vision;
   }

   /**
    * getAboutInfo used to get the about info data.
    */
   public getAboutInfo() {
      let about_info: any;
      about_info = this.db.object('about_info');
      return about_info;
   }


   public getAll = (entityClass: string): Observable<any[]> => {
      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/all';
      return this.http.get<any>(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public getAllByCriteria = (entityClass: string, parameters: string[], orderBy = ''): Observable<any[]> => {
      const searchAttribute = new SearchAttribute();
      searchAttribute.parameters = parameters;
      searchAttribute.orderBy = orderBy;
      const toAdd = JSON.stringify(searchAttribute);
      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/allByCriteriaAndOrderBy';
      return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public getAllByCriteriaWithFiles = (entityClass: string, parameters: string[], orderBy = ''): Observable<any[]> => {
      const searchAttribute = new SearchAttribute();
      searchAttribute.parameters = parameters;
      searchAttribute.orderBy = orderBy;
      const toAdd = JSON.stringify(searchAttribute);
      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/allByCriteriaAndOrderByAndFiles';
      return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public save = (entity: any, entityClass: string): Observable<any> => {
      entity.modifiedBy = this.tokenStorage.getUserId;
      const toAdd = JSON.stringify(entity);
      const actionUrl = Constants.apiServer + '/service/crud/' + entityClass + '/save';
      return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }


   public saveWithUrl = (url: string, genericObject: any): Observable<any> => {

      const toAdd = JSON.stringify(genericObject);
      const actionUrl = Constants.apiServer + url;
      return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }


   public saveWithFile = (entity: any, entityClass: string, formData: FormData, method: string): Observable<any> => {
      let head = new HttpHeaders();
      if (this.tokenStorage.hasToken()) {
         head = head.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
      }
      entity.modifiedBy = this.tokenStorage.getUserId;
      const toAdd = JSON.stringify(entity);
      formData.append('dto', new Blob([toAdd],
         {
            type: 'application/json'
         }));

      const actionUrl = Constants.apiServer + '/service/crud/' + entityClass + '/' + method;
      return this.http.post<any>(actionUrl, formData, { headers: head })
         .pipe(catchError(this.handleError));
   }


   public authenticate = (user: User): Observable<AuthToken> => {
      const toAdd = JSON.stringify(user);
      const actionUrl = Constants.apiServer + '/service/token/authenticate';
      return this.http.post<AuthToken>(actionUrl, toAdd, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public resetPassword = (user: User): Observable<any> => {
      const toAdd = JSON.stringify(user);
      const actionUrl = Constants.apiServer + '/service/user/forgot/sendPassword';
      return this.http.post(actionUrl, toAdd, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public updateToken() {
      if (this.tokenStorage.hasToken()) {
         this.headers = this.headers.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
      }
   }

   public saveUserAndLogin = (user: User): Observable<any> => {
      const toAdd = JSON.stringify(user);
      const actionUrl = Constants.apiServer + '/service/user/forgot/saveUserAndLogin';
      return this.http.post(actionUrl, toAdd, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public getOne = (id: number, entityClass: string): Observable<any> => {
      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/' + id;
      return this.http.get(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public getOneWithFiles = (id: number, entityClass: string): Observable<any> => {
      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/withfiles/' + id;
      return this.http.get(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public delete = (id: number, entityClass: string): Observable<GenericResponse> => {
      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/delete/' + id;
      return this.http.get<GenericResponse>(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public getOneWithChildsAndFiles = (id: number, entityClass: string): Observable<any> => {
      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/withChildsAndFiles/' + id;
      return this.http.get(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public deleteFile = (entityClass: string, vo: any): Observable<any> => {
      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/deletefile';
      return this.http.post<any>(actionUrl, vo, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public getCachedReferences = (elementType: string): Observable<any> => {
    const actionUrl = Constants.apiServer + '/service/reference/' + elementType + '/all/active';
    return this.http.get(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

   public getCacheData() {
    const parameters: string[] = [];
    this.getAllByCriteria('com.softenza.emarket.model.TaxClass', parameters)
      .subscribe((data: TaxClass[]) => {
        this.appInfoStorage.taxClasses = data;
      }, error => console.log(error),
        () => console.log('Get Tax Classes complete'));

    
    this.getAllByCriteria('com.softenza.emarket.model.Language', parameters, ' order by e.sortOrder ')
      .subscribe((data: Language[]) => {
         this.appInfoStorage.languages = data;
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
            data.forEach(language => {
               this.translate.addLangs([language.code]);
               if (language.code === lang) {
                  this.translate.setDefaultLang(language.code);
                  this.appInfoStorage.language = language;

               }
            });
            console.log('Using language :' + lang);
            this.translate.use(lang);

      }, error => console.log(error),
        () => console.log('Get Languages complete'));


    this.getAllByCriteria('com.softenza.emarket.model.StockStatus', parameters)
      .subscribe((data: StockStatus[]) => {
        this.appInfoStorage.stockStatuses = data;
      }, error => console.log(error),
        () => console.log('Get Stock Statuses complete'));

    this.getCachedReferences('lengthclass')
      .subscribe((data: GenericVO[]) => {
        this.appInfoStorage.lengthClasses = data;
      }, error => console.log(error),
        () => console.log('Get lengthclass complete'));

     this.getCachedReferences('weightclass')
      .subscribe((data: GenericVO[]) => {
        this.appInfoStorage.weightClasses = data;
      }, error => console.log(error),
        () => console.log('Get weightclass complete'));

      this.getCachedReferences('manufacturer')
      .subscribe((data: GenericVO[]) => {
        this.appInfoStorage.manufacturers = data;
      }, error => console.log(error),
        () => console.log('Get manufacturer complete'));
  }



   // Error handling
   handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
         // Get client-side error
         errorMessage = error.error.message;
      } else {
         // Get server-side error
         errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.log(errorMessage);
      return throwError(errorMessage);
   }

   public changeLang(lang: Language) {
      this.appInfoStorage.language = lang;
      this.translate.use(lang.code);
   }

}
