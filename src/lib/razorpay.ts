import Razorpay from 'razorpay';

// Server-side Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Client-side configuration
export const razorpayConfig = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  currency: 'INR',
  name: 'Ship Smart',
  description: 'Logistics & Courier Services',
  image: '/logo.png', // Add your logo
  theme: {
    color: '#3B82F6'
  }
};

// Payment order creation interface
export interface CreateOrderData {
  amount: number; // in paise (₹1 = 100 paise)
  bookingId: string;
  userId: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
}

// Payment verification interface
export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
