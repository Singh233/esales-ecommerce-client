"use client";

import { ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-none bg-background mt-auto py-5 w-full">
      {/* Trust Badges */}
      <div className="flex items-center justify-center   w-full flex-col md:flex-row gap-2">
        <div className="px-4 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            100% Secure Shopping
          </span>
        </div>
        <span className="h-1 w-1 bg-muted-foreground rounded-full"></span>
        <div className="px-4 flex items-center gap-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground border">
            <Image
              src="/visa.svg"
              alt="Visa"
              width={32}
              height={20}
              className="h-5 w-auto"
              unoptimized
            />
          </div>
          <div className="border flex items-center space-x-2 text-sm text-muted-foreground">
            <Image
              src="/mastercard.svg"
              alt="Mastercard"
              width={32}
              height={20}
              className="h-5 w-auto"
              unoptimized
            />
          </div>
          <div className="border flex items-center space-x-2 text-sm text-muted-foreground">
            <Image
              src="/paypal.svg"
              alt="PayPal"
              width={32}
              height={20}
              className="h-5 w-auto"
              unoptimized
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
