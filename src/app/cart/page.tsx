"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "~/lib/auth-client";
import { useAppSelector, useAppDispatch } from "~/lib/redux/store";
import {
  removeFromCart,
  updateItemQuantity,
  setCartFromAPI,
} from "~/lib/redux/features/cartSlice";
import {
  getCart,
  removeCartItem,
  updateCartItem,
  clearCart as clearCartAPI,
} from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { items, totalItems, totalAmount } = useAppSelector(
    (state) => state.cart
  );

  const [isClearing, setIsClearing] = useState(false);

  // Fetch cart data from API when user is authenticated
  const { data: cartData, isLoading: isLoadingCart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!session?.user,
    retry: 1,
    refetchOnWindowFocus: true,
  });

  // Mutation for removing items from cart
  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: (updatedCart) => {
      dispatch(setCartFromAPI(updatedCart));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: (error: Error) => {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item. Please try again.");
    },
  });

  // Mutation for updating item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: (updatedCart) => {
      dispatch(setCartFromAPI(updatedCart));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity. Please try again.");
    },
  });

  // Mutation for clearing cart
  const clearCartMutation = useMutation({
    mutationFn: clearCartAPI,
    onSuccess: (clearedCart) => {
      dispatch(setCartFromAPI(clearedCart));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared successfully");
      setIsClearing(false);
    },
    onError: (error: Error) => {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart. Please try again.");
      setIsClearing(false);
    },
  });

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (!session?.user) {
      // For unauthenticated users, update Redux store only
      dispatch(updateItemQuantity({ itemId, quantity: newQuantity }));
      return;
    }

    // Find the actual item ID from the cart data for API call
    const cartItem = cartData?.items.find((item) => {
      const reduxItemId = `${item.product.id}-${item.color || "default"}-${
        item.size || "default"
      }`;
      return reduxItemId === itemId;
    });

    if (cartItem) {
      updateQuantityMutation.mutate({
        itemId: cartItem._id,
        quantity: newQuantity,
      });
    } else {
      // Fallback to Redux update
      dispatch(updateItemQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (!session?.user) {
      // For unauthenticated users, update Redux store only
      dispatch(removeFromCart(itemId));
      return;
    }

    // Find the actual item ID from the cart data for API call
    const cartItem = cartData?.items.find((item) => {
      const reduxItemId = `${item.product.id}-${item.color || "default"}-${
        item.size || "default"
      }`;
      return reduxItemId === itemId;
    });

    if (cartItem) {
      removeItemMutation.mutate(cartItem._id);
    } else {
      // Fallback to Redux update
      dispatch(removeFromCart(itemId));
    }
  };

  const handleClearCart = () => {
    setIsClearing(true);

    clearCartMutation.mutate();
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    router.push("/checkout");
  };

  if (isLoadingCart && session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading cart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <p className="text-muted-foreground">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your
                  cart
                </p>
              </div>
            </div>
            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={isClearing}
              >
                {isClearing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cart
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Empty Cart State */}
          {items.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-semibold mb-4">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-8">
                  Looks like you haven&apos;t added anything to your cart yet.
                  Start shopping to fill it up!
                </p>
                <Link href="/">
                  <Button size="lg">Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized={
                                item.image === "/placeholder-image.svg"
                              }
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingCart className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold truncate">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.brand}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={removeItemMutation.isPending}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Variants */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.selectedColor && (
                              <Badge variant="secondary" className="text-xs">
                                Color: {item.selectedColor}
                              </Badge>
                            )}
                            {item.selectedSize && (
                              <Badge variant="secondary" className="text-xs">
                                Size: {item.selectedSize.toUpperCase()}
                              </Badge>
                            )}
                          </div>

                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  item.quantity <= 1 ||
                                  updateQuantityMutation.isPending
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={updateQuantityMutation.isPending}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({totalItems} items)</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>Calculated at checkout</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span>${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={items.length === 0}
                      >
                        Proceed to Checkout
                      </Button>
                      <Link href="/" className="block">
                        <Button variant="outline" className="w-full">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground pt-4 border-t">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Secure checkout</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
