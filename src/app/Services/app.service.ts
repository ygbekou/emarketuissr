import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { ReviewPopupComponent } from '../Global/ReviewPopup/ReviewPopup.component';
import { ConfirmationPopupComponent } from '../Global/ConfirmationPopup/ConfirmationPopup.component';
import { TokenStorage } from '../token.storage';
import { catchError } from 'rxjs/operators';
import {
   GenericResponse, User, AuthToken, SearchAttribute, Language, GenericVO,
   CategoryDescription, Menu, Company, Country, Zone, CartItem, Product, Order, StoreCategoryDesc,
   Ingredient, RoomStoreVO, Wallet, DiscountCard, Currency, Service, ServiceDescription
} from '../app.models';
import { Constants } from '../app.constants';
import { AppInfoStorage } from '../app.info.storage';
import { TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TimerCountDownComponent } from '../Global/TimerCountDown/TimerCountDown.component';
import { ProductOptionPopupComponent } from '../Pages/Products/ProductsList/ProductOptionPopup.component';
import { CommentPopupComponent } from '../Pages/UserAccount/MyProducts/CommentPopup.component';
import { ShipperSearchComponent } from '../AdminPanel/Deliveries/Summaries/ShipperSearch.component';
import { UserSearchComponent } from '../AdminPanel/Finances/Wallets/UserSearch.component';
import { LocaleService } from './locale.service';


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
   distance = 0.0;
   products: AngularFireObject<any>;

   localStorageCartProducts: any;
   localStorageCartProductsMap: any = {};
   localStorageWishlist: any;

   navbarCartCount = 0;
   navbarCartCountMap = {};

   navbarCartPrice = 0;
   navbarCartPriceMap = {};

   navbarCartShippingWeightMap = {};
   navbarCartShippingMap = {};
   navbarCartShippingGeoZoneMap = {};
   navbarCartDeliveryMap = {};
   navbarCartStoreAllowOrderMap = {};
   navbarCartStorePayCash = {};

   navbarCartTotalBeforeTax = 0;
   navbarCartTotalBeforeTaxMap = {};

   navbarCartEstimatedTax = 0;
   navbarCartEstimatedTaxMap = {};

   navbarCartTotal = 0;
   navbarCartTotalMap = {};

   navbarCartWalletMap = {};

   navbarCartOrderTotalMap = {};

   navbarCartCurrencyMap = {};

   navbarCartPointsMap = {};

   navbarCartPointsValueMap = {};

   usedPointsValueMap = {};

   usedPointsMap = {};

   hasOrderSucceedMap = {};

   navbarWishlistProdCount = 0;
   buyUserCartProducts: any;

   // Custom
   private headers: HttpHeaders;
   appInfoStorage: AppInfoStorage;
   selectedRoomStore: RoomStoreVO;

   // Social Share
   ssTitle = 'Kekouda';
   ssImage = 'https://www.kekouda.com/assets/images/company/logo.png';
   ssUrl = 'https://www.kekouda.com';
   ssDescription = 'Kekouda';
   datePipe: any;
   appService: any;
   reservation: any;

   lang: any;
   navigator: any;

   constructor(private http: HttpClient,
      private dialog: MatDialog,
      private db: AngularFireDatabase,
      private toastyService: ToastaService,
      private deviceService: DeviceDetectorService,
      private toastyConfig: ToastaConfig,
      public tokenStorage: TokenStorage,
      private translate: TranslateService,
      private localeService: LocaleService
   ) {

      this.toastyConfig.position = 'top-right';
      this.toastyConfig.theme = 'material';
      this.calculateLocalWishlistProdCounts();
      this.navigator = navigator;

      // Custom
      this.headers = new HttpHeaders();
      if (this.tokenStorage.hasToken()) {
         this.headers = this.headers.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
      }
      this.headers = this.headers.set('Content-Type', 'application/json');
      this.headers = this.headers.set('Accept', 'application/json');
      // this.initCompany();


      this.appInfoStorage = new AppInfoStorage(this.translate);

      this.refreshReferenceData('UserGroup', 'ORDER BY e.name');

      console.log('*******    App Service constructor called      **********');
      this.getCacheData();
   }

   getUserAgent(): string {
      const deviceInfo = this.deviceService.getDeviceInfo();
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      const isDesktopDevice = this.deviceService.isDesktop();
      return 'browser = ' + deviceInfo.browser + ' '
         + deviceInfo.browser_version + ', os = ' +
         deviceInfo.os + ' ' + deviceInfo.os_version +
         ', device = ' + deviceInfo.device +
         ', Device type = ' + (isMobile ? 'Mobile' : (isTablet ? 'Tablet' : (isDesktopDevice ? 'Desktop' : 'Unkown')));

   }

   public setCartItemDefaultValue(setCartItemDefaultValue) {
      let products: any;
      products = JSON.parse(localStorage.getItem('cart_item')) || [];
      const found = products.some(function (el, index) {
         if (el.name === setCartItemDefaultValue.name) {
            return true;
         }
      });
      if (!found) { products.push(setCartItemDefaultValue); }

      localStorage.setItem('cart_item', JSON.stringify(products));
      console.log('Called from setCartItemDefaultValue');
      this.recalculateCart(true);
   }

   public cloneProduct(p: Product): Product {
      let copy: Product = new Product();
      copy = { ...p };
      copy.productDescriptions = [];
      copy.productVideos = [];
      copy.productToCategorys = [];
      console.log('Product copied');
      console.log(copy);
      return copy;
   }

   public cloneIngredient(i: Ingredient): Ingredient {
      let copy: Ingredient = new Ingredient();
      copy = { ...i };
      copy.ingredientDescriptions = [];
      return copy;
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

   public productOptionPopup(detailData) {
      let productOptionPopup: MatDialogRef<ProductOptionPopupComponent>;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.direction = this.isDirectionRtl ? 'rtl' : 'ltr';

      productOptionPopup = this.dialog.open(ProductOptionPopupComponent, dialogConfig);
      productOptionPopup.componentInstance.productDesc = detailData;

      return productOptionPopup.afterClosed();
   }

   public commentPopup(productStore) {
      let commentPopup: MatDialogRef<CommentPopupComponent>;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.direction = this.isDirectionRtl ? 'rtl' : 'ltr';

      commentPopup = this.dialog.open(CommentPopupComponent, dialogConfig);
      commentPopup.componentInstance.productStore = productStore;

      return commentPopup.afterClosed();
   }

   public confirmationPopup(message: string) {
      let confirmationPopup: MatDialogRef<ConfirmationPopupComponent>;
      confirmationPopup = this.dialog.open(ConfirmationPopupComponent);
      confirmationPopup.componentInstance.message = message;

      return confirmationPopup.afterClosed();
   }

   public timerCountDownPopup(countDownTime: number) {
      let timerCountDownPopup: MatDialogRef<TimerCountDownComponent>;
      timerCountDownPopup = this.dialog.open(TimerCountDownComponent);
      const counterDateTime = new Date(new Date().getTime() + (countDownTime));

      timerCountDownPopup.componentInstance.dateTime = counterDateTime;

      return timerCountDownPopup;
   }

   public timerCountDownPopupClose() {
      this.dialog.closeAll();
   }


   public shipperSearch(searchCriteria: any) {
      let popup: MatDialogRef<ShipperSearchComponent>;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.direction = this.isDirectionRtl ? 'rtl' : 'ltr';
      dialogConfig.maxWidth = '300vw';
      dialogConfig.maxHeight = '300vh';
      dialogConfig.width = '800px';
      dialogConfig.height = '500px';

      popup = this.dialog.open(ShipperSearchComponent, dialogConfig);
      popup.componentInstance.searchCriteria = searchCriteria;

      return popup.afterClosed();
   }

   public userSearch(searchCriteria: any) {
      let popup: MatDialogRef<UserSearchComponent>;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.direction = this.isDirectionRtl ? 'rtl' : 'ltr';
      dialogConfig.maxWidth = '300vw';
      dialogConfig.maxHeight = '300vh';
      dialogConfig.width = '800px';
      dialogConfig.height = '500px';

      popup = this.dialog.open(UserSearchComponent, dialogConfig);
      popup.componentInstance.searchCriteria = searchCriteria;

      return popup.afterClosed();
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
      let cartItems: CartItem[] = [];
      cartItems = JSON.parse(localStorage.getItem('cart_item')) || [];
      let title = 'Adding Product To Cart';
      let msg = 'Product adding to the cart';
      this.translate.get(['COMMON.ADDING_PRODUCT', 'COMMON.ERROR']).subscribe((res) => {
         title = res['COMMON.ADDING_PRODUCT'];
      });
      this.translate.get(['COMMON.QUANTITY', 'COMMON.ERROR']).subscribe((res) => {
         msg = res['COMMON.QUANTITY'] + ' : 1';
      });
      const toastOption: ToastOptions = {
         title: title,
         msg: msg,
         showClose: true,
         timeout: 1000,
         theme: 'material'
      };


      let found = false;
      let index = 0;
      for (const ci of cartItems) {
         if (data.hasOption === 0 && ci.ptsId === data.ptsId) {
            cartItems[index].quantity += (data.quantity ? data.quantity : 1);
            cartItems[index].total = this.calculateCartItemTotal(cartItems[index]);

            found = true;
            break;
         }
         index++;
      }

      if (!found) {
         data.quantity = (data.quantity ? data.quantity : 1);
         data.total = this.calculateCartItemTotal(data);
         cartItems.push(data);
      }
      if (type === 'wishlist') {
         this.removeLocalWishlistProduct(data);
      }

      this.toastyService.wait(toastOption);
      setTimeout(() => {
         localStorage.setItem('cart_item', JSON.stringify(cartItems));
         console.log('Called from setCartItemDefaultValue');
         this.recalculateCart(true);
      }, 500);
   }

   public buyNow(data: any) {
      let products: any;
      products = JSON.parse(localStorage.getItem('cart_item')) || [];

      const found = products.some(function (el, index) {
         if (el.name === data.name) {
            if (!data.quantity) { data.quantity = 1; }
            products[index].quantity = data.quantity;
            return true;
         }
      });
      if (!found) {
         products.push(data);
      }
      localStorage.setItem('cart_item', JSON.stringify(products));
      this.recalculateCart(true);
   }

   public updateAllLocalCartProduct(products: any) {
      localStorage.removeItem('cart_item');
      localStorage.setItem('cart_item', JSON.stringify(products));
   }

   public recalculateCart(needParse: boolean) {
      if (needParse) {
         this.localStorageCartProducts = null;
         this.localStorageCartProducts = JSON.parse(localStorage.getItem('cart_item')) || [];

         this.localStorageCartProductsMap = {};
         this.localStorageCartProducts.forEach(cartItem => {
            if (!this.localStorageCartProductsMap[cartItem.storeId]) {
               this.localStorageCartProductsMap[cartItem.storeId] = new Array();
            }
            this.localStorageCartProductsMap[cartItem.storeId].push(cartItem);
         });
      }

      this.navbarCartCount = 0;
      this.navbarCartPrice = 0;
      this.navbarCartTotalBeforeTax = 0;
      this.navbarCartEstimatedTax = 0;
      this.navbarCartTotal = 0;

      this.navbarCartCountMap = {};
      this.navbarCartPriceMap = {};
      this.navbarCartShippingMap = {};
      this.navbarCartShippingWeightMap = {};
      this.navbarCartTotalBeforeTaxMap = {};
      this.navbarCartEstimatedTaxMap = {};
      this.navbarCartTotalMap = {};
      this.navbarCartOrderTotalMap = {};
      this.localStorageCartProducts.forEach(cartItem => {
         this.navbarCartPrice += this.calculateCartItemTotal(cartItem);
         if (!this.navbarCartPriceMap[cartItem.storeId]) {
            this.navbarCartCountMap[cartItem.storeId] = 0;
            this.navbarCartPriceMap[cartItem.storeId] = 0;
            this.navbarCartShippingMap[cartItem.storeId] = 0;
            this.navbarCartShippingWeightMap[cartItem.storeId] = 0;
            this.navbarCartTotalBeforeTaxMap[cartItem.storeId] = 0;
            this.navbarCartEstimatedTaxMap[cartItem.storeId] = 0;
            this.navbarCartTotalMap[cartItem.storeId] = 0;
            this.navbarCartOrderTotalMap[cartItem.storeId] = 0;
            this.hasOrderSucceedMap[cartItem.storeId] = false;

            this.navbarCartCurrencyMap[cartItem.storeId] = {
               'storeName': cartItem.storeName,
               'currencyCode': cartItem.currencyCode,
               'symbolLeft': cartItem.symbolLeft,
               'symbolRight': cartItem.symbolRight,
               'decimalPlace': cartItem.decimalPlace
            };
         }

         this.navbarCartCountMap[cartItem.storeId] += cartItem.quantity;
         this.navbarCartCount += Number(cartItem.quantity);
         this.navbarCartPriceMap[cartItem.storeId] += this.calculateCartItemTotal(cartItem);

         this.navbarCartShippingWeightMap[cartItem.storeId] += (cartItem.shippingWeight ? cartItem.shippingWeight : 0)
            * Number(cartItem.quantity);

         if (cartItem.taxRules) {
            cartItem.tax = 0;
            cartItem.taxRules.forEach(
               taxRule => {
                  cartItem.tax += taxRule.taxRate.rate * cartItem.quantity;
               }
            );
         }

         cartItem.tax = this.roundingValue(cartItem.tax);
         cartItem.total = this.roundingValue(this.calculateCartItemTotal(cartItem) + cartItem.tax);
         this.navbarCartEstimatedTax += cartItem.tax;
         this.navbarCartEstimatedTaxMap[cartItem.storeId] += cartItem.tax;

         this.navbarCartPriceMap[cartItem.storeId] = this.roundingValue(this.navbarCartPriceMap[cartItem.storeId]);

      });

      for (const [storeId, storeOrderShippingWeight] of Object.entries(this.navbarCartShippingWeightMap)) {
         const pickUp = localStorage.getItem('deliveryMode')
            && localStorage.getItem('deliveryMode') === '1' ? true : false;
         if (!pickUp) {
            if (this.navbarCartShippingGeoZoneMap[storeId]) {
               if (this.navbarCartShippingGeoZoneMap[storeId].geoZone.shippingMode === 0) {
                  this.navbarCartShippingMap[storeId] = this.navbarCartShippingGeoZoneMap[storeId].geoZone.flatRate;
                  console.log('Calc based on flat rate: ' + this.navbarCartShippingMap[storeId]);
               } else if (this.navbarCartShippingGeoZoneMap[storeId].geoZone.shippingMode === 1) {
                  this.navbarCartShippingMap[storeId] = this.roundingValue(this.navbarCartShippingGeoZoneMap[storeId].geoZone.weightRate *
                     Math.ceil(Number((storeOrderShippingWeight && storeOrderShippingWeight > 0)
                        ? storeOrderShippingWeight : 0.1) / this.navbarCartShippingGeoZoneMap[storeId].geoZone.shippingWeight));
                  console.log('Calc based on weight: ' + this.navbarCartShippingMap[storeId]);
               } else if (this.navbarCartShippingGeoZoneMap[storeId].geoZone.shippingMode === 2 && this.distance > 0) {
                  this.navbarCartShippingMap[storeId] = this.roundingValue(this.navbarCartShippingGeoZoneMap[storeId].geoZone.kmRate *
                     this.distance *
                     Math.ceil(Number((storeOrderShippingWeight && storeOrderShippingWeight > 0) ? storeOrderShippingWeight : 0.1)
                        / this.navbarCartShippingGeoZoneMap[storeId].geoZone.shippingWeightKm));
                  console.log('Calc based on distance: ' + this.navbarCartShippingMap[storeId]);
               } else {
                  this.navbarCartShippingMap[storeId] = 0;
                  console.log('Calc based zero 1: ' + this.navbarCartShippingMap[storeId]);
               }
            } else {
               this.navbarCartShippingMap[storeId] = 0;
               console.log('Calc based zero 2: ' + this.navbarCartShippingMap[storeId]);
            }
         } else {
            this.navbarCartShippingMap[storeId] = 0;
            console.log('Calc based zero 3: ' + this.navbarCartShippingMap[storeId]);
         }
         this.navbarCartTotalBeforeTaxMap[storeId] = this.roundingValue(this.navbarCartPriceMap[storeId]
            + this.navbarCartShippingMap[storeId]);
         this.navbarCartTotalMap[storeId] = this.roundingValue(this.navbarCartTotalBeforeTaxMap[storeId]
            + this.navbarCartEstimatedTaxMap[storeId]);
         this.navbarCartOrderTotalMap[storeId] = this.navbarCartTotalMap[storeId];
      }

      this.getUserWallets();
      this.getUserPoints();

   }

   calculateCartItemTotal(cartItem: CartItem) {
      let totalPrice = 0;

      if (cartItem.productDiscountQuantity > 0 && cartItem.productDiscountPrice > 0) {
         const nberDiscountQuantity = Math.trunc(cartItem.quantity / cartItem.productDiscountQuantity);
         const moduloDiscountQuantity = cartItem.quantity % cartItem.productDiscountQuantity;
         totalPrice = cartItem.productDiscountPrice * nberDiscountQuantity
            + cartItem.price * moduloDiscountQuantity;
      } else {
         totalPrice = cartItem.price * cartItem.quantity;
      }

      return this.roundingValue(totalPrice);
   }

   calculateOptionTotal(optionMaps) {
      let totalOptionPrice = 0;
      optionMaps.forEach(optionValueDescs => {
         optionValueDescs.forEach(optionDesc => {
            if ((optionDesc.value !== undefined || optionDesc.checked !== undefined)
               && optionDesc.price !== undefined && optionDesc.price > 0) {
               if (optionDesc.pricePrefix === '+') {
                  totalOptionPrice += optionDesc.price;
               } else if (optionDesc.pricePrefix === '-') {
                  totalOptionPrice -= optionDesc.price;
               }
            }
         });
      });

      return totalOptionPrice;
   }

   roundingValue(value: number) {
      return Math.round(value * 100 + Number.EPSILON) / 100;

   }

   applyPointsChecked(storeId: number) {
      this.navbarCartOrderTotalMap[storeId]
         = this.navbarCartTotalMap[storeId] - this.navbarCartWalletMap[storeId];
      this.navbarCartPointsValueMap[storeId] = undefined;
      if (this.tokenStorage.pointsMap[storeId]) {
         if (this.navbarCartOrderTotalMap[storeId] > this.tokenStorage.pointsMap[storeId].pointsValue) {
            this.usedPointsValueMap[storeId] = this.tokenStorage.pointsMap[storeId].pointsValue;
         } else {
            if (this.navbarCartOrderTotalMap[storeId] > 0) {
               this.usedPointsValueMap[storeId] = this.navbarCartOrderTotalMap[storeId];
            }
         }
         this.usedPointsMap[storeId] = this.usedPointsValueMap[storeId] / this.tokenStorage.pointsMap[storeId].storePointValue;
      }
   }

   pointsChanged(storeId: number) {
      this.navbarCartOrderTotalMap[storeId]
         = this.navbarCartTotalMap[storeId] - this.navbarCartWalletMap[storeId];
      this.navbarCartPointsValueMap[storeId] = undefined;
      this.usedPointsMap[storeId] = this.usedPointsValueMap[storeId] ?
         this.usedPointsValueMap[storeId] / this.tokenStorage.pointsMap[storeId].storePointValue
         : undefined;
   }

   applyPoints(storeId: number) {
      let pointsError: string;
      this.navbarCartOrderTotalMap[storeId]
         = this.navbarCartTotalMap[storeId] - this.navbarCartWalletMap[storeId];
      this.navbarCartPointsValueMap[storeId] = undefined;
      if (this.usedPointsValueMap[storeId] <= this.tokenStorage.pointsMap[storeId].pointsValue) {
         if (this.usedPointsValueMap[storeId] <= this.navbarCartOrderTotalMap[storeId]) {
            this.navbarCartPointsValueMap[storeId] = this.usedPointsValueMap[storeId];
            this.navbarCartOrderTotalMap[storeId] -= this.usedPointsValueMap[storeId];
         } else {
            this.translate.get('MESSAGE.POINTS_GREATHER_THAN_ORDER_TOTAL').subscribe((res) => {
               pointsError = res;
            });
         }
      } else {
         this.translate.get('MESSAGE.POINTS_GREATHER_THAN_AVAILABLE').subscribe((res) => {
            pointsError = res;
         });
      }

      return pointsError;
   }

   // Removing cart from local
   public removeLocalCartProduct(product: any) {
      const products: any = JSON.parse(localStorage.getItem('cart_item'));

      for (let i = 0; i < products.length; i++) {
         if (products[i].ptsId === product.ptsId) {
            products.splice(i, 1);
            break;
         }
      }

      let title = 'Remove Product From Cart';
      let msg = '';
      this.translate.get(['MESSAGE.REMOVE_PROD_CART', 'COMMON.ERROR']).subscribe((res) => {
         title = res['MESSAGE.REMOVE_PROD_CART'];
      });
      this.translate.get(['COMMON.QUANTITY', 'COMMON.ERROR']).subscribe((res) => {
         msg = res['COMMON.QUANTITY'] + ' : ' + product.quantity;
      });

      const toastOption: ToastOptions = {
         title: title,
         msg: msg,
         showClose: true,
         timeout: 1000,
         theme: 'material'
      };

      this.toastyService.wait(toastOption);
      setTimeout(() => {
         // ReAdding the products after remove
         console.log('Called from removeLocalCartProduct');
         localStorage.setItem('cart_item', JSON.stringify(products));
         this.recalculateCart(true);
      }, 500);
   }

   public completeOrder(storeId: number) {
      console.log('Completing order ...');
      const products: any = JSON.parse(localStorage.getItem('cart_item'));
      this.hasOrderSucceedMap[storeId] = true;

      const filteredProducts = products.filter(p => {
         return p.storeId !== storeId;
      });

      delete this.localStorageCartProductsMap[storeId];
      setTimeout(() => {
         // ReAdding the products after remove
         console.log('Called from completeOrder');
         localStorage.setItem('cart_item', JSON.stringify(filteredProducts));
         this.recalculateCart(true);
      }, 500);
   }
   /*
      ----------  Wishlist Product Function  ----------
   */

   // Adding new Product to Wishlist in localStorage
   public addToWishlist(data: any) {

      let title = 'Adding Product To wishlist';
      let msg = '';
      this.translate.get(['MESSAGE.ADDING_WISHLIST', 'COMMON.ERROR']).subscribe((res) => {
         msg = res['MESSAGE.ADDING_WISHLIST'];
      });

      this.translate.get(['COMMON.WISHLIST', 'COMMON.ERROR']).subscribe((res) => {
         title = res['COMMON.WISHLIST'];
      });

      const toastOption: ToastOptions = {
         title: title,
         msg: msg,
         showClose: true,
         timeout: 1000,
         theme: 'material'
      };

      let wishItems: any;
      wishItems = JSON.parse(localStorage.getItem('wishlist_item')) || [];

      let found = false;
      let index = 0;
      for (const ci of wishItems) {
         if (ci.ptsId === data.ptsId) {
            found = true;
            break;
         }
         index++;
      }

      if (!found) {
         wishItems.push(data);
         this.toastyService.wait(toastOption);
         setTimeout(() => {
            localStorage.setItem('wishlist_item', JSON.stringify(wishItems));
            this.calculateLocalWishlistProdCounts();
         }, 500);
      } else {
         this.translate.get(['MESSAGE.PROD_ALREADY_ADDED', 'COMMON.ERROR']).subscribe((res) => {
            msg = res['MESSAGE.PROD_ALREADY_ADDED'];

         });
         toastOption.title = title;
         toastOption.msg = msg;
         this.toastyService.wait(toastOption);
      }
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
         if (products[i].ptsId === product.ptsId) {
            products.splice(i, 1);
            break;
         }
      }
      let title = '';
      let msg = '';
      this.translate.get(['MESSAGE.REMOVE_PROD_WISH', 'COMMON.ERROR']).subscribe((res) => {
         msg = res['MESSAGE.REMOVE_PROD_WISH'];
      });
      this.translate.get(['COMMON.WISHLIST', 'COMMON.ERROR']).subscribe((res) => {
         title = res['COMMON.WISHLIST'];
      });

      const toastOption: ToastOptions = {
         title: title,
         msg: msg,
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

      let cartItems: CartItem[] = [];
      cartItems = JSON.parse(localStorage.getItem('cart_item')) || [];
      let title = '';
      let msg = '';
      this.translate.get(['COMMON.ADDING_PRODUCT', 'COMMON.ERROR']).subscribe((res) => {
         title = res['COMMON.ADDING_PRODUCT'];
      });
      this.translate.get(['COMMON.QUANTITY', 'COMMON.ERROR']).subscribe((res) => {
         msg = res['COMMON.QUANTITY'] + ' : 1';
      });
      const toastOption: ToastOptions = {
         title: title,
         msg: msg,
         showClose: true,
         timeout: 1000,
         theme: 'material'
      };

      for (const data of dataArray) {
         let found = false;
         let index = 0;
         for (const ci of cartItems) {
            if (ci.ptsId === data.ptsId) {
               cartItems[index].quantity += 1;
               cartItems[index].total += cartItems[index].price;
               found = true;
               break;
            }
            index++;
         }

         if (!found) {
            data.quantity = 1;
            data.total = data.price;
            cartItems.push(data);
         }
      }

      this.toastyService.wait(toastOption);
      setTimeout(() => {
         localStorage.removeItem('wishlist_item');
         localStorage.setItem('cart_item', JSON.stringify(cartItems));
         this.recalculateCart(true);
         this.calculateLocalWishlistProdCounts();
      }, 500);
   }

   public getUtcDatetime(hours: number, minutes: number, seconds: number, timeZoneOffset: number) {
      const now = new Date();
      const actualUtcDatetime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      actualUtcDatetime.setHours(hours);
      actualUtcDatetime.setMinutes(minutes);
      actualUtcDatetime.setSeconds(seconds);
      actualUtcDatetime.setMilliseconds(0);
      const storeUtcDatetime = new Date(actualUtcDatetime.getTime() + timeZoneOffset * 60000);

      return storeUtcDatetime;
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
      console.log('Called from addBuyUserDetails');
      this.recalculateCart(true);
   }

   public removeBuyProducts() {
      localStorage.removeItem('byProductDetails');
      this.buyUserCartProducts = JSON.parse(localStorage.getItem('byProductDetails'));
   }


   public storeOrderId(order: Order) {

      localStorage.setItem('order_id', order.id + '');
   }

   public clearOrderId() {
      localStorage.removeItem('order_id');
   }


   public getStoredOrderId() {
      return +localStorage.getItem('order_id');
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

   public saveWithFileUsingUrl = (url: string, entity: any, formData: FormData): Observable<any> => {
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

      const actionUrl = Constants.apiServer + url;
      return this.http.post<any>(actionUrl, formData, { headers: head })
         .pipe(catchError(this.handleError));
   }

   public downloadWithFileUsingUrl = (url: string, entity: any, formData: FormData): Observable<any> => {
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

      const actionUrl = Constants.apiServer + url;
      return this.http.post<Blob>(actionUrl, formData, { headers: head, responseType: 'blob' as 'json' })
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

   public deleteCategory = (id: number): Observable<GenericResponse> => {
      const actionUrl = Constants.apiServer + '/service/catalog/deleteCategory/' + id;
      console.log(actionUrl);
      return this.http.get<GenericResponse>(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public deleteMarketing = (id: number): Observable<GenericResponse> => {
      const actionUrl = Constants.apiServer + '/service/catalog/deleteMarketing/' + id;
      console.log(actionUrl);
      return this.http.get<GenericResponse>(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public getMenus = (langId: number, sectionId: number): Observable<Menu[]> => {
      const actionUrl = Constants.apiServer + '/service/catalog/getMenus/' + langId + '/' + sectionId;
      console.log(actionUrl);
      return this.http.get<Menu[]>(actionUrl, { headers: this.headers })
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

   public getObjects = (url: string): Observable<any[]> => {
      const actionUrl = Constants.apiServer + url;
      return this.http.get<any[]>(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public getObject = (url: string): Observable<any> => {
      const actionUrl = Constants.apiServer + url;
      return this.http.get<any>(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public getIp = (): Observable<any> => {
      return this.http.get('https://api.ipify.org/?format=json')
         .pipe(catchError(this.handleError));
   }

   // public getLang() {
   //    let lang = localStorage.getItem('lang');
   //    if (lang) {
   //       console.log('Using storage lang' + lang);
   //    } else {
   //       if (!lang) {
   //          lang = navigator.language;
   //          if (lang) {
   //             console.log('Using browser lang=' + lang);
   //          } else {
   //             lang = 'fr';
   //             console.log('Using default lang=' + lang);
   //          }
   //       }
   //    }

   //    return lang;
   // }


   public getCacheData() {
      let parameters: string[] = [];

      this.getAllByCriteria('com.softenza.emarket.model.Language', parameters, ' order by e.sortOrder ')
         .subscribe((data: Language[]) => {
            this.appInfoStorage.languages = data;

            const lang = this.localeService.getLocale();

            data.forEach(language => {
               this.translate.addLangs([language.code]);
               if (language.code === lang) {
                  this.translate.setDefaultLang(language.code);
                  this.appInfoStorage.language = language;
                  console.log(this.appInfoStorage.language);

               }
            });
            console.log('Using language :' + lang);
            this.translate.use(lang);
            this.lang = lang;
            this.getDropDownCategories();
            this.getStoreCategories();
            this.getMenus(this.appInfoStorage.language.id, 1)
               .subscribe((menus: Menu[]) => {
                  this.appInfoStorage.mainMenus = menus;
                  // console.log(this.appInfoStorage.mainMenus);
               },
                  error => console.log(error),
                  () => console.log('Get all Main menus complete'));

            this.getAllByCriteria('Company', parameters)
               .subscribe((data2: Company[]) => {
                  this.appInfoStorage.companies = data2;
                  if (data2.length > 0) {
                     data2.forEach(aCompany => {
                        if (lang === aCompany.language) {
                           this.appInfoStorage.company = aCompany;
                        }
                     });
                  }
               },
                  error => console.log(error),
                  () => console.log('Get Company complete'));

            parameters.push('e.language.id = |langCode|' + this.appInfoStorage.language.id + '|Integer');
            this.getAllByCriteria('TransactionTypeDescription', parameters, ' ')
               .subscribe((data2: any[]) => {
                  this.appInfoStorage.transactionTypes = data2;
               }, error => console.log(error),
                  () => console.log('Get transaction types complete'));

            this.getAllByCriteria('ServiceDescription', parameters, ' ')
               .subscribe((data1: any[]) => {
                  this.appInfoStorage.services = data1;
               }, error => console.log(error),
                  () => console.log('Get services complete'));

            this.getAllByCriteria('FundTypeDescription', parameters, ' ')
               .subscribe((data3: any[]) => {
                  this.appInfoStorage.fundTypes = data3;
               }, error => console.log(error),
                  () => console.log('Get fundTypes complete'));


            parameters = [];

         }, error => console.log(error),
            () => console.log('Get Languages complete'));


      this.getAllByCriteria('AttributeGroupDescription', parameters, ' order by e.attributeGroup.sortOrder ')
         .subscribe((data: any[]) => {
            this.appInfoStorage.attributeGroups = data;
         }, error => console.log(error),
            () => console.log('Get AttibuteGroup complete'));

      this.getAllByCriteria('TimePeriod', parameters, ' order by e.name ')
         .subscribe((data: any[]) => {
            this.appInfoStorage.timePeriods = data;
         }, error => console.log(error),
            () => console.log('Get TimePeriod complete'));

      this.getAllByCriteria('Currency', parameters, ' order by e.title ')
         .subscribe((data: any[]) => {
            this.appInfoStorage.currencies = data;
         }, error => console.log(error),
            () => console.log('Get Currency complete'));

      this.getCachedReferences('taxclass')
         .subscribe((data: GenericVO[]) => {
            this.appInfoStorage.taxClasses = data;
         }, error => console.log(error),
            () => console.log('Get taxclass complete'));

      this.getCachedReferences('stockstatus')
         .subscribe((data: GenericVO[]) => {
            this.appInfoStorage.stockStatuses = data;
         }, error => console.log(error),
            () => console.log('Get stock status complete'));

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

   public getStoreCategories() {
      const parameters: string[] = [];
      parameters.push('e.language.id = |langCode|' + this.appInfoStorage.language.id + '|Integer');
      this.getAllByCriteria('com.softenza.emarket.model.StoreCategoryDesc', parameters,
         ' order by e.storeCat.sortOrder ')
         .subscribe((data: StoreCategoryDesc[]) => {
            this.appInfoStorage.storeCategories = data;
         },
            (error) => console.log(error),
            () => console.log('Get all StoreCategoryDesc complete'));
   }

   getDropDownCategories() {
      const parameters: string[] = [];
      parameters.push('e.language.id = |langCode|' + this.appInfoStorage.language.id + '|Integer');
      parameters.push('e.category.showInSearch = |sInS|1|Integer');
      this.getAllByCriteria('com.softenza.emarket.model.CategoryDescription', parameters,
         ' order by e.category.sortOrder ')
         .subscribe((data: CategoryDescription[]) => {
            this.appInfoStorage.searchCategories = data;
            this.appInfoStorage.selectedSearchCategory = this.appInfoStorage.searchCategories[0];
         },
            error => console.log(error),
            () => console.log('Get all CategoryDescription complete'));
   }

   refreshReferenceData(dataType: string, orderBy: string) {
      const parameters: string[] = [];
      this.getAllByCriteria(dataType, parameters, orderBy !== undefined ? orderBy : ' order by e.description')
         .subscribe((data: any[]) => {
            if ('ReturnAction' === dataType) {
               this.appInfoStorage.returnActions = data;
            } else if ('ReturnStatus' === dataType) {
               this.appInfoStorage.returnStatuses = data;
            } else if ('ReturnReason' === dataType) {
               this.appInfoStorage.returnReasons = data;
            } else if ('UserGroup' === dataType) {
               this.appInfoStorage.USER_GROUPS = data;
            }
         }, error => console.log(error),
            () => console.log('Get ' + dataType + ' complete'));
   }

   getCountries() {
      if (this.appInfoStorage.getCountries().length > 0) {
         return;
      }

      const parameters: string[] = [];
      this.getAllByCriteria('com.softenza.emarket.model.Country', parameters)
         .subscribe((data: Country[]) => {
            this.appInfoStorage.setCountries(data);
         },
            error => console.log(error),
            () => console.log('Get all Countries complete'));
   }

   getZones(country: Country) {
      if (country) {
         const parameters: string[] = [];
         parameters.push('e.country.id = |countryId|' + country.id + '|Integer');
         parameters.push('e.status = |xyz|1|Integer');
         this.getAllByCriteria('com.softenza.emarket.model.Zone', parameters)
            .subscribe((data: Zone[]) => {
               this.appInfoStorage.setZones(data);
            },
               error => console.log(error),
               () => console.log('Get all GeoZone complete'));
      }
   }

   getTimePeriod(timePeriodName: string) {
      let timePeriod;

      this.appInfoStorage.timePeriods.forEach((element) => {
         if (element.name === timePeriodName && element.language.id === this.appInfoStorage.language.id) {
            timePeriod = element;
         }
      });

      return timePeriod;
   }

   getUserWallets() {
      if (+this.tokenStorage.getUserId() > 0) {
         const parameters: string[] = [];
         parameters.push('e.user.id = |userId|' + this.tokenStorage.getUserId() + '|Integer');
         parameters.push('e.status = |wStatus|1|Integer');
         this.getAllByCriteria('Wallet', parameters)
            .subscribe((data: Wallet[]) => {
               data.forEach((w) => {
                  w.availableBalance = w.balance;
                  this.tokenStorage.walletMap[w.currency.code] = w;
               });

               for (const [storeId, total] of Object.entries(this.navbarCartTotalMap)) {

                  if (this.tokenStorage.walletMap[this.navbarCartCurrencyMap[storeId].currencyCode].availableBalance >
                     this.navbarCartTotalMap[storeId]) {
                     this.navbarCartWalletMap[storeId] = this.navbarCartTotalMap[storeId];
                     this.navbarCartOrderTotalMap[storeId] = 0;
                  } else {
                     this.navbarCartWalletMap[storeId] = this.tokenStorage.
                        walletMap[this.navbarCartCurrencyMap[storeId].currencyCode].availableBalance;
                     this.navbarCartOrderTotalMap[storeId] = this.navbarCartTotalMap[storeId] - this.navbarCartWalletMap[storeId];
                  }

                  this.tokenStorage.walletMap[this.navbarCartCurrencyMap[storeId].currencyCode].availableBalance
                     -= this.navbarCartWalletMap[storeId];
               }
            },
               error => console.log(error),
               () => console.log('Get all GeoZone complete'));
      }
   }

   getUserPoints() {
      if (+this.tokenStorage.getUserId() > 0) {
         let storeIds = '';
         let i = 0;
         for (const [storeId, storeOrderShippingWeight] of Object.entries(this.navbarCartShippingWeightMap)) {
            if (i > 0) {
               storeIds = storeIds + ',';
            }
            storeIds = storeIds + storeId;
            i++;
         }

         if (storeIds.length > 0) {
            const parameters: string[] = [];
            parameters.push('e.user.id = |uId|' + this.tokenStorage.getUserId() + '|Integer');
            parameters.push('e.store.id IN |sId|' + storeIds + '|List<Integer>');
            this.getAllByCriteria('DiscountCard', parameters)
               .subscribe((data: DiscountCard[]) => {
                  data.forEach((dc) => {
                     this.tokenStorage.pointsMap[dc.store.id] = dc;
                     this.applyPointsChecked(dc.store.id);
                  });
               },
                  error => console.log(error),
                  () => console.log('Get all GeoZone complete'));
         }
      }
   }


   // Error handling
   handleError(error) {
      let errorMessage = '';
      if (error.error instanceof HttpErrorResponse) {
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


   public filterData(data, params: any, sort?, page?, perPage?) {
      this.sortData(sort, data);
      return this.paginator(data, page, perPage);
   }

   public sortData(sort, data) {
      if (sort) {
         // console.log('Sort called: ' + sort);
         // console.log(data);
         switch (sort) {
            case 'rating':
               data = data.sort((a, b) => {
                  if (a.rating / a.ratingCount < b.rating / b.ratingCount) {
                     return 1;
                  }
                  if (a.rating / a.ratingCount > b.rating / b.ratingCount) {
                     return -1;
                  }
                  return 0;
               });
               console.log('Which one? rating');
               break;
            case 'vews':
               data = data.sort((a, b) => {
                  if (a.viewCount < b.viewCount) {
                     return 1;
                  }
                  if (a.viewCount > b.viewCount) {
                     return -1;
                  }
                  return 0;
               });
               console.log('Which one? views');
               break;
            case 'namedesc':
               data = data.sort((a, b) => {
                  if (a.name.toLowerCase() < b.name.toLowerCase()) {
                     return 1;
                  }
                  if (a.name.toLowerCase() > b.name.toLowerCase()) {
                     return -1;
                  }
                  return 0;
               });
               console.log('Which one? name asc');
               break;
            case 'nameasc':
               data = data.sort((a, b) => {
                  if (a.name.toLowerCase() > b.name.toLowerCase()) {
                     return 1;
                  }
                  if (a.name.toLowerCase() < b.name.toLowerCase()) {
                     return -1;
                  }
                  return 0;
               });
               console.log('Which one? name asc');
               break;
            case 'pricedesc':
               data = data.sort((a, b) => {
                  if (a.product.price < b.product.price) {
                     // console.log(a.product.price + '-1-' + a.product.price);
                     return 1;
                  }
                  if (a.product.price > b.product.price) {
                     // console.log(a.product.price + '- -1 -' + a.product.price);
                     return -1;
                  }
                  // console.log(a.product.price + '-0-' + a.product.price);
                  return 0;
               });
               console.log('Which one? price asc');
               break;
            case 'priceasc':
               data = data.sort((a, b) => {
                  if (a.product.price > b.product.price) {
                     return 1;
                  }
                  if (a.product.price < b.product.price) {
                     return -1;
                  }
                  return 0;
               });
               console.log('Which one? price asc');
               break;
            case 'roomTypeAsc':
               data = data.sort((a, b) => {
                  if (a.roomTypeName.toLowerCase() > b.roomTypeName.toLowerCase()) {
                     return 1;
                  }
                  if (a.roomTypeName.toLowerCase() < b.roomTypeName.toLowerCase()) {
                     return -1;
                  }
                  return 0;
               });
               console.log('Which one? name asc');
               break;
            case 'roomTypeDesc':
               data = data.sort((a, b) => {
                  if (a.roomTypeName.toLowerCase() < b.roomTypeName.toLowerCase()) {
                     return 1;
                  }
                  if (a.roomTypeName.toLowerCase() > b.roomTypeName.toLowerCase()) {
                     return -1;
                  }
                  return 0;
               });
               console.log('Which one? name asc');
               break;
            default:
               console.log('Which one? Default');
               break;
         }
      }
      // console.log(data);
      return data;
   }

   public paginator(items, inpage?, inperPage?) {
      const page = inpage || 1,
         perPage = inperPage || 4,
         offset = (page - 1) * perPage,
         paginatedItems = items.slice(offset).slice(0, perPage),
         totalPages = Math.ceil(items.length / perPage);
      return {
         data: paginatedItems,
         pagination: {
            page: page,
            perPage: perPage,
            prePage: page - 1 ? page - 1 : null,
            nextPage: (totalPages > page) ? page + 1 : null,
            total: items.length,
            totalPages: totalPages,
         }
      };
   }

   public pad(num: number, size: number): string {
      if (num) {
         let s = num + '';
         while (s.length < size) { s = '0' + s; }
         return s;
      } else {
         return '';
      }

   }


   getBuildingTypeLabel(buildingType: number) {

      let bldgTypeStr = '';
      this.translate.get(['COMMON.HOTEL', 'COMMON.APPARTMENT', 'COMMON.VILLA',
         'COMMON.RESORT', 'COMMON.CABIN', 'COMMON.COTTAGE']).subscribe(res => {
            if (buildingType === 1) {
               bldgTypeStr = res['COMMON.HOTEL'];
            } else if (buildingType === 2) {
               bldgTypeStr = res['COMMON.APPARTMENT'];
            } else if (buildingType === 3) {
               bldgTypeStr = res['COMMON.VILLA'];
            } else if (buildingType === 4) {
               bldgTypeStr = res['COMMON.RESORT'];
            } else if (buildingType === 5) {
               bldgTypeStr = res['COMMON.CABIN'];
            } else if (buildingType === 6) {
               bldgTypeStr = res['COMMON.COTTAGE'];
            }
         });

      return bldgTypeStr;
   }

   getServiceDesc(service: Service) {
      let match: ServiceDescription;
      for (const servDesc of this.appInfoStorage.services) {
         if (servDesc.service.id === service.id) {
            match = servDesc;
         }
      }

      return match;
   }

   public updateObject = (url: string): Observable<GenericResponse> => {
      const actionUrl = Constants.apiServer + url;
      return this.http.get<GenericResponse>(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

   public formatAmount(amount: number, ccy: Currency) {
      return ccy.symbolLeft ? (ccy.symbolLeft + ' ' + amount) : (amount + ' ' + ccy.symbolRight);
   }

}
