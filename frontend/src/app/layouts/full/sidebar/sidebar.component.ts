import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import {jwtDecode} from 'jwt-decode';
import { MenuItems, Menu } from 'src/app/shared/menu-items';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class AppSidebarComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  token: string | null = localStorage.getItem('token');
  tokenPayload: any;
  filteredMenuItems: Menu[] = [];
  private tokenSubscription!: Subscription;

  private _mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private menuItemsService: MenuItems,
    private authService: AuthService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.updateMenuItems();
  }

  ngOnInit(): void {
    this.tokenSubscription = this.authService.getTokenObservable().subscribe(token => {
      console.log('Token changed:', token); // Debug log
      this.token = token;
      this.updateMenuItems();
      this.changeDetectorRef.detectChanges(); // Ensure changes are detected
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }

  private updateMenuItems(): void {
    if (this.token) {
      try {
        this.tokenPayload = jwtDecode(this.token);
        console.log('Token Payload:', this.tokenPayload); // Debug log
      } catch (error) {
        console.error('Error decoding token:', error);
        this.tokenPayload = {}; // Fallback to an empty object if decoding fails
      }
    } else {
      this.tokenPayload = {}; // Fallback if no token is present
    }

    console.log('User Role:', this.tokenPayload.role); // Debug log
    this.filteredMenuItems = this.menuItemsService.getMenuitem(this.tokenPayload.role);
  }
}


