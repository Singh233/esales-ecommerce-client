"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAppSelector, useAppDispatch } from "~/lib/redux/store";
import { clearCart } from "~/lib/redux/features/cartSlice";
import { createOrder } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Image from "next/image";
import { Loader2, CreditCard, Lock } from "lucide-react";
import Link from "next/link";

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount, totalItems } = useAppSelector(
    (state) => state.cart
  );

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      dispatch(clearCart());
      router.push(`/order-confirmation/${data.orderNumber}`);
    },
    onError: (error) => {
      console.error("Order creation failed:", error);
      alert("Failed to create order. Please try again.");
    },
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-()]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Card number validation (16 digits)
    const cardNumberRegex = /^\d{16}$/;
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    // Expiry date validation (MM/YY format and future date)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!expiryRegex.test(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expiryDate <= now) {
        newErrors.expiryDate = "Expiry date must be in the future";
      }
    }

    // CVV validation (3 digits)
    const cvvRegex = /^\d{3}$/;
    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!cvvRegex.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ");
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date
    else if (name === "expiryDate") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2");
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }
    // CVV should only be digits
    else if (name === "cvv") {
      const formatted = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const orderData = {
      contact: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      items: items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        color: item.selectedColor,
        size: item.selectedSize,
      })),
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: "india", // Default to US for now
      },
      paymentMethod: "credit_card",
    };

    console.log(orderData);
    createOrderMutation.mutate(orderData);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">
              Add some items to your cart before checkout
            </p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Order Summary
                    <span className="text-sm font-normal text-gray-600">
                      {totalItems} item{totalItems !== 1 ? "s" : ""}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-600">{item.brand}</p>
                        {item.selectedColor && (
                          <p className="text-xs text-gray-600">
                            Color: {item.selectedColor}
                          </p>
                        )}
                        {item.selectedSize && (
                          <p className="text-xs text-gray-600">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Checkout Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Secure Checkout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Contact Information
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-medium mb-1"
                          >
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.fullName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.fullName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-1"
                          >
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium mb-1"
                          >
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.phone
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 mt-6">
                        Shipping Address
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium mb-1"
                          >
                            Street Address *
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.address
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.address && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.address}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium mb-1"
                            >
                              City *
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.city
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.city && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.city}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="state"
                              className="block text-sm font-medium mb-1"
                            >
                              State *
                            </label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.state
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.state && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.state}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="zipCode"
                            className="block text-sm font-medium mb-1"
                          >
                            Zip Code *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.zipCode
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.zipCode && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.zipCode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 mt-6 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Information
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="cardNumber"
                            className="block text-sm font-medium mb-1"
                          >
                            Card Number *
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.cardNumber
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.cardNumber && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="expiryDate"
                              className="block text-sm font-medium mb-1"
                            >
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.expiryDate
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.expiryDate && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.expiryDate}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="cvv"
                              className="block text-sm font-medium mb-1"
                            >
                              CVV *
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              maxLength={3}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.cvv
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.cvv && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.cvv}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-6"
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Complete Order - $${totalAmount.toFixed(2)}`
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
