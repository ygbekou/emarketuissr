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
  fileNames: string[];
  type: 'User';
  constructor() {
    super();
    this.userGroup = new UserGroup();
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


export class Product {
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
  fileNames: string[];
  productVideos: ProductVideo[] = [];
  productDescriptions: ProductDescription[] = [];
  productToCategorys: ProductToCategory[] = [];

  type = 'Product';

  cloneWithoutChilds(product: Product) {
    const copy = { ...product };
    copy.productDescriptions = [];
    copy.productVideos = [];
    copy.productToCategorys = [];

    return copy;
  }

  copyData(copyFrom: Product) {
    this.id = copyFrom.id;
  }
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
  fixedMenu: number;
  leftToRight: number;
  headerTextPosition: number;
  headerImageType: string;
  themeColor: string;
  type = 'Company';
  modifiedBy: number;
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
  decimalPlace: number;
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
  type = 'OrderStatus';
}

export class ReturnStatus {
  id: number;
  name: string;
  language: Language;
  type = 'ReturnStatus';
}

export class ReturnReason {
  id: number;
  name: string;
  language: Language;
  type = 'ReturnReason';
}

export class ReturnAction {
  id: number;
  name: string;
  language: Language;
  type = 'ReturnAction';
}

export class Country {
  id: number;
  addressFormat: string;
  isoCode2: string;
  isoCode3: string;
  name: string;
  postcodeRequired: number;
  status: number;
  type = 'Country';
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
  name: String;
  description: string;
  type = 'GeoZone';
}

export class ZoneToGeoZone {
  id: number;
  zone: Zone;
  geoZone: GeoZone;
  country: Country;
  type = 'ZoneToGeoZone';
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

export class Store {
  id: number;
  name: string;
  owner: User;
  address: Address;
  email: string;
  image: string;
  phone: string;
  status: number;
  fileNames: string[];
  modifiedBy: number;
  description: string;
  sslUrl: string;
  url: string;
  type = 'Store';
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

export class Address {
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
  zone: Zone;
  type = 'Address';
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
  user: User;
  last4Digits: string;
  type = 'CreditCard';
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

  attributeGroupDescriptions: AttributeGroupDescription[] = [];

  type = 'AttributeGroup';
}

export class AttributeGroupDescription {
  id: number;
  attributeGroup: AttributeGroup;
  language: Language;
  name: string;

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
  sortOrder: number;
  status: number;
  stockStatusId: number;
  taxClassId: number;
  promo: number;
  viewed: number;
  modifiedBy: number;
  dateAvailable: Date;
  type = 'ProductToStore';
}


export class ProductOption {
  id: number;
  product: Product;
  option: Options;
  required: number;
  value: string;
  optionName: string;

  valueDate: Date;
  timeMinute: number;
  timeHour: number;

  productOptionValues: ProductOptionValue[]

  type = 'ProductOption';

  constructor() {
    this.product = new Product();
    this.option = new Options();
    this.required = 0;
  }
}

export class ProductOptionValue {
  id: number;
  product: Product;
  option: Options;
  productOption: ProductOption;
  optionValue: OptionValue;
  points: number;
  pointsPrefix: string;
  price: number;
  pricePrefix: string;
  weight: number;
  weightPrefix: string;
  quantity: number;
  subtract: number;

  type = 'ProductOptionValue';

  constructor() {
    this.product = new Product();
    this.option = new Options();
    this.optionValue = new OptionValue();
    this.productOption = new ProductOption();
  }
}

export class ProductVO {
  prodId: number;
  dateAvailable: number;
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
  promo: number;
  points: number;
  price: number;
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
  width: number;
  viewCount: number;
  ratingCount: number;
  rating: number;
  description: string;
  metaDescription: string;
  metaKeyword: string;
  metaTitle: string;
  name: string;
  tag: string;
  storeId: number;
  storeName: string;
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
  category: string;
}