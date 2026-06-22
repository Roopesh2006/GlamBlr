export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  area: string;
}

export interface Service {
  name: string;
  price: number;
  duration: string;
  category: 'Hair' | 'Skin' | 'Nails' | 'Bridal' | 'Spa' | 'Grooming';
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  validUntil: string;
  code: string;
  isActive: boolean;
}

export interface Salon {
  id: string;
  name: string;
  area: 'Indiranagar' | 'Koramangala' | 'Whitefield' | 'Jayanagar' | 'HSR Layout' | 'Banaswadi';
  rating: number;
  reviewCount: number;
  priceRange: '$$' | '$$$' | '$$$$';
  images: string[];
  services: Service[];
  openHours: string;
  specialties: string[];
  isLuxury: boolean;
  isFeatured: boolean;
  description: string;
  reviewsCount: number;
  reviews: Review[];
  offers?: Offer[];
  phone?: string;
  email?: string;
  address?: string;
}

export interface Booking {
  id: string;
  salonId: string;
  salonName: string;
  service: Service;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

export interface QuizQA {
  id: number;
  question: string;
  options: {
    label: string;
    icon: string;
    value: string;
  }[];
}
