import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/app/app.models';
import { Router } from '@angular/router';
import { TokenStorage } from 'src/app/token.storage';
import { AppService } from 'src/app/Services/app.service';
import { emailValidator, matchingPasswords } from 'src/app/Global/utils/app-validators';

@Component({
  selector: 'embryo-ForgotPassword',
  templateUrl: './ForgotPassword.component.html',
  styleUrls: ['./ForgotPassword.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public loginForm: FormGroup;
  public hide = true;
  error: '';
  constructor(public fb: FormBuilder,
    public router: Router,
    private tokenStorage: TokenStorage,
    public translate: TranslateService,
    public appService: AppService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, emailValidator])],
    });
  }

  public sendPassword(values: User) {
    try {
      console.log(values);
      const user: User = values;
      user.type = 'User';
      console.log(user);
      if (user.email) {
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
