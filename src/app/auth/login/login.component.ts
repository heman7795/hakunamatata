import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment'
import { ToastrService } from 'ngx-toastr';

import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  submitted: boolean;
  returnUrl: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private LoginService: AuthService,
    private route: ActivatedRoute,
    private toaster: ToastrService

  ) { }
  emailandphonepattern = /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/;
  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'admin/dashboard';

    if (sessionStorage.getItem('Authorization')) {
      this.router.navigateByUrl(this.returnUrl);
    }

    this.loginForm = this.formBuilder.group({
      'email': [
        '',
        Validators.compose(
          [Validators.required,
          Validators.pattern(this.emailandphonepattern)

          ],
        ),
      ],
      'password': [
        '', [Validators.required]]

    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return true;
    }

    var user = JSON.parse(localStorage.getItem('user'))
    if (user != null) {

      if (user.email === this.loginForm.value.email && user.password === this.loginForm.value.password) {
        this.toaster.success('Successfully logedin')
        localStorage.setItem('Authorization', uuidv4())
        this.router.navigate(['admin/user'])
      } else {
        this.toaster.info('username or password incorrect')
      }
    } else {
      this.toaster.error('Please create user to login')
      this.router.navigate(['/signup'])
    }

  }




}
