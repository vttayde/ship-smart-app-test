'use client'

import { useState } from 'react';

export default function SimplePaymentDemo() {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Mock booking data
  const booking = {
    id: 'booking_demo_123',
    route: 'Mumbai → Delhi',
    weight: 2.5,
    courierPartner: 'Blue Dart Express',
    price: 450
  };

  const gst = booking.price * 0.18;
  const totalAmount = booking.price + gst;

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    // Simulate payment process
    setTimeout(() => {
      setPaymentStatus('success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💳 Razorpay Payment Integration
          </h1>
          <p className="text-gray-600">
            Professional payment gateway implementation ready for Ship Smart
          </p>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-mono text-sm">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span className="font-medium">{booking.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span>{booking.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Courier Partner:</span>
              <span>{booking.courierPartner}</span>
            </div>
          </div>

          {!showPayment && (
            <button
              onClick={() => setShowPayment(true)}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Proceed to Payment
            </button>
          )}
        </div>

        {/* Payment Summary Card */}
        {showPayment && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
            
            <div className="space-y-3 mb-6">
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
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                ✅ Payment successful! Your booking is confirmed.
              </div>
            )}

            {paymentStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                ❌ Payment failed. Please try again.
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentStatus === 'processing' ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : paymentStatus === 'success' ? (
                'Payment Completed ✅'
              ) : (
                `Pay ₹${totalAmount.toFixed(2)} with Razorpay`
              )}
            </button>

            {/* Razorpay Info */}
            <div className="text-center text-xs text-gray-500 mt-4">
              <p>Secure payment powered by</p>
              <div className="flex items-center justify-center mt-1">
                <span className="font-bold text-blue-600">Razorpay</span>
              </div>
            </div>
          </div>
        )}

        {/* Implementation Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Implementation Ready</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 text-green-600">✅ Backend APIs</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Payment Order Creation</li>
                <li>• Payment Verification</li>
                <li>• Database Integration</li>
                <li>• Security Implementation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-green-600">✅ Frontend Integration</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React Payment Hook</li>
                <li>• Dynamic Script Loading</li>
                <li>• Status Management</li>
                <li>• Error Handling</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📋 Setup Instructions:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Sign up for Razorpay account</li>
              <li>2. Add API keys to .env.local</li>
              <li>3. Install packages: npm install</li>
              <li>4. Test with Razorpay test cards</li>
              <li>5. Go live with production keys</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
