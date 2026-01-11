import React, { useState } from 'react';
import { 
  FileText, Truck, Lock, AlertTriangle, 
  Gavel, AlertOctagon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const Terms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tos' | 'chargeback' | 'shipping' | 'privacy'>('tos');

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center w-full px-6 py-4 font-bold text-sm transition-all border-l-4 text-left ${
        activeTab === id 
          ? 'bg-peach-50 text-peach-700 border-peach-500' 
          : 'text-slate-500 hover:bg-slate-50 border-transparent hover:border-slate-200'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${activeTab === id ? 'text-peach-500' : 'text-slate-400'}`} />
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <SEO title="Terms of Service & Policies" description="Review our Terms of Service, Chargeback Policies, and Shipping Information." />
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Legal Center</h1>
        <p className="text-slate-500">Agreements, Policies & Corporate Protection</p>
      </div>

      <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl overflow-hidden min-h-[800px] border border-gray-100">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider text-center lg:text-left">Policy Navigation</h3>
          </div>
          <nav className="flex-grow flex flex-col">
            <TabButton id="tos" label="Terms of Service" icon={FileText} />
            <TabButton id="chargeback" label="Chargeback & Fraud" icon={AlertOctagon} />
            <TabButton id="shipping" label="Shipping & Fulfillment" icon={Truck} />
            <TabButton id="privacy" label="Privacy & Data" icon={Lock} />
          </nav>
          
          <div className="p-6 bg-slate-50 border-t border-gray-100">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center lg:text-left">
              <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center justify-center lg:justify-start">
                <Gavel className="w-4 h-4 mr-2" /> Dispute Resolution
              </h4>
              <p className="text-xs text-blue-600 mb-3 leading-relaxed">
                All disputes must be handled via our internal Resolution Center prior to any external action.
              </p>
              <Link to="/disputes" className="w-full block text-center text-xs font-bold bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition">
                Open Dispute Case
              </Link>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-8 lg:p-12 overflow-y-auto bg-slate-50/30">
          
          {/* TERMS OF SERVICE TAB */}
          {activeTab === 'tos' && (
            <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Master Service Agreement</h2>
                <p className="text-sm text-slate-500 mt-1">Effective Date: {new Date().toLocaleDateString()} | Version 3.1 (Binding)</p>
              </div>

              {/* Age & Liability Warning */}
              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg shadow-sm">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-red-900 text-sm uppercase tracking-wide">STRICT 18+ REQUIREMENT & SECTION 230 IMMUNITY</h3>
                    <p className="text-red-800 mt-1 text-xs leading-relaxed text-justify">
                      The Peachy Marketplace ("Platform") is a provider of an interactive computer service under 47 U.S.C. § 230. We do not create content. 
                      By accessing this site, you certify under penalty of perjury that you are at least 18 years of age and viewing this content is legal in your jurisdiction. 
                      <strong>We assume NO LIABILITY for user-generated content</strong>. 
                      Entering this site constitutes a waiver of any right to sue the Platform, its owners, or affiliates for third-party actions or content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 text-slate-700 text-sm leading-relaxed text-justify">
                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">1. Acceptance of Terms & Binding Agreement</h3>
                  <p>
                    These Terms of Service ("Terms") constitute a legally binding contract between you ("User", "Buyer", or "Seller") and The Peachy Marketplace. 
                    By creating an account, accessing the site, or completing a transaction, you unequivocally agree to be bound by these Terms. 
                    If you do not agree to every provision, including the Mandatory Arbitration Clause and Class Action Waiver, you are strictly prohibited from accessing the Platform. 
                    We reserve the right to modify these Terms at any time; continued use constitutes acceptance of updates.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">2. Compliance with 18 U.S.C. § 2257</h3>
                  <p className="mb-2">
                    The Platform operates strictly as a venue for User-Generated Content (UGC). We are not the "producer" of any content found on the site.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 bg-white p-4 rounded-lg border border-gray-200">
                    <li>
                      <strong>Seller Responsibility:</strong> Every Seller warrants that they are the "Primary Producer" 
                      as defined by 18 U.S.C. § 2257 and are solely responsible for satisfying the record-keeping requirements, including age verification of all performers.
                    </li>
                    <li>
                      <strong>Exemption Statement:</strong> Content produced by a Seller is exempt from 2257 record-keeping by the Platform pursuant to the secondary producer exemption, as the Platform does not hire, contract, or direct performers.
                    </li>
                    <li>
                      <strong>Zero Tolerance Policy:</strong> Any content depicting minors, non-consensual acts, bestiality, or violence will be immediately reported to the NCMEC and federal authorities (FBI/CyberTip). Accounts found in violation will be terminated and permanently blacklisted.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">3. Marketplace Fees & Payments</h3>
                  <p>
                    The Platform facilitates payments between buyers and sellers.
                  </p>
                   <ul className="list-disc pl-5 space-y-2 bg-white p-4 rounded-lg border border-gray-200">
                    <li>
                      <strong>Buyer Fee:</strong> A service fee of <strong>4%</strong> is charged to the Buyer on top of the listing price to cover payment processing and platform maintenance.
                    </li>
                    <li>
                      <strong>Seller Fee:</strong> A service fee of <strong>4%</strong> is deducted from the Seller's earnings for each transaction.
                    </li>
                    <li>
                      <strong>Payouts:</strong> Funds are credited to the Seller's internal wallet instantly upon successful payment capture and are available for withdrawal via PayPal or ACH.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">4. Intellectual Property & Content Ownership</h3>
                  <p>
                    Users retain ownership of the content they upload but grant the Platform a worldwide, non-exclusive, royalty-free license to host, display, and distribute said content. 
                    Users warrant that they own all copyrights to uploaded material. The Platform respects the DMCA and will respond to valid takedown notices. 
                    Filing a false DMCA notice is a federal crime; we will pursue damages for fraudulent takedown requests.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">5. Limitation of Liability & Indemnification</h3>
                  <p className="bg-gray-100 p-4 rounded-lg border border-gray-200 font-medium italic">
                    TO THE FULLEST EXTENT PERMITTED BY LAW, THE PLATFORM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, LOSS OF PROFITS, DATA USE, OR GOODWILL. 
                    YOU AGREE TO INDEMNIFY, DEFEND, AND HOLD HARMLESS THE PLATFORM, ITS OWNERS, OFFICERS, AND AFFILIATES FROM ANY CLAIMS, DAMAGES, OBLIGATIONS, LOSSES, LIABILITIES, COSTS OR DEBT, AND EXPENSES (INCLUDING ATTORNEY'S FEES) ARISING FROM YOUR USE OF THE SERVICE OR VIOLATION OF THESE TERMS.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">6. Mandatory Arbitration & Class Action Waiver</h3>
                  <p>
                    <strong>READ THIS SECTION CAREFULLY. IT LIMITS YOUR LEGAL RIGHTS.</strong>
                    Any dispute, claim, or controversy arising out of or relating to these Terms or the breach, termination, enforcement, interpretation, or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by binding arbitration rather than in court.
                    <strong> You agree that you may bring claims against the Platform only in your individual capacity and not as a plaintiff or class member in any purported class or representative proceeding.</strong>
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">7. Termination of Service</h3>
                  <p>
                    We reserve the absolute right to terminate, suspend, or restrict your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. 
                    The Platform is a private business and may refuse service to anyone at its sole discretion.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* CHARGEBACK POLICY TAB */}
          {activeTab === 'chargeback' && (
            <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-red-600 flex items-center">
                  <AlertOctagon className="w-6 h-6 mr-2" /> Friendly Fraud & Chargeback Policy
                </h2>
                <p className="text-sm text-slate-500 mt-1">READ CAREFULLY: We prosecute Friendly Fraud to the fullest extent of the law.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-red-500 mb-6">
                  <h3 className="font-bold text-red-700 text-lg mb-2">Zero Tolerance for "Friendly Fraud"</h3>
                  <p className="text-sm text-slate-700">
                    "Friendly Fraud" (or Chargeback Fraud) occurs when a consumer makes a purchase with their own credit card and then requests a chargeback from their bank after receiving the goods or services. 
                    <strong>This is considered theft of services and wire fraud.</strong> The Peachy Marketplace utilizes advanced anti-fraud algorithms and manual review to prevent unauthorized use.
                  </p>
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-4">1. Irrevocable Waiver of Dispute Rights</h3>
                <p className="text-sm text-slate-700 mb-4 text-justify">
                  By clicking "Purchase," "Subscribe," "Buy Tokens," or "Book Room," you acknowledge that you are purchasing immediate access to digital media or live entertainment. 
                  <strong>ALL SALES ARE FINAL.</strong> You expressly waive the right to initiate a chargeback for reasons including but not limited to: 
                  "Buyer's Remorse," "Item Not As Described" (unless adjudicated via our internal dispute process), "Forgot to Cancel," "Didn't Like the Content," or "Family Member Used Card."
                </p>

                <h3 className="font-bold text-slate-900 text-lg mb-4">2. Financial & Legal Consequences</h3>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                   <p className="text-sm text-red-800 font-bold mb-2">If you initiate a chargeback without following our dispute resolution process:</p>
                   <ul className="list-decimal pl-5 space-y-1 text-sm text-red-700">
                     <li>Your account will be <strong>Immediately and Permanently Banned</strong>.</li>
                     <li>Your IP address, email, and payment fingerprint will be added to a global blacklist shared with other adult industry merchants.</li>
                     <li>We will dispute the chargeback with evidence including IP logs, access timestamps, and chat history.</li>
                     <li>The debt will be sent to a third-party collections agency, which may impact your credit score.</li>
                     <li>For amounts exceeding $500, we reserve the right to file a police report for Theft of Services (18 Pa.C.S. § 3926).</li>
                   </ul>
                </div>
              </div>
            </div>
          )}

          {/* SHIPPING POLICY TAB */}
          {activeTab === 'shipping' && (
            <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <Truck className="w-6 h-6 mr-2" /> Shipping & Fulfillment Policy
                </h2>
                <p className="text-sm text-slate-500 mt-1">Information regarding digital delivery and physical goods.</p>
              </div>

              <div className="space-y-6 text-slate-700 text-sm">
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="font-bold text-slate-900 text-lg mb-2">1. Digital Content (Instant Delivery)</h3>
                   <p className="mb-2">
                     The vast majority of items on The Peachy Marketplace are digital assets (photos, videos, or links).
                   </p>
                   <ul className="list-disc pl-5 space-y-2">
                     <li>
                       <strong>Automatic Delivery:</strong> If a Seller has enabled Auto-Delivery, your content is accessible immediately after payment via your "Purchases" tab or sent to your registered email.
                     </li>
                     <li>
                       <strong>Manual Delivery:</strong> For custom content, the Seller has 48 hours to deliver the file via the onsite messaging system. If they fail to do so, you are entitled to a full refund via the Resolution Center.
                     </li>
                   </ul>
                </section>

                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="font-bold text-slate-900 text-lg mb-2">2. Physical Goods</h3>
                   <p className="mb-2">
                     Some sellers may list physical items (e.g. worn items, merchandise). The Peachy Marketplace is a venue and does not warehouse or ship items directly.
                   </p>
                   <ul className="list-disc pl-5 space-y-2">
                     <li>
                       <strong>Seller Responsibility:</strong> Sellers are solely responsible for packaging, shipping, and providing tracking numbers for physical goods.
                     </li>
                     <li>
                       <strong>Tracking Requirement:</strong> Sellers must provide a valid tracking number within 5 business days of purchase. Failure to do so allows the buyer to claim a "Non-Delivery" refund.
                     </li>
                     <li>
                       <strong>Discrete Shipping:</strong> Sellers are expected to use discrete packaging to protect buyer privacy.
                     </li>
                   </ul>
                </section>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY TAB */}
          {activeTab === 'privacy' && (
            <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <Lock className="w-6 h-6 mr-2" /> Privacy Policy
                </h2>
                <p className="text-sm text-slate-500 mt-1">Your privacy is our priority. We minimize data retention.</p>
              </div>

              <div className="space-y-6 text-slate-700 text-sm">
                 <p>
                   We understand the sensitive nature of this platform. We are committed to protecting your identity and personal data.
                 </p>
                 
                 <section>
                   <h3 className="font-bold text-slate-900 text-lg mb-2">1. Data Collection</h3>
                   <ul className="list-disc pl-5 space-y-1">
                     <li><strong>Account Data:</strong> We collect your email and hashed password.</li>
                     <li><strong>Verification Data:</strong> ID photos are processed by a secure third-party verification partner and are NOT stored permanently on our public web servers after verification is complete.</li>
                     <li><strong>Payment Data:</strong> We do not store full credit card numbers. All payments are processed by secure third-party gateways (PayPal, Melio, etc).</li>
                   </ul>
                 </section>

                 <section>
                   <h3 className="font-bold text-slate-900 text-lg mb-2">2. Data Usage</h3>
                   <p>
                     We use your data strictly to facilitate transactions, verify age (legal requirement), and prevent fraud. We do not sell your data to marketing agencies.
                   </p>
                 </section>

                 <section>
                   <h3 className="font-bold text-slate-900 text-lg mb-2">3. Data Deletion</h3>
                   <p>
                     You may request full account deletion at any time by contacting support. Note that transaction logs must be kept for 7 years for tax and legal compliance (18 U.S.C. § 2257).
                   </p>
                 </section>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};