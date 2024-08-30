// import { Component, OnInit } from '@angular/core';
// import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { SignupComponent } from '../signup/signup.component';
// import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
// import { LoginComponent } from '../login/login.component';
// import { Router } from '@angular/router';
// import { UserService } from '../services/user.service';
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss']
// })
// export class HomeComponent implements OnInit {

//   constructor(private dialog:MatDialog,
//     private router:Router,
//     private userService: UserService,
//   //new  
//   private authService: AuthService // Inject AuthService

// ) { }



//   ngOnInit(): void {
//     if (this.authService.isAuthenticated()) {
//       this.userService.checkToken().subscribe((response: any) => {
//         const role = this.authService.getUserRole();
//         if (role === 'admin') {
//           this.router.navigate(['/cafe/dashboard']); // Admin dashboard
//         } else if (role === 'user') {
//           this.router.navigate(['/cafe/userdashboard']); // User dashboard
//         } else {
//           this.router.navigate(['/']); // Default route
//         }
//       }, (error: any) => {
//         console.log(error);
//       });
//     }
//   }




//   signupAction(){
//     const dilogConfig = new MatDialogConfig();
//     dilogConfig.width = "550px";
//     this.dialog.open(SignupComponent,dilogConfig);
//   }

//   forgotPasswordAction(){
//   const dilogConfig = new MatDialogConfig();
//   dilogConfig.width = "550px";
//   this.dialog.open(ForgotPasswordComponent,dilogConfig);
//   }

//   loginAction(){
//     const dilogConfig = new MatDialogConfig();
//     dilogConfig.width = "550px";
//     this.dialog.open(LoginComponent,dilogConfig);

//   }


// }


import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) { }

  // ngOnInit(): void {
  //   if (this.authService.isAuthenticated()) {
  //     this.userService.checkToken().subscribe((response: any) => {
  //       const role = this.authService.getUserRole();
  //       if (role === 'admin') {
  //         this.router.navigate(['/cafe/dashboard']); // Admin dashboard
  //       } else {
  //         this.router.navigate(['/cafe/userdashboard']); // User dashboard
  //       }
  //     }, (error: any) => {
  //       console.log(error);
  //       localStorage.clear();
  //       this.router.navigate(['/']); // Default route if token is invalid
  //     });
  //   }
  // }


  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.userService.checkToken().subscribe((response: any) => {
        const role = this.authService.getUserRole();
        if (role === 'admin') {
          this.router.navigate(['/cafe/dashboard']); // Admin dashboard
        } else if (role === 'user') {
          this.router.navigate(['/cafe/userdashboard']); // User dashboard
        } else {
          this.router.navigate(['/cafe/userdashboard']); // Default route
        }
      }, (error: any) => {
        console.log(error);
      });
    } else {
      // If no token, assume user and navigate to user dashboard
      this.router.navigate(['/cafe/userdashboard']);
    }
  }
  

  signupAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(SignupComponent, dialogConfig);
  }

  forgotPasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }

  loginAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(LoginComponent, dialogConfig);
  }
}
