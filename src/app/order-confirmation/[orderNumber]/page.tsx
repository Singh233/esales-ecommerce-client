"use client";

import { useParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  return (
    <div className="min-h-[calc(100vh-132px)] bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>

              <h1 className="text-3xl font-bold text-green-600 mb-4">
                Order Confirmed!
              </h1>

              <p className="text-lg text-gray-600 mb-2">
                Thank you for your purchase!
              </p>

              <p className="text-gray-600 mb-6">
                Your order number is:{" "}
                <span className="font-semibold">{orderNumber}</span>
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  We&apos;ve sent a confirmation email with your order details.
                  Your order will be processed and shipped soon.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link href={"/"} className="w-max mx-auto">
                  <Button className="w-full">Continue Shopping</Button>
                </Link>

                <Link href={"/orders"} className="w-full">
                  <Button variant="outline" className="w-full">
                    View My Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
