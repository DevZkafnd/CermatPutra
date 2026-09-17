/**
 * UI Types for Frontend Components
 * Contains type definitions for map, carousel, and other UI components
 */

// ============================================================================
// Map Component Types
// ============================================================================

export interface Location {
  lat: number;
  lng: number;
}

export interface BillingAddress {
  province: string;
  city: string;
  district: string;
  postalCode: string;
  fullAddress: string;
  location?: Location;
}

export interface MapComponentProps {
  location?: Location;
  address?: BillingAddress;
  onLocationChange?: (location: Location) => void;
  interactive?: boolean;
  onMapClick?: () => void;
}

export interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: Location;
  onSave: (location: Location) => void;
}

// ============================================================================
// Carousel Component Types
// ============================================================================

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  label?: string;
  judul?: string;
  deskripsi?: string;
  tombolUtama?: string;
  tombolSekunder?: string;
  hrefUtama?: string;
  hrefSekunder?: string;
  gambar?: string;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
  aspectRatio?: string;
}

export interface CarouselState {
  currentIndex: number;
  isAnimating: boolean;
}

// ============================================================================
// Form Component Types
// ============================================================================

export interface FormInputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
}

export interface FormTextAreaProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}
