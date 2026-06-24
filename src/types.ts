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

export interface Salon {
  id: string;
  name: string;
  area: 'Indiranagar' | 'Koramangala' | 'Whitefield' | 'Jayanagar' | 'HSR Layout' | 'Banaswadi' | 'Hebbal';
  rating: number;
  reviewCount: number;
  priceRange: '₹₹' | '₹₹₹' | '₹₹₹₹';
  images: string[];
  services: Service[];
  openHours: string;
  specialties: string[];
  isLuxury: boolean;
  isFeatured: boolean;
  description: string;
  reviewsCount: number;
  reviews: Review[];
  offerTitle?: string;
  offerDesc?: string;
  offerCode?: string;
}

export interface Booking {
  id: string;
  salonId: string;
  salonName: string;
  service: Service;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  status: 'confirmed' | 'pending';
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
