"use client";

import { ShoppingCart, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useAppSelector } from "~/lib/redux/store";
import Link from "next/link";

export default function Header() {
  const totalItems = useAppSelector((state) => state.cart.totalItems);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo placeholder on the left */}
          <Link className="flex items-center space-x-2 cursor-pointer" href="/">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              E
            </div>
            <span className="text-xl font-bold tracking-tight">ESales</span>
          </Link>

          {/* Navigation items could go here in the center */}
          <div className="flex-1" />

          {/* Cart and User icons on the right */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}

            <Link
              href={"/checkout"}
              className="relative bg-gray-200 p-2 rounded-sm hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>

            {/* User Button */}
            <Link
              href={"/profile"}
              className="relative bg-gray-200 p-2 rounded-sm hover:bg-gray-100 transition-colors"
            >
              <User className="h-4 w-4" />
              <span className="sr-only">User account</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
