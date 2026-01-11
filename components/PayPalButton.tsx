import React, { useEffect, useRef, useState } from 'react';
import { FEES } from '../constants';

interface PayPalButtonProps {
  amount: number;
  description: string;
  customId?: string;
  onSuccess: (details: any) => void;
  onError?: (err: any) => void;
}

// Global script loader to prevent duplicate scripts
const loadPayPalScript = (clientId: string) => {
  return new Promise((resolve, reject) => {
    if ((window as any).paypal) {
      resolve((window as any).paypal);
      return;
    }
    const scriptId = 'paypal-js-sdk';
    if (document.getElementById(scriptId)) {
        // Script is already loading, wait for it
        const interval = setInterval(() => {
            if ((window as any).paypal) {
                clearInterval(interval);
                resolve((window as any).paypal);
            }
        }, 100);
        return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&components=buttons`;
    script.async = true;
    script.onload = () => resolve((window as any).paypal);
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
};

export const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, description, customId, onSuccess, onError }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  
  const isMounted = useRef(true);
  const buttonInstance = useRef<any>(null);

  // Calculate Total with 4% Buyer Fee
  const serviceFee = amount * FEES.BUYER_FEE_PERCENT;
  const totalAmount = (amount + serviceFee).toFixed(2);
  const safeDescription = (description || "Purchase").replace(/[^\w\s\-\.\(\)\$\%\#]/gi, '').substring(0, 120); // Aggressive sanitization

  useEffect(() => {
    isMounted.current = true;
    
    // Load SDK Dynamically
    const CLIENT_ID = 'AbkHNTbccKTux5lsE5nCi7BHsKT-Qpbmse2XU5T3J4pUKrLUle6BtwLm0LaIuSygsz0rq2MrTnlGcg-k';
    
    loadPayPalScript(CLIENT_ID)
        .then(() => {
            if (isMounted.current) setIsSdkReady(true);
        })
        .catch(err => {
            console.error("PayPal Load Error:", err);
            if (isMounted.current) setErrorMessage("Secure connection to PayPal failed.");
        });

    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!isSdkReady || !paypalRef.current) return;
    
    // Cleanup existing buttons
    if (paypalRef.current.innerHTML !== "") {
        paypalRef.current.innerHTML = "";
    }

    const renderButton = async () => {
        const w = window as any;
        if (!w.paypal) return;

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
                                value: totalAmount
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
                            // Extract error message safely
                            let msg = "Payment failed";
                            if (err?.message) msg = err.message;
                            if (typeof err === 'string') msg = err;
                            console.error("Capture Error:", msg);
                            if (onError && isMounted.current) onError(msg);
                        });
                },
                onError: (err: any) => {
                    // Handle "string did not match expected pattern" (DOMException)
                    let msg = "An error occurred with PayPal.";
                    if (err instanceof Error) msg = err.message;
                    else if (typeof err === 'string') msg = err;
                    
                    if (msg.includes("pattern") || msg.includes("popup_close")) {
                        console.warn("PayPal Warning:", msg);
                        return; // Ignore these specific non-critical errors
                    }

                    console.error("PayPal Component Error:", msg);
                    if (isMounted.current) {
                        setErrorMessage("Payment gateway error. Please try again.");
                        if (onError) onError(msg);
                    }
                }
            });

            if (paypalRef.current && isMounted.current) {
                await button.render(paypalRef.current);
                buttonInstance.current = button;
            }
        } catch (err) {
            console.error("Button Render Error:", err);
        }
    };

    renderButton();

    return () => {
        if (buttonInstance.current) {
            try { buttonInstance.current.close(); } catch(e) {}
            buttonInstance.current = null;
        }
    };

  }, [isSdkReady, totalAmount, safeDescription, customId]);

  if (errorMessage) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-bold text-center border border-red-200">
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (!isSdkReady) {
      return (
          <div className="w-full h-[150px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400 text-sm">
              Loading Secure Payment...
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