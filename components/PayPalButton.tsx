import React, { useEffect, useRef, useState } from 'react';
import { FEES } from '../constants';

interface PayPalButtonProps {
  amount: number;
  description: string;
  customId?: string;
  onSuccess: (details: any) => void;
  onError?: (err: any) => void;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, description, customId, onSuccess, onError }) => {
  const [error, setError] = useState<string | null>(null);
  // Generate a unique ID for this button's container to ensure isolation
  const containerId = useRef(`paypal-container-${Math.random().toString(36).substring(2, 9)}`);
  const isMounted = useRef(true);

  // Calculate Total with 4% Buyer Fee
  const serviceFee = amount * FEES.BUYER_FEE_PERCENT;
  const totalAmount = (amount + serviceFee).toFixed(2);
  const safeDescription = (description || "Purchase").substring(0, 127);

  useEffect(() => {
    isMounted.current = true;
    let buttonInstance: any = null;

    const loadPayPal = async () => {
      const w = window as any;
      
      // 1. Wait for Global SDK
      if (!w.paypal || !w.paypal.Buttons) {
        if (isMounted.current) {
             // Retry shortly if script is still loading
             setTimeout(loadPayPal, 200);
        }
        return;
      }

      const container = document.getElementById(containerId.current);
      if (!container) return; // Component likely unmounted

      // 2. Clear Container manually to prevent duplicates
      container.innerHTML = "";

      try {
        // 3. Create Button Instance
        buttonInstance = w.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: safeDescription,
                custom_id: customId || 'GUEST',
                amount: {
                  currency_code: "USD",
                  value: totalAmount
                }
              }]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
               if (isMounted.current) onSuccess(details);
            }).catch((err: any) => {
                console.error("PayPal Capture Error:", err);
                if (isMounted.current && onError) onError(err);
            });
          },
          onError: (err: any) => {
            const errStr = String(err);
            // Ignore generic script errors from cross-origin/CDN issues
            if (errStr.includes("Script error") || errStr.includes("popup_close")) return;
            
            console.error("PayPal Button Error:", err);
            if (isMounted.current && onError) onError(err);
          }
        });

        // 4. Render only if still mounted and container exists
        if (isMounted.current && container) {
           await buttonInstance.render(`#${containerId.current}`);
        }

      } catch (err) {
        console.error("PayPal Render Exception:", err);
        if (isMounted.current) setError("Payment system unavailable. Please refresh.");
      }
    };

    loadPayPal();

    // Cleanup
    return () => {
      isMounted.current = false;
      
      // Attempt to close the button instance to prevent memory leaks or async errors
      if (buttonInstance && typeof buttonInstance.close === 'function') {
        try {
            buttonInstance.close().catch(() => {});
        } catch (e) {
            // Ignore sync errors during close
        }
      }

      // Force clear the container
      const container = document.getElementById(containerId.current);
      if (container) container.innerHTML = "";
    };
  }, [amount, safeDescription, totalAmount, customId]);

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm font-bold text-center border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-4 text-center shadow-sm">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Subtotal:</span>
          <span className="font-mono">${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3 border-b border-gray-200 pb-2">
          <span>Service Fee ({(FEES.BUYER_FEE_PERCENT * 100).toFixed(0)}%):</span>
          <span className="font-mono">${serviceFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-slate-800 text-xl">
          <span>Total:</span>
          <span>${totalAmount}</span>
        </div>
      </div>
      {/* Container must have a stable ID */}
      <div id={containerId.current} className="z-0 relative min-h-[150px] flex justify-center w-full" />
    </div>
  );
};