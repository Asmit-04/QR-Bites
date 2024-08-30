import { Component, OnInit } from '@angular/core';
import { UserDashboardService } from '../services/user-dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute for query params





@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  responseMessage:any;
	data:any;
	ngAfterViewInit() { }

	//new
	images =[
      {name:'main.png', caption :'main'},
//    {name:'slider-2.png', caption :'slider-2'},
	  {name:'slider-21.png', caption :'slider-21'},
	  {name:'BEST.png', caption :'BEST'},

	];



	

  constructor(
    private userDashboardService:UserDashboardService,
    private ngxService:NgxUiLoaderService,
		private snackbarService:SnackbarService,
		private route: ActivatedRoute // Inject ActivatedRoute to access URL query parameters
  ) 
  { 
      this.ngxService.start();
			this.userdashboardData();
  }

  ngOnInit(): void {
	// Extract tableId from URL and store it in local storage
    this.route.queryParams.subscribe(params => {
		const tableId = params['tableId'];
		if (tableId) {
		  localStorage.setItem('tableId', tableId);
		}
	  });

	
  }


  userdashboardData(){
		this.userDashboardService.getDetails().subscribe((response:any)=>{
			this.ngxService.stop();
			this.data= response;
		},(error:any)=>{
          this.ngxService.stop();
		  console.log(error);
		  if(error.error?.message){
			this.responseMessage=error.error?.message;
		  }
		  else{
			this.responseMessage= GlobalConstants.genericError;
		  }
		this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
		})
	}
}



