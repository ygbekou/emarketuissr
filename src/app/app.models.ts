import { Constants } from './app.constants';

export class Area {
  constructor(public id: number,
    public value: number,
    public unit: string) { }
}

export class AdditionalFeature {
  constructor(public id: number,
    public name: string,
    public value: string) { }
}

export class Location {
  constructor(public id: number,
    public lat: number,
    public lng: number) { }
}

export class Price {
  public sale: number;
  public rent: number;
}


export class Gallery {
  constructor(public id: number,
    public small: string,
    public medium: string,
    public big: string) { }
}

export class Plan {
  constructor(public id: number,
    public name: string,
    public desc: string,
    public area: Area,
    public rooms: number,
    public baths: number,
    public image: string) { }
}

export class Pagination {
  constructor(public page: number,
    public perPage: number,
    public prePage: number,
    public nextPage: number,
    public total: number,
    public totalPages: number) { }
}


export class BaseModel {
  lang: string;
  remainingFileNames: string[] = [];
  createDate: Date;
}

export class SearchAttribute {
  parameters: string[];
  orderBy: string;
}

export class Role {
  id: number;
  name: string;
  description: string;
  status: number;
  type = 'Role';
}

export class UserGroup {
  id: number;
  name: string;
  type = 'UserGroup';
}

export class User extends BaseModel {
  id: number;
  code: string;
  image: string;
  ip: string;
  salt: string;
  userGroup: UserGroup;
  userName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  middleName: string;
  picture: string;
  email: string;
  sex: string;
  birthDate: Date;
  homePhone: string;
  mobilePhone: string;
  status: number;
  firstTimeLogin: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  website: string;
  reveivePromo: boolean;
  modifiedBy: number;
  stripeCustomerId: string;
  fileNames: string[];
  language: Language;
  isShipper: number;
  type = 'User';

  // transient
  addresss: Address[] = [];
  shippingAddress: Address;
  billingAddress: Address;
  creditCards: CreditCard[] = [];
  creditCard: CreditCard;
  tmoneys: Tmoney[] = [];
  tmoney: Tmoney;
  floozs: Flooz[] = [];
  flooz: Flooz;
  paymentMethodCode: string;

  constructor() {
    super();
    this.userGroup = new UserGroup();
    this.shippingAddress = new Address();
    this.billingAddress = new Address();
    this.creditCard = new CreditCard();
  }
}

export class Employee {
  id: number;
  user: User = new User();
  shortResume: string;
  resume: string;
  status: number;

  name: string;
  type = 'Employee';
}

export class AuthToken {
  id: number;
  userName: string;
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  token: string;
  roleName: string;
  picture: string;
  firstTimeLogin: string;
  authorities: number[];
  userId: number;
  homePage: string;
}


export class Product extends BaseModel {
  id: number;
  dateAvailable: Date;
  ean: string;
  height: number;
  image: string;
  isbn: string;
  jan: string;
  length: number;
  lengthClassId: number;
  location: string;
  manufacturerId: number;
  minimum: number;
  model: string;
  mpn: string;
  points = 0;
  singleImage: false;
  price: number;
  quantity: number;
  shipping: number;
  sku: string;
  sortOrder: number;
  status: number;
  stockStatusId: number;
  subtract: number;
  taxClassId: number;
  upc: string;
  viewed = 0;
  weight: number;
  weightClassId: number;
  width: number;
  modifiedBy: number;
  rating: number;
  ratingCount: number;
  currency: Currency;
  fileNames: string[];
  productVideos: ProductVideo[] = [];
  productDescriptions: ProductDescription[] = [];
  productToCategorys: ProductToCategory[] = [];
  shippingWeight: number;
  type = 'Product';
  action: string;
}

export class ProductDescription {
  id: number;
  product: Product;
  language: Language;
  name: string;
  description: string;
  shortDescription: string;
  mediumDescription: string;
  tag: string;
  metaTitle: string;
  metaDescription: string;
  metaKeyword: string;
  type = 'ProductDescription';
}

export class ProductDiscount {
  id: number;
  storeId: number;
  ptsId: number;
  dateEnd: Date;
  dateStart: Date;
  startHour: string;
  endHour: string;
  price: number;
  priority: number;
  quantity: number;
  percentage: number;
  status: number;
  modifiedBy: number;
  type = 'ProductDiscount';

  // Transient variable
  disablePrice: boolean;
  disablePercentage: boolean;
  constructor() {
    this.dateStart = new Date();
    this.status = 1;
  }
}


export class ProductAttribute {
  id: number;
  product: Product;
  language: Language;
  attribute: Attribute;
  text: string;
  attributeName: string;

  type = 'ProductAttribute';

  constructor() {
    this.product = new Product();
    this.attribute = new Attribute();
    this.language = new Language();
  }
}

export class ProductToCategory {
  id: number;
  product: Product;
  category: Category;

  type = 'ProductToCategory';
  action = '';
}

export class ProductRelated {
  id: number;
  product: Product;
  related: Product;

  type = 'ProductRelated';
  action = '';
}

export class ProductToParent {
  id: number;
  product: Product;
  parent: Product;
  category: Category;
  quantity: number;
  currentOption: any;
  currentCategoryOption: any;

  categoryDescription: CategoryDescription = new CategoryDescription();
  categoryOptions: CategoryDescription[] = [];
  filteredCategoryOptions: CategoryDescription[] = [];

  parentProductDescription: ProductDescription = new ProductDescription();
  parentOptions: ProductDescription[] = [];
  filteredParentOptions: ProductDescription[] = [];

  type = 'ProductToParent';
  action = '';

}

export class Language {
  id: number;
  name: string;
  code: string;
  locale: string;
  image: string;
  directory: string;
  sortOrder: number;
  status: number;
  type = 'Language';
}

export class Setting {
  fixedMenu: number;
  leftToRight: number;
  headerTextPosition: number;
  headerImageType: string;
  themeColor: string;
}

export class News {
  id: number;
  author: User;
  language: string;
  title: string;
  shortTitle: string;
  content: string;
  shortMessage: string;
  mediumMessage: string;
  publicationDatetime: Date;
  modDate: Date;
  viewCount: number;
  rating: number;
  ratingCount: number;
  picture: string;
  status: number;
  gallery: any[];
  newsVideos: NewsVideo[] = [];
  modifiedBy: number;
  type = 'News';
  fileNames: string[];
  constructor() {
    this.author = new User();
  }

}

export class NewsVideo {
  id: number;
  news: News;
  name: string;
  link: string;
  embedVideo: any;
  status: number;
  type = 'NewsNewsVideo';
  modifiedBy: number;
  modDate: Date;
  constructor() {
    this.modifiedBy = 1;
    this.modDate = new Date();
  }
}

export class Section {
  id: number;
  name: string;
  title: string;
  description: string;
  shortMessage: string;
  mediumMessage: string;
  picture: string;
  status: number;
  showInMenu: number;
  language: string;
  sectionLabel: string;
  statusDesc: string;
  type = 'Section';
  modifiedBy: number;
  constructor() {
    this.picture = 'section.jpg';
  }
}


export class SectionItem {
  id: number;
  section: Section;
  title: string;
  description: string;
  shortMessage: string;
  mediumMessage: string;
  picture: string;
  status: number;
  showInMenu: number;
  language: string;
  modifiedBy: number;
  text1: string;
  text2: string;
  text3: string;
  type = 'SectionItem';
  constructor() {
    this.picture = '';
  }
}

export class ContactUsMessage {
  id: number;
  createDate: Date;
  name: string;
  email: string;
  phone: string;
  message: string;
  modifiedBy: number;
  type = 'ContactUsMessage';
}

export class Slider {
  id: number;
  name: '';
  fileLocation: string;
  status: number;
  type = 'Slider';
  modifiedBy: number;
  constructor() {
    this.fileLocation = '';
  }

}

export class SliderText {
  id: number;
  slider: Slider;
  text1: '';
  text2: '';
  text3: '';
  modifiedBy: number;
  language: string;
  type = 'SliderText';
}

export class Faq {
  id: number;
  language: string;
  question: string;
  answer: string;
  noCount: number;
  yesCount: number;
  modifiedBy: number;
  status: number;
  type = 'Faq';
}

export class GenericResponse {
  result: string;
  message: string;
}

export class GenericVO {
  id: number;
  name: string;
  languageId: number;
}

export class Category {
  id: number;
  categoryId: number;
  catColumn: number;
  sortOrder: number;
  status: number;
  image: string;
  singleImage: true;
  parent: Category;
  top: number;
  type = 'Category';
  showInSearch: number;
  showInMenu: number;
  showInDropDown: number;
  showInFooter: number;
  showInMobile: number;
  showInKitchen: number;
  childCount: number;
}
export class CategoryDescription {
  id: number;
  category: Category;
  language: Language;
  name: string;
  description: string;
  tag: string;
  metaTitle: string;
  metaDescription: string;
  metaKeyword: string;
  type = 'CategoryDescription';
  action = '';
  longName = '';
}

export class Currency {
  id: number;
  code: string;
  decimalPlace = 0;
  status: number;
  symbolLeft: string;
  symbolRight: string;
  title: string;
  value: number;
  modDate: Date;
  type = 'Currency';
}

export class StockStatus {
  id: number;
  name: string;
  language: Language;
  type = 'StockStatus';
}


export class OrderStatus {
  id: number;
  name: string;
  language: Language;
  description: string;
  status: number;
  type = 'OrderStatus';
}

export class ReturnStatus {
  id: number;
  name: string;
  language: Language;
  description: string;
  type = 'ReturnStatus';

  constructor() {
    this.language = new Language();
  }
}

export class ReturnReason {
  id: number;
  name: string;
  language: Language;
  description: string;
  type = 'ReturnReason';

  constructor() {
    this.language = new Language();
  }
}

export class CancellationReason {
  id: number;
  name: string;
  language: Language;
  description: string;
  type = 'CancellationReason';

  constructor() {
    this.language = new Language();
  }
}

export class PresentPreorderScreen {
  id: number;
  name: string;
  language: Language;
  description: string;
  status: number;
  type = 'PresentPreorderScreen';

  constructor() {
    this.language = new Language();
  }
}

export class TimePeriod {
  id: number;
  name: string;
  language: Language;
  description: string;
  type = 'TimePeriod';

  constructor() {
    this.language = new Language();
  }
}

export class ReturnAction {
  id: number;
  name: string;
  language: Language;
  description: string;
  type = 'ReturnAction';

  constructor() {
    this.language = new Language();
  }
}

export class Country {
  id: number;
  addressFormat: string;
  isoCode2: string;
  isoCode3: string;
  code: string;
  name: string;
  postcodeRequired: number;
  status: number;

  zones: Zone[];
  type = 'Country';

  constructor() {
    this.zones = [];
  }
}

export class Zone {
  id: number;
  code: String;
  country: Country;
  name: string;
  status: number;
  type = 'Zone';
}

export class GeoZone {
  id: number;
  name: string;
  store: Store;
  shippingMode: number;
  flatRate: number;
  weightRate: number;
  shippingWeight: number;
  status: number;
  description: string;
  shipper: Shipper;
  delStart1: string;
  delEnd1: string;
  delStart2: string;
  delEnd2: string;
  delStart3: string;
  delEnd3: string;
  delStart4: string;
  delEnd4: string;
  delStart5: string;
  delEnd5: string;
  delStart6: string;
  delEnd6: string;
  delStart0: string;
  delEnd0: string;
  kmRate: number;
  shippingWeightKm: number;
  constructor() {
    this.status = 1;
  }
  type = 'GeoZone';
}

export class ZoneToGeoZone {
  id: number;
  zone: Zone;
  store: Store;
  geoZone: GeoZone;
  country: Country;
  deliveryTimeBegin: number;
  deliveryTimeEnd: number;
  deliveryTimeUnit = '';
  errors: string[];
  type = 'ZoneToGeoZone';

  constructor() {
    this.country = new Country();
  }
}

export class TaxClass {
  id: number;
  title: string;
  description: string;
  type = 'TaxClass';
}

export class TaxRate {
  id: number;
  geoZone: GeoZone;
  name: string;
  rate: number;
  taxType: string;
  createDate: Date;
  modDate: Date;
  type = 'TaxRate';
}

export class TaxRule {
  id: number;
  taxRate: TaxRate;
  taxClass: TaxClass;
  based: string;
  priority: number;
  type = 'TaxRule';
}
export class WeightClass {
  id: number;
  value: number;
  type = 'WeightClass';
}

export class WeightClassDescription {
  id: number;
  language: Language;
  weightClass: WeightClass;
  title: string;
  unit: string;
  type = 'WeightClassDescription';
}

export class LengthClass {
  id: number;
  value: number;
  type = 'LengthClass';
}

export class LengthClassDescription {
  id: number;
  language: Language;
  lengthClass: LengthClass;
  title: string;
  unit: string;
  type = 'LengthClassDescription';
}

export class Information {
  id: number;
  bottom: number;
  sortOrder: number;
  status: number;
  type = 'Information';
}

export class InformationDescription {
  id: number;
  description: string;
  information: Information;
  language: Language;
  metaDescription: string;
  metaKeyword: string;
  metaTitle: string;
  title: string;
  type = 'InformationDescription';
}

export class Store extends BaseModel {
  id: number;
  name: string;
  owner: User;
  address: Address;
  email: string;
  image: string;
  storeFrontImage: string;
  phone: string;
  status: number;
  aprvStatus: number;
  fileNames: string[];
  modifiedBy: number;
  description: string;
  sslUrl: string;
  url: string;
  currency: Currency;
  code: string;
  displayWeb: number;
  displayMb: number;
  onlineStore: number;
  sortOrder: number;
  public storeCat: StoreCategory;
  catName: string;
  sendSMSNewOrder: number;
  sendSMSOrderCancel: number;
  sendSMSLowInventory: number;
  sendSMSShipper: number;
  cellPhone: string;
  rating: number;
  ratingCount: number;
  ratingAverage: number;
  openTime: string;
  closeTime: string;
  reviews: Review[];
  openTime1: string;
  closeTime1: string;
  openTime2: string;
  closeTime2: string;
  openTime3: string;
  closeTime3: string;
  openTime4: string;
  closeTime4: string;
  openTime5: string;
  closeTime5: string;
  openTime6: string;
  closeTime6: string;
  openTime0: string;
  closeTime0: string;
  longitude: number;
  latitude: number;
  presentPreorderScreen: PresentPreorderScreen;
  timeZone: TimeZone;
  acceptPickupCash: number;
  acceptDeliveryCash: number;
  allowReopen: number;
  lockAfterXPrint: number;
  autoUpload: number;
  allowExRcpt: number;
  trackGuestCnt: number;
  processingFeesPercentage: number;
  cashProFeePercent: number;
  maxDistance: number;
  useMenu: number;
  allowPickup: number;
  flashPromo: string;
  dayStartTime: string;
  waitressPrint: number;
  waitressClose: number;
  reasonRequired: number;
  cityCountryName: string;
  checkinHour: string;
  checkoutHour: string;
  pymtMethodReq: number;

  type = 'Store';
  constructor() {
    super();
    this.aprvStatus = 0;
    this.onlineStore = 1;
    this.owner = new User();
    this.currency = new Currency();
  }

}

export class SeoUrl {
  id: number;
  keyword: string;
  language: string;
  query: string;
  store: Store;
  type = 'SeoUrl';
}

export class Customer {
  id: number;
}

/* export class Address {
  id: number;
  address1: string;
  address2: string;
  city: string;
  company: string;
  user: User;
  country: Country;
  customer: Customer;
  firstName: string;
  lastName: string;
  postCode: string;
  middleName: string;
  addressType: number;
  billTo: number;
  shipTo: number;
  zone: Zone;
  phone: string;
  status = 0;
  public longitude: number;
  public latitude: number;
  type = 'Address';

  constructor() {
    this.country = new Country();
    this.zone = new Zone();
  }
} */

export class Address {
  public id: number;
  public address1: string;
  public address2: string;
  public city: string;
  public company: string;
  public user: User;
  public country: Country;
  public customer: Customer;
  public firstName: string;
  public lastName: string;
  public postCode: string;
  public middleName: string;
  public addressType: number;
  public billTo: number;
  public shipTo: number;
  public zone: Zone;
  public status = 0;
  public phone: string;
  public email: string;
  public longitude: number;
  public latitude: number;
  public name: string;
  public gPlaceId: string;
  public countryCode: string;
  public type = 'Address';
  constructor() {
    this.status = 0;
    this.billTo = 0;
    this.shipTo = 0;
    this.country = new Country();
    this.zone = new Zone();
  }
}
export class CreditCard {
  id: number;
  name: string;
  cardNumber: string;
  secCode: string;
  expMonth: string;
  expYear: string;
  status: number;
  cardType: string;
  cardTypeIndex: number;
  user: User;
  last4Digits: string;
  stripePaymentMethodId: string;
  type = 'CreditCard';
}

export class Tmoney {
  id: number;
  phoneNumber: string;
  user: User;
  type = 'Tmoney';
}

export class Flooz {
  id: number;
  phoneNumber: string;
  user: User;
  type = 'Flooz';
}

export class Menu {
  state: string;
  name?: string;
  type?: string;
  icon?: string;
  children?: Menu[];
}

export class Marketing {
  id: number;
  clicks: number;
  code: string;
  section: number;
  scope: number;
  sortOrder: number;
  status: number;
  image: string;
  beginDate: Date;
  endDate: Date;
  type = 'Marketing';
}

export class MarketingDescription {
  id: number;
  language: Language;
  name: string;
  marketing: Marketing;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeyword: string;
  type = 'MarketingDescription';
}

export class MarketingProduct {
  id: number;
  product: Product;
  store: Store;
  marketing: Marketing;
  clicks: number;
  sortOrder: number;
  status: number;
  beginDate: Date;
  endDate: Date;
  modifiedBy: number;
  type = 'MarketingProduct';
}

export class ProductVideo {
  id: number;
  product: Product;
  name: string;
  link: string;
  embedVideo: any;
  status: number;
  type = 'ProductVideo';
  modifiedBy: number;
  modDate: Date;
  constructor() {
    this.modifiedBy = 1;
    this.modDate = new Date();
  }
}

export class AttributeGroup {
  id: number;
  sortOrder = 0;

  attributeGroupName: string;
  attributeGroupDescriptions: AttributeGroupDescription[] = [];

  type = 'AttributeGroup';
}

export class AttributeGroupDescription {
  id: number;
  attributeGroup: AttributeGroup;
  language: Language;
  name: string;

  parentEntities: [];
  type = 'AttributeGroupDescription';
}

export class Attribute {
  id: number;
  attributeGroup: AttributeGroup;
  sortOrder = 0;

  attributeDescriptions: AttributeDescription[] = [];

  type = 'Attribute';
}

export class AttributeDescription {
  id: number;
  attribute: Attribute;
  language: Language;
  name: string;
  text: string;
  attributeGroupName: string;

  type = 'AttributeDescription';
}

export class Options {
  id: number;
  optionType: string;
  sortOrder = 0;

  optionDescriptions: OptionDescription[] = [];

  optionDescriptionName: string;

  type = 'Option';
}

export class OptionDescription {
  id: number;
  option: Options;
  language: Language;
  name: string;

  type = 'OptionDescription';
}

export class OptionValue {
  id: number;
  option: Options;
  image: string;
  sortOrder = 0;

  // Transient
  imageFiles: any[];

  optionValueDescriptions: OptionValueDescription[] = [];

  type = 'OptionValue';
}

export class OptionValueDescription {
  id: number;
  option: Options;
  optionValue: OptionValue;
  language: Language;
  name: string;

  // Transient
  optionDescriptionName: string;
  type = 'OptionValueDescription';
}

export class ProductToStore {
  id: number;
  product: Product;
  store: Store;
  minimum: number;
  points: number;
  price: number;
  quantity: number;
  maxQty: number;
  sortOrder: number;
  status: number;
  vipPrice: number;
  buyPrice: number;
  stockStatusId: number;
  taxClassId: number;
  promo: number;
  viewed: number;
  modifiedBy: number;
  dateAvailable: Date;
  availableOnline: number;
  marginPerc: number;
  shippingWeight: number;
  productDiscounts: ProductDiscount[] = [];
  productStoreIngredients: ProductStoreIngredient[] = [];
  subtract: number;
  allowNegInvn: number;
  type = 'ProductToStore';

  productName: string;
  storeName: string;
  image: string;
  quantityComment: string;
  diffQty: number;
  shouldPerformExtraUpdate: boolean;

  transferQty: number;
  errors: string[];


  constructor() {
    this.subtract = 1;
    this.allowNegInvn = 1;
  }
}


export class ProductOption {
  id: number;
  product: Product;
  option: Options;
  optionType: string;
  required: number;
  value: string;
  optionName: string;

  valueDate: Date;
  timeMinute: number;
  timeHour: number;

  productOptionValues: ProductOptionValue[];
  povs: ProductOptionValue[];

  type = 'ProductOption';

  constructor() {
    this.product = new Product();
    this.option = new Options();
    this.required = 0;
  }
}

export class ProductOptionValue {
  id: number;
  optionId: number;
  ovId: number;
  optionName: string;
  name: string;
  image: string;
  sortOrder: number;
  points: number;
  pointsPrefix: string;
  price: number;
  pricePrefix: string;
  weight: number;
  weightPrefix: string;
  quantity: number;
  subtract: number;

  product: Product;
  option: Options;
  productOption: ProductOption;
  optionValue: OptionValue;

  value: string;
  check: boolean;

  type = 'ProductOptionValue';

  constructor() {
    this.product = new Product();
    this.option = new Options();
    this.optionValue = new OptionValue();
    this.productOption = new ProductOption();
  }
}


export class ProductStoreOption {
  id: number;
  productToStore: ProductToStore;
  option: Options;
  required: number;
  value: string;
  optionName: string;

  valueDate: Date;
  timeMinute: number;
  timeHour: number;

  productStoreOptionValues: ProductStoreOptionValue[];

  type = 'ProductStoreOption';

  constructor() {
    this.productToStore = new ProductToStore();
    this.option = new Options();
    this.required = 0;
  }
}

export class ProductStoreOptionValue {
  id: number;
  productToStore: ProductToStore;
  option: Options;
  productStoreOption: ProductStoreOption;
  optionValue: OptionValue;
  points: number;
  pointsPrefix: string;
  price: number;
  vipPrice: number;
  pricePrefix: string;
  weight: number;
  weightPrefix: string;
  quantity: number;
  subtract: number;
  optionValueName: string;

  type = 'ProductStoreOptionValue';

  constructor() {
    this.productToStore = new ProductToStore();
    this.option = new Options();
    this.optionValue = new OptionValue();
    this.productStoreOption = new ProductStoreOption();
  }
}


export class ProductDescVO {
  id: number;
  product: ProductVO;
  description: string;
  metaDescription: string;
  metaKeyword: string;
  metaTitle: string;
  name: string;
  tag: string;
  features: string[];
  shortDescription: string;
  mediumDescription: string;
  category: string;
  shippingWeight: number;

  povos: ProductOptionVO[];
}

export class CartItem {
  prdId: number;
  ptsId: number;
  storeId: number;
  image: string;
  name: string;
  storeName: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
  storeUrl: string;
  currencyId: number;
  currencyCode: string;
  symbolLeft: string;
  symbolRight: string;
  decimalPlace: number;
  productDiscountQuantity: number;
  productDiscountPrice: number;
  productDiscountPercentage: number;
  percentagePrice: number;
  productDiscountId: number;
  taxRules: TaxRule[];
  optionValueDescriptionMaps: Map<string, ProductOptionValue[]>;
  selectedOptions: ProductOptionValue[];
  selectedOptionMap = {};
  itemIndex: number;
  adjTotal: number;
  povos: ProductOptionVO[];
  hasOption: number;
  shippingWeight: number;

  public constructor(p: ProductDescVO) {
    this.prdId = p.product.id;
    this.ptsId = p.product.ptsId;
    this.storeId = p.product.storeId;
    this.image = p.product.image;
    this.name = p.name;
    this.storeName = p.product.storeName;
    this.quantity = 0;
    this.price = p.product.percentagePrice > 0 ? p.product.percentagePrice : p.product.price;
    this.price = p.product.totalPrice > 0 ? p.product.totalPrice : this.price;
    this.tax = p.product.tax;
    this.total = 0;
    this.storeUrl = Constants.webServer + '/#/products?storeId=' + this.storeId;
    this.taxRules = p.product.taxRules;
    this.currencyId = p.product.currencyId;
    this.currencyCode = p.product.currencyCode;
    this.symbolLeft = p.product.symbolLeft;
    this.symbolRight = p.product.symbolRight;
    this.decimalPlace = p.product.currencyDecimalPlace;
    this.productDiscountQuantity = p.product.productDiscountQuantity;
    this.productDiscountPrice = p.product.productDiscountPrice;
    this.productDiscountId = p.product.productDiscountId;
    this.optionValueDescriptionMaps = p.product.optionValueDescriptionMaps;
    if (p.product.selectedOptionsMap) {
      this.selectedOptions = Object.values(p.product.selectedOptionsMap);
    }

    if (this.selectedOptions) {
      this.selectedOptions.forEach(item => {
        if (this.selectedOptionMap[item.optionName] === undefined) {
          this.selectedOptionMap[item.optionName] = [];
        }

        this.selectedOptionMap[item.optionName].push(item);
      });
    }
    this.hasOption = p.product.hasOption;
    this.povos = p.povos;
    this.shippingWeight = p.product.shippingWeight;
  }
}

export class ProductListVO {
  categories: string[];
  productDescVOs: ProductDescVO[];
}

export class ProductVO {
  id: number;
  dateAvailable: number;
  ean: string;
  height: number;
  image: string;
  isbn: string;
  jan: string;
  length: number;
  lengthClassId: number;
  lengthClassName: string;
  location: string;
  manufacturerId: number;
  manufacturerName: string;
  minimum: number;
  model: string;
  mpn: string;
  promo: number;
  points: number;
  price: number;
  totalPrice: number;
  quantity: number;
  shipping: number;
  sku: string;
  sortOrder: number;
  status: number;
  stockStatusId: number;
  subtract: number;
  taxClassId: number;
  upc: number;
  viewed: number;
  weight: number;
  weightClassId: number;
  weightClassName: string;
  width: number;
  viewCount: number;
  ratingCount: number;
  rating: number;
  ratingAverage: number;
  storeId: number;
  storeName: string;
  currencyId: number;
  currencyCode: string;
  symbolLeft: string;
  symbolRight: string;
  sold: number;
  ptsId: number;
  pQuantity: number;
  pStockStatusId: number;
  pPrice: number;
  pPoints: number;
  pTaxClassId: number;
  pSold: number;
  pPromo: number;
  pStatus: number;
  pMinimum: number;
  pSortOrder: number;
  fileNames: string[];
  reviews: Review[];
  ratingCountMaps: Map<number, number>;
  optionValueDescriptionMaps: Map<string, ProductOptionValue[]>;
  productDimensions: string;
  taxRules: TaxRule[];
  tax: number;
  total: number;
  productDiscountQuantity: number;
  productDiscountPrice: number;
  productDiscountPercentage: number;
  currencyDecimalPlace: number;
  percentagePrice: number;
  productDiscountId: number;
  hasOption: number;
  buyPrice: number;
  allowNegInvn: number;
  shippingWeight: number;
  selectedOptionsMap: Map<number, any> = new Map();
}

export class Review {
  id: number;
  user: User;
  product: Product;
  store: Store;
  author: string;
  rating = 0;
  status: number;
  approvalStatus: number;
  headline: string;
  comments: string;
  approverComments: string;
  image: string;
  createDate: Date;

  type = 'ProductReview';

  constructor() {
    this.user = new User();
    this.product = new Product();
    this.store = new Store();
    this.status = 1;
    this.approvalStatus = 0;
  }

}

export class Company {
  id: number;
  name: string;
  description: string;
  metaKeyword: string;
  metaDescription: string;
  language: string;
  address: string;
  country: string;
  email: string;
  phone: string;
  phone2: string;
  fax: string;
  logo: 'logo.png';
  favicon = 'favicon.ico';
  backgroundSlider: string;
  bannerContentHeader: string;
  bannerContentParagraph: string;
  copyright: string;
  twitterApi: string;
  googleMap: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedInUrl: string;
  instagramUrl: string;
  googlePlusUrl: string;
  footerParagraph1: string;
  footerParagraph2: string;
  footerParagraph3: string;
  fromEmail: string;
  toEmail: string;
  status = 0;
  footerType: string;
  displayMission = false;
  displayTestimonial = false;
  displayServices = false;
  displayClientLogos = false;
  displayTeams = false;
  displayAuthor = false;
  displayExpertise = false;
  displayFeatured = false;
  displayBlogs = false;
  displayShortLang = false;
  displayToolbar = false;
  displayFooterContact = false;
  displayFeaturedBlogs = false;
  fixedMenu: number;
  leftToRight: number;
  headerTextPosition: number;
  headerImageType: string;
  themeColor: string;
  type = 'Company';
  modifiedBy: number;
}

export class CompanyLocation {
  id: number;
  address: string;
  comment: string;
  fax: string;
  geocode: string;
  rank: number;
  image: string;
  name: string;
  open: string;
  telephone: string;
  type = 'Location';
}

export class OrderHistory {
  id: number;
  comment: string;
  notify: number;
  order: Order;
  user: User;
  orderStatus: OrderStatus;
  createDate: Date;
  modifiedBy: number;
  type = 'OrderHistory';
  constructor() {
    this.order = new Order();
    this.user = new User();
    this.notify = 1;
    this.orderStatus = new OrderStatus();
  }
}


export class OrderOption {
  id: number;
  name: string;
  orderId: number;
  orderProductId: number;
  optionId: number;
  optionValueId: number;
  optionType: string;
  value: string;
  points: number;
  pointsPrefix: string;
  price: number;
  pricePrefix: string;
  weight: number;
  weightPrefix: string;

  constructor() {

  }
}

export class Return {

  id: number;
  comment: string;
  customerId: number;
  dateOrdered: Date;
  email: string;
  firstName: string;
  lastName: string;
  model: string;
  opened: number;
  order: Order;
  product: string;
  productId: number;
  quantity: number;
  returnAction: ReturnAction;
  returnReason: ReturnReason;
  returnStatus: ReturnStatus;
  telephone: string;
  createDate: Date;
  modDate: Date;

  customer: string;

  returnProducts: ReturnProduct[];

  type = 'Return';


  constructor() {
    this.order = new Order();
    this.returnAction = new ReturnAction();
    this.returnReason = new ReturnReason();
    this.returnStatus = new ReturnStatus();
    this.returnProducts = [];
  }
}


export class ReturnProduct {

  id: number;
  comment: string;
  model: string;
  opened: number;
  productName: string;
  product: Product;
  returnId: number;
  quantity: number;
  returnReason: ReturnReason;

  type = 'ReturnProduct';

  constructor() {
    this.product = new Product();
    this.returnReason = new ReturnReason();
  }
}

export class ReturnHistory {
  id: number;
  comment: string;
  notify: number;
  returnId: number;
  returnStatus: ReturnStatus;
  createDate: Date;

  override: boolean;

  type = 'ReturnHistory';

  constructor() {
    this.returnStatus = new ReturnStatus();
  }
}



export class Order {
  id: number;
  acceptLanguage: string;
  affialiateId: number;
  comment: string;
  commission: number;
  currencyCode: string;
  currencyId: number;
  currencyValue: number;
  customField: string;
  userId: number;
  email: string;
  fax: string;
  firstName: string;
  forwardedIp: string;
  invoiceNo: number;
  invoicePrefix: string;
  ip: string;
  language: Language;
  lastName: string;
  marketingId: number;
  orderStatus: OrderStatus;
  statusCode: string;
  paymentAddress1: string;
  paymentAddress2: string;
  paymentAddressFormat: string;
  paymentCity: string;
  paymentCode: string;
  paymentCompany: string;
  paymentCountry: string;
  paymentCountryId: string;
  paymentCustomField: string;
  paymentfirstName: string;
  paymentlastName: string;
  paymentMethod: string;
  paymentPostcode: string;
  paymentZone: string;
  paymentZoneId: number;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingAddressFormat: string;
  shippingCity: string;
  shippingCode: string;
  shippingCompany: string;
  shippingCountry: string;
  shippingCountryId: number;
  shippingCustomField: string;
  shippingfirstName: string;
  shippinglastName: string;
  shippingMethod: string;
  shippingPostcode: string;
  shippingZone: string;
  shippingZoneId: number;
  storeId: number;
  storeName: string;
  storeUrl: string;
  telephone: string;
  total: number;
  shippingCost: number;
  taxFees: number;
  tracking: string;
  userAgent: string;
  createDate: Date;
  modDate: Date;
  modifiedBy: number;
  failureReason: string;
  paygateGlobalPaymentUrl: string;
  errors: string[];
  paymentInfo: string;
  cancellationReason: CancellationReason;
  shipper: Shipper;
  zoneToGeoZone: ZoneToGeoZone;
  preorderDate: Date;
  preorderHour: number;
  preorderMinute: string;
  preorderTimePeriod: TimePeriod;
  expected: Date;

  type = 'Order';
  totalRewardPoints: number;
  orderProducts: OrderProduct[] = [];
  orderOptions: OrderOption[] = [];
  orderOptionMap = {};
  products: Product[] = [];
  constructor() {
    this.type = 'Order';
  }

}

export class OrderProduct {
  id: number;
  model: string;
  name: string;
  order: Order;
  price: number;
  ptsId: number;
  product: Product;
  quantity: number;
  reward: number;
  tax: number;
  total: number;

  orderOptionMap = {};
}

export class SearchCriteria {
  priceMin: number;
  priceMax: number;
  category: string;
  text: string;
}

export class ReviewSearchCriteria {
  id: number;
  reviewType: number; // 0 -- product review, 1-- store review
  reviewTypeString: string;
  productName: string;
  storeName: string;
  storeId: number;
  languageId: number;
  status: number;
  approvalStatus: number;
  author: string;
  beginReviewDate: Date;
  endReviewDate: Date;
}

export class OrderSearchCriteria {
  orderId: number;
  returnId: number;
  storeId: number;
  userId: number;
  langId: number;
  status: number;
  orderType: number; // 0 -- online, 1-- store
  customerName: string;
  orderStatus: OrderStatus;
  returnStatus: ReturnStatus;
  minTotal: number;
  maxTotal: number;
  beginDate: Date;
  endDate: Date;
  miscText1: string;
  miscText2: string;
  miscNum1: number;
  miscNum2: number;
}

export class UserSearchCriteria {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  userGroup: UserGroup;
  status: number;
  ip: string;
  dateAdded: Date;
}

export class StoreSearchCriteria {
  storeId: number;
  name: string;
  email: string;
  userId: number;
  firstName: string;
  lastName: string;
  status: number;
  aprvStatus: number;
  createDate: Date;
}

export class ProductSearchCriteria {

  constructor(public languageId: number,
    public storeId: number,
    public marketingId: number,
    public catId: number,
    public searchText: string,
    public fromWeb: number,
    public productId: number,
    public topN: number,
    public userId: number,
    public storeCatId: number,
    public fromStore: number
  ) {

  }
}

export class PaymentMethodChangeVO {
  userId: number;
  paymentMethodCode: string;
  paymentMethodCodeId: number;
  stripePaymentMethodId: string;
  last4Digits: string;
  tmoneyPhone: string;
}

export class CustomerHistory {
  id: number;
  comment: string;
  notify: number;
  user: User;
  createDate: Date;

  type = 'CustomerHistory';

  constructor() {
    this.user = new User();
  }
}

export class CustomerTransaction {
  id: number;
  amount: number;
  description: string;
  notify: number;
  user: User;
  order: Order;
  createDate: Date;

  type = 'CustomerTransaction';

  constructor() {
    this.user = new User();
    this.order = new Order();
  }
}

export class CustomerReward {
  id: number;
  points: number;
  description: string;
  user: User;
  order: Order;
  createDate: Date;

  type = 'CustomerReward';

  constructor() {
    this.user = new User();
    this.order = new Order();
  }
}

export class OnlineOrderVO {
  orderId: number;
  storeId: number;
  storeName: string;
  cFirstName: string;
  cLastName: string;
  email: string;
  phone: string;
  addr1: string;
  addr2: string;
  city: string;
  zone: string;
  zipCode: string;
  country: string;
  paymentMethod: string;
  total: number;
  tracking: string;
  currencyCode: string;
  symbolLeft: string;
  symbolRight: string;
  currencyDecimalPlace: number;
  createDate: Date;
  status: string;
  isCancellable: boolean;
  orderProducts: OrderProduct[] = [];
}

export class StoreOrderVO {
  thId: number;
  storeId: number;
  storeName: string;
  cashier: string;
  tName: string;
  quantity: number;
  price: number;
  rebate: number;
  total: number;
  customers: number;
  currencyCode: string;
  symbolLeft: string;
  symbolRight: string;
  currencyDecimalPlace: number;
  createDate: Date;
  status: string;
}

export class OrdersVO {
  online: OnlineOrderVO[];
  store: StoreOrderVO[];
  onlineStatus: Map<string, number>;
  storeStatus: Map<number, number>;
}

export class TabHdr {
  public id: number;
  public tablId: number;
  public storeId: number;
  public userId: number;
  public cashier: string;
  public name: string;
  public storeDay: Date;
  public quantity: number;
  public guests: number;
  public price: number;
  public rebate: number;
  public total: number;
  public taxFees: number;
  public status: number;
  public createDate: Date;
  public modDate: Date;
  public comments: string;
  public clientId: number;
  public exRcpt: number;
  public tabDtls: TabDtl[] = [];
  public type = 'TabHdr';
}

export class TabDtl {
  public id: number;
  public prdName: string;
  public pic: string;
  public tabId: number;
  public ptsId: number;
  public prdId: number;
  public price: number;
  public quantity: number;
  public total: number;
  public createDate: Date;
  public modDate: Date;
  public type = 'TabDtl';
}

export class StoreCategory {
  id: number;
  sortOrder: number;
}

export class StoreCategoryDesc {
  id: number;
  storeCat: StoreCategory;
  language: Language;
  name: string;
}

export class EmailVerification {
  id: number;
  email: string;
  confirmEmail: string;
  expirationDate: Date;
  lang = 'fr';
  type = 'EmailVerification';
}

export class ProductOptionVO {
  id: number;
  ptsId: number;
  ptsoId: number;
  optionType: string;
  name: string;
  option: Options;
  productStoreOption: ProductStoreOption;
  optionValue: OptionValue;
  points: number;
  pointsPrefix: string;
  price: number;
  pricePrefix: string;
  weight: number;
  weightPrefix: string;
  quantity: number;
  subtract: number;
  required: number;

  povs: ProductOptionValue[];
}

export class RunReportVO {
  reportName: string;
  parameters: Parameter[];
  reportFormat: string;
}
export class Parameter {
  name: string;
  value: string;
  constructor(n: string, v: string) {
    this.name = n;
    this.value = v;
  }
}

export class Shipper {
  id: number;
  name: number;
  image: number;
  description: number;
  phone: number;
  email: number;
  status: number;
  sortOrder: number;
  ratingCount: number;
  rating: number;
  deliveryCount: number;
  user: User;
  url: number;
  type = 'Shipper';
}

export class TimeZone {
  id: number;
  name: string;
  description: string;
  gmtOffset: number;
}

export class StoreCatVO {
  id: number;
  name: string;
  count: number;
  url: string;
}

export class StoreShipper {
  id: number;
  shipper: Shipper;
  store: Store;
  shipperStatus: number;
  storeStatus: number;
  shipCount: number;
  type = 'StoreShipper';
}

export class SalesSummary {
  id: number;
  store: Store;
  currency: Currency;
  year: number;
  month: number;
  paymentMethod: string;
  total: number;
  shippingCost: number;
  taxFees: number;
  processingFees: number;
  totalDue: number;
  totalPaid: number;
  totalRemaining: number;
  status: number;
  payoutId: number;
  acknowledger: User;
  acknowledgerFullName: string;
  acknowledgeDate: Date;
  modifiedBy: number;

  type = 'SalesSummary';

  constructor() {
    this.acknowledger = new User();
    this.store = new Store();
    this.currency = new Currency();
  }
}

export class SalesSummarySearchCriteria {
  id: number;
  year: number;
  month: number;
  currencyId: number;
  currencyCode: string;
  storeId: number;
  storeName: string;
  status: number;
  paymentMethods: string[];
  userId: number;
  totalDueGreaterThan: number;
  beginDate: Date;
  endDate: Date;
}


export class Payout {
  public id: number;
  public store: Store;
  public currency: Currency;
  public year: number;
  public total: number;
  public image: string;
  public proofPayoutId: string;
  public comment: string;
  public payoutDate: Date;
  public status: number;
  public modifiedBy: number;
  public reversePayoutId: number;
  public payer: User;
  public createDate: Date;

  public salesSummaryIds: number[];
  public salesSummarys: SalesSummary[];
  public salesSummaryVOs: [];
  public payerFullName: string;

  type = 'Payout';

  constructor() {
    this.store = new Store();
    this.currency = new Currency();
    this.payer = new User();
  }
}


export class PayoutVO {
  id: number;
  storeId: number;
  storeName: string;
  total: number;
  year: number;
  image: string;
  proofPayoutId: string;
  comment: string;
  currencyCode: string;
  currencyId: number;
  currencySymbolLeft: string;
  currencySymbolRight: string;
  currencyDecimalPlace: number;
  payoutDate: Date;
  createDate: Date;
  status: number;
  reversePayoutId: number;

  constructor(payout: Payout) {
    this.id = payout.id;
    this.storeId = payout.store.id;
    this.storeName = payout.store.name;
    this.total = payout.total;
    this.year = payout.year;
    this.image = payout.image;
    this.proofPayoutId = payout.proofPayoutId;
    this.comment = payout.comment;
    this.currencyCode = payout.currency.code;
    this.currencyId = payout.currency.id;
    this.currencySymbolLeft = payout.currency.symbolLeft;
    this.currencySymbolRight = payout.currency.symbolRight;
    this.currencyDecimalPlace = payout.currency.decimalPlace;
    this.payoutDate = payout.payoutDate;
    this.createDate = payout.createDate;
    this.status = payout.status;
    this.reversePayoutId = payout.reversePayoutId;
  }
}

export class PayoutSearchCriteria {
  id: number;
  year: number;
  currencyId: number;
  currencyCode: string;
  storeId: number;
  storeName: string;
  status: number;
  proofPayoutId: string[];
  userId: number;
  payoutDate: Date;
  beginDate: Date;
  endDate: Date;
}


export class Ingredient extends BaseModel {
  id: number;
  image: string;
  manufacturerId: number;
  status = 1;
  modifiedBy: number;
  fileNames: string[];
  ingredientDescriptions: IngredientDescription[] = [];
  name: string;

  type = 'Ingredient';
  action: string;
}

export class IngredientDescription {
  id: number;
  ingredient: Ingredient;
  language: Language;
  name: string;
  description: string;
  shortDescription: string;
  mediumDescription: string;

  type = 'IngredientDescription';
}

export class Icon extends BaseModel {
  id: number;
  code: string;
  status = 1;
  modifiedBy: number;
  iconDescs: IconDesc[] = [];
  name: string;

  type = 'Icon';
  action: string;
}

export class IconDesc {
  id: number;
  icon: Icon;
  language: Language;
  name: string;
  desc: string;
  shortDesc: string;
  mediumDesc: string;

  type = 'IconDesc';
}

export class StoreIngredient {
  id: number;
  store: Store;
  ingredient: Ingredient;
  minimumQty: number;
  maximumQty: number;
  price: number;
  quantity: number;
  status = 1;
  modifiedBy: number;

  storeName: string;
  ingredientName: string;
  transferQty: number;
  errors: string[];

  type = 'StoreIngredient';

  public constructor() {
    this.store = new Store();
    this.ingredient = new Ingredient();
  }

}

export class IngredientSearchCriteria {
  id: number;
  ingredientId: number;
  storeId: number;
  productStoreId: number;
  languageId: number;
  userId: number;
  ingredientName: string;
  status: number;
  inventoryLevel: string;
}

export class StoreIngredientInventory {
  id: number;
  storeIngredient: StoreIngredient;
  quantity: number;
  description: string;
  createDate: Date;
  modBy: number;
  addByLastName: string;
  addByFirstName: string;

  type = 'StoreIngredientInventory';

  public constructor() {
    this.storeIngredient = new StoreIngredient();
  }

}

export class ProductStoreIngredient {
  id: number;
  productStoreId: number;
  productStoreOptionId: number;
  productStoreOptionValue: ProductStoreOptionValue;
  ingredient: Ingredient;
  quantityPerUnit: number;
  ingredientName: string;
  isTouched: false;

  type = 'ProductStoreIngredient';

  constructor() {
    this.ingredient = new Ingredient();
    this.productStoreOptionValue = new ProductStoreOptionValue();
  }
}


export class ProductMenu extends BaseModel {
  id: number;
  image: string;
  status = 1;
  showInKitchen: number;
  modifiedBy: number;
  menuDescriptions: MenuDescription[] = [];
  name: string;

  type = 'Menu';
  action: string;
}

export class MenuDescription {
  id: number;
  menu: ProductMenu;
  language: Language;
  name: string;
  description: string;
  shortDescription: string;
  mediumDescription: string;

  type = 'MenuDescription';
}

export class StoreMenu {
  id: number;
  store: Store;
  menu: ProductMenu;
  showInKitchen: number;
  showInBar: number;
  status = 1;
  modifiedBy: number;

  storeName: string;
  menuName: string;

  type = 'StoreMenu';

  public constructor() {
    this.store = new Store();
    this.menu = new ProductMenu();
  }

}


export class MenuSearchCriteria {
  id: number;
  menuId: number;
  storeId: number;
  productStoreId: number;
  storeMenuId: number;
  languageId: number;
  userId: number;
  menuName: string;
  status: number;
}

export class ProductStoreMenu {
  id: number;
  productStoreId: number;
  storeMenuId: number;
  productId: number;
  storeId: number;
  menu: ProductMenu;
  product: Product;
  menuName: string;
  productName: string;
  image: string;
  isTouched: false;

  type = 'ProductStoreMenu';

  constructor() {
    this.menu = new ProductMenu();
  }
}

export class Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  status = 1;
  modifiedBy: number;
  type = 'Supplier';
}

export class TransactionType {
  id: number;
  approverOnly = 0;
  status = 1;
  transactionTypeDescriptions: TransactionTypeDescription[] = [];
  name: string;

  type = 'TransactionType';
}

export class TransactionTypeDescription {
  id: number;
  language: Language;
  transactionType: TransactionType;
  name: string;

  type = 'TransactionTypeDescription';
}

export class PoHdr {
  id: number;
  store: Store;
  purchaser: User;
  supplier: Supplier;
  poDate: Date;
  subTotal: number;
  taxes: number;
  discount: number;
  amount: number;
  image: string;
  description: string;
  status = 0;
  approvedBy: User;
  approvedDate: Date;

  storeName: string;
  modifiedBy: number;

  approverName: String;

  type = 'PoHdr';

  constructor() {
    this.purchaser = new User();
    this.store = new Store();
    this.poDate = new Date();
  }
}

export class PoDtl {
  id: number;
  poHdr: PoHdr;
  product: Product;
  ingredient: Ingredient;
  unitAmount: number;
  quantity: number;
  totalAmount: number;
  status: number;

  productName: string;
  ingredientName: string;
  isTouched = false;
  modifiedBy: number;

  type = 'PoDtl';

  constructor() {
    this.poHdr = new PoHdr();
    this.product = new Product();
    this.ingredient = new Ingredient();
  }
}

export class POSearchCriteria {
  id: number;
  storeId: number;
  storeName: string;
  purchaserId: number;
  purchaserName: string;
  supplierId: number;
  supplierName: string;
  status: number;
  beginDate: Date;
  endDate: Date;
  userId: number;
  minAmount: number;
  maxAmount: number;
}

export class StoreEmployee {
  id: number;
  store: Store;
  employee: User;
  status: number;
  role: number;
  canApprove: number;
  canReprint: number;
  canReopen: number;
  canTransfer: number;
  beginDate: Date;
  endDate: Date;
  type = 'StoreEmployee';
}

export class Transaction {
  id: number;
  transactionType: TransactionType;
  store: Store;
  paidBy: User;
  receiver: User;
  transactionDate: Date;
  salaryDate: Date;
  amount: number;
  image: string;
  description: string;
  status = 0;

  storeName: string;
  modifiedBy: number;
  receiverName: string;
  paidByName: string;

  approvedBy: User;
  approvedDate: Date;
  approverName: string;

  type = 'Transaction';

  constructor() {
    this.store = new Store();
    this.transactionDate = new Date();
  }
}

export class TransactionSearchCriteria {

  id: number;
  transactionId: number;
  transactionTypeId: number;
  storeId: number;
  storeName: string;
  receiverId: number;
  receiverName: string;
  paidById: number;
  paidByName: string;
  status: number;
  beginDate: Date;
  endDate: Date;
  userId: number;
  minAmount: number;
  maxAmount: number;
}


export class Bill {
  id: number;
  store: Store;
  billDate: Date;
  dueDate: Date;
  paidDate: Date;
  subTotal: number;
  reference: string;
  taxes: number;
  discount: number;
  amount: number;
  amountDue: number;
  amountPaid: number;
  image: string;
  description: string;
  status = 0;
  storeName: string;
  modifiedBy: number;
  type = 'Bill';
  constructor() {
    this.store = new Store();
    this.billDate = new Date();
    const d = new Date();
    this.reference = ('SOFT') + this.dateAsYYYYMMDDHHNN(d);
  }
  dateAsYYYYMMDDHHNN(date): string {
    return date.getFullYear()
      + '' + this.leftpad(date.getMonth() + 1, 2)
      + '' + this.leftpad(date.getDate(), 2)
      + '' + this.leftpad(date.getHours(), 2)
      + '' + this.leftpad(date.getMinutes(), 2);
  }

  leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
      + String(val)).slice(String(val).length);
  }
}



export class BillDtl {
  id: number;
  bill: Bill;
  product: Product;
  service: Service;
  unitAmount: number;
  quantity: number;
  totalAmount: number;
  status: number;

  productName: string;
  serviceName: string;
  isTouched = false;
  modifiedBy: number;

  type = 'BillDtl';

  constructor() {
    this.bill = new Bill();
    this.product = new Product();
    this.service = new Service();
  }
}

export class BillSearchCriteria {

  id: number;
  billId: number;
  storeId: number;
  storeName: string;
  status: number;
  beginDate: Date;
  endDate: Date;
  userId: number;
  minAmount: number;
  maxAmount: number;
}


export class Service {
  id: number;
  status: number;
  serviceDescriptions: ServiceDescription[] = [];
  name: string;
  constructor() {
    this.status = 1;
  }
  type = 'Service';
}

export class ServiceDescription {
  id: number;
  language: Language;
  service: Service;
  name: string;

  type = 'ServiceDescription';
}

export class StoreService {
  id: number;
  store: Store;
  service: Service;
  startDate: Date;
  endDate: Date;
  subTotal: number;
  taxes: number;
  discount: number;
  amount: number;
  description: string;
  image: string;
  status = 1;
  billRecur: number;
  renewalRecur: number;

  storeName: string;
  modifiedBy: number;

  type = 'StoreService';

  constructor() {
    this.store = new Store();
    this.service = new Service();
  }
}


export class ServiceSearchCriteria {

  id: number;
  serviceId: number;
  storeId: number;
  storeName: string;
  status: number;
  beginStartDate: Date;
  endStartDate: Date;
  userId: number;
  minAmount: number;
  maxAmount: number;
}


export class BillPayment {
  id: number;
  bill: Bill;
  paymentDate: Date;
  dueDate: Date;
  amount: number;
  image: string;
  status: number;

  isTouched = false;
  modifiedBy: number;

  type = 'BillPayment';

  constructor() {
    this.bill = new Bill();
    this.status = 1;
  }
}



export class Reservation {
  id: number;
  userId: number;
  clientId: number;
  storeId: number;
  languageId: number;
  language: Language;
  beginDate: Date;
  endDate: Date;
  checkinDate: Date;
  checkoutDate: Date;
  rebate: number;
  price: number;
  total: number;
  quantity: number;
  firstName: string;
  lastName: string;
  sex: string;
  idType: number;
  idNbr: string;
  nbrAdult: string;
  nbrChild: string;
  contact: string;
  taxFees: number;
  status: number;
  offline: number;
  modifiedBy: number;
  storeDay: Date;
  createDate: Date;
  cashier: string;
  // transient
  tempId: number;
  country: Country;
  phone: string;
  days: number;
  nbrRooms: number;
  notMainGuest: boolean;
  saveDetails: boolean;

  acceptLanguage: string;
  affialiateId: number;
  ip: string;
  email: string;
  confirmEmail: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  postCode: string;
  telephone: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;

  nameOnCard: string;
  stripePaymentMethodId: string;
  pymtMethodCode: string;
  pymtMethodName: string;
  last4Digits: string;
  cardTypeIndex: string;
  tmoney: Tmoney;
  flooz: Flooz;

  storeName: string;
  storeUrl: string;
  comments: string;
  userAgent: string;

  currencyId: number;
	currencyCode: string;
  currencyDecimalPlace: number;

  reservationRooms: ReservationRoom[];
  roomTypeIds: number[];
  roomTypes: RoomTypeVO[];
  errors: string[];

  type = 'Reservation';
}

export class ReservationVO {
  reservationId: number;
	userId: number;
  storeId: number;
  buildingId: number;
  source: number;
	storeName: string;
	image: string;
	cFirstName: string;
	cLastName: string;
	gFirstName: string;
	gLastName: string;
	gEmail: string;
	cashier: string;
	days: number;
	nbrAdult: number;
	nbrChild: number;
	nbrRooms: number;
	email: string;
	phone: string;
	addr1: string;
	addr2: string;
	city: string;
	zoneId: number;
	zone: string;
	zipCode: string;
	countryId: number;
	country: string;
	paymentMethod: string;
	price: number;
	rebate: number;
	total: number;
	currencyCode: string;
	currencyId: number;
	symbolLeft: string;
	symbolRight: string;
	currencyDecimalPlace: string;
	createDate: Date;
	beginDate: Date;
	endDate: Date;
	checkinDate: Date;
	checkoutDate: Date;
  status: number;
  isCancellable: Boolean;

	reservationRooms: ReservationRoomVO[];

}

export class ReservationRoomVO {
  id: number;
	roomId: number;
	reservId: number;
	floorNumber: number;
	roomName: string;
	roomTypeName: string;
	buildingName: string;
  price: number;
  total: number;
	nbrChild: number;
	nbrAdult: number;
}

export class ReservationRoom {
  public id: number;
  public reservId: number;
  public roomId: number;
  public nbrAdult: number;
  public nbrChild: number;
  public price: number;
  public roomName: string;
  public roomTypeName: string;
  public buildingName: string;
  public comments: string;
  public status: number;
  public tempId: number;
  public type = 'ReservationRoom';
}

export class Room {
  public id: number;
  public roomType: RoomType;
  public roomTypeName: string;
  public roomNbr: number;
  public floorNbr: number;
  public image: string;
  public status = 1;
  public building: Building;
  public modifiedBy: number;
  public roomTypeDescs: RoomTypeDesc[];
  public type = 'Room';
  public action: string;
  constructor() {
    this.roomType = new RoomType();
    this.building = new Building();
    this.status = 0;
  }
}

export class RoomSearchCriteria {
  public id: number;
  public roomTypeId: number;
  public floorNbr: number;
  public buildingId: number;
  public storeId: number;
  public roomTypeName: string;
  public userId: number;
  public languageId: number;
  public status: number;
}

export class RoomType {
  public id: number;
  public price: number;
  public vipPrice: number;
  public hrlyPrice: number;
  public vipHrlyPrice: number;
  public qty: number;
  public storeId: number;
  public availableQty: number;
  public image: string;
  public status: number;
  public roomTypeDescs: RoomTypeDesc[] = [];
  public name: string;
  public modifiedBy: number;
  public type = 'RoomType';
  public action: string;
  constructor() {
    this.status = 1;
  }

}

export class RoomTypeDesc {
  public id: number;
  public language: Language;
  public roomType: RoomType;
  public name: string;
  public description: string;

  public type = 'RoomTypeDesc';
}

export class Amenity {
  id: number;
  image: string;
  status: number;
  amenityDescs: AmenityDesc[] = [];
  name: string;
  modifiedBy: number;
  iconId: number;
  icon: Icon;
  type = 'Amenity';
  action: string;

  constructor() {
    this.status = 1;
  }

}

export class AmenityDesc {
  public id: number;
  public language: Language;
  public amenity: Amenity;
  public name: string;
  public description: string;

  public type = 'AmenityDesc';
}

export class RoomTypeAmenity {
  public id: number;
  public roomType: RoomType;
  public amenity: Amenity;
  public price: number;
  public type = 'RoomTypeAmenity';
  public roomTypeName: string;
  public amenityName: string;
  public image: string;
  constructor() {
  }
}

export class Building {
  id: number;
  storeId: number;
  image: string;
  image1: string;
  image2: string;
  status = 1;
  modifiedBy: number;
  name: string;
  nbrFloors: number;
  fileNames: string[];
  remainingFileNames: string[] = [];
  singleImage = false;
  type = 'Building';
  action: string;

  constructor() {
    this.status = 1;
  }
}

export class ReservationSearchCriteria {
  reservationId: number;
  source: number;
  storeId: number;
  userId: number;
  langId: number;
  status: number;
  statuses: number[];
  reservationType: number; // 0 -- online, 1-- store
  customerName: string;
  minTotal: number;
  maxTotal: number;
  beginDate: Date;
  endDate: Date;
}

export class ReservationHistory {
  id: number;
  comment: string;
  notify: number;
  reservation: Reservation;
  user: User;
  status: number;
  createDate: Date;
  modifiedBy: number;
  type = 'ReservationHistory';

  constructor() {
    this.reservation = new Reservation();
    this.user = new User();
    this.notify = 1;
  }
}


export class ProductTransfer {

  productId: number;
  fromPtsId: number;
  fromStoreId: number;
  toPtsId: number;
  toStoreId: number;
  quantity: number;
  comment: string;
  status = 1;
  modifiedBy: number;

  public constructor() {
  }

}


export class IngredientTransfer {

  ingredientId: number;
  fromStIngId: number;
  fromStoreId: number;
  toStIngId: number;
  toStoreId: number;
  quantity: number;
  comment: string;
  status = 1;
  modifiedBy: number;

  public constructor() {
  }

}


export class ProductHistory {

  id: number;
  product: Product;
  ptsId: number;
  quantity: number;
  price: number;
	comment: string;
	fromPtsId: number;
  toPtsId: number;
  store: Store;
	fromStore: Store;
  toStore: Store;
  modifiedBy: number;

  storeName: string;
  productName: string;

  public constructor() {
  }

}


export class PrdHistSearchCriteria {
  id: number;
  productId: number;
  ingredientId: number;
  langId: number;
  ptsId: number;
	fromPtsId: number;
  toPtsId: number;
  storeId: number;
  fromStoreId: number;
	toStoreId: number;
  userId: number;
  modBy: number;
  minQuantity: number;
  maxQuantity: number;
  beginDate: Date;
  endDate: Date;
}


export class Fund {
  id: number;
  fundType: FundType;
  store: Store;
  paidBy: User;
  receivedBy: User;
  fundDate: Date;
  amount: number;
  image: string;
  description: string;
  status = 0;

  storeName: string;
  modifiedBy: number;
  receivedByName: string;
  paidByName: string;

  approvedBy: User;
  approvedDate: Date;
  approverName: string;

  type = 'Fund';

  constructor() {
    this.store = new Store();
    this.fundDate = new Date();
  }
}

export class FundSearchCriteria {

  id: number;
  fundId: number;
  fundTypeId: number;
  storeId: number;
  storeName: string;
  receiverId: number;
  receiverName: string;
  paidById: number;
  paidByName: string;
  status: number;
  beginDate: Date;
  endDate: Date;
  userId: number;
  minAmount: number;
  maxAmount: number;
}

export class FundType {
  id: number;
  approverOnly = 0;
  status = 1;
  fundTypeDescriptions: FundTypeDescription[] = [];
  name: string;

  type = 'FundType';
}

export class FundTypeDescription {
  id: number;
  language: Language;
  fundType: FundType;
  name: string;

  type = 'FundTypeDescription';
}


export class RoomVO {

  id: number;
  roomId: number;
  floorNumber: number;
	roomNumber: number;
	roomTypeId: number;
	roomTypeName: string;
	cityName: string;
  countryName: string;
  price: number;

	//Store
	storeId: number;
	storeName: string;
	prodStoreId: number;
	currencyId: number;
	currencyCode: string;
	symbolLeft: string;
	symbolRight: string;
	currencyDecimalPlace: number;

	//
	pQuantity: number;
	pStockStatusId: number;
	pPrice: number;
	pPoints: number;
	pTaxClassId: number;
	pSold: number;
	pPromo: number;
	pStatus: number;
	pMinimum: number;
	pSortOrder: number;

	fileNames: string[];
	reviews: Review[];
	ratingCountMaps: Map<number, number>;
	taxRules: TaxRule[];

	tax: number;
	total: number;

}


export class RoomStoreVO {
  id: number;
  storeName: string;
  image: string;
  image1: string;
  image2: string;
  image3: string;
  bldgId: number;
	prodStoreId: number;
	currencyId: number;
	currencyCode: string;
	symbolLeft: string;
	symbolRight: string;
  currencyDecimalPlace: number;
  address1: string;
  address2: string;
  postCode: string;
	cityName: string;
	countryId: number;
  countryName: string;
  lowestPrice: number;
  highestPrice: number;
  rating: number;
  ratingCount: number;
  pymtMethodReq: number;
  
  roomTyeVOs: RoomTypeVO[];
  nbrRooms = 0;
  total = 0;

  fileNames: string[];
	reviews: Review[];
	ratingCountMaps: Map<number, number>;
	taxRules: TaxRule[];

}

export class RoomTypeVO {
  id: number;
	roomTypeName: string;
	price: number;
  qtyAvailable: number;
  nbRooms = 0;
  total: number;
  roomIds: number[];

  amenities: AmenityVO[];
}

export class RoomListVO {
  roomTypes: string[];
  roomStoreVOs: RoomStoreVO[];
}

export class AmenityVO {
  id: number;
	image: string;
	name: string;
	description: string;
  language: Language;
  iconId: string;
  iconCode: string;

}

export class HotelSearchCriteria {
  storeId: number;
  priceMin: number;
  priceMax: number;
  roomTypeId: number;
  roomTypeName: string;
  checkinDate: Date;
  checkoutDate: Date;
  checkinTS: Date;
  checkoutTS: Date;
  isHourly = false;
  beginHr: string;
  endHr: string;
  days: number;
  text: string;
  languageId: number;
  rooms = 1;
  adults = 1;
  children = 0;
  location: string;
  address: Address;
  withAmenities = false;
}
