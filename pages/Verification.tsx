import React, { useState } from 'react';
import { ShieldCheck, Upload, Check } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Verification: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        setSubmitted(true);
        // Logic to send to Admin Portal would go here
    } catch(err) {
        alert("Error: Failed to submit verification documents. Please ensure all files are valid and try again.");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <SEO title="Verification Submitted" />
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Submission Received</h2>
        <p className="text-slate-600 mb-8">
          Thank you for submitting your verification details. Our staff will review your documents within 24-48 hours. 
          You will receive a notification once your status changes.
        </p>
        <button 
          onClick={() => window.location.hash = '#/'}
          className="bg-slate-800 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-700"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden my-8">
      <SEO title="ID Verification" description="Verify your identity to unlock seller features and full site access." />
      <div className="bg-slate-900 p-8 text-center">
        <ShieldCheck className="w-16 h-16 text-peach-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">ID Verification</h1>
        <p className="text-slate-400">Join our safe community of verified buyers and sellers.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Legal Name</label>
              <input required type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input required type="date" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900" />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Document Upload</h3>
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            Ensure photos are clear, not blurry, and text is readable. Rejections will delay your access.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
              <div className="bg-peach-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-peach-600">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-bold text-gray-700 mb-1">Government ID (Front)</p>
              <p className="text-xs text-gray-500 mb-4">Drivers License, Passport, or State ID</p>
              <input required type="file" className="text-sm text-gray-500 mx-auto w-full" />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
              <div className="bg-peach-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-peach-600">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-bold text-gray-700 mb-1">Selfie Holding ID</p>
              <p className="text-xs text-gray-500 mb-4">Face and ID must be clearly visible</p>
              <input required type="file" className="text-sm text-gray-500 mx-auto w-full" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full py-4 bg-peach-500 hover:bg-peach-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-peach-200 transition-all transform hover:scale-[1.01]"
          >
            Submit for Verification
          </button>
          <p className="text-center text-xs text-gray-400 mt-4">
            By submitting, you agree to the processing of your personal data for identity verification purposes only. 
            Data is stored securely.
          </p>
        </div>
      </form>
    </div>
  );
};