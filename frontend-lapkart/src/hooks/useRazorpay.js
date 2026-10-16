import { useCallback } from 'react';

/**
 * useRazorpay — dynamically loads the Razorpay checkout script and
 * returns a function to open the payment popup.
 *
 * Usage:
 *   const openRazorpay = useRazorpay();
 *   openRazorpay({ options, onSuccess, onFailure });
 */
const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  const openRazorpay = useCallback(async ({ options, onSuccess, onFailure }) => {
    const loaded = await loadScript(RAZORPAY_SCRIPT_URL);
    if (!loaded) {
      onFailure?.('Razorpay SDK failed to load. Check your internet connection.');
      return;
    }
    const rzp = new window.Razorpay({
      ...options,
      handler: (response) => onSuccess?.(response),
      modal: {
        ondismiss: () => onFailure?.('Payment cancelled by user'),
      },
    });
    rzp.on('payment.failed', (response) => {
      onFailure?.(response.error?.description || 'Payment failed');
    });
    rzp.open();
  }, []);

  return openRazorpay;
}
