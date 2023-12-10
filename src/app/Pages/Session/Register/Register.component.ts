import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenStorage } from 'src/app/token.storage';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { User, EmailVerification } from 'src/app/app.models';
import { emailValidator, matchingPasswords } from 'src/app/Global/utils/app-validators';

@Component({
  selector: 'app-register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public emailForm: FormGroup;
  public verificationCodeForm: FormGroup;
  public hide = true;
  error = '';
  message = '';
  fromPage = '';
  verified = false;
  pageStatus = 'verify_email';

  @Output()
  registerEvent = new EventEmitter<any>();

  constructor(public fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorage,
    public snackBar: MatSnackBar,
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

    this.emailForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, emailValidator])],
      confirmEmail: ['', Validators.compose([Validators.required, emailValidator])]
    }, { validator: this.matchingStr('email', 'confirmEmail') });

    this.verificationCodeForm = this.fb.group({
      email: new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required, emailValidator])),
      verificationCode: ['', Validators.required],
      confirmVerificationCode: ['', Validators.required]
    }, { validator: this.matchingStr('verificationCode', 'confirmVerificationCode') }
    );


    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      language: ['', Validators.required],
      sex: ['', Validators.required],
      // userName: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      email: new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required, emailValidator])),
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      receiveNewsletter: true
    }, { validator: matchingPasswords('password', 'confirmPassword') });
  }

  public onRegisterFormSubmit(values: User): void {
    this.message = '';
    this.error = '';
    values.email = this.verificationCodeForm.controls.email.value;
    if (this.registerForm.valid) {
      console.log(values);
      const user: User = values;
      user.type = 'User';
      console.log(user);
      this.appService.saveUserAndLogin(user)
        .subscribe(data => {
          if (data.token === 'E') {
            this.translate.get(['VALIDATION.EMAIL_USED', 'COMMON.ERROR']).subscribe(res => {
              this.error = res['VALIDATION.EMAIL_USED'];
            });
          } else if (data.token === 'S') {
            this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
              this.error = res['MESSAGE.ERROR_OCCURRED'];
            });
          } else {
            this.tokenStorage.saveAuthData(data);
            this.appService.updateToken();

            if (this.registerEvent) {
                this.registerEvent.emit(1);
                return;
              }

            if (this.fromPage === 'checkout') {
              this.router.navigate(['/checkout/payment']);
              return;
            }
            if (this.appService.tokenStorage.getRole() === '1') {// client
              this.router.navigate(['/account/profile']);
            } else if (this.appService.tokenStorage.getRole() === '2') { // seller
              this.router.navigate(['/account/profile']);
            } else if (this.appService.tokenStorage.getRole() === '3') { // admin
              this.router.navigate(['/admin']);
            }
          }
        });
    }
  }

  matchingStr(str1Key: string, str2Key: string) {
    return (group: FormGroup) => {
      const str1 = group.controls[str1Key];
      const str2 = group.controls[str2Key];
      if (str1.value !== str2.value) {
        return str2.setErrors({ mismatchedStrings: true });
      }
    };
  }

  verifyEmail(values: EmailVerification) {
    this.message = '';
    this.error = '';
    values.type = 'EmailVerification';
    let lang = this.appService.navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    values.lang = lang;
    console.log(values);
    if (this.emailForm.valid) {
      this.appService.saveWithUrl('/service/user/forgot/registration/verifyEmail', values)
        .subscribe((data: any) => {
          if (!data.errors || data.errors.length === 0) {
            this.translate.get(['MESSAGE.EMAIL_VERIFICATION_CODE_SENT', 'COMMON.ERROR']).subscribe(res => {
              this.message = res['MESSAGE.EMAIL_VERIFICATION_CODE_SENT'];
            });

            this.verificationCodeForm.setValue(
              {
                email: data.email,
                verificationCode: '',
                confirmVerificationCode: ''
              }
            );
            this.pageStatus = 'verify_code';
          }
        },
          error => console.log(error),
          () => console.log('Verify Email complete'));
    }
  }


  verifyCode(values: EmailVerification) {
    this.message = '';
    this.error = '';
    let lang = this.appService.navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    values.lang = lang;
    values.type = 'EmailVerification';
    values.email = this.emailForm.controls.email.value;
    console.log(values);
    if (this.emailForm.valid) {
      this.appService.saveWithUrl('/service/user/forgot/registration/verifyCode', values)
        .subscribe((data: any) => {
          if (!data.errors || data.errors.length === 0) {
            this.translate.get(['MESSAGE.EMAIL_VERIFICATION_CODE_SENT', 'COMMON.ERROR']).subscribe(res => {
              this.message = res['MESSAGE.EMAIL_VERIFICATION_CODE_SENT'];
            });

            this.registerForm.controls.email.setValue(values.email);
            this.pageStatus = 'submit_registration';
          } else {
            this.translate.get(['MESSAGE.INVALID_VERIFICATION_CODE', 'COMMON.ERROR']).subscribe(res => {
              this.error = res['MESSAGE.INVALID_VERIFICATION_CODE'];
            });
          }
        },
          error => console.log(error),
          () => console.log('Verification code complete'));
    }
  }


  isVerifyEmail() {
    return this.pageStatus === 'verify_email';
  }

  isVerifyCode() {
    return this.pageStatus === 'verify_code';
  }

  isSubmitRegistration() {
    return this.pageStatus === 'submit_registration';
  }

}
