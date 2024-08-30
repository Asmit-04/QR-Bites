export interface Category {
    id: number;
    name: string;

    // Add other properties as needed
  }
  
  export interface Product {
    id: number;
    name: string;
    categoryid: number;  // If it stores only the ID
    price: number;
    // Add other properties as needed
  }