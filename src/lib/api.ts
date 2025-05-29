const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1";

export interface Product {
  id: string;
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

export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
  color?: string | null;
  size?: string | null;
}

export interface OrderData {
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export const createOrder = async (orderData: OrderData): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create order: ${response.status}`);
  }

  const data = await response.json();
  return data.order || data;
};

export interface PaginatedOrders {
  results: Order[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface GetUserOrdersOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  status?: string;
  paymentStatus?: string;
}

export const getUserOrders = async (
  options: GetUserOrdersOptions = {}
): Promise<PaginatedOrders> => {
  const queryParams = new URLSearchParams();

  if (options.page) queryParams.append("page", options.page.toString());
  if (options.limit) queryParams.append("limit", options.limit.toString());
  if (options.sortBy) queryParams.append("sortBy", options.sortBy);
  if (options.status) queryParams.append("status", options.status);
  if (options.paymentStatus)
    queryParams.append("paymentStatus", options.paymentStatus);

  const response = await fetch(
    `${API_BASE_URL}/orders/user-orders?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user orders: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
