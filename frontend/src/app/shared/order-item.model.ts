export interface OrderItem {
    id: number;
    name: string;
    // category: string;
    category: { id: number; name: string }; // Adjust to match the actual structure
    price: number;
    quantity: number;
    total: number;
  }