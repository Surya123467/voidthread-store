export type ProductStatus = "draft" | "active" | "archived";

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  stockQuantity: number;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  position: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  story: string;
  priceInPaise: number;
  compareAtPriceInPaise?: number;
  status: ProductStatus;
  collection: string;
  featured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
};

export type CartLine = {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  unitPriceInPaise: number;
};
