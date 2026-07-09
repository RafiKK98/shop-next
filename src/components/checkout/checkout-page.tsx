"use client";

import { useState } from "react";
import { CheckoutStepper } from "./checkout-stepper";
import { ShippingStep } from "./shipping-step";
import { ReviewStep } from "./review-step";
import type { CartItemWithProduct } from "@/lib/cart";

export interface Address {
  id: string;
  label: string | null;
  fullName: string | null;
  phone: string | null;
  street: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean | null;
}

export interface CouponState {
  code: string;
  discountAmount: number;
  couponId: string;
}

interface CheckoutPageProps {
  items: CartItemWithProduct[];
  addresses: Address[];
  cartValidation: { valid: boolean; errors: string[] };
}

const steps = [{ label: "Shipping Address" }, { label: "Review Order" }];

export function CheckoutPage({ items, addresses, cartValidation }: CheckoutPageProps) {
  const [currentStep, setCurrentStep] = useState(cartValidation.valid ? 0 : 0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    () => addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || null,
  );
  const [appliedCoupon, setAppliedCoupon] = useState<CouponState | null>(null);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const handleContinue = () => {
    setCurrentStep(1);
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  return (
    <div>
      <CheckoutStepper steps={steps} currentStep={currentStep} />

      {!cartValidation.valid && cartValidation.errors.length > 0 && (
        <div className="alert alert-error mb-6" role="alert">
          <ul className="list-disc pl-4">
            {cartValidation.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {currentStep === 0 && (
        <ShippingStep
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          onContinue={handleContinue}
          cartEmpty={items.length === 0}
        />
      )}

      {currentStep === 1 && (
        <ReviewStep
          items={items}
          selectedAddress={selectedAddress}
          onBack={handleBack}
          appliedCoupon={appliedCoupon}
          onCouponChange={setAppliedCoupon}
        />
      )}
    </div>
  );
}
