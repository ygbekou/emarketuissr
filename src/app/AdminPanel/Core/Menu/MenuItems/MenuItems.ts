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
    state: 'admin',
    name: 'Products',
    type: 'sub',
    icon: 'shopping_basket',
    children: [
      { state: 'menus', name: 'Menus', type: 'link' },
      { state: 'categories', name: 'Categories', type: 'link' },
      { state: 'products', name: 'Products', type: 'link' },
      { state: 'marketings', name: 'Marketing', type: 'link' },
      { state: 'attributes', name: 'Attributes', type: 'link' },
      { state: 'options', name: 'Options', type: 'link' },
      { state: 'ingredients', name: 'Ingredients', type: 'link' },
      { state: 'information', name: 'Information', type: 'link' }
    ]
  },
  {
    state: 'admin/sales',
    name: 'Sales',
    type: 'sub',
    icon: 'shopping_cart',
    children: [
      { state: 'orders', name: 'Orders', type: 'link' },
      { state: 'returns', name: 'Returns', type: 'link' },
      { state: 'reviews', name: 'Reviews', type: 'link' },
      { state: 'summaries', name: 'Sales Summaries', type: 'link' },
      { state: 'payouts/0', name: 'Payouts', type: 'link' }
    ]
  },
  {
    state: 'admin/deliveries',
    name: 'Deliveries',
    type: 'sub',
    icon: 'local_shipping',
    children: [
      { state: 'deliv/summaries', name: 'Summaries', type: 'link' },
      { state: 'deliv/payouts/0', name: 'Payouts', type: 'link' }
    ]
  },
  {
    state: 'admin/customers',
    name: 'Customers',
    type: 'sub',
    icon: 'people',
    children: [
      { state: 'users', name: 'Users', type: 'link' },
      { state: 'stores/list', name: 'Stores', type: 'link' }
    ]
  },
  {
    state: 'admin/finances',
    name: 'Finances',
    type: 'sub',
    icon: 'account_balance',
    children: [
      { state: 'fundTypes', name: 'Fund Types', type: 'link' },
      { state: 'transactionTypes', name: 'Transaction Types', type: 'link' },
      { state: 'services', name: 'Services', type: 'link' },
      { state: 'suppliers', name: 'Suppliers', type: 'link' },
      { state: 'bills', name: 'Billing', type: 'link' }
    ]
  },
  {
    state: 'admin/hospitalities',
    name: 'Hospitalities',
    type: 'sub',
    icon: 'hotel',
    children: [
      { state: 'amenities', name: 'Amenities', type: 'link' },
      { state: 'reservations', name: 'Reservations', type: 'link' },
      { state: 'icons', name: 'Icons', type: 'link' },
    ]
  },
  {
    state: 'admin/system',
    name: 'System',
    type: 'sub',
    icon: 'settings',
    children: [
      { state: 'stores', name: 'Stores', type: 'link' },
      { state: 'shippers', name: 'Shippers', type: 'link' },
      { state: 'configs', name: 'Configuration', type: 'link' },
      { state: 'languages', name: 'Languages', type: 'link' },
      { state: 'currencies', name: 'Currencies', type: 'link' },
      { state: 'stockStatuses', name: 'Stock Statutes', type: 'link' },
      { state: 'orderStatuses', name: 'Order Statutes', type: 'link' },
      { state: 'returnStatuses', name: 'Return Statutes', type: 'link' },
      { state: 'returnReasons', name: 'Return Reasons', type: 'link' },
      { state: 'returnActions', name: 'Return Actions', type: 'link' },
      { state: 'countries', name: 'Countries', type: 'link' },
      { state: 'zones', name: 'Zones', type: 'link' },
      { state: 'geoZones', name: 'Shipping Zones', type: 'link' },
      { state: 'lengthClasses', name: 'Length classes', type: 'link' },
      { state: 'weightClasses', name: 'Weight classes', type: 'link' },
      { state: 'taxClasses', name: 'Tax classes', type: 'link' },
      { state: 'taxRates', name: 'Tax rates', type: 'link' }
    ]
  },
  {
    state: '/home',
    name: 'Go To Site',
    type: 'link',
    icon: 'home'
  }
];

const MENUITEMS_FR = [
  {
    state: 'admin/admindash',
    name: 'Tableau de board',
    type: 'link',
    icon: 'poll'
  },
  {
    state: 'admin',
    name: 'Produits',
    type: 'sub',
    icon: 'shopping_basket',
    children: [
      { state: 'menus', name: 'Menus', type: 'link' },
      { state: 'categories', name: 'Categories', type: 'link' },
      { state: 'products', name: 'Produits', type: 'link' },
      { state: 'marketings', name: 'Marketing', type: 'link' },
      { state: 'attributes', name: 'Attributs', type: 'link' },
      { state: 'options', name: 'Options', type: 'link' },
      { state: 'ingredients', name: 'Ingredients', type: 'link' },
      { state: 'information', name: 'Information', type: 'link' }
    ]
  },
  {
    state: 'admin/sales',
    name: 'Ventes',
    type: 'sub',
    icon: 'shopping_cart',
    children: [
      { state: 'orders', name: 'Commandes', type: 'link' },
      { state: 'returns', name: 'Retours', type: 'link' },
      { state: 'reviews', name: 'Reviews', type: 'link' },
      { state: 'summaries', name: 'Sommaire des ventes', type: 'link' },
      { state: 'payouts/0', name: 'Payements', type: 'link' }
    ]
  },
  {
    state: 'admin/deliveries',
    name: 'Livraisons',
    type: 'sub',
    icon: 'local_shipping',
    children: [
      { state: 'deliv/summaries', name: 'Sommaires', type: 'link' },
      { state: 'deliv/payouts/0', name: 'Payements', type: 'link' }
    ]
  },
  {
    state: 'admin/customers',
    name: 'Clients',
    type: 'sub',
    icon: 'people',
    children: [
      { state: 'users', name: 'Utilisateurs', type: 'link' },
      { state: 'stores/list', name: 'Boutiques', type: 'link' }
    ]
  },
  {
    state: 'admin/finances',
    name: 'Finances',
    type: 'sub',
    icon: 'account_balance',
    children: [
      { state: 'fundTypes', name: 'Types de Fond', type: 'link' },
      { state: 'transactionTypes', name: 'Types de Transaction', type: 'link' },
      { state: 'services', name: 'Services', type: 'link' },
      { state: 'suppliers', name: 'Fournisseurs', type: 'link' },
      { state: 'bills', name: 'Facturation', type: 'link' }
    ]
  },
  {
    state: 'admin/hospitalities',
    name: 'Hotelleries',
    type: 'sub',
    icon: 'hotel',
    children: [
      { state: 'amenities', name: 'Amenitées', type: 'link' },
      { state: 'reservations', name: 'Reservations', type: 'link' },
      { state: 'icons', name: 'Icons', type: 'link' }
    ]
  },
  {
    state: 'admin/system',
    name: 'Systeme',
    type: 'sub',
    icon: 'settings',
    children: [
      { state: 'configs', name: 'Configuration', type: 'link' },
      { state: 'shippers', name: 'Expediteurs', type: 'link' },
      { state: 'languages', name: 'Langues', type: 'link' },
      { state: 'currencies', name: 'Monnaies', type: 'link' },
      { state: 'stockStatuses', name: 'Etat des stocks', type: 'link' },
      { state: 'orderStatuses', name: 'Etats des commandes', type: 'link' },
      { state: 'returnStatuses', name: 'Etats des retours', type: 'link' },
      { state: 'returnReasons', name: 'Raisons des retours', type: 'link' },
      { state: 'returnActions', name: 'Actions des retours', type: 'link' },
      { state: 'countries', name: 'Pays', type: 'link' },
      { state: 'zones', name: 'Zones', type: 'link' },
      { state: 'geoZones', name: 'Zones d\'expedition', type: 'link' },
      { state: 'lengthClasses', name: 'Unites de longueur', type: 'link' },
      { state: 'weightClasses', name: 'Unites de masse', type: 'link' },
      { state: 'taxClasses', name: 'Classes de taxes', type: 'link' },
      { state: 'taxRates', name: 'Taux de taxes', type: 'link' }
    ]
  },
  {
    state: '/home',
    name: 'Aller sur le site',
    type: 'link',
    icon: 'home'
  }
];

@Injectable()
export class AdminMenuItems {
  getAll(lang: string): Menu[] {
    if (!lang || lang === 'fr') {
      return MENUITEMS_FR;
    } else {
      return MENUITEMS;
    }
  }
}
