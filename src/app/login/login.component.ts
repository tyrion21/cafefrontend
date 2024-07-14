import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm:any = FormGroup
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,

  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null,[Validators.required]]
    });
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe(
      (response: any) => {
        console.log('Signup response:', response);
        this.ngxService.stop();
        this.dialogRef.close();
        localStorage.setItem('token', response.token);       
        this.router.navigate(['/cafe/dashboard']);
        // if (typeof response === 'string') {
        //   this.responseMessage = response;
        // } else if (response && typeof response === 'object') {
        //   this.responseMessage = response.message || 'Lo successful!';
        // } else {
        //   this.responseMessage = 'Signup successful!';
        // }
        // this.snackbarService.openSnackBar(this.responseMessage, '');
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
