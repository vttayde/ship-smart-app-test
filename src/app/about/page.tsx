import React from 'react';
import { Navigation, Button, Card } from '@/components';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="about" />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Ship Smart</h1>
          <p className="text-xl text-gray-600">Revolutionizing logistics through smart aggregation</p>
        </div>

        {/* Mission Section */}
        <Card padding="lg" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Ship Smart is on a mission to simplify logistics for everyone. We connect consumers and businesses 
            with multiple courier service providers through one unified platform, making shipping smarter, 
            faster, and more affordable.
          </p>
        </Card>

        {/* What We Do */}
        <Card padding="lg" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🚚 Multi-Courier Integration</h3>
              <p className="text-gray-600">We partner with leading courier services like Delhivery, Shadowfax, Ekart, and BlueDart to give you more choices.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">💰 Price Comparison</h3>
              <p className="text-gray-600">Compare real-time prices across all partners to find the best deal for your shipping needs.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📱 Real-time Tracking</h3>
              <p className="text-gray-600">Track all your packages in one place with live GPS updates across all courier partners.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔐 Secure Platform</h3>
              <p className="text-gray-600">Your data and payments are protected with enterprise-grade security measures.</p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card padding="lg" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">4+</div>
              <p className="text-gray-600">Courier Partners</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <p className="text-gray-600">Cities Covered</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">1M+</div>
              <p className="text-gray-600">Packages Delivered</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">99.5%</div>
              <p className="text-gray-600">On-time Delivery</p>
            </div>
          </div>
        </Card>

        {/* Values */}
        <Card padding="lg" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">🎯 Customer First</h3>
              <p className="text-gray-600">Every decision we make is focused on providing the best experience for our customers.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">🚀 Innovation</h3>
              <p className="text-gray-600">We continuously innovate to make logistics smarter and more efficient.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">🤝 Partnership</h3>
              <p className="text-gray-600">We believe in building strong partnerships with courier services to benefit everyone.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">💡 Transparency</h3>
              <p className="text-gray-600">Clear pricing, honest communication, and transparent processes in everything we do.</p>
            </div>
          </div>
        </Card>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Ship Smart?</h2>
          <p className="text-gray-600 mb-6">Join thousands of customers who trust Ship Smart for their logistics needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/services" size="lg">
              Get Started
            </Button>
            <Button href="/signup" variant="outline" size="lg">
              Create Account
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
