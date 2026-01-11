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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);
  
  // Refs to track lifecycle and prevent race conditions
  const isMounted = useRef(true);
  const renderTimer = useRef<any>(null);
  const buttonInstance = useRef<any>(null);

  // Calculate Total with 4% Buyer Fee
  const serviceFee = amount * FEES.BUYER_FEE_PERCENT;
  const totalAmount = (amount + serviceFee).toFixed(2);
  const safeDescription = (description || "Purchase").substring(0, 127);

  // Helper to parse the [object Object] error from PayPal
  const parseError = (err: any): string => {
    if (typeof err === 'string') return err;
    if (err?.message) return err.message;
    try {
        return JSON.stringify(err);
    } catch {
        return 'Unknown PayPal Error';
    }
  };

  useEffect(() => {
    isMounted.current = true;

    const renderButton = () => {
      const w = window as any;

      if (!w.paypal) {
        // Retry if script is loading
        if (isMounted.current) {
            renderTimer.current = setTimeout(renderButton, 300);
        }
        return;
      }

      // Cleanup previous instance if exists to prevent duplicates
      if (buttonInstance.current) {
        try { buttonInstance.current.close(); } catch(e) {}
        buttonInstance.current = null;
      }

      if (paypalRef.current) {
         paypalRef.current.innerHTML = "";
      }

      try {
        const button = w.paypal.Buttons({
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
                  value: totalAmount // Must be string
                }
              }]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture()
              .then((details: any) => {
                 if (isMounted.current) onSuccess(details);
              })
              .catch((err: any) => {
                 const msg = parseError(err);
                 console.error("PayPal Capture Error:", msg);
                 if (isMounted.current && onError) onError(msg);
              });
          },
          onError: (err: any) => {
            const msg = parseError(err);
            
            // Ignore benign popup closures or specific internal SDK warnings
            if (msg.includes("popup_close") || msg.includes("unhandled_exception")) {
                console.warn("PayPal SDK Warning:", msg);
                return;
            }

            console.error("PayPal Component Error:", msg);
            if (isMounted.current) {
                setErrorMessage("Payment gateway error. Please refresh and try again.");
                if (onError) onError(msg);
            }
          }
        });

        // Store instance and render
        if (paypalRef.current && isMounted.current) {
            buttonInstance.current = button;
            button.render(paypalRef.current).catch((err: any) => {
                console.error("PayPal Render Failed:", err);
            });
        }
      } catch (err: any) {
         console.error("PayPal Init Error:", err);
         if (isMounted.current) setErrorMessage("Failed to load secure payment button.");
      }
    };

    // Debounce rendering to handle React Strict Mode double-invoke
    if (renderTimer.current) clearTimeout(renderTimer.current);
    renderTimer.current = setTimeout(renderButton, 100);

    return () => {
      isMounted.current = false;
      if (renderTimer.current) clearTimeout(renderTimer.current);
      
      // Cleanup button instance gracefully
      if (buttonInstance.current) {
        try { buttonInstance.current.close(); } catch(e) {}
        buttonInstance.current = null;
      }
    };
  }, [amount, safeDescription, totalAmount, customId]);

  if (errorMessage) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-bold text-center border border-red-200">
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fadeIn">
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
      
      <div className="relative min-h-[150px] flex justify-center w-full z-0">
         <div ref={paypalRef} className="w-full relative z-0" />
      </div>
    </div>
  );
};