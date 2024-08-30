import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from '../shared/global-constants';
import { error } from 'console';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm:any = UntypedFormGroup;
  responseMessage : any ;


  constructor(private formBuilder:UntypedFormBuilder,
    private userService:UserService,
    private snackbarService:SnackbarService,
    private dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService) { }
 
   

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
       email : [null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]]

    });
  }


handleSubmit(){
  this.ngxService.start();
  var formData = this.forgotPasswordForm.value;
  var data ={
    email : formData.email
  }
this.userService.forgotPassword(data).subscribe((response:any)=>{
this.ngxService.stop();
this.responseMessage = response?.message;
this.dialogRef.close();
this.snackbarService.openSnackBar(this.responseMessage,"");
},(error)=>{
  this.ngxService.stop();
  if(error.error?.message){
     this.responseMessage = error.error?.message;
  }
  else{
    this.responseMessage = GlobalConstants.genericError;
  }
  this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
   })
}
}
