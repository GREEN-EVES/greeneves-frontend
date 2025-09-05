import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold">Green Eves</h3>
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Create beautiful wedding websites and invitations with thousands of design combinations. 
              Your perfect wedding, designed in minutes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Wedding Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Wedding Services</h4>
            <ul className="space-y-3 text-primary-foreground/80">
              <li><Link href="#" className="hover:text-accent transition-colors">Wedding Websites</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Save the Dates</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Wedding Invitations</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">RSVP Management</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Guest List Tools</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Support</h4>
            <ul className="space-y-3 text-primary-foreground/80">
              <li><Link href="#" className="hover:text-accent transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Design Guidelines</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Wedding Etiquette</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Live Chat</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Company</h4>
            <ul className="space-y-3 text-primary-foreground/80">
              <li><Link href="#" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Press</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Partnerships</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-6 text-sm text-primary-foreground/80">
              <span>&copy; 2024 Green Eves. All rights reserved.</span>
              <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-accent transition-colors">Cookie Policy</Link>
            </div>
            <div className="text-sm text-primary-foreground/80">
              Made with <Heart className="h-4 w-4 inline mx-1 fill-current" /> for couples worldwide
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;