import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface MenuNode {
  name: string;
  url: string;
  icon: string;
  children?: MenuNode[];
}

const TREE_DATA_EN: MenuNode[] = [
  {
    name: 'Account',
    url: '/account/profile',
    icon: '',
    children: [
      { name: 'Profile', url: '/account/profile', icon: 'account_circle' },
      { name: 'Addresses', url: '/account/addresses', icon: 'location_on' },
      { name: 'Deliveries', url: '/account/deliveries', icon: 'local_shipping' },
      { name: 'Saved cards', url: '/account/cards', icon: 'credit_card' }
    ]
  },
  {
    name: 'Buying',
    url: '/account/buying',
    icon: '',
    children: [
      { name: 'Open orders', url: '/account/open-orders', icon: 'shopping_cart' },
      { name: 'Purchase dashboard', url: '/account/client-dashboard', icon: 'dashboard' }
    ]
  }, {
    name: 'Selling',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Stores', url: '/account/stores', icon: 'store' },
      { name: 'Sales dashboard', url: '/account/sales-dashboard', icon: 'dashboard' },
      { name: 'Sales summary', url: '/account/sales-summaries', icon: 'dashboard' },
      { name: 'Sales history', url: '/account/sales-orders', icon: 'shopping_cart' },
      { name: 'Sell an item', url: '/account/sell-item', icon: 'store' },
      { name: 'Product ingredients', url: '/account/store-ingredients', icon: 'fastfood' },
      { name: 'Restaurant menu', url: '/account/store-menus', icon: 'restaurant_menu' },
      { name: 'Transactions', url: '/account/transactions', icon: 'credit_card' },
      { name: 'Purchase Orders', url: '/account/purchase-orders', icon: 'shopping_basket' },
      { name: 'Billings', url: '/account/seller-bills', icon: 'laptop' },
      { name: 'My store items', url: '/account/my-items', icon: 'toggle_on' },
      { name: 'Shipping zones', url: '/account/shipping-zones', icon: 'local_shipping' },
      { name: 'Reports', url: '/account/reports', icon: 'segment' }
    ]
  },
];

const TREE_DATA_FR: MenuNode[] = [
  {
    name: 'Compte',
    url: '/account/profile',
    icon: '',
    children: [
      { name: 'Profile', url: '/account/profile', icon: 'account_circle' },
      { name: 'Adresses', url: '/account/addresses', icon: 'location_on' },
      { name: 'Livraisons', url: '/account/deliveries', icon: 'local_shipping' },
      { name: 'Cartes enregistrées', url: '/account/cards', icon: 'credit_card' }
    ]
  },
  {
    name: 'Achats',
    url: '/account/buying',
    icon: '',
    children: [
      { name: 'Achats en cours', url: '/account/open-orders', icon: 'shopping_cart' },
      { name: 'Tableau de bord', url: '/account/client-dashboard', icon: 'dashboard' }
    ]
  }, {
    name: 'Ventes',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Boutiques', url: '/account/stores', icon: 'store' },
      { name: 'Tableau de bord', url: '/account/sales-dashboard', icon: 'dashboard' },
      { name: 'Sommaire des ventes', url: '/account/sales-summaries', icon: 'dashboard' },
      { name: 'Historique ventes', url: '/account/sales-orders', icon: 'shopping_cart' },
      { name: 'Vendre un produit', url: '/account/sell-item', icon: 'store' },
      { name: 'Ingredients des produits', url: '/account/store-ingredients', icon: 'fastfood' },
      { name: 'Menu restaurant', url: '/account/store-menus', icon: 'restaurant_menu' },
      { name: 'Transactions', url: '/account/transactions', icon: 'credit_card' },
      { name: 'Commandes', url: '/account/purchase-orders', icon: 'shopping_basket' },
      { name: 'Facturations', url: '/account/seller-bills', icon: 'laptop' },
      { name: 'Produits en vente', url: '/account/my-items', icon: 'toggle_on' },
      { name: 'Zones d\'expedition', url: '/account/shipping-zones', icon: 'local_shipping' },
      { name: 'Etats', url: '/account/reports', icon: 'segment' }
    ]
  },
];

/** Flat node with expandable and level information */
interface EmarketFlatNode {
  expandable: boolean;
  name: string;
  url: string;
  icon: string;
  level: number;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-account',
  templateUrl: './Account.component.html',
  styleUrls: ['./Account.component.scss']
})
export class AccountComponent implements OnInit {

  showMenu = true;

  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      url: node.url,
      icon: node.icon,
      level: level,
    };
  }

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);
  treeControl = new FlatTreeControl<EmarketFlatNode>(
    node => node.level, node => node.expandable);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(public translate: TranslateService, public appService: AppService) {

    let lang = navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    if (Cookie.get('lang')) {
      lang = Cookie.get('lang');
      console.log('Using cookie lang=' + Cookie.get('lang'));
    } else if (lang) {
      console.log('Using browser lang=' + lang);
      // this.translate.use(lang);
    } else {
      lang = 'fr';
      console.log('Using default lang=fr');
    }
    if (appService.appInfoStorage.language) {
      lang = appService.appInfoStorage.language.code;
    }

    if (lang === 'fr') {
      this.dataSource.data = TREE_DATA_FR;
    } else {
      this.dataSource.data = TREE_DATA_EN;
    }
  }

  ngOnInit() {
  }

  toggleSidebar() {
    this.showMenu = !this.showMenu;
  }
  hasChild = (_: number, node: EmarketFlatNode) => node.expandable;
}
