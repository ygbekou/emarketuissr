import { Component, ViewChild, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DiscountCardTransDTO, DCDetail, DiscountCardDTO } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-admin-discountcard',
  styleUrls: ['AdminDiscountCard.component.scss'],
  templateUrl: 'AdminDiscountCard.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminDiscountCardComponent {
  columnsToDisplay = ['createDate', 'type', 'amount', 'store'];
  dataSource: MatTableDataSource<DiscountCardTransDTO>;
  @ViewChild(MatPaginator, { static: false }) dctPaginator;
  @ViewChild(MatSort, { static: true }) dctSort;

  @Input()
  discountCard: DiscountCardDTO = new DiscountCardDTO();

  dtlCols: string[] = ['name', 'qty', 'fraction', 'earnedPoints'];
  dtlDS: MatTableDataSource<DCDetail>;
  @ViewChild(MatPaginator, { static: false }) dtlPaginator;
  @ViewChild(MatSort, { static: true }) dtlSort;

  @Input()
  isAdmin = true;

  expandedElement: DiscountCardTransDTO | null;

  //
  constructor(public appService: AppService, public translate: TranslateService) {
    //super(translate);
  }

  ngOnInit() {
    //this.getDiscountCardTransList(1);
  }


  getDiscountCardTransList(discountCardId: number) {
    this.dataSource = new MatTableDataSource<DiscountCardTransDTO>([]);
    this.appService.saveWithUrl('/service/finance/getDiscountCardTransList/',
      {
        discountCardId: discountCardId
      })
      .subscribe((data: DiscountCardTransDTO[]) => {

        this.dataSource = new MatTableDataSource<DiscountCardTransDTO>(data);
        this.dataSource.paginator = this.dctPaginator;
        this.dataSource.sort = this.dctSort;

      },
        error => console.log(error),
        () => console.log('Get dicount card trans list complete'));
  }


  getDCDetailList(discountCardTransId: number, transType: string) {
    this.appService.saveWithUrl('/service/finance/getDCTransDetails/',
      {
        discountCardTransId: discountCardTransId,
        transType: transType,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: DCDetail[]) => {

        if (!data) {
          data = [];
        }
        this.dtlDS = new MatTableDataSource<DCDetail>(data);
        this.dtlDS.paginator = this.dtlPaginator;
        this.dtlDS.sort = this.dtlSort;

      },
        error => console.log(error),
        () => console.log('Get dicount card trans details complete'));
  }

  getDetails(element: DiscountCardTransDTO) {
    this.expandedElement = this.expandedElement === element ? null : element;

    this.getDCDetailList(element.id, element.dcTransType);

  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
  }, {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }, {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`
  }, {
    position: 5,
    name: 'Boron',
    weight: 10.811,
    symbol: 'B',
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`
  }, {
    position: 6,
    name: 'Carbon',
    weight: 12.0107,
    symbol: 'C',
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`
  }, {
    position: 7,
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`
  }, {
    position: 8,
    name: 'Oxygen',
    weight: 15.9994,
    symbol: 'O',
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`
  }, {
    position: 9,
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`
  }, {
    position: 10,
    name: 'Neon',
    weight: 20.1797,
    symbol: 'Ne',
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`
  },
];


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */