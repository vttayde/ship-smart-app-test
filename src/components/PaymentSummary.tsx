'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRazorpay } from '@/hooks/useRazorpay';
import { CreateOrderData } from '@/lib/razorpay';

interface PaymentSummaryProps {
  booking: {
    id: string;
    route: string;
    weight: number;
    courierPartner: string;
    price: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  onPaymentSuccess?: (data: any) => void;
  onPaymentError?: (error: any) => void;
}

export default function PaymentSummary({ 
  booking, 
  user, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentSummaryProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const { initiatePayment, isLoading } = useRazorpay({
    onSuccess: (data) => {
      setPaymentStatus('success');
      onPaymentSuccess?.(data);
    },
    onError: (error) => {
      setPaymentStatus('error');
      setError(error.message || 'Payment failed');
      onPaymentError?.(error);
    }
  });

  const handlePayment = async () => {
    setPaymentStatus('processing');
    setError('');

    const orderData: CreateOrderData = {
      amount: booking.price * 100, // Convert to paise
      bookingId: booking.id,
      userId: user.id,
      customerEmail: user.email,
      customerPhone: user.phone,
      customerName: user.name
    };

    await initiatePayment(orderData);
  };

  const gst = booking.price * 0.18; // 18% GST
  const totalAmount = booking.price + gst;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Booking Details */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Route:</span>
            <span className="font-medium">{booking.route}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Weight:</span>
            <span className="font-medium">{booking.weight} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Courier:</span>
            <span className="font-medium">{booking.courierPartner}</span>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping Cost:</span>
            <span>₹{booking.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST (18%):</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Status Messages */}
        {paymentStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            ✅ Payment successful! Your booking is confirmed.
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            ❌ {error}
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isLoading || paymentStatus === 'processing' || paymentStatus === 'success'}
          className="w-full"
          size="lg"
        >
          {isLoading || paymentStatus === 'processing' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </>
          ) : paymentStatus === 'success' ? (
            'Payment Completed ✅'
          ) : (
            `Pay ₹${totalAmount.toFixed(2)}`
          )}
        </Button>

        {/* Razorpay Info */}
        <div className="text-center text-xs text-gray-500">
          <p>Secure payment powered by</p>
          <div className="flex items-center justify-center mt-1">
            <span className="font-bold text-blue-600">Razorpay</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
