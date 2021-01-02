import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenStorage } from 'src/app/token.storage';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { User } from 'src/app/app.models';

@Component({
  selector: 'app-sign-in',
  templateUrl: './CommonSignIn.component.html',
  styleUrls: ['./CommonSignIn.component.scss']
})
export class CommonSignInComponent implements OnInit {

  public loginForm: FormGroup;
  public hide = true;
  error: '';

  @Input()
  fromPage = '';

  constructor(public fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorage,
    public translate: TranslateService,
    public appService: AppService) {

    this.route.params.subscribe(() => {
      this.route.queryParams.forEach(queryParams => {
        this.fromPage = queryParams['fromPage'];
        console.log('from page : ' + this.fromPage);
      });
    });

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      rememberMe: false
    });
  }

  public onLoginFormSubmit(): void {
    if (this.loginForm.valid) {
      this.router.navigate(['/']);
    }
  }


  public login(values: any) {
    if (this.loginForm.valid) {
      const user: User = new User();
      user.userName = this.loginForm.controls.userName.value;
      user.password = this.loginForm.controls.password.value;
      try {
        this.error = ''
        user.lang = this.translate.currentLang;
        // console.log('Current lang=' + this.translate.currentLang);

        this.appService.authenticate(user)
          .subscribe(data => {
            // console.log(data);
            if (data.token !== '' && data.token !== null) {
              console.log('login successful');
              this.tokenStorage.saveAuthData(data);
              this.appService.updateToken();

              if (this.fromPage === 'checkout') {
                this.router.navigate(['/checkout/payment']);
                return;
              } else if (this.fromPage) {
                this.router.navigate([this.fromPage]);
              }

              if (this.appService.tokenStorage.getRole() === '1') {// client
                this.router.navigate(['/account/client-dashboard']);
              } else if (this.appService.tokenStorage.getRole() === '2') { // seller
                this.router.navigate(['/account/sales-dashboard']);
              } else if (this.appService.tokenStorage.getRole() === '3') { // admin
                this.router.navigate(['/admin']);
              }
              // this.router.navigate([this.tokenStorage.getHomePage()]);
            } else {
              console.log('login failed');
              this.translate.get(['MESSAGE.INVALID_USER_PASS', 'COMMON.ERROR']).subscribe(res => {
                this.error = res['MESSAGE.INVALID_USER_PASS'];
              });
            }
          });
      } catch (e) {
        console.log('Exception during login...');
        this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
          this.error = res['MESSAGE.ERROR_OCCURRED'];
        });
      }
    }
  }

  public sendPassword() {
    try {
      const user: User = new User();
      user.userName = this.loginForm.controls.userName.value;
      console.log('Sending password for user: ' + user.userName);
      if (user.userName === null || user.userName === '') {
        this.translate.get(['VALIDATION.USER_NAME_REQUIRED', 'COMMON.ERROR']).subscribe(res => {
          this.error = res['VALIDATION.USER_NAME_REQUIRED'];
        });
      } else {
        this.appService.resetPassword(user)
          .subscribe(() => {
            this.translate.get(['MESSAGE.PASSWORD_SENT', 'COMMON.SUCCESS']).subscribe(res => {
              this.error = res['MESSAGE.PASSWORD_SENT'];
            })
          });
      }
    } catch (e) {
      this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
        this.error = res['MESSAGE.ERROR_OCCURRED'];
      });
    }
  }

}
