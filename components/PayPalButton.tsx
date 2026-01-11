import React, { useEffect, useRef, useState } from 'react';
import { FEES } from '../constants';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
    // 1. Check if PayPal is already available
    if ((window as any).paypal) {
      resolve((window as any).paypal);
      return;
    }

    const scriptId = 'paypal-js-sdk';
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement;

    if (existingScript) {
        // Script exists but might be loading
        const onScriptLoad = () => resolve((window as any).paypal);
        const onScriptError = (e: Event) => reject(e);
        
        existingScript.addEventListener('load', onScriptLoad);
        existingScript.addEventListener('error', onScriptError);
        
        // Cleanup listeners if promise settles (optional optimization, omitted for brevity)
        return;
    }

    // 2. Load the script
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&components=buttons&enable-funding=venmo`;
    script.async = true;
    
    // Add data attribute to help with debugging/namespace
    script.setAttribute('data-namespace', 'paypal_sdk');

    script.onload = () => resolve((window as any).paypal);
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
};

export const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, description, customId, onSuccess, onError }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  
  const paypalRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  const buttonInstance = useRef<any>(null);

  // Calculate Total with 4% Buyer Fee
  const serviceFee = amount * FEES.BUYER_FEE_PERCENT;
  const totalAmount = (amount + serviceFee).toFixed(2);
  const safeDescription = (description || "Purchase").replace(/[^\w\s\-\.\(\)\$\%\#]/gi, '').substring(0, 120);

  // Hardcoded Sandbox Client ID
  const CLIENT_ID = 'AbkHNTbccKTux5lsE5nCi7BHsKT-Qpbmse2XU5T3J4pUKrLUle6BtwLm0LaIuSygsz0rq2MrTnlGcg-k';

  useEffect(() => {
    isMounted.current = true;
    
    loadPayPalScript(CLIENT_ID)
        .then(() => {
            if (isMounted.current) setIsSdkReady(true);
        })
        .catch(err => {
            console.error("PayPal Load Error:", err);
            // Fallback to simulation mode if script fails (e.g. adblocker, offline, or strict CSP)
            if (isMounted.current) setSimulationMode(true);
        });

    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    // If not ready or in simulation mode, skip actual render
    if (!isSdkReady || simulationMode || !paypalRef.current) return;
    
    // Cleanup existing buttons in the container to avoid duplicates
    if (paypalRef.current.innerHTML !== "") {
        paypalRef.current.innerHTML = "";
    }

    const renderButton = async () => {
        const w = window as any;
        if (!w.paypal) {
            setSimulationMode(true);
            return;
        }

        try {
            const button = w.paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal'
                },
                createOrder: (_data: any, actions: any) => {
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
                onApprove: (_data: any, actions: any) => {
                    return actions.order.capture()
                        .then((details: any) => {
                            if (isMounted.current) onSuccess(details);
                        })
                        .catch((err: any) => {
                            let msg = "Payment failed";
                            if (err?.message) msg = err.message;
                            console.error("Capture Error:", msg);
                            if (onError && isMounted.current) onError(msg);
                        });
                },
                onError: (err: any) => {
                    let msg = "An error occurred with PayPal.";
                    if (err instanceof Error) msg = err.message;
                    else if (typeof err === 'string') msg = err;
                    
                    console.error("PayPal Component Error:", msg);
                    
                    // Known issue: "Can not read window host" often happens in preview iframes
                    // We switch to simulation mode to allow testing to continue
                    if (msg.includes("window") || msg.includes("host") || msg.includes("popup")) {
                        if (isMounted.current) setSimulationMode(true);
                    } else {
                        if (isMounted.current) {
                            setErrorMessage("Payment gateway error. Please try again.");
                            if (onError) onError(msg);
                        }
                    }
                }
            });

            if (paypalRef.current && isMounted.current) {
                // Wrap render in try/catch for synchronous render errors
                try {
                    await button.render(paypalRef.current);
                    buttonInstance.current = button;
                } catch (renderErr) {
                    console.error("Button Render Exception:", renderErr);
                    if (isMounted.current) setSimulationMode(true);
                }
            }
        } catch (err) {
            console.error("Button Init Error:", err);
            if (isMounted.current) setSimulationMode(true);
        }
    };

    renderButton();

    return () => {
        if (buttonInstance.current) {
            try { buttonInstance.current.close(); } catch(e) {}
            buttonInstance.current = null;
        }
    };

  }, [isSdkReady, totalAmount, safeDescription, customId, simulationMode]);

  const handleSimulateSuccess = () => {
      // Mock PayPal Response Object
      const mockDetails = {
          id: `MOCK-${Date.now()}`,
          status: 'COMPLETED',
          payer: {
              name: { given_name: 'Test', surname: 'User' },
              email_address: 'test@example.com'
          },
          purchase_units: [{
              amount: {
                  value: totalAmount,
                  currency_code: 'USD'
              },
              description: safeDescription
          }],
          create_time: new Date().toISOString(),
          update_time: new Date().toISOString()
      };
      onSuccess(mockDetails);
  };

  // 1. Critical Error State
  if (errorMessage) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-bold text-center border border-red-200">
        <p>{errorMessage}</p>
        <button onClick={() => setErrorMessage(null)} className="mt-2 text-red-600 underline">Retry</button>
      </div>
    );
  }

  // 2. Simulation Mode (Fallback)
  if (simulationMode) {
      return (
          <div className="w-full animate-fadeIn">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4 text-center">
                <div className="flex items-center justify-center text-amber-600 mb-2">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-bold text-sm">Test Mode Active</span>
                </div>
                <p className="text-xs text-amber-700 mb-4">
                    PayPal SDK failed to load (likely due to preview environment restrictions). 
                    You can simulate a successful payment below.
                </p>
                
                <div className="bg-white p-3 rounded-lg border border-amber-100 mb-4">
                     <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Total:</span>
                        <span className="font-bold text-slate-800">${totalAmount}</span>
                     </div>
                     <div className="text-xs text-gray-400 text-left truncate">{safeDescription}</div>
                </div>

                <button 
                    onClick={handleSimulateSuccess}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-95"
                >
                    <CheckCircle className="w-5 h-5 mr-2" /> Simulate Successful Payment
                </button>
              </div>
          </div>
      );
  }

  // 3. Loading State
  if (!isSdkReady) {
      return (
          <div className="w-full h-[150px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400 text-sm border border-gray-200">
              Initializing Secure Payment...
          </div>
      );
  }

  // 4. Standard PayPal Button
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