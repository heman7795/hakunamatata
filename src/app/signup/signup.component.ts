import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registerForm: any;
  emailandphonepattern = /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/;
  submitted: boolean;
  constructor( private formBuilder: FormBuilder,private toastr: ToastrService, private router:Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      'firstName':['',[Validators.required]],
      'email': [
        '',
        Validators.compose(
          [Validators.required,
          Validators.pattern(this.emailandphonepattern)

          ],
        ),
      ],
      'password': [
        '',
        Validators.compose(
          [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/), Validators.minLength(6), Validators.maxLength(15)],
        ),
      ],
      
    });
  }
  get f() { return this.registerForm.controls; }




    onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }
       localStorage.setItem('user',JSON.stringify(this.registerForm.value))
      // display form values on success
      this.toastr.success("Successfully SignedUp", 'successs')
      this.router.navigate(['/login'])
      
  }
  
  


}
