import { Injectable } from '@angular/core';
import { AuthToken, User } from './app.models';

@Injectable()
export class TokenStorage {

  public static TOKEN_KEY = 'AuthToken';
  public static USER_GROUP_ID = 'user_group_id';
  public static ROLE_NAME = 'role_name';
  public static PICTURE = 'picture';
  public static FIRST_NAME = 'first_name';
  public static MIDDLE_NAME = 'middle_name';
  public static LAST_NAME = 'last_name';
  public static FIRST_TIME_LOGIN = 'first_time_login';
  public static MENUS = 'menus';
  public static NON_MENU_RESOURCES = 'non_menu_resources';
  public static USER_ID = 'user_id';
  public static EMAIL = 'email';
  public static PHONE = 'phone';
  public static USER_NAME = 'user_name';
  public static HOME_PAGE = 'home_page';
  public static USER = 'user';
  public static DAY_START_TIME = 'day_start_time';


  constructor() { }

  signOut() {
    window.localStorage.removeItem(TokenStorage.TOKEN_KEY);
    // window.localStorage.clear();
  }

  public saveAuthData(authData: AuthToken) {

    window.localStorage.removeItem(TokenStorage.USER);
    window.localStorage.setItem(TokenStorage.USER, JSON.stringify(authData));

    window.localStorage.removeItem(TokenStorage.TOKEN_KEY);
    window.localStorage.setItem(TokenStorage.TOKEN_KEY, authData.token);

    // user data
    window.localStorage.removeItem(TokenStorage.USER_GROUP_ID);
    window.localStorage.setItem(TokenStorage.USER_GROUP_ID, authData.authorities[0] + '');

    window.localStorage.removeItem(TokenStorage.ROLE_NAME);
    window.localStorage.setItem(TokenStorage.ROLE_NAME, authData.roleName);

    window.localStorage.removeItem(TokenStorage.PICTURE);
    window.localStorage.setItem(TokenStorage.PICTURE, authData.picture);

    window.localStorage.removeItem(TokenStorage.FIRST_NAME);
    window.localStorage.setItem(TokenStorage.FIRST_NAME, authData.firstName);

    window.localStorage.removeItem(TokenStorage.MIDDLE_NAME);
    window.localStorage.setItem(TokenStorage.MIDDLE_NAME, authData.middleName);

    window.localStorage.removeItem(TokenStorage.LAST_NAME);
    window.localStorage.setItem(TokenStorage.LAST_NAME, authData.lastName);

    window.localStorage.removeItem(TokenStorage.FIRST_TIME_LOGIN);
    window.localStorage.setItem(TokenStorage.FIRST_TIME_LOGIN, authData.firstTimeLogin);

    window.localStorage.removeItem(TokenStorage.USER_ID);
    window.localStorage.setItem(TokenStorage.USER_ID, authData.userId + '');

    window.localStorage.removeItem(TokenStorage.USER_NAME);
    window.localStorage.setItem(TokenStorage.USER_NAME, authData.userName + '');

    window.localStorage.removeItem(TokenStorage.EMAIL);
    window.localStorage.setItem(TokenStorage.EMAIL, authData.email);

    window.localStorage.removeItem(TokenStorage.PHONE);
    window.localStorage.setItem(TokenStorage.PHONE, authData.phone);

    window.localStorage.removeItem(TokenStorage.HOME_PAGE);
    window.localStorage.setItem(TokenStorage.HOME_PAGE, authData.homePage);
  }

  public clearAuthData() {
    window.localStorage.removeItem(TokenStorage.USER);
    window.localStorage.removeItem(TokenStorage.TOKEN_KEY);
    window.localStorage.removeItem(TokenStorage.USER_GROUP_ID);
    window.localStorage.removeItem(TokenStorage.ROLE_NAME);
    window.localStorage.removeItem(TokenStorage.PICTURE);
    window.localStorage.removeItem(TokenStorage.FIRST_NAME);
    window.localStorage.removeItem(TokenStorage.MIDDLE_NAME);
    window.localStorage.removeItem(TokenStorage.LAST_NAME);
    window.localStorage.removeItem(TokenStorage.FIRST_TIME_LOGIN);
    window.localStorage.removeItem(TokenStorage.USER_ID);
    window.localStorage.removeItem(TokenStorage.USER_NAME);
    window.localStorage.removeItem(TokenStorage.EMAIL);
    window.localStorage.removeItem(TokenStorage.PHONE);
    window.localStorage.removeItem(TokenStorage.HOME_PAGE);
  }

  public getToken(): string {
    return window.localStorage.getItem(TokenStorage.TOKEN_KEY);
  }

  public hasToken(): boolean {
    return this.getToken() !== '' && this.getToken() != null;
  }

  public getRole(): string {
    return window.localStorage.getItem(TokenStorage.USER_GROUP_ID);
  }

  public getRoleName(): string {
    return window.localStorage.getItem(TokenStorage.ROLE_NAME);
  }

  public getPicture(): string {
    return window.localStorage.getItem(TokenStorage.PICTURE);
  }

  public getFirstName(): string {
    return window.localStorage.getItem(TokenStorage.FIRST_NAME);
  }

  public getMiddleName(): string {
    return window.localStorage.getItem(TokenStorage.MIDDLE_NAME);
  }

  public getLastName(): string {
    return window.localStorage.getItem(TokenStorage.LAST_NAME);
  }

  public getFirstTimeLogin(): string {
    return window.localStorage.getItem(TokenStorage.FIRST_TIME_LOGIN);
  }

  public getMenus(): string {
    return window.localStorage.getItem(TokenStorage.MENUS);
  }

  public getNonMenuPermissions(): string {
    return window.localStorage.getItem(TokenStorage.NON_MENU_RESOURCES);
  }

  public getName(): string {
    const middleName = (this.getMiddleName() !== null && this.getMiddleName()
      !== undefined && this.getMiddleName() !== 'undefined' ? this.getMiddleName() + ' ' : '');
    return this.getFirstName() + ' ' + middleName + this.getLastName();
  }

  public getUserId(): string {
    return window.localStorage.getItem(TokenStorage.USER_ID);
  }

  public getUserName(): string {
    return window.localStorage.getItem(TokenStorage.USER_NAME);
  }

  public getEmail(): string {
    return window.localStorage.getItem(TokenStorage.EMAIL);
  }

  public getPhone(): string {
    return window.localStorage.getItem(TokenStorage.PHONE);
  }

  public getHomePage(): string {
    return window.localStorage.getItem(TokenStorage.HOME_PAGE);
  }

  public getUser(): User {
    return JSON.parse(window.localStorage.getItem(TokenStorage.USER));
  }

}
