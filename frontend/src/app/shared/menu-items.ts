import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    { state: 'dashboard', name: "Overview", icon: 'dashboard', role: 'admin' },
    { state: 'userdashboard', name: 'Dashboard', icon: 'dashboard', role: '' },
    { state: 'category', name: 'Manage Category', icon: 'category', role: 'admin' },
    { state: 'product', name: 'Manage Products', icon: 'inventory_2', role: 'admin' },
    { state: 'bill', name: 'View Orders', icon: 'import_contacts', role: 'admin' },
    { state: 'get-product', name: 'View Menu', icon: 'inventory_2', role: '' },
    { state: 'user', name: 'View Admins', icon: 'people', role: 'admin' },
    { state: 'order', name: 'Place Order', icon: 'list_alt', role: '' }
];

@Injectable()
export class MenuItems {
  getMenuitem(role?: string): Menu[] {
    return MENUITEMS.filter(menuItem => !menuItem.role || menuItem.role === role);
  }
}









// import { Injectable } from "@angular/core";

// export interface Menu{
//     state:string;
//     name:string;
//     icon:string;
//     role:string;
    
// }

// const MENUITEMS =[
//     {state:'dashboard', name:'Dashboard',icon:'dashboard',role:'admin'},
//     {state:'category', name:'Manage Category',icon:'category',role:'admin'},
//     {state:'product', name:'Manage Product',icon:'inventory_2',role:'admin'},
//      //    ---------- new
//     //  {state:'userdashboard', name:'Dashboard',icon:'dashboard',role:'user'},
//     {state:'userdashboard', name:'Dashboard',icon:'dashboard',role:''},
//     {state:'bill', name:'View Orders',icon:'import_contacts',role:'admin'},
//     {state:'get-product', name:'View Menu',icon:'inventory_2',role:''},
//     {state:'user', name:'View User',icon:'people',role:'admin'},
//     {state:'order', name:'Place Order',icon:'list_alt',role:''}

  
// ];


// @Injectable()
// export class MenuItems {
//      getMenuitem(): Menu[] {
//         return MENUITEMS;
//      }
// }