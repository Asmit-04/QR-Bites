import { Component, OnInit,EventEmitter } from '@angular/core';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { SignupComponent } from 'src/app/signup/signup.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  displayedColumns:string[] = ['name','email','contactNumber','status'];
  dataSource:any;
  responseMessage:any;
  onEditUser = new EventEmitter();
  // userForm :any = UntypedFormGroup;


  constructor( private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService,
    private userService:UserService,
    private dialog:MatDialog,) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }


  tableData(){
    this.userService.getUsers().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    },(error:any)=>{
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

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  handleChangeAction(status:any,id:any){
   this.ngxService.start();
    var data = {
      status:status.toString(),
      id:id
    }
    this.userService.updateStatus(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage=response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
        }
        else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
      })
      }


//new

handleDeleteAction(values:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data={
    message : 'delete '+values.name+' user'
  };
  const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
  const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteUser(values.id);
      dialogRef.close();
  })
}

deleteUser(id:any){
  this.userService.delete(id).subscribe((response:any)=>{    
    this.ngxService.stop();
    this.tableData();
    this.responseMessage = response?.message;
    this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{ 
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
          this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
}

// openSignupDialog(): void {
//   this.dialog.open(SignupComponent, {
//     width: '400px' // Adjust the width as needed
//   });
// }

// Open dialog for adding a new user
openSignupDialog(action: string, data?: any): void {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '400px'; // Adjust the width as needed
  dialogConfig.data = {
    action: action,
    data: data // Pass the data for editing if provided
  };
  
  const dialogRef = this.dialog.open(SignupComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(() => {
    this.tableData(); // Refresh the table data after closing the dialog
  });
}



handleEditAction(values: any) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    action: 'Edit', // Ensure this is set
    data: values     // This should contain the user data being edited
  };
  dialogConfig.width = "850px";
  const dialogRef = this.dialog.open(SignupComponent, dialogConfig);

  dialogRef.componentInstance.onEditUser.subscribe(
    () => {
      this.tableData();
    }
  );
}



}
