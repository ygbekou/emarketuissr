import { Injectable } from '@angular/core';
import { AuthToken } from 'src/app/app.models';


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
  public static USER_NAME = 'user_name';
  public static HOME_PAGE = 'home_page';

  constructor() { }

  signOut() {
    window.sessionStorage.removeItem(TokenStorage.TOKEN_KEY);
    // window.sessionStorage.clear();
  }

  public saveAuthData(authData: AuthToken) {

    window.sessionStorage.removeItem(TokenStorage.TOKEN_KEY);
    window.sessionStorage.setItem(TokenStorage.TOKEN_KEY, authData.token);

    // user data
    window.sessionStorage.removeItem(TokenStorage.USER_GROUP_ID);
    window.sessionStorage.setItem(TokenStorage.USER_GROUP_ID, authData.authorities[0] + '');

    window.sessionStorage.removeItem(TokenStorage.ROLE_NAME);
    window.sessionStorage.setItem(TokenStorage.ROLE_NAME, authData.roleName);

    window.sessionStorage.removeItem(TokenStorage.PICTURE);
    window.sessionStorage.setItem(TokenStorage.PICTURE, authData.picture);

    window.sessionStorage.removeItem(TokenStorage.FIRST_NAME);
    window.sessionStorage.setItem(TokenStorage.FIRST_NAME, authData.firstName);

    window.sessionStorage.removeItem(TokenStorage.MIDDLE_NAME);
    window.sessionStorage.setItem(TokenStorage.MIDDLE_NAME, authData.middleName);

    window.sessionStorage.removeItem(TokenStorage.LAST_NAME);
    window.sessionStorage.setItem(TokenStorage.LAST_NAME, authData.lastName);

    window.sessionStorage.removeItem(TokenStorage.FIRST_TIME_LOGIN);
    window.sessionStorage.setItem(TokenStorage.FIRST_TIME_LOGIN, authData.firstTimeLogin);

    window.sessionStorage.removeItem(TokenStorage.USER_ID);
    window.sessionStorage.setItem(TokenStorage.USER_ID, authData.userId + '');

    window.sessionStorage.removeItem(TokenStorage.USER_NAME);
    window.sessionStorage.setItem(TokenStorage.USER_NAME, authData.userName + '');

    window.sessionStorage.removeItem(TokenStorage.HOME_PAGE);
    window.sessionStorage.setItem(TokenStorage.HOME_PAGE, authData.homePage);
  }

  public clearAuthData() {
    window.sessionStorage.removeItem(TokenStorage.TOKEN_KEY);
    window.sessionStorage.removeItem(TokenStorage.USER_GROUP_ID);
    window.sessionStorage.removeItem(TokenStorage.ROLE_NAME);
    window.sessionStorage.removeItem(TokenStorage.PICTURE);
    window.sessionStorage.removeItem(TokenStorage.FIRST_NAME);
    window.sessionStorage.removeItem(TokenStorage.MIDDLE_NAME);
    window.sessionStorage.removeItem(TokenStorage.LAST_NAME);
    window.sessionStorage.removeItem(TokenStorage.FIRST_TIME_LOGIN);
    window.sessionStorage.removeItem(TokenStorage.USER_ID);
    window.sessionStorage.removeItem(TokenStorage.USER_NAME);
    window.sessionStorage.removeItem(TokenStorage.HOME_PAGE);
  }

  public getToken(): string {
    return window.sessionStorage.getItem(TokenStorage.TOKEN_KEY);
  }

  public hasToken(): boolean {
    return this.getToken() !== '' && this.getToken() != null;
  }

  public getRole(): string {
    return window.sessionStorage.getItem(TokenStorage.USER_GROUP_ID);
  }

  public getRoleName(): string {
    return window.sessionStorage.getItem(TokenStorage.ROLE_NAME);
  }

  public getPicture(): string {
    return window.sessionStorage.getItem(TokenStorage.PICTURE);
  }

  public getFirstName(): string {
    return window.sessionStorage.getItem(TokenStorage.FIRST_NAME);
  }

  public getMiddleName(): string {
    return window.sessionStorage.getItem(TokenStorage.MIDDLE_NAME);
  }

  public getLastName(): string {
    return window.sessionStorage.getItem(TokenStorage.LAST_NAME);
  }

  public getFirstTimeLogin(): string {
    return window.sessionStorage.getItem(TokenStorage.FIRST_TIME_LOGIN);
  }

  public getMenus(): string {
    return window.sessionStorage.getItem(TokenStorage.MENUS);
  }

  public getNonMenuPermissions(): string {
    return window.sessionStorage.getItem(TokenStorage.NON_MENU_RESOURCES);
  }

  public getName(): string {
    const middleName = (this.getMiddleName() !== null && this.getMiddleName()
      !== undefined && this.getMiddleName() !== 'undefined' ? this.getMiddleName() + ' ' : '');
    return this.getFirstName() + ' ' + middleName + this.getLastName();
  }

  public getUserId(): string {
    return window.sessionStorage.getItem(TokenStorage.USER_ID);
  }

  public getUserName(): string {
    return window.sessionStorage.getItem(TokenStorage.USER_NAME);
  }
  public getHomePage(): string {
    return window.sessionStorage.getItem(TokenStorage.HOME_PAGE);
  }
}
