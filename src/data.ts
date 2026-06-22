import { Salon } from './types';

export const LUX_SALONS: Salon[] = [
  {
    id: '1',
    name: 'Maison de l\u2019Or',
    area: 'Indiranagar',
    rating: 4.9,
    reviewCount: 342,
    priceRange: '$$$$',
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Balayage & Couture Toning', price: 9500, duration: '180 mins', category: 'Hair' },
      { name: 'Kerastase Chronologiste Caviar Rite', price: 6500, duration: '90 mins', category: 'Hair' },
      { name: 'Bridal Glow-Up Signature Makeup', price: 25000, duration: '240 mins', category: 'Bridal' },
      { name: 'Caviar Radiance Luxury Facial', price: 7500, duration: '75 mins', category: 'Skin' },
      { name: 'Nail extensions with 24K Gold Leaf', price: 4500, duration: '90 mins', category: 'Nails' }
    ],
    openHours: '09:00 AM - 09:00 PM',
    specialties: ['French Balayage', 'Hair Botox', 'High-End Bridal Makeup'],
    isLuxury: true,
    isFeatured: true,
    description: 'Nestled in the upscale heart of Indiranagar, Maison de l\u2019Or is Bangalore\u2019s premier salon sanctuary. Drawing inspiration from luxury Parisian boudoirs, we deliver absolute perfection using premium elixir treatments, custom color diagnostics, and master-crafted styles.',
    reviewsCount: 342,
    reviews: [
      { id: 'r1', author: 'Ananya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', rating: 5, text: 'The absolute pinnacle of luxury. The gold leaf manicures and Kerastase rituals are unmatched. Truly world-class services!', date: '2 days ago', area: 'Indiranagar' },
      { id: 'r2', author: 'Rohan Sen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', rating: 5, text: 'Extremely professional stylists. The luxury atmosphere and exquisite coffee made my day. Recommended for couture coloring.', date: '1 week ago', area: 'Koramangala' }
    ],
    offers: [
      { id: 'o1', title: 'Summer Glow Package', description: '20% off on all facial treatments this month', discountPercent: 20, validUntil: '2026-07-31', code: 'GLOW20', isActive: true },
      { id: 'o2', title: 'Bridal Early Bird', description: 'Book bridal package 3 months ahead and get 15% off', discountPercent: 15, validUntil: '2026-12-31', code: 'BRIDE15', isActive: true }
    ],
    phone: '+91 80 4123 4567',
    email: 'bonjour@maisondelor.com',
    address: '100 Feet Road, Indiranagar, Bangalore'
  },
  {
    id: '2',
    name: 'Aura Premium Wellness',
    area: 'Koramangala',
    rating: 4.8,
    reviewCount: 218,
    priceRange: '$$$',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Luxury Deep Tissue Massage', price: 4800, duration: '90 mins', category: 'Spa' },
      { name: 'HydraFacial Platinum Glow', price: 6200, duration: '60 mins', category: 'Skin' },
      { name: 'Aroma Infused Steam & Soak', price: 3000, duration: '45 mins', category: 'Spa' },
      { name: 'Advanced Collagen Infusing Facial', price: 5500, duration: '75 mins', category: 'Skin' }
    ],
    openHours: '10:00 AM - 08:30 PM',
    specialties: ['Luxury Spa Treatments', 'HydraFacials', 'Collagen Therapies'],
    isLuxury: true,
    isFeatured: true,
    description: 'Aura Premium Wellness offers a transcendent escape from the city\u2019s concrete noise. Unwind in private state-of-the-art therapist rooms with customizable aromatherapy profiles, state-of-the-art oxygen-infused showers, and elite skincare solutions.',
    reviewsCount: 218,
    reviews: [
      { id: 'r3', author: 'Meera Hegde', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', rating: 5, text: 'The HydroFacial is incredibly revitalizing. Exceptional care and extremely polite staff. It feels like a 5-star resort.', date: '3 days ago', area: 'Koramangala' }
    ],
    offers: [
      { id: 'o3', title: 'Weekend Spa Retreat', description: 'Buy 2 spa treatments, get 1 free on weekends', discountPercent: 33, validUntil: '2026-08-15', code: 'WEEKEND33', isActive: true }
    ],
    phone: '+91 80 4222 8888',
    address: '7th Block, Koramangala, Bangalore'
  },
  {
    id: '3',
    name: 'The Gilded Groom',
    area: 'Indiranagar',
    rating: 4.7,
    reviewCount: 184,
    priceRange: '$$$',
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Royal Charcoal Shave & Massage', price: 2200, duration: '50 mins', category: 'Grooming' },
      { name: 'Master Barber Haircut & Sculpt', price: 1800, duration: '45 mins', category: 'Grooming' },
      { name: 'Beard Detox Therapy with Beard Oil', price: 1200, duration: '30 mins', category: 'Grooming' },
      { name: 'Men\u2019s Brightening Skin Ritual', price: 3500, duration: '60 mins', category: 'Skin' }
    ],
    openHours: '09:30 AM - 09:00 PM',
    specialties: ['Barber Journeymen Styles', 'Beard Micro-Sculpting', 'Executive Facials'],
    isLuxury: false,
    isFeatured: true,
    description: 'An elite, modern gentleman\u2019s lounge focusing strictly on high-level grooming, razor sculpting, hair styling, and executive skincare. Enjoy aged fine single-malt aromas, luxury leather recliners, and precision care.',
    reviewsCount: 184,
    reviews: [
      { id: 'r4', author: 'Karan Malhotra', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150', rating: 4.5, text: 'Awesome haircut and extremely clean shave. They pay attention to the smallest details. Best grooming club in BLR.', date: '5 days ago', area: 'HSR Layout' }
    ],
    offers: [
      { id: 'o4', title: 'First Visit Special', description: '25% off your first grooming package', discountPercent: 25, validUntil: '2026-09-30', code: 'FIRST25', isActive: true }
    ],
    phone: '+91 80 4567 8901',
    address: '12th Main, Indiranagar, Bangalore'
  },
  {
    id: '4',
    name: 'Velours Luxury Skin Clinic',
    area: 'Whitefield',
    rating: 4.9,
    reviewCount: 289,
    priceRange: '$$$',
    images: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1626015508386-8fa0dc926cd9?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Glow Dwell Peptide Facial', price: 5800, duration: '60 mins', category: 'Skin' },
      { name: 'Brightening Pigment Peel', price: 4500, duration: '45 mins', category: 'Skin' },
      { name: 'Nourishing Sea Minerals Mask', price: 3200, duration: '40 mins', category: 'Skin' },
      { name: 'Premium Bride Gold Facial Prep', price: 9000, duration: '90 mins', category: 'Bridal' }
    ],
    openHours: '10:00 AM - 08:00 PM',
    specialties: ['Advanced Dermal Therapy', 'Glow Hydrators', 'Organic Herb Peels'],
    isLuxury: true,
    isFeatured: false,
    description: 'Velours Luxury Skin Clinic pairs clinical precision with pure organic pampering. Our licensed dermal specialists utilize laser diagnostics and advanced peptide formulations to unlock your skin\u2019s biological glow.',
    reviewsCount: 289,
    reviews: [
      { id: 'r5', author: 'Sonal Mittal', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', rating: 5, text: 'Absolutely spectacular. The Gold Facial Prep made my face radiant for weeks. The skin analysis is extremely professional.', date: '1 week ago', area: 'Whitefield' }
    ],
    phone: '+91 80 4789 0123',
    address: 'ITPL Road, Whitefield, Bangalore'
  },
  {
    id: '5',
    name: 'Tress & Co. Salon',
    area: 'Jayanagar',
    rating: 4.6,
    reviewCount: 156,
    priceRange: '$$',
    images: [
      'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Keratin Ultra Strengthening Treatment', price: 4200, duration: '120 mins', category: 'Hair' },
      { name: 'Precision Women\u2019s Cut & Wave', price: 1800, duration: '60 mins', category: 'Hair' },
      { name: 'Vibrant Root Retouch & Gloss', price: 2500, duration: '75 mins', category: 'Hair' }
    ],
    openHours: '10:00 AM - 08:30 PM',
    specialties: ['Keratin Restructuring', 'Balayage Highlights', 'Volumizing Blowouts'],
    isLuxury: false,
    isFeatured: false,
    description: 'Tress & Co. is a vibrant, modern high-street hair studio in Jayanagar. Specializing in advanced texture management, vibrant fashion pigments, and bouncy, high-density blowouts that turn heads.',
    reviewsCount: 156,
    reviews: [
      { id: 'r6', author: 'Preeti G.', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=150', rating: 5, text: 'Best blowout I\u2019ve received in South Bangalore. Outstanding stylists who understand Indian hair density wonderfully.', date: '4 days ago', area: 'Jayanagar' }
    ],
    offers: [
      { id: 'o5', title: 'Student Special', description: '15% off for students with valid ID', discountPercent: 15, validUntil: '2026-12-31', code: 'STUDENT15', isActive: true }
    ],
    phone: '+91 80 4901 2345',
    address: '4th Block, Jayanagar, Bangalore'
  },
  {
    id: '6',
    name: 'The Crown & Coat',
    area: 'Whitefield',
    rating: 4.8,
    reviewCount: 198,
    priceRange: '$$$$',
    images: [
      'https://images.unsplash.com/photo-1633681926035-ec1ac984418a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Hair Botox & Silk Infusion', price: 8500, duration: '150 mins', category: 'Hair' },
      { name: 'Japanese Head Spa Treatment', price: 5000, duration: '75 mins', category: 'Spa' },
      { name: 'Classic French Manicure Luxe', price: 2800, duration: '50 mins', category: 'Nails' },
      { name: 'Olaplex Bond Rebuilding Rit', price: 4500, duration: '60 mins', category: 'Hair' }
    ],
    openHours: '09:00 AM - 09:30 PM',
    specialties: ['Japanese Scalp Spa', 'Hair Botox', 'High-End Nail Art'],
    isLuxury: true,
    isFeatured: true,
    description: 'Spanning across a spacious glass mansion in Whitefield, The Crown & Coat acts as the go-to aesthetic house for IT founders and elite executives. Famous for its authentic 11-step Japanese head spa treatment.',
    reviewsCount: 198,
    reviews: [
      { id: 'r7', author: 'Aishwarya R.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150', rating: 4.8, text: 'The Japanese Head Spa is worth every single rupee. Pure, celestial bliss! My scalp feels incredibly clean.', date: '3 weeks ago', area: 'Whitefield' }
    ],
    phone: '+91 80 5123 4567',
    address: 'Hope Farm Junction, Whitefield, Bangalore'
  },
  {
    id: '7',
    name: 'Vogue Nails & Lashes',
    area: 'HSR Layout',
    rating: 4.5,
    reviewCount: 124,
    priceRange: '$$',
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Acrylic Extensions with custom nail art', price: 3500, duration: '90 mins', category: 'Nails' },
      { name: 'Gel Overlay & Luxury Mani-Pedi', price: 2200, duration: '70 mins', category: 'Nails' },
      { name: 'Classic Lash extensions - Volume Lift', price: 4000, duration: '120 mins', category: 'Skin' },
      { name: 'Chic Chrome Polish Upgrade', price: 1200, duration: '30 mins', category: 'Nails' }
    ],
    openHours: '10:30 AM - 08:30 PM',
    specialties: ['Custom Acrylic Extensions', 'Matte Nail Coatings', 'Volume Lash Mapping'],
    isLuxury: false,
    isFeatured: false,
    description: 'Bangalore\u2019s specialized hub for beautiful nail designs and premium eyelash lifts. Over 200 high-end colors and decals imported from Japan and Korea, applied in an ultra-chic pink and gray interior.',
    reviewsCount: 124,
    reviews: [
      { id: 'r8', author: 'Divya Gowda', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', rating: 4, text: 'Love my new extensions! The nail artist took her time and executed the mood board perfectly.', date: '1 day ago', area: 'HSR Layout' }
    ],
    phone: '+91 80 5345 6789',
    address: '27th Main, HSR Layout, Bangalore'
  },
  {
    id: '8',
    name: 'Royal Heritage Bridal Lounge',
    area: 'Jayanagar',
    rating: 5.0,
    reviewCount: 147,
    priceRange: '$$$$',
    images: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Couture Sabyasachi Style Bridal Makeup', price: 35000, duration: '300 mins', category: 'Bridal' },
      { name: 'Luxury Haldi / Mehendi Organic Glow', price: 12000, duration: '120 mins', category: 'Bridal' },
      { name: 'Bridesmaid Silk Blowout & Contour', price: 6500, duration: '90 mins', category: 'Bridal' },
      { name: 'Premium Hair Crown Saree Draping', price: 4000, duration: '60 mins', category: 'Bridal' }
    ],
    openHours: '08:00 AM - 08:00 PM',
    specialties: ['Heirloom South Indian Bridal Styles', 'Traditional Saree Artistry', 'HD Airbrush Makeup'],
    isLuxury: true,
    isFeatured: true,
    description: 'Serving three generations of premium South Bangalore families, Royal Heritage Bridal Lounge is the definitive word in heirloom makeup, saree draping, and luxury glow-ups.',
    reviewsCount: 147,
    reviews: [
      { id: 'r9', author: 'Shruthi Nair', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', rating: 5, text: 'They made me look and feel like absolute royalty on my wedding day. Precision saree wrapping and makeup that lasted 16 hours.', date: '5 days ago', area: 'Jayanagar' }
    ],
    offers: [
      { id: 'o6', title: 'Bridal Package Deal', description: 'Complete bridal package at 30% off during off-season', discountPercent: 30, validUntil: '2026-08-31', code: 'BRIDAL30', isActive: true }
    ],
    phone: '+91 80 5567 8901',
    address: '3rd Block, Jayanagar, Bangalore'
  },
  {
    id: '9',
    name: 'The Zen Retreat & Salon',
    area: 'Banaswadi',
    rating: 4.6,
    reviewCount: 92,
    priceRange: '$$',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Thai Herbal Compress Wellness Massage', price: 3500, duration: '80 mins', category: 'Spa' },
      { name: 'Deep Cleansing Sea Salt Body Scrub', price: 2800, duration: '60 mins', category: 'Spa' },
      { name: 'Restorative Aloe Vera Organic Facial', price: 2200, duration: '50 mins', category: 'Skin' }
    ],
    openHours: '10:00 AM - 08:30 PM',
    specialties: ['Herbal Compress Therapy', 'Reflexology', 'Hydrating Body Wraps'],
    isLuxury: false,
    isFeatured: false,
    description: 'The Zen Retreat offers organic therapies, herbal oil compresses, and high-level skin care in a tranquil, wood-carved, garden-surrounded Banaswadi paradise.',
    reviewsCount: 92,
    reviews: [
      { id: 'r10', author: 'Priyanka Das', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150', rating: 4.5, text: 'A lovely hidden gem in Banaswadi. Perfect massage and amazing green tea afterward. Very soothing interior.', date: '2 weeks ago', area: 'Banaswadi' }
    ],
    phone: '+91 80 5789 0123',
    address: 'Banaswadi Main Road, Bangalore'
  },
  {
    id: '10',
    name: 'Couture Tresses & Nails',
    area: 'HSR Layout',
    rating: 4.7,
    reviewCount: 162,
    priceRange: '$$$',
    images: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Balayage Color Melting & Silk Treatment', price: 8200, duration: '150 mins', category: 'Hair' },
      { name: 'Acrylic Ombre Nail Sets Luxe', price: 3800, duration: '80 mins', category: 'Nails' },
      { name: 'Anti-Pollution Carbon Peeling Glow', price: 4200, duration: '60 mins', category: 'Skin' }
    ],
    openHours: '10:00 AM - 09:00 PM',
    specialties: ['Hair Ombre & Melt', 'Luxury Nail Sets', 'Carbon Facial Peeling'],
    isLuxury: true,
    isFeatured: false,
    description: 'Combining dynamic young hair specialists with an extreme master nail art studio, Couture Tresses features the most modern color gradients, neon nails, and deep hair botox treatments in HSR Layout.',
    reviewsCount: 162,
    reviews: [
      { id: 'r11', author: 'Nitya Reddy', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', rating: 5, text: 'Awesome experience! The ombre extensions are stunning and they have a separate luxurious hair wash room.', date: '6 days ago', area: 'HSR Layout' }
    ],
    phone: '+91 80 5901 2345',
    address: 'Sector 2, HSR Layout, Bangalore'
  },
  {
    id: '11',
    name: 'Blanc Luxe Barbershop',
    area: 'Koramangala',
    rating: 4.8,
    reviewCount: 175,
    priceRange: '$$$',
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Royal Sandalwood Shave & Scrub', price: 2500, duration: '60 mins', category: 'Grooming' },
      { name: 'Signature Hair Sculpt & Steam Hot Towel', price: 1900, duration: '50 mins', category: 'Grooming' },
      { name: 'Men\u2019s Brightening Gold Mud Pack', price: 2800, duration: '40 mins', category: 'Skin' }
    ],
    openHours: '09:00 AM - 09:00 PM',
    specialties: ['Sandalwood Beard Spa', 'Precision Cuts', 'Hot Towel Therapies'],
    isLuxury: true,
    isFeatured: false,
    description: 'Bringing clean traditional Italian barbering to Koramangala, Blanc Luxe has premium marble counters, gold plated instruments, and signature aromatherapy steam hot towels.',
    reviewsCount: 175,
    reviews: [
      { id: 'r12', author: 'Varun Bhatia', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', rating: 5, text: 'Best master trim of my life. The hot sandalwood pack is incredibly relaxing after a long week of work.', date: '1 week ago', area: 'Koramangala' }
    ],
    phone: '+91 80 6123 4567',
    address: '80 Feet Road, Koramangala, Bangalore'
  },
  {
    id: '12',
    name: 'Urban Oasis Unisex Day Spa',
    area: 'Banaswadi',
    rating: 4.4,
    reviewCount: 108,
    priceRange: '$$',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'
    ],
    services: [
      { name: 'Classic Swedish Massage', price: 2800, duration: '60 mins', category: 'Spa' },
      { name: 'Purifying Charcoal Cleansing Facial', price: 1800, duration: '50 mins', category: 'Skin' },
      { name: 'Luxe Hair Spa & Steam Mask', price: 2000, duration: '60 mins', category: 'Hair' }
    ],
    openHours: '10:00 AM - 09:00 PM',
    specialties: ['Swedish Massage', 'Active Charcoal Scrubs', 'Aromatic Day Packages'],
    isLuxury: false,
    isFeatured: false,
    description: 'A cozy, premium high-street retreat focusing on active botanical ingredients and high-quality massotherapy protocols that dissolve modern executive strain.',
    reviewsCount: 108,
    reviews: [
      { id: 'r13', author: 'Rahul Krishnan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', rating: 4, text: 'Great services and value-for-money packages. The staff is extremely competent and helpful.', date: '4 weeks ago', area: 'Banaswadi' }
    ],
    phone: '+91 80 6345 6789',
    address: 'Banaswadi Ring Road, Bangalore'
  }
];
