export interface Product {
  id: {
    timestamp: number;
    machine: number;
    pid: number;
    increment: number;
    creationTime: string;
  };
  name: string;
  imageUrl?: string;
  description?: string;
  price: number;
  stock: number;
  tagId?: string;
}
