import { Injectable } from '@angular/core';

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: 'admin-panel/reports',
    name: 'Reports',
    type: 'link',
    icon: 'poll'
  },
  {
    state: 'admin-panel/invoices',
    name: 'Invoices',
    type: 'link',
    icon: 'recent_actors'
  },
  {
    state: 'admin-panel',
    name: 'Products',
    type: 'sub',
    icon: 'shopping_cart',
    children: [
      {state: 'products', name: 'Products',type : 'link'},
      {state: 'product-add', name: 'Product Add',type : 'link'}
    ]
  },
  {
    state: 'admin-panel/account/profile',
    name: 'Profile',
    type: 'link',
    icon: 'account_circle'
  },
  {
    state: '/home',
    name: 'Go To Site',
    type: 'link',
    icon: 'home'
  }
];

@Injectable()
export class AdminMenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }
}
