import React, { useState } from 'react';
import { 
  FileText, ShieldAlert, Truck, Lock, AlertTriangle, CheckCircle, 
  Ban, Gavel, AlertOctagon, Scale, ChevronRight, ExternalLink, Scroll
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
                <p className="text-sm text-slate-500 mt-1">Effective Date: {new Date().toLocaleDateString()} | Version 3.0 (Binding)</p>
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
                  <h3 className="font-bold text-slate-900 text-lg mb-2">3. Intellectual Property & Content Ownership</h3>
                  <p>
                    Users retain ownership of the content they upload but grant the Platform a worldwide, non-exclusive, royalty-free license to host, display, and distribute said content. 
                    Users warrant that they own all copyrights to uploaded material. The Platform respects the DMCA and will respond to valid takedown notices. 
                    Filing a false DMCA notice is a federal crime; we will pursue damages for fraudulent takedown requests.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">4. Limitation of Liability & Indemnification</h3>
                  <p className="bg-gray-100 p-4 rounded-lg border border-gray-200 font-medium italic">
                    TO THE FULLEST EXTENT PERMITTED BY LAW, THE PLATFORM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, LOSS OF PROFITS, DATA USE, OR GOODWILL. 
                    YOU AGREE TO INDEMNIFY, DEFEND, AND HOLD HARMLESS THE PLATFORM, ITS OWNERS, OFFICERS, AND AFFILIATES FROM ANY CLAIMS, DAMAGES, OBLIGATIONS, LOSSES, LIABILITIES, COSTS OR DEBT, AND EXPENSES (INCLUDING ATTORNEY'S FEES) ARISING FROM YOUR USE OF THE SERVICE OR VIOLATION OF THESE TERMS.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">5. Mandatory Arbitration & Class Action Waiver</h3>
                  <p>
                    <strong>READ THIS SECTION CAREFULLY. IT LIMITS YOUR LEGAL RIGHTS.</strong>
                    Any dispute, claim, or controversy arising out of or relating to these Terms or the breach, termination, enforcement, interpretation, or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by binding arbitration rather than in court.
                    <strong> You agree that you may bring claims against the Platform only in your individual capacity and not as a plaintiff or class member in any purported class or representative proceeding.</strong>
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">6. Termination of Service</h3>
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
                <div className="bg-red-50 border border-red-200 p-5 rounded-lg mb-6">
                  <ul className="list-decimal pl-5 text-sm text-red-900 space-y-3">
                    <li>
                      <strong>Immediate Ban:</strong> Your account will be permanently terminated. You will forfeit all remaining wallet balances, tokens, and purchased content access.
                    </li>
                    <li>
                      <strong>Administrative Penalty:</strong> You agree to pay a <strong>$250.00 USD Administrative Penalty Fee</strong> per individual chargeback instance to cover our dispute resolution costs, legal fees, and merchant fines.
                    </li>
                    <li>
                      <strong>Collections & Credit Reporting:</strong> We assign all unpaid chargeback debts and penalty fees to a third-party collections agency. This activity will be reported to major credit bureaus (Equifax, Experian, TransUnion) and will negatively impact your credit score.
                    </li>
                    <li>
                      <strong>Global Blacklisting:</strong> Your personal identity (Name, Email, IP Address, Device Fingerprint, and Card Hash) will be submitted to global high-risk merchant databases (e.g., BadBuyerList, Ethoca), effectively banning you from thousands of other adult sites and payment processors globally.
                    </li>
                  </ul>
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-4">3. Evidence We Submit to Banks</h3>
                <p className="text-sm text-slate-700 mb-3">
                  We contest 100% of chargebacks. We will provide your issuing bank with a comprehensive evidence dossier that proves you authorized the transaction, including:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Geo-Location & IP Logs at time of purchase</div>
                  <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Device Fingerprinting (OS, Browser, Screen Res)</div>
                  <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Full Chat, Message & Consumption History</div>
                  <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Content Access/Download Timestamps</div>
                  <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> "I Agree to Terms" Click-wrap Timestamp</div>
                  <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> AVS (Address Verification System) Match</div>
                </div>
              </div>
            </div>
          )}

          {/* SHIPPING POLICY TAB */}
          {activeTab === 'shipping' && (
            <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
               <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Fulfillment Policy & Liability Disclaimer</h2>
                <p className="text-sm text-slate-500 mt-1">Regulating the transfer of Digital and Physical Goods.</p>
              </div>

              <div className="space-y-6 text-sm text-slate-700 text-justify">
                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">1. Platform Role & Limitation of Involvement</h3>
                  <div className="bg-orange-50 p-5 rounded-lg border border-orange-200 mb-4">
                    <p className="text-orange-900 leading-relaxed">
                      The Peachy Marketplace acts solely as a venue/facilitator. <strong>WE DO NOT MANUFACTURE, WAREHOUSE, INSPECT, OR SHIP PHYSICAL ITEMS.</strong> 
                      We are not a party to the contract of sale between Buyer and Seller. We accept no liability for lost, damaged, stolen, or seized packages.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">2. Digital Goods Delivery (Automatic)</h3>
                  <p className="mb-2">
                    Transactions for digital content (Photos, Videos, Links, Cam Shows) are deemed "Delivered" and "Accepted" the moment the content is made accessible in the User Dashboard or the Livestream begins.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>No Returns:</strong> Due to the nature of digital data (it cannot be un-seen or un-copied), returns are impossible. All digital sales are final.</li>
                    <li><strong>Access Logs:</strong> Our server logs record the exact timestamp a buyer views or downloads a file. This record serves as absolute proof of delivery for dispute purposes.</li>
                    <li><strong>File Integrity:</strong> If a file is corrupted, you must report it within 24 hours. The Seller is obligated to provide a working replacement.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">3. Physical Goods & Seller Obligations</h3>
                  <p className="mb-2">
                    Sellers listing physical items agree to the following strict conditions:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li><strong>Mandatory Tracking:</strong> Sellers MUST provide a valid tracking number from a major carrier (USPS, UPS, FedEx, DHL) within the handling time specified. Orders without tracking are liable for automatic refund.</li>
                    <li><strong>Risk of Loss:</strong> The risk of loss transfers to the Buyer once the carrier scans the package as "Accepted" or "Picked Up". The Platform is not liable for "Porch Piracy" or misdelivery by carriers.</li>
                    <li><strong>Discreet Packaging:</strong> All items must be shipped in plain, discreet packaging with no indication of the contents on the exterior label to protect Buyer privacy.</li>
                    <li><strong>Customs Seizures:</strong> International Buyers assume all risk regarding customs importation. If an item is seized, the Seller is not obligated to refund unless they misdeclared the item.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">4. Dispute Resolution Timeframes</h3>
                  <p>
                    Failure to report an issue within the designated timeframe constitutes acceptance of the item and waiver of all claims.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div className="bg-white p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-bold text-slate-800 mb-1">Digital Goods</h4>
                      <p className="text-xs text-slate-500">Must open dispute within <span className="text-red-600 font-bold">48 HOURS</span> of purchase.</p>
                    </div>
                    <div className="bg-white p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-bold text-slate-800 mb-1">Physical Goods</h4>
                      <p className="text-xs text-slate-500">Must open dispute within <span className="text-red-600 font-bold">14 DAYS</span> of delivery scan.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY TAB */}
          {activeTab === 'privacy' && (
            <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Privacy & Data Handling</h2>
                <p className="text-sm text-slate-500 mt-1">Balancing User Anonymity with Legal Obligations.</p>
              </div>

              <div className="space-y-6 text-sm text-slate-600 text-justify">
                <section>
                  <h3 className="font-bold text-slate-900 mb-2">1. Cooperation with Law Enforcement</h3>
                  <p>
                    While we value user privacy, The Peachy Marketplace will cooperate fully with law enforcement agencies. 
                    We will disclose user data (including IP addresses, message logs, and transaction details) without a warrant if we reasonably believe it is necessary to prevent:
                    (a) Death or serious physical injury; (b) Fraud or financial crime; (c) The distribution of CSAM.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 mb-2">2. Data Sharing for Fraud Prevention</h3>
                  <p>
                    In the event of a chargeback, payment dispute, or Terms violation, your personal data <strong>will be shared</strong> with:
                    Payment Processors, Card Issuing Banks, Debt Collection Agencies, and Shared Industry Blacklists. 
                    This is necessary to protect the financial integrity of the Platform.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 mb-2">3. Record Retention</h3>
                  <p>
                    We retain all transaction data, verification documents, and access logs for a minimum of <strong>7 years</strong> to comply with IRS/Tax regulations and 18 U.S.C. § 2257 record-keeping requirements. 
                    This data is stored in secure, encrypted environments.
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