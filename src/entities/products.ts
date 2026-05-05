export interface Product {
  id: string;
  name: string;
  marketplace: string;
  marketplaceLink: string;
  category: string;
  imageUrl: string;
  minPrice: string | null;
  maxPrice: string | null;
  createdAt?: Date;
  updatedAt?: Date | null;
}
