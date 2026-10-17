import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Indian Currency string without unwanted decimals (e.g. 5603.040000000008 -> "5,603")
 * Defaults to rounded integer rupees to prevent floating-point precision artifacts anywhere in the UI.
 */
export function formatPrice(amount, { decimals = 0 } = {}) {
  if (amount == null || amount === '') return '0';
  const num = Number(amount);
  if (isNaN(num)) return '0';

  if (decimals === 0) {
    return Math.round(num).toLocaleString('en-IN');
  }

  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a number as Indian Currency with the ₹ symbol (e.g. 5603.040000000008 -> "₹5,603")
 */
export function formatCurrency(amount, options) {
  return `₹${formatPrice(amount, options)}`;
}

