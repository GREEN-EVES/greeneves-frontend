'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface RSVPFormProps {
  eventId: string;
  className?: string;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ eventId, className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Replace with actual API endpoint when public RSVP is implemented
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          name: formData.name,
          email: formData.email,
          rsvpStatus: formData.attending === 'yes' ? 'ACCEPTED' : 'DECLINED',
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', attending: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      {submitStatus === 'success' ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
          <p>Your RSVP has been received. We look forward to celebrating with you!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Your Name *
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Will you be attending? *</label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.attending === 'yes' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, attending: 'yes' })}
                className="flex-1"
              >
                Yes, I'll be there!
              </Button>
              <Button
                type="button"
                variant={formData.attending === 'no' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, attending: 'no' })}
                className="flex-1"
              >
                Can't make it
              </Button>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message (Optional)
            </label>
            <Textarea
              id="message"
              placeholder="Share your well wishes..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full"
            />
          </div>

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm">
              Something went wrong. Please try again or contact the event organizer.
            </div>
          )}

          <Button
            type="submit"
            disabled={!formData.name || !formData.attending || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
          </Button>
        </form>
      )}
    </div>
  );
};
