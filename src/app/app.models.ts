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
  userName: string;
  currentPassword: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  picture = 'user.jpg';
  sex: string;
  homePhone: string;
  mobilePhone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  companyName: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  website: string;
  birthDate: Date;
  status: number;
  userGroup: UserGroup;
  receiveNewsletter: true;
  modifiedBy: number;
  // Transients
  confirmPassword: string;
  name: string;
  roles: Role[];
  type = 'User';
  fileNames: string[];
  shortResume: string;
  resume: string;
  employees: Employee[] = [];
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

export class TaxClass {
  id: number;
  title: string;
  description: string;
}

export class StockStatus {
  id: number;
  name: string;
  languageId: number;
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
  upc: string;
  viewed: number;
  weight: number;
  weightClassId: number;
  width: number;

  productDescriptions: ProductDescription[] = [];
}

export class ProductDescription {
  id: number;
  productId: number;
  languageId: number;
  name: string;
  description: string;
  tag: string;
  metaTitle: string;
  metaDescription: string;
  metaKeyword: string;
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
  createDate: Date
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
