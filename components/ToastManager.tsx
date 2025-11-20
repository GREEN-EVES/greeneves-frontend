'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/stores/ui';
import { toast } from '@/hooks/use-toast';

/**
 * ToastManager bridges the UI store's toast state to the shadcn/ui toast system.
 * This allows components to use showToast() from the UI store,
 * and the toasts will be displayed using the shadcn/ui Toaster component.
 */
export function ToastManager() {
  const toastState = useUIStore((state) => state.toast);

  useEffect(() => {
    if (toastState && toastState.open) {
      // Map UI store toast types to shadcn/ui variants
      const variant = toastState.type === 'error' ? 'destructive' : 'default';

      // Determine title based on type
      const title =
        toastState.type === 'success' ? 'Success' :
        toastState.type === 'error' ? 'Error' :
        toastState.type === 'warning' ? 'Warning' :
        'Info';

      // Show the toast using shadcn/ui
      toast({
        variant,
        title,
        description: toastState.message,
      });
    }
  }, [toastState]);

  return null; // This component doesn't render anything
}
