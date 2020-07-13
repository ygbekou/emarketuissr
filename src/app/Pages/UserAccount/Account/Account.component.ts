import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

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
      { name: 'Addresses', url: '/account/address', icon: 'location_on' },
      { name: 'Saved cards', url: '/account/cards', icon: 'credit_card' }
    ]
  },
  {
    name: 'Buying',
    url: '/account/buying',
    icon: '',
    children: [
      { name: 'Purchase Overview', url: '/account/buy-overview', icon: 'dashboard' },
      { name: 'Purchase history', url: '/account/order-history', icon: 'history' },
      { name: 'Open orders', url: '/account/open-orders', icon: 'shopping_cart' },
      { name: 'Buy again', url: '/account/buy-again', icon: 'add_shopping_cart' }
    ]
  }, {
    name: 'Selling',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Sales Overview', url: '/account/sell-overview', icon: 'dashboard' },
      { name: 'Sell an item', url: '/account/sell-item', icon: 'store' },
      { name: 'Draft items', url: '/account/draft-item', icon: 'restore_from_trash' },
      { name: 'Active items', url: '/account/active-sale', icon: 'toggle_on' },
      { name: 'Sold items', url: '/account/sold-item', icon: 'toggle_off' }
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
      { name: 'Adresses', url: '/account/address', icon: 'location_on' },
      { name: 'Cartes enregistrées', url: '/account/cards', icon: 'credit_card' }
    ]
  },
  {
    name: 'Achats',
    url: '/account/buying',
    icon: '',
    children: [
      { name: 'Aperçu des achats', url: '/account/buy-overview', icon: 'dashboard' },
      { name: 'Historique achats', url: '/account/order-history', icon: 'history' },
      { name: 'Achats en cours', url: '/account/open-orders', icon: 'shopping_cart' },
      { name: 'Acheter encore', url: '/account/buy-again', icon: 'add_shopping_cart' }
    ]
  }, {
    name: 'Ventes',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Aperçu des ventes', url: '/account/sell-overview', icon: 'dashboard' },
      { name: 'Vendre un produit', url: '/account/sell-item', icon: 'store' },
      { name: 'Brouillon', url: '/account/draft-item', icon: 'restore_from_trash' },
      { name: 'Produits en vente', url: '/account/active-sale', icon: 'toggle_on' },
      { name: 'Produits vendus', url: '/account/sold-item', icon: 'toggle_off' }
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
    if (appService.appInfoStorage.language.code === 'fr') {
      this.dataSource.data = TREE_DATA_FR;
    } else {
      this.dataSource.data = TREE_DATA_EN;
    }
  }

  ngOnInit() {
  }

  hasChild = (_: number, node: EmarketFlatNode) => node.expandable;
}
