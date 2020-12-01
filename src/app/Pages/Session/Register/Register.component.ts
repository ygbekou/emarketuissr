import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenStorage } from 'src/app/token.storage';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { User } from 'src/app/app.models';
import { emailValidator, matchingPasswords } from 'src/app/Global/utils/app-validators';

@Component({
  selector: 'app-register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public hide = true;
  error = '';
  fromPage = '';
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
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      sex: ['', Validators.required],
      // userName: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      receiveNewsletter: true
    }, { validator: matchingPasswords('password', 'confirmPassword') });
  }

  public onRegisterFormSubmit(values: User): void {
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

}
