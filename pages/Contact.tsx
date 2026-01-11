import React from 'react';
import { SEO } from '../components/SEO';

export const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulation of API call/Email sending
      const isSuccess = Math.random() > 0.05; // 95% simulated success rate
      
      if (isSuccess) {
        alert(`Success: Your message has been sent to our support team. Ticket ID: #${Math.floor(Math.random() * 10000)}. We will reply to your email shortly.`);
        // In a real app, we would reset the form here
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error("Simulated Network Timeout");
      }
    } catch (err) {
      console.error("Contact Form Error:", err);
      alert("Error: Unable to send message. The server is not responding. Please check your internet connection or email staff@peachy-markets.com directly.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <SEO title="Contact Us" description="Get in touch with The Peachy Marketplace support team." />
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">Contact Us</h1>
        <p className="text-slate-500 text-center mb-8">
          Have a question or issue? Fill out the form below and our staff will get back to you at <span className="text-peach-600 font-bold">staff@peachy-markets.com</span>
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
              <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input required type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900" />
            </div>
          </div>
          
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
             <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900" />
          </div>

          <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
             <textarea required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none h-32 text-gray-900"></textarea>
          </div>

          <button type="submit" className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition shadow-lg">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};