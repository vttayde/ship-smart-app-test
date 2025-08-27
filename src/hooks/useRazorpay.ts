'use client'

import { useState } from 'react';
import { CreateOrderData, VerifyPaymentData, razorpayConfig } from '@/lib/razorpay';

// Declare Razorpay global interface
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UseRazorpayProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useRazorpay = ({ onSuccess, onError }: UseRazorpayProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Razorpay script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setIsScriptLoaded(true);
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setIsScriptLoaded(true);
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Create payment order
  const createPaymentOrder = async (orderData: CreateOrderData) => {
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  // Verify payment
  const verifyPayment = async (paymentData: VerifyPaymentData) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  };

  // Initialize payment
  const initiatePayment = async (orderData: CreateOrderData) => {
    setIsLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create payment order
      const order = await createPaymentOrder(orderData);

      // Initialize Razorpay options
      const options = {
        ...razorpayConfig,
        amount: order.amount,
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verificationData: VerifyPaymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            const verification = await verifyPayment(verificationData);
            onSuccess?.(verification);
          } catch (error) {
            onError?.(error);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onError?.(new Error('Payment cancelled by user'));
          }
        },
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone
        },
        notes: {
          booking_id: orderData.bookingId,
          user_id: orderData.userId
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      setIsLoading(false);
      onError?.(error);
    }
  };

  return {
    initiatePayment,
    isLoading,
    isScriptLoaded
  };
};
