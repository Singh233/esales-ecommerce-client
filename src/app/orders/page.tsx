"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useRouter } from "next/navigation";
import { getUserOrders, type Order } from "~/lib/api";
import {
  Loader2,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OrdersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-orders", currentPage],
    queryFn: () =>
      getUserOrders({
        page: currentPage,
        limit: pageSize,
        sortBy: "createdAt:desc",
      }),
  });

  const formatDate = (dateString: string) => {
    console.log(dateString);
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "default";
      case "shipped":
        return "secondary";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "outline";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading your orders...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-lg text-red-600 mb-4">
                  Failed to load your orders
                </p>
                <p className="text-gray-600 mb-6">
                  {error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"}
                </p>
                <div className="space-x-4">
                  <Button onClick={() => refetch()}>Try Again</Button>
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!ordersData?.results || ordersData.results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-4">No orders found</p>
                <p className="text-gray-600 mb-6">
                  You haven&apos;t placed any orders yet. Start shopping to see
                  your orders here.
                </p>
                <Link href="/" className="inline-block">
                  <Button>Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">
              {ordersData.totalResults}{" "}
              {ordersData.totalResults === 1 ? "order" : "orders"} found
            </p>
          </div>

          <div className="space-y-6">
            {ordersData.results.map((order: Order) => (
              <Card
                key={order.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex md:items-center justify-between gap-4 md:flex-row flex-col">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold">
                        Order {order.orderNumber}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          {formatCurrency(order.totalAmount || 0)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        Shipping Status: {order.status}
                      </Badge>
                      <Badge
                        variant={getPaymentStatusBadgeVariant(
                          order.paymentStatus
                        )}
                      >
                        Payment Status: {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Items Ordered
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => {
                        const product =
                          typeof item.product === "object"
                            ? item.product
                            : null;
                        return (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            {product?.images?.[0] && (
                              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white flex-shrink-0">
                                <Image
                                  src={product.images[0]}
                                  alt={product.title || "Product"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {product?.title || "Product"}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span>Qty: {item.quantity}</span>
                                {item.color && <span>Color: {item.color}</span>}
                                {item.size && <span>Size: {item.size}</span>}
                              </div>
                            </div>
                            <div className="text-left sm:text-right mt-2 sm:mt-0 w-full sm:w-auto">
                              <p className="font-semibold">
                                {formatCurrency(item.price)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                each
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contact and Shipping Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                        Contact Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {order.contact.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {order.contact.phone}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                        Shipping Address
                      </h4>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p>{order.contact.name}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {ordersData.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {ordersData.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === ordersData.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
