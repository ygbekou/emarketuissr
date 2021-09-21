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
      { name: 'Saved cards', url: '/account/cards', icon: 'credit_card' }
    ]
  },
  {
    name: 'Orders',
    url: '/account/buying',
    icon: '',
    children: [
      { name: 'Orders dashboard', url: '/account/client-dashboard', icon: 'dashboard' },
      { name: 'Orders details', url: '/account/open-orders', icon: 'shopping_cart' },
    ]
  }, {
    name: 'Sales',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Stores', url: '/account/stores', icon: 'store' },
      { name: 'Sales dashboard', url: '/account/sales-dashboard', icon: 'dashboard' },
      { name: 'Sales summary', url: '/account/sales-summaries', icon: 'summarize' },
      { name: 'Sales details', url: '/account/sales-orders', icon: 'shopping_cart' },
    ]
  }, {
    name: 'Products',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Sell a product', url: '/account/sell-item', icon: 'sell' },
      { name: 'My store products', url: '/account/my-items', icon: 'qr_code_2' },
      { name: 'Composite products', url: '/account/store-ingredients', icon: 'category' },
      { name: 'Menu (Restaurant)', url: '/account/store-menus', icon: 'restaurant_menu' },
     ]
  }, {
    name: 'Accounting',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Accounting dashboard', url: '/account/sales-finance-dashboard', icon: 'dashboard' },
      { name: 'Expenses', url: '/account/transactions', icon: 'receipt_long' },
      { name: 'Purchase Orders', url: '/account/purchase-orders', icon: 'shopping_basket' },
      { name: 'Bills', url: '/account/seller-bills', icon: 'receipt' }
    ]
  }, {
    name: 'Shipping',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Shipping zones', url: '/account/shipping-zones', icon: 'local_shipping' },
      { name: 'My shippers', url: '/account/shipping-zones', icon: 'directions_run' },
      { name: 'My deliveries', url: '/account/deliveries', icon: 'local_shipping' },
    ]
  }, {
    name: 'Hospitality',
    url: '/account/hospitality',
    icon: 'account_circle',
    children: [
      { name: 'Building', url: '/account/seller-buildings', icon: 'hotel' },
      { name: 'Amenity', url: '/account/amenities', icon: 'tv' }
    ]
  }, {
    name: 'Reports',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Inventory Reports', url: '/account/reports/1', icon: 'inventory' },
      { name: 'Sales Reports', url: '/account/reports/2', icon: 'point_of_sale' },
    ]
  }
];

const TREE_DATA_FR: MenuNode[] = [
  {
    name: 'Compte',
    url: '/account/profile',
    icon: '',
    children: [
      { name: 'Profile', url: '/account/profile', icon: 'account_circle' },
      { name: 'Adresses', url: '/account/addresses', icon: 'location_on' },
      { name: 'Cartes enregistrées', url: '/account/cards', icon: 'credit_card' }
    ]
  },
  {
    name: 'Achats',
    url: '/account/buying',
    icon: '',
    children: [
      { name: 'Tableau de bord', url: '/account/client-dashboard', icon: 'dashboard' },
      { name: 'Détails Achats', url: '/account/open-orders', icon: 'shopping_cart' },
    ]
  }, {
    name: 'Ventes',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Boutiques', url: '/account/stores', icon: 'store' },
      { name: 'Tableau de bord', url: '/account/sales-dashboard', icon: 'dashboard' },
      { name: 'Détails ventes', url: '/account/sales-orders', icon: 'shopping_cart' },
      { name: 'Payements', url: '/account/sales-summaries', icon: 'summarize' },
    ]
  }, {
    name: 'Produits',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Vendre un produit', url: '/account/sell-item', icon: 'sell' },
      { name: 'Produits en vente', url: '/account/my-items', icon: 'qr_code_2' },
      { name: 'Produits Composites', url: '/account/store-ingredients', icon: 'category' },
      { name: 'Menu (Restaurant)', url: '/account/store-menus', icon: 'restaurant_menu' },
     ]
  }, {
    name: 'Comptabilité',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Tableau de bord', url: '/account/sales-finance-dashboard', icon: 'dashboard' },
      { name: 'Dépenses', url: '/account/transactions', icon: 'receipt_long' },
      { name: 'Commandes', url: '/account/purchase-orders', icon: 'shopping_basket' },
      { name: 'Factures', url: '/account/seller-bills', icon: 'receipt' }
    ]
  }, {
    name: 'Livraisons',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Zones d\'expédition', url: '/account/shipping-zones', icon: 'local_shipping' },
      { name: 'Mes livreurs', url: '/account/my-shippers', icon: 'directions_run' },
      { name: 'Mes livraisons', url: '/account/deliveries', icon: 'local_shipping' },
    ]
  }, {
    name: 'Hospitalité',
    url: '/account/hospitality',
    icon: 'account_circle',
    children: [
      { name: 'Imeubles', url: '/account/seller-buildings', icon: 'hotel' },
      { name: 'Aménités', url: '/account/amenities', icon: 'tv' }
    ]
  }, {
    name: 'Etats',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Etats d\'inventaire', url: '/account/reports/1', icon: 'inventory' },
      { name: 'Etats de ventes', url: '/account/reports/2', icon: 'point_of_sale' },
    ]
  }
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
