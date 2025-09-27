'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground">
      {/* Top notification bar */}
      <div className="bg-gradient-to-r from-primary to-pink-600 px-4 py-2 text-sm text-center text-primary-foreground">
        Up to 40% off all Save the Dates and Invitations
        <Link href="/designs" className="ml-2 underline cursor-pointer hover:no-underline">
          Explore Designs
        </Link>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo and nav */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <h1 className="text-2xl font-bold">GreenEves</h1>
              </Link>
              <span className="bg-primary-foreground text-primary px-2 py-1 rounded text-xs font-medium">
                New
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 hover:text-accent transition-colors">
                  <span>Plan & Invite</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-foreground">
                  <DropdownMenuItem>
                    <Link href="/designs">Wedding Website</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Save the Dates</DropdownMenuItem>
                  <DropdownMenuItem>Invitations</DropdownMenuItem>
                  <DropdownMenuItem>Guest List</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 hover:text-accent transition-colors">
                  <span>Gift List</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-foreground">
                  <DropdownMenuItem>Create Registry</DropdownMenuItem>
                  <DropdownMenuItem>Browse Gifts</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 hover:text-accent transition-colors">
                  <span>Expert Advice</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-foreground">
                  <DropdownMenuItem>Wedding Planning</DropdownMenuItem>
                  <DropdownMenuItem>Etiquette Guide</DropdownMenuItem>
                  <DropdownMenuItem>Inspiration</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <span className="hidden lg:inline text-sm">Find an Event</span>
            
            <div className="hidden md:block">
              <AuthButtons />
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary/95 backdrop-blur-sm border-t border-primary-foreground/20">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                <div className="border-b border-primary-foreground/20 pb-3">
                  <h3 className="font-semibold text-primary-foreground/80 text-sm uppercase tracking-wide mb-2">Plan & Invite</h3>
                  <div className="space-y-2">
                    <Link href="/designs" className="block py-2 text-primary-foreground hover:text-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      Wedding Website
                    </Link>
                    <div className="block py-2 text-primary-foreground hover:text-accent transition-colors">Save the Dates</div>
                    <div className="block py-2 text-primary-foreground hover:text-accent transition-colors">Invitations</div>
                    <div className="block py-2 text-primary-foreground hover:text-accent transition-colors">Guest List</div>
                  </div>
                </div>

                <div className="border-b border-primary-foreground/20 pb-3">
                  <h3 className="font-semibold text-primary-foreground/80 text-sm uppercase tracking-wide mb-2">Gift List</h3>
                  <div className="space-y-2">
                    <div className="block py-2 text-primary-foreground hover:text-accent transition-colors">Create Registry</div>
                    <div className="block py-2 text-primary-foreground hover:text-accent transition-colors">Browse Gifts</div>
                  </div>
                </div>

                <div className="border-b border-primary-foreground/20 pb-3">
                  <h3 className="font-semibold text-primary-foreground/80 text-sm uppercase tracking-wide mb-2">Expert Advice</h3>
                  <div className="space-y-2">
                    <div className="block py-2 text-primary-foreground hover:text-accent transition-colors">Wedding Planning</div>
                    <div className="block py-2 text-primary-foreground hover:text-accent transition-colors">Etiquette Guide</div>
                    <div className="block py-2 text-primary-foreground hover:text-accent transition-colors">Inspiration</div>
                  </div>
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-primary-foreground/20">
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  <AuthButtons />
                </div>
              </div>

              {/* Find Event Link */}
              <div className="pt-2">
                <div className="text-primary-foreground/80 text-sm">Find an Event</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const AuthButtons = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4" />
          <span className="text-primary-foreground/80">{user.email}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary-foreground hover:text-accent hover:bg-white/10"
          asChild
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSignOut}
          className="text-primary-foreground hover:text-accent hover:bg-white/10"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-accent hover:bg-white/10" asChild>
        <Link href="/login">Log in</Link>
      </Button>
      <Button size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
        <Link href="/register">Get Started</Link>
      </Button>
    </>
  );
};

export default Header;