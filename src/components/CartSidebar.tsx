"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "~/lib/redux/store";
import {
  removeFromCart,
  updateItemQuantity,
  clearCart,
} from "~/lib/redux/features/cartSlice";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function CartSidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalItems, totalAmount } = useAppSelector(
    (state) => state.cart
  );

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    dispatch(updateItemQuantity({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Your cart is empty
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </div>
          <Badge variant="secondary">{totalItems} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-3 border rounded-lg"
            >
              {/* Product Image */}
              <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized={item.image === "/placeholder-image.svg"}
                  />
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.brand}</p>
                {item.selectedColor && (
                  <p className="text-xs text-muted-foreground">
                    Color: {item.selectedColor}
                  </p>
                )}
                {item.selectedSize && (
                  <p className="text-xs text-muted-foreground">
                    Size: {item.selectedSize.toUpperCase()}
                  </p>
                )}
                <p className="text-sm font-semibold">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Cart Actions */}
        <div className="space-y-2">
          <Button className="w-full" onClick={() => router.push("/checkout")}>
            Proceed to Checkout
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearCart}
          >
            Clear Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
