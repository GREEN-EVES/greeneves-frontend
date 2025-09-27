"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import Header from "@/components/Header";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  ArrowLeft,
  Check,
  X,
  UserPlus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  relationship?: string;
  guestType: 'guest' | 'plus_one' | 'child';
  invitedBy?: string;
  rsvpStatus?: 'attending' | 'not_attending' | 'pending';
  createdAt: string;
}

export default function GuestManagementPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'not_attending' | 'pending'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    relationship: "",
    guestType: "guest" as const
  });

  const fetchGuests = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching guests...');
      const response = await api.get('/guests');
      console.log('📡 API Response:', response);
      console.log('📊 Response data:', response.data);
      
      const guestsData = response.data;
      console.log('🎯 Guests data type:', typeof guestsData);
      console.log('📋 Is array?', Array.isArray(guestsData));
      console.log('📝 Guests data:', guestsData);
      
      // Extract guests array from nested response
      const guestsArray = guestsData.guests || guestsData;
      console.log('🎯 Extracted guests array:', guestsArray);
      console.log('📋 Is guests array?', Array.isArray(guestsArray));
      
      // Ensure we always set an array and map RSVP status
      let finalGuests = Array.isArray(guestsArray) ? guestsArray : [];
      
      // Add rsvpStatus field based on rsvps array
      finalGuests = finalGuests.map(guest => ({
        ...guest,
        rsvpStatus: guest.rsvps && guest.rsvps.length > 0 
          ? guest.rsvps[0].response 
          : 'pending'
      }));
      
      console.log('✅ Setting guests to:', finalGuests);
      setGuests(finalGuests);
    } catch (error) {
      console.error('❌ Error fetching guests:', error);
      // Set empty array on error
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      console.log('🚀 useEffect triggered, calling fetchGuests...');
      fetchGuests();
    }
  }, [isAuthenticated, isLoading, router]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/guests', newGuest);
      console.log('Guest added response:', response.data); // Debug log
      
      // Add the new guest to local state
      if (response.data) {
        setGuests(prev => Array.isArray(prev) ? [...prev, response.data] : [response.data]);
      }
      
      // Also refetch the guests list to ensure sync with backend
      await fetchGuests();
      
      setNewGuest({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        relationship: "",
        guestType: "guest"
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };

  const filteredGuests = Array.isArray(guests) ? guests.filter(guest => {
    const fullName = `${guest.firstName || ''} ${guest.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || guest.rsvpStatus === filterStatus;
    return matchesSearch && matchesFilter;
  }) : [];

  console.log('🔄 Current guests state:', guests);
  console.log('📊 Guests count:', Array.isArray(guests) ? guests.length : 'Not array');
  console.log('🔍 Filtered guests:', filteredGuests);
  console.log('📈 Filtered count:', filteredGuests.length);

  const guestStats = {
    total: Array.isArray(guests) ? guests.length : 0,
    attending: Array.isArray(guests) ? guests.filter(g => g.rsvpStatus === 'attending').length : 0,
    notAttending: Array.isArray(guests) ? guests.filter(g => g.rsvpStatus === 'not_attending').length : 0,
    pending: Array.isArray(guests) ? guests.filter(g => g.rsvpStatus === 'pending').length : 0
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                Guest Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your wedding guest list and track RSVPs
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{guestStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Guests</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{guestStats.attending}</p>
                  <p className="text-sm text-muted-foreground">Attending</p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{guestStats.notAttending}</p>
                  <p className="text-sm text-muted-foreground">Not Attending</p>
                </div>
                <X className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{guestStats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <UserPlus className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'pending', 'attending', 'not_attending'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status)}
                    size="sm"
                  >
                    {status === 'all' ? 'All' : 
                     status === 'not_attending' ? 'Not Attending' : 
                     status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Guest Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Guest</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <Input
                      required
                      value={newGuest.firstName}
                      onChange={(e) => setNewGuest({...newGuest, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <Input
                      required
                      value={newGuest.lastName}
                      onChange={(e) => setNewGuest({...newGuest, lastName: e.target.value})}
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      value={newGuest.phone}
                      onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Relationship</label>
                    <Input
                      value={newGuest.relationship}
                      onChange={(e) => setNewGuest({...newGuest, relationship: e.target.value})}
                      placeholder="Friend, Family, Colleague"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Guest Type</label>
                    <select
                      value={newGuest.guestType}
                      onChange={(e) => setNewGuest({...newGuest, guestType: e.target.value as 'guest' | 'plus_one' | 'child'})}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="guest">Guest</option>
                      <option value="plus_one">Plus One</option>
                      <option value="child">Child</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Guest</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Guest List */}
        <Card>
          <CardHeader>
            <CardTitle>Guest List ({filteredGuests.length})</CardTitle>
            <CardDescription>
              Manage your wedding guests and track their RSVP status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredGuests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No guests found</h3>
                <p className="text-muted-foreground mb-4">
                  {guests.length === 0 ? "Start by adding your first guest" : "Try adjusting your search or filter"}
                </p>
                {guests.length === 0 && (
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Guest
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGuests.map((guest, index) => {
                  console.log(`🎯 Rendering guest ${index}:`, guest);
                  return (
                  <div key={guest.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {guest.firstName?.charAt(0) || '?'}{guest.lastName?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{guest.firstName || 'Unknown'} {guest.lastName || ''}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {guest.email && (
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {guest.email}
                            </span>
                          )}
                          {guest.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {guest.phone}
                            </span>
                          )}
                        </div>
                        {guest.relationship && (
                          <p className="text-xs text-muted-foreground">{guest.relationship}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          guest.rsvpStatus === 'attending' ? 'default' :
                          guest.rsvpStatus === 'not_attending' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {guest.rsvpStatus === 'attending' ? 'Attending' :
                         guest.rsvpStatus === 'not_attending' ? 'Not Attending' : 
                         'Pending'}
                      </Badge>
                      <Badge variant="outline">
                        {guest.guestType?.replace('_', ' ') || 'Guest'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}