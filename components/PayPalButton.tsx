import React, { useEffect, useRef, useState } from 'react';
import { FEES } from '../constants';

interface PayPalButtonProps {
  amount: number;
  description: string;
  onSuccess: (details: any) => void;
  onError?: (err: any) => void;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, description, onSuccess, onError }) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate Total with 7% Fee
  const serviceFee = amount * FEES.SERVICE_FEE_PERCENT;
  const totalAmount = (amount + serviceFee).toFixed(2);

  useEffect(() => {
    // Check if PayPal SDK is loaded
    if ((window as any).paypal) {
      setSdkReady(true);
    } else {
      setError("PayPal SDK not loaded. Please check your internet connection or API Key configuration.");
    }
  }, []);

  useEffect(() => {
    if (sdkReady && paypalRef.current && (window as any).paypal) {
      // Clear previous buttons if any
      paypalRef.current.innerHTML = "";

      (window as any).paypal.Buttons({
        style: {
          layout: 'vertical',
          color:  'gold',
          shape:  'rect',
          label:  'paypal'
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: description,
              amount: {
                currency_code: "USD",
                value: totalAmount,
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: totalAmount
                    }
                }
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          onSuccess(order);
        },
        onError: (err: any) => {
          console.error("PayPal Error:", err);
          if (onError) onError(err);
        }
      }).render(paypalRef.current);
    }
  }, [sdkReady, totalAmount, description]);

  if (error) {
      return (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm font-bold text-center">
              {error}
          </div>
      );
  }

  return (
    <div className="w-full">
        <div className="bg-gray-100 p-3 rounded-lg mb-4 text-center">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Subtotal:</span>
                <span>${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Service Fee (7%):</span>
                <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-slate-800 text-lg">
                <span>Total Charge:</span>
                <span>${totalAmount}</span>
            </div>
        </div>
        <div ref={paypalRef} className="z-0 relative" />
    </div>
  );
};
