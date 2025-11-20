'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useTemplateStore } from '@/stores/template';
import { useEventStore } from '@/stores/event';
import { useUIStore } from '@/stores/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Sparkles, Save, Plus, X } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';

function EventSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams?.get('template');

  const { user, isAuthenticated, isInitialized, isLoading: authLoading } = useAuthStore();
  const { currentTemplate, fetchTemplate } = useTemplateStore();
  const { currentEvent, createEvent, updateEvent, fetchEvents } = useEventStore();
  const showToast = useUIStore((state) => state.showToast);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [checkingOwnership, setCheckingOwnership] = useState(false);
  const [ownershipChecked, setOwnershipChecked] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Track last validated template to prevent duplicate validation errors
  const lastValidatedTemplateId = useRef<string | null>(null);

  // Image URLs
  const [coverImageUrl, setCoverImageUrl] = useState(currentEvent?.coverImageUrl || '');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(currentEvent?.galleryImages || []);

  // Form state
  const [eventType, setEventType] = useState<'WEDDING' | 'BIRTHDAY'>(
    currentEvent?.eventType ? currentEvent.eventType.toUpperCase() as 'WEDDING' | 'BIRTHDAY' : 'WEDDING'
  );
  const [eventName, setEventName] = useState(currentEvent?.eventName || '');
  const [eventDate, setEventDate] = useState(
    currentEvent?.eventDate ? new Date(currentEvent.eventDate).toISOString().split('T')[0] : ''
  );
  const [eventTime, setEventTime] = useState(currentEvent?.eventTime || '');
  const [venueName, setVenueName] = useState(currentEvent?.venueName || '');
  const [venueAddress, setVenueAddress] = useState(currentEvent?.venueAddress || '');

  // Wedding-specific
  const [brideName, setBrideName] = useState(currentEvent?.brideName || '');
  const [groomName, setGroomName] = useState(currentEvent?.groomName || '');
  const [ourStory, setOurStory] = useState(currentEvent?.ourStory || '');

  // Birthday-specific
  const [celebrantName, setCelebrantName] = useState(currentEvent?.celebrantName || '');
  const [age, setAge] = useState<number | undefined>(currentEvent?.age);
  const [birthdayMessage, setBirthdayMessage] = useState(currentEvent?.birthdayMessage || '');

  // Settings
  const [rsvpEnabled, setRsvpEnabled] = useState(currentEvent?.rsvpEnabled ?? true);

  useEffect(() => {
    // Wait for auth to fully initialize (not loading anymore)
    if (!isInitialized || authLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (templateId) {
      fetchTemplate(templateId);
    }
    fetchEvents();
  }, [isInitialized, authLoading, isAuthenticated, templateId, router, fetchTemplate, fetchEvents]);

  // Sync form state with loaded event
  useEffect(() => {
    if (currentEvent) {
      console.log('📋 Loading event data:', currentEvent);

      // Populate all form fields from loaded event
      if (currentEvent.eventType) {
        setEventType(currentEvent.eventType.toUpperCase() as 'WEDDING' | 'BIRTHDAY');
      }
      setEventName(currentEvent.eventName || '');
      setEventDate(currentEvent.eventDate ? new Date(currentEvent.eventDate).toISOString().split('T')[0] : '');
      setEventTime(currentEvent.eventTime || '');
      setVenueName(currentEvent.venueName || '');
      setVenueAddress(currentEvent.venueAddress || '');

      // Images
      setCoverImageUrl(currentEvent.coverImageUrl || '');
      setGalleryUrls(currentEvent.galleryImages || []);
      console.log('📸 Loaded images:', {
        cover: currentEvent.coverImageUrl,
        gallery: currentEvent.galleryImages,
      });

      // Wedding fields
      setBrideName(currentEvent.brideName || '');
      setGroomName(currentEvent.groomName || '');
      setOurStory(currentEvent.ourStory || '');

      // Birthday fields
      setCelebrantName(currentEvent.celebrantName || '');
      setAge(currentEvent.age);
      setBirthdayMessage(currentEvent.birthdayMessage || '');

      // Settings
      setRsvpEnabled(currentEvent.rsvpEnabled ?? true);
    }
  }, [currentEvent]);

  // Automatically set event type based on template (only for new events)
  // For existing events, validate template matches event type ONLY when selecting a new template
  useEffect(() => {
    if (!currentTemplate) return;

    // IMPORTANT: If user is editing existing event without selecting a new template,
    // skip validation entirely (they're just editing content, not changing template)
    if (currentEvent && !templateId) {
      console.log('📝 Edit mode without new template - skipping validation');
      return;
    }

    // CRITICAL FIX: Only validate if the loaded template matches the URL template ID
    // This prevents validating with stale template data during template switching
    if (templateId && currentTemplate.id !== templateId) {
      console.log('⏳ Waiting for correct template to load...');
      console.log('URL wants:', templateId, 'but currentTemplate is:', currentTemplate.id);
      return;
    }

    // Skip if we already validated this template
    if (lastValidatedTemplateId.current === currentTemplate.id) {
      return;
    }

    if (!currentEvent) {
      // Creating new event - set event type from template
      console.log('✅ Template loaded:', currentTemplate.name);
      console.log('Template eventType:', currentTemplate.eventType);

      if (currentTemplate.eventType) {
        console.log('Setting eventType to:', currentTemplate.eventType);
        setEventType(currentTemplate.eventType);
      }
      lastValidatedTemplateId.current = currentTemplate.id;
    } else {
      // Editing existing event WITH new template selection - validate template matches event type
      const templateType = currentTemplate.eventType?.toUpperCase();
      const eventTypeUpper = currentEvent.eventType?.toUpperCase();

      console.log('🔍 Validating NEW template against existing event');
      console.log('Template type:', templateType);
      console.log('Event type:', eventTypeUpper);

      if (templateType && eventTypeUpper && templateType !== eventTypeUpper) {
        showToast(
          `Template type mismatch: This is a ${templateType.toLowerCase()} template, but your event is a ${eventTypeUpper.toLowerCase()} event. Please select a ${eventTypeUpper.toLowerCase()} template.`,
          'error'
        );
        lastValidatedTemplateId.current = currentTemplate.id;
        setTimeout(() => {
          router.push('/designs');
        }, 2000);
      } else {
        // Template matches - mark as validated
        console.log('✅ Template type matches event type');
        lastValidatedTemplateId.current = currentTemplate.id;
      }
    }
  }, [currentTemplate, currentEvent, templateId, showToast, router]);

  // Check template ownership when template is loaded
  useEffect(() => {
    const checkTemplateOwnership = async () => {
      // Skip check if no template
      if (!currentTemplate) return;

      // Reset ownership check when template changes
      if (currentTemplate.id !== lastValidatedTemplateId.current) {
        setOwnershipChecked(false);
      }

      // Skip check if already checked for this specific template
      if (ownershipChecked) return;

      // Free templates don't need ownership check
      if (!currentTemplate.isPremium) {
        setOwnershipChecked(true);
        return;
      }

      setCheckingOwnership(true);
      try {
        const response = await api.get(`/payments/check-ownership/${currentTemplate.id}`);
        console.log('🔐 Ownership check:', response.data);

        if (!response.data.hasAccess) {
          // User doesn't have access to this premium template
          showToast(
            `This is a premium template (₦${currentTemplate.price?.toLocaleString()}). Please purchase it first.`,
            'error'
          );

          // Redirect back to design gallery after a short delay
          setTimeout(() => {
            router.push('/designs');
          }, 3000);
        } else {
          setOwnershipChecked(true);
        }
      } catch (error) {
        console.error('Failed to check template ownership:', error);
        showToast('Failed to verify template access', 'error');
        // Don't allow proceeding on ownership check failure for premium templates
        setTimeout(() => {
          router.push('/designs');
        }, 2000);
      } finally {
        setCheckingOwnership(false);
      }
    };

    checkTemplateOwnership();
  }, [currentTemplate, ownershipChecked, showToast, router]);

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('album', 'covers');

      console.log('📤 Uploading cover image...');
      const response = await api.post('/uploads/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('📥 Response received:', response.data);

      // Backend returns: { message: string, data: { url, publicId, width, height } }
      const imageUrl = response.data.data?.url || response.data.url;

      if (!imageUrl) {
        throw new Error('No URL in response');
      }

      setCoverImageUrl(imageUrl);
      showToast('Cover image uploaded successfully!', 'success');
    } catch (error) {
      console.error('❌ Upload error:', error);
      if (error instanceof Error) {
        showToast(`Upload failed: ${error.message}`, 'error');
      } else {
        showToast('Failed to upload cover image', 'error');
      }
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (galleryUrls.length + files.length > 10) {
      showToast('Maximum 10 gallery images allowed', 'error');
      return;
    }

    setUploadingGallery(true);
    try {
      console.log(`📤 Uploading ${files.length} gallery image(s)...`);
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('album', 'gallery');

        const response = await api.post('/uploads/photos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Backend returns: { message: string, data: { url, publicId, width, height } }
        const imageUrl = response.data.data?.url || response.data.url;
        if (!imageUrl) {
          throw new Error('No URL in response');
        }
        return imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('✅ Gallery uploads successful:', uploadedUrls);
      setGalleryUrls([...galleryUrls, ...uploadedUrls]);
      showToast(`${files.length} image(s) uploaded successfully!`, 'success');
    } catch (error) {
      console.error('❌ Gallery upload error:', error);
      if (error instanceof Error) {
        showToast(`Upload failed: ${error.message}`, 'error');
      } else {
        showToast('Failed to upload gallery images', 'error');
      }
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const eventData: Record<string, unknown> = {
        eventType: eventType.toLowerCase(), // Convert to lowercase for backend
        eventName,
        eventDate: new Date(eventDate).toISOString(),
        eventTime: eventTime || undefined,
        venueName: venueName || undefined,
        venueAddress: venueAddress || undefined,
        selectedTemplateId: currentTemplate?.id || templateId,
        rsvpEnabled,
        coverImageUrl: coverImageUrl || undefined,
        galleryImages: galleryUrls.length > 0 ? galleryUrls : undefined,
      };

      if (eventType === 'WEDDING') {
        eventData.brideName = brideName || undefined;
        eventData.groomName = groomName || undefined;
        eventData.ourStory = ourStory || undefined;
      } else {
        eventData.celebrantName = celebrantName || undefined;
        eventData.age = age || undefined;
        eventData.birthdayMessage = birthdayMessage || undefined;
      }

      if (currentEvent) {
        await updateEvent(currentEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }

      showToast('Event saved successfully!', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showToast('Failed to save event', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (currentEvent?.publicSlug) {
      window.open(`/events/${currentEvent.publicSlug}`, '_blank');
    } else if (currentTemplate?.slug) {
      window.open(`/designs/${currentTemplate.slug}`, '_blank');
    }
  };

  const handlePublish = async () => {
    await handleSaveDraft();
    if (currentEvent?.publicSlug) {
      router.push(`/events/${currentEvent.publicSlug}`);
    }
  };

  if (!isInitialized || authLoading || checkingOwnership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          {authLoading && <p className="text-gray-600">Checking authentication...</p>}
          {checkingOwnership && <p className="text-gray-600">Verifying template access...</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentEvent ? 'Edit Your Event' : 'Create Your Event'}
          </h1>
          <p className="text-gray-600">
            {currentTemplate && `Using ${currentTemplate.name} template`}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={handleSaveDraft}
            disabled={isSaving || !eventName || !eventDate}
            variant="outline"
            className="flex-1 border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 font-semibold"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            onClick={handlePreview}
            variant="outline"
            className="font-semibold transition-all"
            style={{
              borderWidth: '2px',
              borderColor: 'hsl(68 61% 34%)',
              color: 'hsl(68 61% 34%)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(68 61% 34%)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'hsl(68 61% 34%)';
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={handlePublish}
            disabled={!eventName || !eventDate}
            className="font-semibold text-white shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: 'hsl(68 61% 34%)', borderColor: 'hsl(68 61% 34%)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(68 61% 28%)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'hsl(68 61% 34%)')}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>

        {/* Main Form */}
        <Card className="shadow-md border-gray-200">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100">
            <CardTitle className="text-2xl">Event Details</CardTitle>
            <CardDescription className="text-base">Fill in your event information below</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="specific">{eventType === 'WEDDING' ? 'Wedding' : 'Birthday'}</TabsTrigger>
                <TabsTrigger value="venue">Venue</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Event Type</Label>
                  <div className="mt-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-2 border-primary/30 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">
                      Based on your selected template
                    </p>
                    <p className="text-xl font-semibold text-primary">
                      {eventType === 'WEDDING' ? '💒 Wedding' : '🎂 Birthday'}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <Label htmlFor="eventName" className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                    Event Name *
                  </Label>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g., Sarah & Michael's Wedding"
                    required
                    className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white h-11"
                  />
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Date & Time</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventDate" className="text-sm font-semibold text-gray-600 mb-2 block">
                        Event Date *
                      </Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                        className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventTime" className="text-sm font-semibold text-gray-600 mb-2 block">
                        Event Time
                      </Label>
                      <Input
                        id="eventTime"
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="rsvpEnabled"
                      checked={rsvpEnabled}
                      onChange={(e) => setRsvpEnabled(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <Label htmlFor="rsvpEnabled" className="cursor-pointer text-base font-semibold text-gray-700">
                      Enable RSVP feature
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 ml-8 mt-1">
                    Allow guests to respond to your invitation
                  </p>
                </div>
              </TabsContent>

              {/* Wedding/Birthday Specific Tab */}
              <TabsContent value="specific" className="space-y-6 mt-6">
                {eventType === 'WEDDING' ? (
                  <>
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Couple Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="brideName" className="text-sm font-semibold text-gray-600 mb-2 block">
                            Bride's Name
                          </Label>
                          <Input
                            id="brideName"
                            value={brideName}
                            onChange={(e) => setBrideName(e.target.value)}
                            placeholder="e.g., Sarah"
                            className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white h-11"
                          />
                        </div>
                        <div>
                          <Label htmlFor="groomName" className="text-sm font-semibold text-gray-600 mb-2 block">
                            Groom's Name
                          </Label>
                          <Input
                            id="groomName"
                            value={groomName}
                            onChange={(e) => setGroomName(e.target.value)}
                            placeholder="e.g., Michael"
                            className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white h-11"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <Label htmlFor="ourStory" className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                        Your Love Story
                      </Label>
                      <Textarea
                        id="ourStory"
                        value={ourStory}
                        onChange={(e) => setOurStory(e.target.value)}
                        placeholder="Share how you met and your journey together..."
                        rows={6}
                        className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white resize-none"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Tell your guests the story of your relationship
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Celebrant Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="celebrantName" className="text-sm font-semibold text-gray-600 mb-2 block">
                            Celebrant's Name
                          </Label>
                          <Input
                            id="celebrantName"
                            value={celebrantName}
                            onChange={(e) => setCelebrantName(e.target.value)}
                            placeholder="e.g., Alex"
                            className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white h-11"
                          />
                        </div>
                        <div>
                          <Label htmlFor="age" className="text-sm font-semibold text-gray-600 mb-2 block">
                            Age (Optional)
                          </Label>
                          <Input
                            id="age"
                            type="number"
                            value={age || ''}
                            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="e.g., 30"
                            className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white h-11"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <Label htmlFor="birthdayMessage" className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                        Birthday Message
                      </Label>
                      <Textarea
                        id="birthdayMessage"
                        value={birthdayMessage}
                        onChange={(e) => setBirthdayMessage(e.target.value)}
                        placeholder="Share a special message for your guests..."
                        rows={6}
                        className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white resize-none"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Add a personal message to make the celebration special
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Venue Tab */}
              <TabsContent value="venue" className="space-y-6 mt-6">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <Label htmlFor="venueName" className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                    Venue Name
                  </Label>
                  <Input
                    id="venueName"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g., The Grand Ballroom"
                    className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white h-11"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the name of your event venue
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <Label htmlFor="venueAddress" className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                    Venue Address
                  </Label>
                  <Textarea
                    id="venueAddress"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="123 Elegant Street, Victoria Island, Lagos"
                    rows={3}
                    className="bg-gray-50 border-gray-300 focus:border-primary focus:bg-white resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Provide the full address so guests can easily find the venue
                  </p>
                </div>
              </TabsContent>

              {/* Photos Tab */}
              <TabsContent value="photos" className="space-y-6 mt-6">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <Label htmlFor="coverImage" className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                    Cover Image
                  </Label>
                  <div className="mt-2">
                    <input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      disabled={uploadingCover}
                      className="block w-full text-sm text-gray-600
                        file:mr-4 file:py-2.5 file:px-5
                        file:rounded-lg file:border-2 file:border-primary/30
                        file:text-sm file:font-semibold
                        file:bg-primary/5 file:text-primary
                        hover:file:bg-primary/10 hover:file:border-primary/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all cursor-pointer"
                    />
                    {uploadingCover && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <p className="text-sm text-gray-600">Uploading...</p>
                      </div>
                    )}
                  </div>
                  {coverImageUrl && (
                    <div className="mt-4 relative h-48 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                      <Image
                        src={coverImageUrl}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Main image for your event page. Recommended: 1920x1080px
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <Label htmlFor="galleryImages" className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 block">
                    Gallery Images ({galleryUrls.length}/10)
                  </Label>
                  <div className="mt-2">
                    <input
                      id="galleryImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageUpload}
                      disabled={uploadingGallery || galleryUrls.length >= 10}
                      className="block w-full text-sm text-gray-600
                        file:mr-4 file:py-2.5 file:px-5
                        file:rounded-lg file:border-2 file:border-primary/30
                        file:text-sm file:font-semibold
                        file:bg-primary/5 file:text-primary
                        hover:file:bg-primary/10 hover:file:border-primary/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all cursor-pointer"
                    />
                    {uploadingGallery && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <p className="text-sm text-gray-600">Uploading images...</p>
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Add up to 10 images. You can select multiple files at once.
                    </p>
                  </div>

                  {/* Gallery Preview */}
                  {galleryUrls.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Gallery Preview ({galleryUrls.length} {galleryUrls.length === 1 ? 'image' : 'images'})
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {galleryUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={url}
                              alt={`Gallery ${index + 1}`}
                              width={200}
                              height={150}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-md"
                              title="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EventSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event setup...</p>
        </div>
      </div>
    }>
      <EventSetupContent />
    </Suspense>
  );
}
