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
    state: 'admin/admindash',
    name: 'Dashboard',
    type: 'link',
    icon: 'poll'
  },
  {
    state: 'admin/invoices',
    name: 'Invoices',
    type: 'link',
    icon: 'recent_actors'
  },
  {
    state: 'admin',
    name: 'Products',
    type: 'sub',
    icon: 'shopping_cart',
    children: [
      { state: 'categories', name: 'Categories', type: 'link' },
      { state: 'products', name: 'Products', type: 'link' },
      { state: 'product-add', name: 'Product Add', type: 'link' },
      { state: 'marketings', name: 'Marketing', type: 'link' },
      { state: 'attributes', name: 'Attributes', type: 'link' },
      { state: 'information', name: 'Information', type: 'link' }
    ]
  },
  {
    state: 'admin/system',
    name: 'System',
    type: 'sub',
    icon: 'shopping_cart',
    children: [
      { state: 'stores', name: 'Stores', type: 'link' },
      { state: 'languages', name: 'Languages', type: 'link' },
      { state: 'currencies', name: 'Currencies', type: 'link' },
      { state: 'stockStatuses', name: 'Stock Statutes', type: 'link' },
      { state: 'orderStatuses', name: 'Order Statutes', type: 'link' },
      { state: 'returnStatuses', name: 'Return Statutes', type: 'link' },
      { state: 'returnReasons', name: 'Return Reasons', type: 'link' },
      { state: 'returnActions', name: 'Return Actions', type: 'link' },
      { state: 'countries', name: 'Countries', type: 'link' },
      { state: 'zones', name: 'Zones', type: 'link' },
      { state: 'geoZones', name: 'Geo Zones', type: 'link' },
      { state: 'lengthClasses', name: 'Length classes', type: 'link' },
      { state: 'weightClasses', name: 'Weight classes', type: 'link' },
      { state: 'taxClasses', name: 'Tax classes', type: 'link' },
      { state: 'taxRates', name: 'Tax rates', type: 'link' }
    ]
  },
  {
    state: 'admin/account/profile',
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
