'use client';

import React from 'react';
import { Navigation, Card, Button, ProtectedRoute } from '@/components';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="home" />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to your Dashboard, {user?.firstName}!
            </h1>
            <p className="text-xl text-gray-600">
              This is a protected page that requires authentication.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                {user?.phone && <p><strong>Phone:</strong> {user.phone}</p>}
              </div>
              <div className="mt-4">
                <Button variant="outline">Edit Profile</Button>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button href="/services" className="w-full">
                  Compare Courier Services
                </Button>
                <Button href="/tracking" variant="outline" className="w-full">
                  Track Package
                </Button>
                <Button variant="outline" className="w-full">
                  View Booking History
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
