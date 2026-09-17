// Statuses where order can be cancelled
export const CANCELLABLE_STATUSES = ['MENUNGGU_PEMBAYARAN', 'DIKEMAS'] as const;

// Check if order can be cancelled based on status
export function canCancelOrder(status: string): boolean {
  return CANCELLABLE_STATUSES.includes(status as any);
}

// Get status display name
export function getStatusDisplayName(status: string): string {
  return status.replace(/_/g, ' ');
}
