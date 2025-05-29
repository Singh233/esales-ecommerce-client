const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1";

export interface Product {
  _id: string;
  title: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  quantity: number;
  colors: string[];
  sizes: string[];
  rating: {
    rate: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  message: string;
  product?: T;
}

export const getProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status}`);
  }

  const data: ApiResponse<Product> = await response.json();

  if (!data.product) {
    throw new Error("Product not found in response");
  }

  return data.product;
};
