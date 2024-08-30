
import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: any = UntypedFormGroup;
  responseMessage: any;
  @Output() onEditUser = new EventEmitter();
  action: string;
  dialogData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) { 
    this.action = data?.action || 'Signup'; // Default to 'Signup' if action is not provided
    this.dialogData = data?.data || {}; // Default to an empty object if no data is provided
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [this.dialogData?.name || null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [this.dialogData?.email || null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [this.dialogData?.contactNumber || null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      // password: [null, this.action === 'Edit' ? null : Validators.required] 
      password: [null, this.action !== 'Edit' ? Validators.required : null]
    });
  }

  handleSubmit() {
    this.ngxService.start();
    const formData = this.signupForm.value;

    if (this.action === 'Edit') {
      this.editUser(formData);
    } else {
      this.signupUser(formData);
    }
  }

  signupUser(formData: any) {
    const data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    };

    this.userService.signup(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "");
      },
      (error) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
  }

  editUser(formData: any) {
    const data = {
      id: this.dialogData.id,
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
 
    };
    console.log('Data to update:', data); 
    this.userService.update(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.onEditUser.emit();  // Emit event for successful edit
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
      },
      (error: any) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
  }

  handleError(error: any) {
    if (error.error?.message) {
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  }
}



















// import { Component, OnInit , Inject , EventEmitter, Output} from '@angular/core';
// import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { UserService } from '../services/user.service';
// import { SnackbarService } from '../services/snackbar.service';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { GlobalConstants } from '../shared/global-constants';

// @Component({
//   selector: 'app-signup',
//   templateUrl: './signup.component.html',
//   styleUrls: ['./signup.component.scss']
// })
// export class SignupComponent implements OnInit {
//   signupForm: any = UntypedFormGroup;
//   responseMessage: any;
//   @Output() onEditUser = new EventEmitter();
//   action: string;
//   dialogData: any;

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private formBuilder: UntypedFormBuilder,
//     private router: Router,
//     private userService: UserService,
//     private snackbarService: SnackbarService,
//     private dialogRef: MatDialogRef<SignupComponent>,
//     private ngxService: NgxUiLoaderService
//   ) { 
//     this.action = data.action;
//     this.dialogData = data.data;
//   }

//   // ngOnInit(): void {
//   //   this.signupForm = this.formBuilder.group({
//   //     name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
//   //     email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
//   //     contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
//   //     password: [null, Validators.required]
//   //   });
//   // }

//   ngOnInit(): void {
//     this.signupForm = this.formBuilder.group({
//       name: [this.dialogData?.name || null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
//       email: [this.dialogData?.email || null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
//       contactNumber: [this.dialogData?.contactNumber || null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
//       password: [null, this.action === 'Edit' ? null : Validators.required]  // Password required only for signup
//     });
//   }



//   handleSubmit() {
//     this.ngxService.start();
//     const formData = this.signupForm.value;
    
//     if (this.action === 'Edit') {
//       this.editUser(formData);
//     } else {
//       this.signupUser(formData);
//     }
//   }

//   signupUser(formData: any) {
//     const data = {
//       name: formData.name,
//       email: formData.email,
//       contactNumber: formData.contactNumber,
//       password: formData.password
//     };
    
//     this.userService.signup(data).subscribe(
//       (response: any) => {
//         this.ngxService.stop();
//         this.dialogRef.close();
//         this.responseMessage = response?.message;
//         this.snackbarService.openSnackBar(this.responseMessage, "");
//         this.router.navigate(['/']);
//       },
//       (error) => {
//         this.ngxService.stop();
//         this.handleError(error);
//       }
//     );
//   }

//   editUser(formData: any) {
//     const data = {
//       id: this.dialogData.id,
//       name: formData.name,
//       email: formData.email,
//       contactNumber: formData.contactNumber,
//       password: formData.password
//     };
    
//     this.userService.update(data).subscribe(
//       (response: any) => {
//         this.ngxService.stop();
//         this.dialogRef.close();
//         this.onEditUser.emit();  // Emit event for successful edit
//         this.responseMessage = response?.message;
//         this.snackbarService.openSnackBar(this.responseMessage, "success");
//       },
//       (error) => {
//         this.ngxService.stop();
//         this.handleError(error);
//       }
//     );
//   }

//   handleError(error: any) {
//     if (error.error?.message) {
//       this.responseMessage = error.error?.message;
//     } else {
//       this.responseMessage = GlobalConstants.genericError;
//     }
//     this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
//   }
// }

















//   handleSubmit() {
//     this.ngxService.start();
//     var formData = this.signupForm.value;
//     var data = {
//       name: formData.name,
//       email: formData.email,
//       contactNumber: formData.contactNumber,
//       password: formData.password
//     };
//     this.userService.signup(data).subscribe(
//       (response: any) => {
//         this.ngxService.stop();
//         this.dialogRef.close();
//         this.responseMessage = response?.message;
//         this.snackbarService.openSnackBar(this.responseMessage, "");
//         this.router.navigate(['/']);
//       },
//       (error) => {
//         this.ngxService.stop();
//         if (error.error?.message) {
//           this.responseMessage = error.error?.message;
//         } else {
//           this.responseMessage = GlobalConstants.genericError;
//         }
//         this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
//       }
//     );
//   }
// }

















// import { Component, OnInit } from '@angular/core';
// import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { UserService } from '../services/user.service';
// import { SnackbarService } from '../services/snackbar.service';
// import { MatDialogRef } from '@angular/material/dialog';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { GlobalConstants } from '../shared/global-constants';


// @Component({
//   selector: 'app-signup',
//   templateUrl:'./signup.component.html',
//   styleUrls: ['./signup.component.scss']
// })
// export class SignupComponent implements OnInit{
//   signupForm :any = UntypedFormGroup;
//   responseMessage:any;  

//   constructor(private formBuilder:UntypedFormBuilder,
//     private router:Router,
//     private userService:UserService,
//     private snackbarService:SnackbarService,
//     private dialogRef:MatDialogRef<SignupComponent>,
//     private ngxService: NgxUiLoaderService) { }

//   ngOnInit(): void {
//     this.signupForm = this.formBuilder.group({
//       name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
//       email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
//       contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
//       password:[null,[Validators.required]],

//     })
//   }
//   handleSubmit(){
//     this.ngxService.start();
//     var formData = this.signupForm.value;
//     var data ={
//       name: formData.name,
//       email: formData.email,
//       contactNumber:formData.contactNumber,
//       password: formData.password
//     }
//     this.userService.signup(data).subscribe((response:any)=>{
//       this.ngxService.stop();
//       this.dialogRef.close();
//       this.responseMessage= response?.message;
//       this.snackbarService.openSnackBar(this.responseMessage,"");
//       this.router.navigate(['/']);
//     },(error)=>{
//       this.ngxService.stop();
//       if(error.error?.message)
//       {
//         this.responseMessage =error.error?.message;
//       }
//       else {
//         this.responseMessage =GlobalConstants.genericError;
//       }
//       this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
//     })
//   }

// }
