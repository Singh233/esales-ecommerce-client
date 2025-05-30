"use client";

import { LogOut, Menu, X, ShoppingCart, Home, Package } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useAppSelector, useAppDispatch } from "~/lib/redux/store";
import { useSession, authClient } from "~/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "~/lib/api";
import { setCartFromAPI, clearCart } from "~/lib/redux/features/cartSlice";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const totalItems = useAppSelector((state) => state.cart.totalItems);
  const dispatch = useAppDispatch();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch cart data when user is authenticated
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!session?.user, // Only fetch when user is authenticated
    retry: 1,
    refetchOnWindowFocus: true,
  });

  // Sync cart data with Redux store when cart data changes
  useEffect(() => {
    if (cartData && session?.user) {
      dispatch(setCartFromAPI(cartData));
    }
  }, [cartData, session?.user, dispatch]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      dispatch(clearCart());
      toast.success("Successfully signed out");
      router.refresh();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo on the left */}
          <Link className="flex items-center space-x-2 cursor-pointer" href="/">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              E
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              ESales
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href={"/"}
              className="relative text-gray-600 flex items-center gap-2 p-2 text-xs font-semibold rounded-sm hover:bg-gray-100 transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
              <span className="sr-only">Home</span>
            </Link>

            <Link
              href={"/orders"}
              className="relative text-gray-600  flex items-center gap-2 p-2 text-xs font-semibold rounded-sm hover:bg-gray-100 transition-colors"
            >
              <Package className="h-4 w-4" />
              Orders
              <span className="sr-only">Orders</span>
            </Link>

            <Link
              href={"/cart"}
              className="relative text-gray-600  flex items-center gap-2 p-2 text-xs font-semibold rounded-sm hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-3 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500">
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>
          </div>

          {/* Right side - Authentication and mobile menu */}
          <div className="flex items-center gap-2">
            {/* Cart icon for mobile - shows cart count */}
            <Link
              href="/cart"
              className="md:hidden relative p-2 text-gray-600 hover:bg-gray-100 rounded-sm transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500">
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>

            {/* Authentication Section */}
            {isPending ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            ) : session?.user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden sm:inline truncate max-w-24 lg:max-w-none">
                  {session.user.name || session.user.email}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSignOut}
                  className="h-8 w-8"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/sign-in" className="hidden sm:block">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm" className="text-xs sm:text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="py-4 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              <Link
                href="/orders"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package className="h-4 w-4" />
                Orders
              </Link>

              {!session?.user && (
                <Link
                  href="/auth/sign-in"
                  className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors sm:hidden"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
