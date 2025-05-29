"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Star, Minus, Plus, ShoppingCart } from "lucide-react";
import { getProduct, type Product } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { useAppDispatch } from "~/lib/redux/store";
import { addToCart } from "~/lib/redux/features/cartSlice";
import { toast } from "sonner";
import { useSession } from "~/lib/auth-client";

interface ProductLandingPageProps {
  productId?: string;
}

export default function ProductLandingPage({
  productId = "68375b8b267d791401c6a084",
}: ProductLandingPageProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // default selected color and size
    if (product) {
      setSelectedColor(product.colors?.[0] || "");
      setSelectedSize(product.sizes?.[0] || "");
      setQuantity(Math.min(product.quantity || 1, 1)); // Ensure quantity starts at 1 or product quantity
    }
  }, [product]);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;
      return Math.max(1, Math.min(newQuantity, product?.quantity || 1));
    });
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (!session?.user) {
      toast.info("Please log in to add items to your cart.");
      return;
    }

    // Dispatch addToCart action
    dispatch(
      addToCart({
        product,
        selectedColor,
        selectedSize,
        quantity,
      })
    );

    // Show success message (you can replace this with a proper toast notification)
    toast.success(`${product.title} added to cart!`);
  };

  // Convert single image to array for carousel and filter out undefined images
  const images = useMemo(() => {
    const imageArray = Array.isArray(product?.images)
      ? product?.images
      : [product?.images];
    return imageArray.filter(Boolean) as string[]; // Filter out undefined values and cast to string[]
  }, [product?.images]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-4xl">⚠️</div>
              <h3 className="text-lg font-semibold">Error Loading Product</h3>
              <p className="text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong"}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-muted-foreground text-4xl">📦</div>
              <h3 className="text-lg font-semibold">Product Not Found</h3>
              <p className="text-muted-foreground">
                The product you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Product Images Carousel */}
          <div className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={image || "/placeholder-image.svg"}
                        alt={`${product.title} - Image ${index + 1}`}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        unoptimized={image === "/placeholder-image.svg"}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LXNpemU9IjE4Ij5Mb2FkaW5nLi4uPC90ZXh0Pgo8L3N2Zz4K"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>

            {/* Thumbnail indicators */}
            {images.length > 1 && (
              <div className="flex justify-center space-x-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-muted-foreground/30"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground tracking-wide">
                {product.brand}
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                {product.title}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.quantity > 0 ? (
                  <Badge variant="secondary">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            {product.rating.count > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating.rate)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.rate.toFixed(1)} ({product.rating.count}{" "}
                  reviews)
                </span>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variant Selectors */}
            <div className="space-y-4">
              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <Select
                    value={selectedColor}
                    onValueChange={setSelectedColor}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: color.toLowerCase() }}
                            />
                            <span className="capitalize">{color}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[3rem] text-center font-medium">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.quantity || 0)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {product.quantity} available
                </span>
              </div>
            </div>

            {/* Buy Now Button */}
            <Button
              onClick={handleBuyNow}
              disabled={product.quantity === 0}
              size="lg"
              className="w-full"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            {/* Additional Product Info */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-mono text-xs">{product.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
