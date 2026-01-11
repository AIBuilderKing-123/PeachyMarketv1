import { User, UserRole, Listing, CamRoom, Transaction } from './types';

export const APP_NAME = "The Peachy Marketplace";
export const SLOGAN = "The Ultimate Marketplace for Sex Workers";

// LEAVE EMPTY. This forces the app to use the domain name it is hosted on.
// This fixes the mobile connection error.
export const API_URL = ""; 

// BUNNY CDN CONFIGURATION
export const BUNNY_CDN_CONFIG = {
  ENABLED: true,
  PULL_ZONE_URL: 'https://video.peachy-markets.com',
  RTMP_INGEST_URL: 'rtmp://rtmp-global.bunnycdn.com/live',
};

export const FEES = {
  SERVICE_FEE_PERCENT: 0.07, // 7% Service Fee (Legacy/Aggregate)
  BUYER_FEE_PERCENT: 0.04, // 4% Buyer Fee added to transaction
  SELLER_FEE_PERCENT: 0.04, // 4% Seller Fee deducted from earnings
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
By accessing The Peachy Marketplace, you confirm you are at least 18 years of age. You agree to be bound by these Terms of Service.

2. CONTENT & CONDUCT
All content must adhere to 18 U.S.C. § 2257 record-keeping requirements. Zero tolerance for illegal content.

3. MARKETPLACE & TRANSACTIONS
- Service Fees: A 4% service fee is added to all transactions.
- Payouts: Sellers may withdraw via PayPal or Direct ACH.
- Liability: The Peachy Marketplace acts solely as a platform.

4. CAM ROOMS
- Booking: Fees for reserving cam rooms are non-refundable within 6 hours of the reserved slot.
- Conduct: Performers must adhere to public decency laws applicable to adult streaming.
`;

export const CHARGEBACK_POLICY = `
STRICT CHARGEBACK POLICY - READ CAREFULLY

The Peachy Marketplace has a ZERO-TOLERANCE policy regarding chargebacks.

By making a purchase, you irrevocably agree that you will not initiate a chargeback.
IN THE EVENT OF AN UNAUTHORIZED CHARGEBACK:
1. Your account will be IMMEDIATELY and PERMANENTLY BANNED.
2. Your IP address and identity will be blacklisted.
3. Legal action may be taken to recover funds plus legal fees ($250 min).
`;

export const SHIPPING_POLICY_TEXT = `
The Peachy Marketplace Shipping & Distribution Policy

1. PLATFORM ROLE
We facilitate connections between buyers and sellers. We DO NOT ship items directly.

2. SELLER RESPONSIBILITIES
Sellers are 100% responsible for shipping/distribution.
- Digital Content: Must be delivered via "Automatic Delivery" or private message.
- Physical Items: Must be shipped via tracked carrier within the stated timeframe.
`;