import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'KES') {
  // Handle null, undefined, or non-numeric values
  if (amount == null || isNaN(amount)) {
    return `${currency} 0.00`
  }

  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  // Format the number with appropriate locale
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  try {
    return formatter.format(numAmount)
  } catch (error) {
    // Fallback formatting if currency is not recognized
    return `${currency} ${numAmount.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
}