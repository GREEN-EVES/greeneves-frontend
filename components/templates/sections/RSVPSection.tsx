"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface RSVPSectionProps {
  config: {
    showPlusOnes?: boolean;
    showDietaryRestrictions?: boolean;
    showMessage?: boolean;
    rsvpDeadlineDays?: number; // Days before event
  };
  eventData: {
    eventId: string;
    userId: string;
    eventDate: string;
    eventType: "wedding" | "birthday";
  };
}

interface RSVPForm {
  guestName: string;
  email: string;
  response: string;
  message: string;
  dietaryRestrictions: string;
  plusOnesCount: number;
}

export default function RSVPSection({ config, eventData }: RSVPSectionProps) {
  const {
    showPlusOnes = true,
    showDietaryRestrictions = true,
    showMessage = true,
    rsvpDeadlineDays = 30,
  } = config;

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rsvpForm, setRsvpForm] = useState<RSVPForm>({
    guestName: "",
    email: "",
    response: "",
    message: "",
    dietaryRestrictions: "",
    plusOnesCount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/public/rsvp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: eventData.userId,
            guestName: rsvpForm.guestName,
            email: rsvpForm.email,
            response: rsvpForm.response,
            message: rsvpForm.message,
            dietaryRestrictions: rsvpForm.dietaryRestrictions,
            plusOnesCount: rsvpForm.plusOnesCount,
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "RSVP Submitted!",
          description: "Thank you for your response. We can't wait to celebrate with you!",
        });

        // Reset form
        setRsvpForm({
          guestName: "",
          email: "",
          response: "",
          message: "",
          dietaryRestrictions: "",
          plusOnesCount: 0,
        });
      } else {
        throw new Error("Failed to submit RSVP");
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDeadlineDate = () => {
    const eventDate = new Date(eventData.eventDate);
    const deadline = new Date(eventDate);
    deadline.setDate(deadline.getDate() - rsvpDeadlineDays);
    return deadline.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">RSVP</h2>
        <p className="text-lg text-muted-foreground mb-12">
          Please respond by {getDeadlineDate()}
        </p>

        <Card className="p-8">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <Input
                  required
                  value={rsvpForm.guestName}
                  onChange={(e) =>
                    setRsvpForm({ ...rsvpForm, guestName: e.target.value })
                  }
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={rsvpForm.email}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Attendance */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Will you be attending? *
                </label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={rsvpForm.response === "attending" ? "default" : "outline"}
                    onClick={() => setRsvpForm({ ...rsvpForm, response: "attending" })}
                    className="flex-1"
                  >
                    Yes, I'll be there!
                  </Button>
                  <Button
                    type="button"
                    variant={
                      rsvpForm.response === "not_attending" ? "default" : "outline"
                    }
                    onClick={() =>
                      setRsvpForm({ ...rsvpForm, response: "not_attending" })
                    }
                    className="flex-1"
                  >
                    Sorry, can't make it
                  </Button>
                </div>
              </div>

              {/* Conditional fields for attending */}
              {rsvpForm.response === "attending" && (
                <>
                  {showPlusOnes && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Number of additional guests
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="3"
                        value={rsvpForm.plusOnesCount}
                        onChange={(e) =>
                          setRsvpForm({
                            ...rsvpForm,
                            plusOnesCount: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  )}

                  {showDietaryRestrictions && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Dietary restrictions or allergies
                      </label>
                      <Input
                        value={rsvpForm.dietaryRestrictions}
                        onChange={(e) =>
                          setRsvpForm({
                            ...rsvpForm,
                            dietaryRestrictions: e.target.value,
                          })
                        }
                        placeholder="None, vegetarian, gluten-free, etc."
                      />
                    </div>
                  )}
                </>
              )}

              {/* Message */}
              {showMessage && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message for the {eventData.eventType === "wedding" ? "couple" : "celebrant"}
                  </label>
                  <Textarea
                    value={rsvpForm.message}
                    onChange={(e) =>
                      setRsvpForm({ ...rsvpForm, message: e.target.value })
                    }
                    placeholder="Share your congratulations or memories..."
                    rows={3}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !rsvpForm.guestName || !rsvpForm.response}
              >
                {loading ? "Submitting..." : "Submit RSVP"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
