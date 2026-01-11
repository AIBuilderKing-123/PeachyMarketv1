import React, { useEffect, useRef, useState } from 'react';
import { FEES } from '../constants';

interface PayPalButtonProps {
  amount: number;
  description: string;
  customId?: string; // Added field to pass User ID
  onSuccess: (details: any) => void;
  onError?: (err: any) => void;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, description, customId, onSuccess, onError }) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Track the actual PayPal button instance to call .close() on cleanup
  const buttonInstance = useRef<any>(null);

  // Calculate Total with 7% Fee
  const serviceFee = amount * FEES.SERVICE_FEE_PERCENT;
  const totalAmount = (amount + serviceFee).toFixed(2);
  
  // Safe description logic
  const safeDescription = (description || "Purchase").substring(0, 127);

  useEffect(() => {
    let isMounted = true;
    
    const loadButtons = () => {
      // Ensure window.paypal exists
      if (!(window as any).paypal) {
        // If not loaded yet, wait a bit
        setTimeout(() => {
           if (isMounted) loadButtons();
        }, 100);
        return;
      }

      const paypal = (window as any).paypal;

      // CLEANUP: Close existing button instance if it exists
      // This is critical to prevent 'paypal_js_sdk_v5_unhandled_exception'
      if (buttonInstance.current) {
          try {
              buttonInstance.current.close();
          } catch (e) {
              // Ignore errors during close, likely already closed
          }
          buttonInstance.current = null;
      }

      if (!paypalRef.current) return;
      
      // Clear container safely
      paypalRef.current.innerHTML = '';

      try {
        // Create new button instance
        buttonInstance.current = paypal.Buttons({
          style: {
            layout: 'vertical',
            color:  'gold',
            shape:  'rect',
            label:  'paypal'
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
            }).catch((err: any) => {
                console.error("PayPal CreateOrder Error:", err);
                throw err;
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
               if (isMounted) onSuccess(details);
            }).catch((err: any) => {
                console.error("PayPal Capture Error:", err);
                if (isMounted && onError) onError(err);
            });
          },
          onError: (err: any) => {
            // Suppress generic "Script error" which often happens on unmount/remount/cross-origin issues
            const errString = String(err);
            if (errString.includes('Script error')) return;
            if (errString.includes('popup_close')) return;
            
            console.error("PayPal SDK Error:", err);
            if (isMounted && onError) onError(err);
          }
        });

        // Render the button
        if (paypalRef.current) {
             buttonInstance.current.render(paypalRef.current).catch((err: any) => {
                // Suppress render errors if element is gone (race condition)
                console.log("PayPal Render suppressed:", err);
             });
        }

      } catch (err) {
        console.error("PayPal Initialization Exception:", err);
        if (isMounted) setError("Error initializing payment.");
      }
    };

    loadButtons();

    // Cleanup function
    return () => {
      isMounted = false;
      if (buttonInstance.current) {
          try {
              buttonInstance.current.close();
          } catch (e) {
              // Ignore
          }
      }
    };
  }, [amount, safeDescription, totalAmount, customId]);

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
        <div ref={paypalRef} className="z-0 relative min-h-[150px] flex justify-center" />
    </div>
  );
};