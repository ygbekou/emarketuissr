import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TranslateService } from '@ngx-translate/core';

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

const TREE_DATA: MenuNode[] = [
  {
    name: 'Account',
    url: '/account/profile',
    icon: '',
    children: [
      { name: 'Profile', url: '/account/profile', icon: 'account_circle' },
      { name: 'Addresses', url: '/account/address', icon: 'location_on'  },
      { name: 'Saved cards', url: '/account/cards', icon: 'credit_card'  }
    ]
  },
  {
    name: 'Buying',
    url: '/account/buying',
    icon: '',
    children: [
      { name: 'Overview', url: '/account/buy-overview', icon: 'dashboard'  },
      { name: 'Purchase history', url: '/account/order-history', icon: 'history'  },
      { name: 'Open orders', url: '/account/open-orders', icon: 'shopping_cart'  },
      { name: 'Buy again', url: '/account/buy-again', icon: 'add_shopping_cart'  }
    ]
  }, {
    name: 'Selling',
    url: '/account/selling',
    icon: 'account_circle',
    children: [
      { name: 'Overview', url: '/account/sell-overview', icon: 'dashboard'  },
      { name: 'Sell an item', url: '/account/sell-item', icon: 'store'  },
      { name: 'Draft', url: '/account/draft-item', icon: 'restore_from_trash'  },
      { name: 'Active', url: '/account/active-sale', icon: 'toggle_on'  },
      { name: 'Sold', url: '/account/sold-item', icon: 'toggle_off'  }
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

  constructor(public translate: TranslateService) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
  }

  hasChild = (_: number, node: EmarketFlatNode) => node.expandable;
}
