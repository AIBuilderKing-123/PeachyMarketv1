import React from 'react';

interface AgeGateProps {
  onVerify: () => void;
  onReject: () => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ onVerify, onReject }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
      <div className="max-w-md w-full bg-slate-900 border-2 border-peach-500 rounded-lg shadow-2xl overflow-hidden text-center p-8">
        <h1 className="text-4xl font-bold text-peach-500 mb-4 tracking-tighter">18+ ONLY</h1>
        <p className="text-white text-lg mb-6">
          This website contains adult content. By entering, you certify that you are at least 18 years of age and agree to our Terms of Service.
        </p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={onVerify}
            className="w-full py-4 bg-peach-600 hover:bg-peach-700 text-white font-bold rounded-full text-xl transition-all transform hover:scale-105"
          >
            I am over 18 - Enter
          </button>
          <button 
            onClick={onReject}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 font-medium rounded-full transition-colors"
          >
            I am under 18 - Exit
          </button>
        </div>
        <p className="mt-8 text-xs text-gray-500">
          The Peachy Marketplace &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};