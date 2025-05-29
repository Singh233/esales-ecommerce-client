"use client";

import { LogOut } from "lucide-react";
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
import { useEffect } from "react";

export default function Header() {
  const totalItems = useAppSelector((state) => state.cart.totalItems);
  const dispatch = useAppDispatch();
  const { data: session, isPending } = useSession();
  const router = useRouter();

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
      dispatch(clearCart()); // Clear cart when user signs out
      toast.success("Successfully signed out");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

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
          <div className="flex items-center gap-2">
            <Link
              href={"/"}
              className="relative text-gray-600 flex items-center gap-2 p-2 text-xs font-semibold rounded-sm hover:bg-gray-100 transition-colors"
            >
              {/* <ShoppingCart className="h-4 w-4" /> */}
              Home
              <span className="sr-only">Home</span>
            </Link>

            <Link
              href={"/orders"}
              className="relative text-gray-600  flex items-center gap-2 p-2 text-xs font-semibold rounded-sm hover:bg-gray-100 transition-colors"
            >
              {/* <ShoppingCart className="h-4 w-4" /> */}
              Orders
              <span className="sr-only">Orders</span>
            </Link>

            <Link
              href={"/cart"}
              className="relative text-gray-600  flex items-center gap-2 p-2 text-xs font-semibold rounded-sm hover:bg-gray-100 transition-colors"
            >
              {/* <ShoppingCart className="h-4 w-4" /> */}
              Cart
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-3 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500">
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>
          </div>

          {/* Cart and User icons on the right */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}

            {/* Authentication Section */}
            {isPending ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            ) : session?.user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden sm:inline">
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
                <Link href="/auth/sign-in">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
