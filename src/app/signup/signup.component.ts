import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  password = true;
  confirmpassword = true;
  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      phone: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.phoneRegex)],
      ],
      password: [null, [Validators.required]],
      confirmpassword: [null, [Validators.required]],
    });
  }

  validateSubmit() {
    return (
      this.signupForm.controls['password'].value !==
      this.signupForm.controls['confirmpassword'].value
    );
  }

  handleSubmit() {
    this.ngxService.start();
    const formData = this.signupForm.value;
    const data = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
    };
    console.log('Datos Enviados:', data);

    this.userService.signup(data).subscribe(
      (response: any) => {
        console.log('Signup response:', response);
        this.ngxService.stop();
        this.dialogRef.close();
        if (typeof response === 'string') {
          this.responseMessage = response;
        } else if (response && typeof response === 'object') {
          this.responseMessage = response.message || 'Signup successful!';
        } else {
          this.responseMessage = 'Signup successful!';
        }
        this.snackbarService.openSnackBar(this.responseMessage, '');
        this.router.navigate(['/']);
      },
      (error) => {
        this.ngxService.stop();
        let message;
        console.error('Error response:', error);
        if (error.status === 200 && typeof error.error === 'string') {
          // Handle plain text response
          this.responseMessage = error.error;
          message = error.error;
          // } else if (error.error && typeof error.error === 'object') {
          //   this.responseMessage = error.error.message || 'An error occurred. Please try again.';
        } else {
          this.responseMessage = error.error;
          message = error.error;
        }
        this.snackbarService.openSnackBar(this.responseMessage, message);
      }
    );
  }
}
