import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialogRef , MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { AuthService } from '../services/auth.service';
import {jwtDecode} from 'jwt-decode';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, Validators.required]
    });
  }

  handleSubmit() {
    this.ngxService.start();
    const formData = this.loginForm.value;
    const data = {
      email: formData.email,
      password: formData.password
    };

    this.userService.login(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.authService.setToken(response.token);
        this.dialogRef.close();

        const tokenPayload: any = jwtDecode(response.token);
        console.log('Login response:', response); // Debug log
        console.log('User role:', tokenPayload.role); // Debug log

        if (tokenPayload.role === 'admin') {
          console.log('Navigating to admin dashboard'); // Debug log
          this.router.navigate(['/cafe/dashboard']); // Admin dashboard route
        } else {
          console.log('Navigating to user dashboard'); // Debug log
          this.router.navigate(['/cafe/userdashboard']); // User dashboard route
        }
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }


  forgotPasswordAction(event: Event) {
    event.preventDefault(); // Prevent the default anchor behavior
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }
  
}









