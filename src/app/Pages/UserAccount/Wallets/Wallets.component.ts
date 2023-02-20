import { Component, OnInit, Input, ViewChild, QueryList } from '@angular/core';
import { Wallet, WalletTrans, User, Language, WalletTransDTO } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
declare var Stripe: any;

@Component({
  selector: 'app-wallets',
  templateUrl: './Wallets.component.html',
  styleUrls: ['./Wallets.component.scss']
})
export class WalletsComponent extends BaseComponent implements OnInit {

  wallets: Wallet[] = [];
  sWallet: Wallet;
  walletTrans: WalletTrans;
  error: string;
  errors: string;
  messages = '';
  fromAdmin = false;
  @Input()
  userId;
  step = 1;

  // Credit card variables
  stripe: any;
  data: any;

  constructor(public appService: AppService, public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {

    if (this.userId === undefined) {
      this.userId = Number(this.appService.tokenStorage.getUserId());
    } else {
      this.fromAdmin = true;
    }
    this.getWallets();

  }

  ngAfterViewInit() {

  }

  private getWallets() {
    const parameters: string[] = [];
    parameters.push('e.status = |walletStatus|1|Integer');
    parameters.push('e.user.id = |userId|' + this.appService.tokenStorage.getUserId() + '|Integer');

    this.appService.getAllByCriteria('Wallet', parameters)
      .subscribe((data: Wallet[]) => {
        this.wallets = data;
      },
        error => console.log(error),
        () => console.log('Get all wallet complete'));
  }


  addCash(wallet: Wallet) {
    this.messages = '';
    wallet.modBy = +this.appService.tokenStorage.getUserId();
    this.walletTrans = new WalletTrans();
    this.walletTrans.currency = wallet.currency;
    this.walletTrans.wallet = wallet;
    this.walletTrans.walletTransType = 'CD';

  }

  addWallet() {
    this.messages = '';
    this.sWallet = new Wallet();
    this.sWallet.user = new User();
    this.sWallet.user.id = +this.appService.tokenStorage.getUserId();
    this.sWallet.createBy = +this.appService.tokenStorage.getUserId();
    this.sWallet.modBy = +this.appService.tokenStorage.getUserId();
    this.walletTrans = new WalletTrans();
    this.walletTrans.wallet = this.sWallet;
    this.walletTrans.walletTransType = 'CD';

  }

  saveWalletTrans() {
    this.walletTrans.createBy = +this.appService.tokenStorage.getUserId();
    this.walletTrans.modBy = +this.appService.tokenStorage.getUserId();
    this.walletTrans.language = new Language();
    this.walletTrans.language = this.appService.appInfoStorage.language;
    this.appService.saveWithUrl('/service/finance/saveWalletTrans',
      this.walletTrans)
      .subscribe((data: WalletTrans) => {
        if (data.id && (data.errors === null || data.errors.length === 0)) {
          this.hasError = false;
          this.walletTrans = null;
          this.messages = '';
          this.getWallets();
        } else {
          this.hasError = true;
          console.log(data);
          this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'MESSAGE.SYSTEM_ERROR', 'MESSAGE.PAYMENT_DECLINED']).subscribe(res => {
            this.messages = res['MESSAGE.SAVE_UNSUCCESS'] + '\n' + (data.errors[0] === 'SYSTEM_ERROR'
              ? res['MESSAGE.SYSTEM_ERROR'] :
              (data.errors[0] === 'PAYMENT_DECLINED' ? res['MESSAGE.PAYMENT_DECLINED'] : data.errors[0])
            );
          });
        }
      },
        error => console.log(error),
        () => console.log('Get purchase order products complete'));
  }

  onTogglePmntMethodChange($event) {
    this.step = 2;
    this.walletTrans.paymentMethodCode = $event.value;
    if ($event.value === 'CREDIT_CARD') {
      setTimeout(() => {
        this.initPaymentMethod();
      }, 0);
    }
  }

  initPaymentMethod() {
    this.appService.getObject('/service/order/stripe-key').toPromise()
      .then(result => {
        return result;
      })
      .then(data => {
        return this.setupElements(data);
      })
      .then(data => {
        this.data = data;
        document.querySelector('button').disabled = false;

        const form = document.getElementById('payment-form');
        form.addEventListener('submit', this.handleCardSave.bind(this));
      });
  }

  setupElements(data) {
    this.stripe = Stripe(data.publishableKey);

    /* ------- Set up Stripe Elements to use in checkout form ------- */
    const elements = this.stripe.elements();
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    const card = elements.create('card', { style: style });
    card.mount('#card-element');

    return {
      stripe: this.stripe,
      card: card,
      clientSecret: data.clientSecret
    };
  }

  handleCardSave(event) {
    this.messages = '';
    this.hasError = false;
    if (!this.walletTrans.currency || !this.walletTrans.amount) {
      this.messages = 'Currency and Amount are required';
      this.hasError = true;
      return;
    }

    event.preventDefault();
    this.saveCard(this.data.stripe, this.data.card, this.data.clientSecret);
  }

  /*
  * Collect card details and pay for the order
  */
  saveCard(stripe, card, clientSecret) {
    this.errors = '';
    stripe
      .createPaymentMethod('card', card)
      .then(result => {
        if (result.error) {
          this.translate.get(['MESSAGE.INVALID_CARD', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.INVALID_CARD'];
          });
          this.messages = result.error;
          this.hasError = true;
        } else {
          this.walletTrans.paymentMethodCode = 'CREDIT_CARD';
          this.walletTrans.stripePaymentMethodId = result.paymentMethod.id;
          this.saveWalletTrans();
        }
      })
      .then(function (result) {
        console.log(result);
        if (result) {
          return result.json();
        }
      })
      .then(function (response) {
        if (response && response.error) {
          // showError(response.error);
        } else if (response && response.requiresAction) {
          // Request authentication
          // handleAction(response.clientSecret);
        } else {
          // orderComplete(response.clientSecret);
        }
      });
  }


}
