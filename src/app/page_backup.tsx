import React from 'react';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="home" />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Ship Smart with
            <span className="text-blue-600"> Multiple Couriers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Compare prices from Delhivery, Shadowfax, Ekart and more. 
            Book shipments and track in real-time through one unified platform.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button href="/book-shipment" size="lg">
              Start Shipping
            </Button>
            <Button href="/tracking" variant="outline" size="lg">
              Track Package
            </Button>
          </div>

          {/* Demo Links */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button href="/payments" variant="outline" size="sm">
              💳 Payment Demo
            </Button>
            <Button href="/maps-demo" variant="outline" size="sm">
              🗺️ Maps Demo
            </Button>
            <Button href="/ai-dashboard" variant="outline" size="sm">
              🤖 AI Dashboard
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card>
            <div className="text-3xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Multi-Courier Integration</h3>
            <p className="text-gray-600">Compare prices from multiple courier providers and choose the best option for your needs.</p>
          </Card>
          
          <Card>
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Smart Comparison</h3>
            <p className="text-gray-600">Find the best rates and delivery options with our intelligent comparison system.</p>
          </Card>
          
          <Card>
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-gray-600">Track your packages in real-time with live GPS tracking across all partner couriers.</p>
          </Card>
        </div>

        {/* Partners Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Trusted Partner Couriers</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">Delhivery</div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">Shadowfax</div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">Ekart</div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">BlueDart</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <span className="text-xl font-bold">📦 Ship Smart</span>
            <p className="mt-2 text-gray-400">Your partner for smart logistics solutions</p>
            <p className="mt-4 text-sm text-gray-500">© 2025 Ship Smart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
