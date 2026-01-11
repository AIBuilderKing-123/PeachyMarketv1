import { User, UserRole, Listing, CamRoom, Transaction } from './types';

export const APP_NAME = "The Peachy Marketplace";
export const SLOGAN = "The Ultimate Marketplace for Sex Workers";
export const API_URL = "https://thepeachyhub.com/api";

// BUNNY CDN CONFIGURATION
// Replace these values with your actual BunnyCDN Stream details when deploying.
export const BUNNY_CDN_CONFIG = {
  ENABLED: true, // Toggle to false to use placeholder graphics instead of video player
  PULL_ZONE_URL: 'https://video.peachy-markets.com', // Your connected hostname or b-cdn.net URL
  RTMP_INGEST_URL: 'rtmp://rtmp-global.bunnycdn.com/live', // Standard BunnyCDN Ingest
  // In a real app, you would fetch the stream key securely from your backend
};

export const FEES = {
  BUYER_FEE_PERCENT: 0.04, // 4% charged to buyer
  SELLER_FEE_PERCENT: 0.04, // 4% charged to seller
  TOKEN_SPLIT_SELLER: 0.85, // 85%
  TOKEN_SPLIT_OWNER: 0.15, // 15%
  VIP_TOKEN_SPLIT_SELLER: 0.90, // 90%
  DIAMOND_TOKEN_SPLIT_SELLER: 0.95, // 95%
  CAM_BLOCK_PRICE: 5.00,
  CAM_BLOCK_PRICE_VIP: 2.50,
  CAM_BLOCK_PRICE_DIAMOND: 0,
  STICKY_PRICE: 2.00,
  PREMIUM_STICKY_PRICE: 20.00,
};

// Initial Room Configuration (Structural)
export const INITIAL_CAM_ROOMS: CamRoom[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  viewers: 0,
  isLive: false,
  menuOptions: [
    { id: 'm1', label: 'Blow Kiss', cost: 50 },
    { id: 'm2', label: 'Flash Boobs', cost: 500 },
    { id: 'm3', label: 'Spank', cost: 200 },
    { id: 'm4', label: 'Oil Show', cost: 2000 },
    { id: 'm5', label: 'Feet Worship', cost: 1000 },
  ],
  bookedSlots: []
}));

export const TERMS_TEXT = `
1. ACCEPTANCE OF TERMS
By accessing The Peachy Marketplace, you confirm you are at least 18 years of age. You agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.

2. CONTENT & CONDUCT
All content uploaded to The Peachy Marketplace must strictly adhere to 18 U.S.C. § 2257 record-keeping requirements. We have a zero-tolerance policy for illegal content. Harassment, hate speech, and fraudulent behavior will result in an immediate permanent ban.

3. MARKETPLACE & TRANSACTIONS
- Service Fees: A 4% service fee is charged to the Buyer and a 4% service fee is deducted from the Seller on all marketplace transactions.
- Payouts: Sellers may withdraw funds via PayPal or Direct ACH (Melio).
- Liability: The Peachy Marketplace acts solely as a platform. We are not a party to any transaction between buyers and sellers.

4. CAM ROOMS
- Booking: Fees for reserving cam rooms are non-refundable within 6 hours of the reserved slot.
- Conduct: Performers must adhere to public decency laws applicable to adult streaming.

5. TERMINATION
We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
`;

export const CHARGEBACK_POLICY = `
STRICT CHARGEBACK POLICY - READ CAREFULLY

The Peachy Marketplace has a ZERO-TOLERANCE policy regarding chargebacks.

By making a purchase on this website (including but not limited to: content, tokens, memberships, and sticky posts), you irrevocably agree that you will not initiate a chargeback with your payment provider or bank.

IN THE EVENT OF AN UNAUTHORIZED CHARGEBACK:
1. Your account will be IMMEDIATELY and PERMANENTLY BANNED.
2. Your IP address, device fingerprint, and personal identity information will be blacklisted.
3. We reserve the right to report your identity and transaction details to relevant anti-fraud databases (e.g., BadBuyerList).
4. Legal action may be taken to recover the funds plus any applicable legal fees ($250 minimum administrative fee per instance) and costs associated with the recovery.

If you have an issue with a purchase, you MUST contact staff@peachy-markets.com for resolution before contacting your bank.
`;

export const SHIPPING_POLICY_TEXT = `
The Peachy Marketplace Shipping & Distribution Policy

1. PLATFORM ROLE
The Peachy Marketplace is a platform only. We facilitate connections between buyers and sellers. We DO NOT ship physical items, distribute digital content directly, or handle delivery logistics.

2. SELLER RESPONSIBILITIES
Sellers are 100% responsible for all shipping, distribution, and delivery of items.
- Digital Content: Must be delivered via the "Automatic Delivery" system or private message immediately upon purchase.
- Physical Items: Must be shipped via a tracked carrier (USPS, UPS, FedEx) within the timeframe stated in the listing.

3. BUYER RESPONSIBILITIES
Buyers must provide accurate delivery information. Buyers must read listing descriptions carefully regarding delivery methods.

4. DISPUTES
All shipping and delivery disputes must be submitted through our official support system. Do not initiate a PayPal chargeback without first contacting support.
`;