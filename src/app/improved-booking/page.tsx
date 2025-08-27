'use client'

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';

interface Courier {
  id: string;
  name: string;
  icon: string;
  price: number;
  rating: number;
  deliveryTime: string;
  features: string[];
  badge?: string;
}

export default function ImprovedBookingPage() {
  const [showComparison, setShowComparison] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);

  const couriers: Courier[] = [
    {
      id: 'delhivery',
      name: 'DELHIVERY',
      icon: '🚚',
      price: 120,
      rating: 4.2,
      deliveryTime: '1-2 Business Days',
      badge: '🛡️ Insurance Included',
      features: [
        '✅ Free Pickup from Home',
        '✅ SMS & Email Updates',
        '✅ Proof of Delivery',
        '✅ Customer Support'
      ]
    },
    {
      id: 'shadowfax',
      name: 'SHADOWFAX',
      icon: '🏍️',
      price: 150,
      rating: 4.5,
      deliveryTime: 'Same Day Delivery',
      badge: '🚀 Express Service',
      features: [
        '✅ Same Day Delivery',
        '✅ Live GPS Tracking',
        '✅ Priority Handling',
        '✅ Instant Notifications'
      ]
    },
    {
      id: 'ekart',
      name: 'EKART',
      icon: '📦',
      price: 95,
      rating: 4.0,
      deliveryTime: '2-3 Business Days',
      badge: '💰 Budget Friendly',
      features: [
        '✅ Most Affordable Option',
        '✅ Reliable Network',
        '✅ Wide Coverage',
        '✅ Standard Tracking'
      ]
    }
  ];

  const handleSearch = () => {
    setShowComparison(true);
  };

  const handleSelectCourier = (courier: Courier) => {
    setSelectedCourier(courier);
    // In a real app, this would redirect to payment/booking confirmation
    alert(`Selected ${courier.name} for ₹${courier.price}`);
  };

  if (!showComparison) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="book" />
        
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              📦 Send Your Parcel<br />Anywhere in India
            </h1>
            <p className="text-xl text-gray-600">
              Compare. Book. Track. Delivered.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-2">FROM</label>
                <select className="p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Bangalore</option>
                  <option>Chennai</option>
                  <option>Kolkata</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-2">TO</label>
                <select className="p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Delhi</option>
                  <option>Mumbai</option>
                  <option>Pune</option>
                  <option>Hyderabad</option>
                  <option>Ahmedabad</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-2">WEIGHT</label>
                <select className="p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>1 KG</option>
                  <option>2 KG</option>
                  <option>5 KG</option>
                  <option>10 KG</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="invisible mb-2">Search</label>
                <Button 
                  onClick={handleSearch}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  SEARCH
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                🚚
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Multiple Couriers</h3>
              <p className="text-gray-600">Delhivery, Shadowfax, Ekart & more</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                💰
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Best Prices</h3>
              <p className="text-gray-600">Compare rates from all partners</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                📱
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Real-time Tracking</h3>
              <p className="text-gray-600">Live GPS tracking for your parcels</p>
            </div>
          </div>

          {/* Stats */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600">📊 Trusted by 10,000+ Customers</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="book" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => setShowComparison(false)}
          className="text-blue-600 font-semibold mb-6 hover:underline"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-gray-900">
            📍 Mumbai → Delhi | 📦 1kg Package
          </h2>
          <p className="text-gray-600">
            🔢 {couriers.length} Services Available | 💰 Starting from ₹{Math.min(...couriers.map(c => c.price))}
          </p>
        </div>

        {/* Courier Cards */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {couriers.map((courier) => (
            <div key={courier.id} className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* Courier Info */}
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{courier.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{courier.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span className="text-2xl font-bold text-blue-600">₹{courier.price}</span>
                      <span>⭐ {courier.rating}/5.0</span>
                      <span>📅 {courier.deliveryTime}</span>
                      <span>{courier.badge}</span>
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <Button 
                  onClick={() => handleSelectCourier(courier)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 whitespace-nowrap"
                >
                  SELECT THIS
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-sm text-gray-600">
                {courier.features.map((feature, index) => (
                  <span key={index}>{feature}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            💡 Need help choosing? Call us at{' '}
            <span className="text-blue-600 font-semibold">1800-XXX-XXXX</span>
          </p>
        </div>

        {/* Additional Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/ai-dashboard">
            <Button variant="outline" className="px-6 py-3">
              🤖 Try AI Optimization
            </Button>
          </Link>
          <Link href="/tracking">
            <Button variant="outline" className="px-6 py-3">
              📍 Track Existing Order
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
