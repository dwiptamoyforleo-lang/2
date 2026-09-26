export type Category = 'All' | 'Outerwear' | 'Tailoring' | 'Silks & Knits' | 'Fine Jewelry' | 'Leather & Artifacts';

export type CapsuleId = 'all' | 'nirvaan' | 'akash' | 'prithvi' | 'kala';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  capsule: CapsuleId;
  capsuleName: string;
  category: Category;
  price: number;
  originalPrice?: number;
  description: string;
  fabricDetails: {
    composition: string;
    weight: string;
    weave: string;
    origin: string;
  };
  craftDetails: {
    artisanHours: number;
    technique: string;
    editionCount: number;
    editionNumber: string;
  };
  images: string[];
  sizes: string[];
  inStock: boolean;
  featured?: boolean;
  editorialQuote?: string;
}

export interface Capsule {
  id: CapsuleId;
  title: string;
  sanskrit: string;
  subtitle: string;
  season: string;
  description: string;
  story: string;
  image: string;
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  monogram?: string;
  quantity: number;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // conversion from USD
}

export interface BespokeBooking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: 'Paris' | 'London' | 'Tokyo' | 'New York' | 'Mumbai' | 'Online Virtual Salon';
  garmentInterest: string;
  preferredDate: string;
  notes: string;
  timestamp: number;
}
