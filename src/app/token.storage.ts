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

  public walletMap = {};
  public pointsMap = {};


  constructor() { }

  signOut() {
    localStorage.removeItem(TokenStorage.TOKEN_KEY);
    // localStorage.clear();
  }

  public saveAuthData(authData: AuthToken) {

    localStorage.removeItem(TokenStorage.USER);
    localStorage.setItem(TokenStorage.USER, JSON.stringify(authData));

    localStorage.removeItem(TokenStorage.TOKEN_KEY);
    localStorage.setItem(TokenStorage.TOKEN_KEY, authData.token);

    // user data
    localStorage.removeItem(TokenStorage.USER_GROUP_ID);
    localStorage.setItem(TokenStorage.USER_GROUP_ID, authData.authorities[0] + '');

    localStorage.removeItem(TokenStorage.ROLE_NAME);
    localStorage.setItem(TokenStorage.ROLE_NAME, authData.roleName);

    localStorage.removeItem(TokenStorage.PICTURE);
    localStorage.setItem(TokenStorage.PICTURE, authData.picture);

    localStorage.removeItem(TokenStorage.FIRST_NAME);
    localStorage.setItem(TokenStorage.FIRST_NAME, authData.firstName);

    localStorage.removeItem(TokenStorage.MIDDLE_NAME);
    localStorage.setItem(TokenStorage.MIDDLE_NAME, authData.middleName);

    localStorage.removeItem(TokenStorage.LAST_NAME);
    localStorage.setItem(TokenStorage.LAST_NAME, authData.lastName);

    localStorage.removeItem(TokenStorage.FIRST_TIME_LOGIN);
    localStorage.setItem(TokenStorage.FIRST_TIME_LOGIN, authData.firstTimeLogin);

    localStorage.removeItem(TokenStorage.USER_ID);
    localStorage.setItem(TokenStorage.USER_ID, authData.userId + '');

    localStorage.removeItem(TokenStorage.USER_NAME);
    localStorage.setItem(TokenStorage.USER_NAME, authData.userName + '');

    localStorage.removeItem(TokenStorage.EMAIL);
    localStorage.setItem(TokenStorage.EMAIL, authData.email);

    localStorage.removeItem(TokenStorage.PHONE);
    localStorage.setItem(TokenStorage.PHONE, authData.phone);

    localStorage.removeItem(TokenStorage.HOME_PAGE);
    localStorage.setItem(TokenStorage.HOME_PAGE, authData.homePage);
  }

  public clearAuthData() {
    localStorage.removeItem(TokenStorage.USER);
    localStorage.removeItem(TokenStorage.TOKEN_KEY);
    localStorage.removeItem(TokenStorage.USER_GROUP_ID);
    localStorage.removeItem(TokenStorage.ROLE_NAME);
    localStorage.removeItem(TokenStorage.PICTURE);
    localStorage.removeItem(TokenStorage.FIRST_NAME);
    localStorage.removeItem(TokenStorage.MIDDLE_NAME);
    localStorage.removeItem(TokenStorage.LAST_NAME);
    localStorage.removeItem(TokenStorage.FIRST_TIME_LOGIN);
    localStorage.removeItem(TokenStorage.USER_ID);
    localStorage.removeItem(TokenStorage.USER_NAME);
    localStorage.removeItem(TokenStorage.EMAIL);
    localStorage.removeItem(TokenStorage.PHONE);
    localStorage.removeItem(TokenStorage.HOME_PAGE);
  }

  public getToken(): string {
    return localStorage.getItem(TokenStorage.TOKEN_KEY);
  }

  public hasToken(): boolean {
    return this.getToken() !== '' && this.getToken() != null;
  }

  public getRole(): string {
    return localStorage.getItem(TokenStorage.USER_GROUP_ID);
  }

  public getRoleName(): string {
    return localStorage.getItem(TokenStorage.ROLE_NAME);
  }

  public getPicture(): string {
    return localStorage.getItem(TokenStorage.PICTURE);
  }

  public getFirstName(): string {
    return localStorage.getItem(TokenStorage.FIRST_NAME);
  }

  public getMiddleName(): string {
    return localStorage.getItem(TokenStorage.MIDDLE_NAME);
  }

  public getLastName(): string {
    return localStorage.getItem(TokenStorage.LAST_NAME);
  }

  public getFirstTimeLogin(): string {
    return localStorage.getItem(TokenStorage.FIRST_TIME_LOGIN);
  }

  public getMenus(): string {
    return localStorage.getItem(TokenStorage.MENUS);
  }

  public getNonMenuPermissions(): string {
    return localStorage.getItem(TokenStorage.NON_MENU_RESOURCES);
  }

  public getName(): string {
    const middleName = (this.getMiddleName() !== null && this.getMiddleName()
      !== undefined && this.getMiddleName() !== 'undefined' ? this.getMiddleName() + ' ' : '');
    return this.getFirstName() + ' ' + middleName + this.getLastName();
  }

  public getUserId(): string {
    return localStorage.getItem(TokenStorage.USER_ID);
  }

  public getUserName(): string {
    return localStorage.getItem(TokenStorage.USER_NAME);
  }

  public getEmail(): string {
    return localStorage.getItem(TokenStorage.EMAIL);
  }

  public getPhone(): string {
    return localStorage.getItem(TokenStorage.PHONE);
  }

  public getHomePage(): string {
    return localStorage.getItem(TokenStorage.HOME_PAGE);
  }

  public getUser(): User {
    return JSON.parse(localStorage.getItem(TokenStorage.USER));
  }

}
