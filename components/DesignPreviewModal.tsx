'use client';

import React, { useState } from 'react';
import { Heart, X, Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/auth';
import { useDesignStore } from '@/stores/design';
import type { DesignTemplate } from '@/types';
import { useRouter } from 'next/navigation';

interface DesignPreviewModalProps {
  template: DesignTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

const getColorHex = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    cream: '#F5F5DC',
    gold: '#FFD700',
    purple: '#8B5CF6',
    green: '#10B981',
    silver: '#C0C0C0',
    white: '#FFFFFF',
    beige: '#F5F5DC',
    brown: '#8B4513',
    blue: '#3B82F6',
    pink: '#EC4899',
    black: '#000000',
  };
  
  return colorMap[color.toLowerCase()] || '#6B7280';
};

const DesignPreviewModal: React.FC<DesignPreviewModalProps> = ({
  template,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { toggleFavorite, selectTemplate, isLoading, error } = useDesignStore();
  const [isSelecting, setIsSelecting] = useState(false);

  if (!template) return null;

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    await toggleFavorite(template.id);
  };

  const handleSelectTemplate = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsSelecting(true);
    try {
      await selectTemplate(template.id);
      onClose();
      // Could show success message or redirect to customization
    } catch (err) {
      // Error is handled in the store
    } finally {
      setIsSelecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold">{template.name}</span>
              {template.isPremium && (
                <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  <Crown className="h-3 w-3" />
                  <span>Premium</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className={`${template.isFavorited ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            >
              <Heart className={`h-5 w-5 ${template.isFavorited ? 'fill-current' : ''}`} />
            </Button>
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{template.category}</span>
              <span>•</span>
              <span>{template.collection}</span>
              {template.isPremium && template.price && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-primary">${template.price}</span>
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Preview Image */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={template.previewUrl || template.imageUrl}
                alt={`${template.name} preview`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Color Palette */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Color Palette</h4>
              <div className="flex space-x-2">
                {template.colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className="text-xs text-muted-foreground capitalize">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {template.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {template.description}
                </p>
              </div>
            )}

            {template.features && template.features.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Features Included</h4>
                <div className="space-y-2">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleSelectTemplate}
                disabled={isSelecting || isLoading}
                className="w-full"
                size="lg"
              >
                {isSelecting ? 'Selecting...' : 'Use This Design'}
              </Button>
              
              {!template.isPremium && (
                <p className="text-center text-xs text-green-600 font-medium">
                  Free Template
                </p>
              )}
              
              {template.isPremium && (
                <p className="text-center text-xs text-muted-foreground">
                  Premium features include advanced customization, priority support, and more
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesignPreviewModal;