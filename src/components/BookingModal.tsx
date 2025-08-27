'use client';

import React, { useState } from 'react';
import { Button, Card, Input } from '@/components';
import { createBooking } from '@/lib/api';
import type { CourierService, BookingRequest } from '@/lib/api';

interface BookingModalProps {
  service: CourierService;
  isOpen: boolean;
  onClose: () => void;
  searchParams: {
    from: string;
    to: string;
    weight: number;
  };
}

export default function BookingModal({ service, isOpen, onClose, searchParams }: BookingModalProps) {
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData: BookingRequest = {
        courierId: service.id,
        from: searchParams.from,
        to: searchParams.to,
        weight: searchParams.weight,
        senderDetails: {
          name: formData.senderName,
          phone: formData.senderPhone,
          address: formData.senderAddress,
        },
        receiverDetails: {
          name: formData.receiverName,
          phone: formData.receiverPhone,
          address: formData.receiverAddress,
        },
      };

      await createBooking(bookingData);
      setSuccess(true);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your package has been booked with {service.name}. You will receive a tracking ID shortly.</p>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Book with {service.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Service Summary */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{service.name} {service.logo}</p>
              <p className="text-sm text-gray-600">{searchParams.from} → {searchParams.to}</p>
              <p className="text-sm text-gray-600">Weight: {searchParams.weight}kg</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">₹{service.price}</p>
              <p className="text-sm text-gray-600">Delivery: {service.estimatedDays}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sender Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sender Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone Number"
                name="senderPhone"
                type="tel"
                value={formData.senderPhone}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              label="Address"
              name="senderAddress"
              value={formData.senderAddress}
              onChange={handleChange}
              className="mt-4"
              required
            />
          </div>

          {/* Receiver Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Receiver Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone Number"
                name="receiverPhone"
                type="tel"
                value={formData.receiverPhone}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              label="Address"
              name="receiverAddress"
              value={formData.receiverAddress}
              onChange={handleChange}
              className="mt-4"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
