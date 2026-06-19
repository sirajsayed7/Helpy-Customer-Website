import { useState } from 'react'
import { ArrowLeft, Star, Heart, MapPin, Shield, Users, Clock, ChevronUp, ChevronDown, Check, Home, Sparkles, Sofa, Refrigerator, Shirt, CalendarDays, Info, ArrowRight, Car, Plane, Hotel, Luggage, Droplets, Scissors, Flower2, Wind, Wrench, Headphones, Laptop, Code2, MonitorSmartphone, BookOpen, Calculator, Languages } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { StatusBar } from '../components/shared'

type ServiceOption = { label: string; desc: string; price: number; icon: any; image?: string }
type ExtraOption = { label: string; price: number; icon: any }
type ProviderConfig = {
  label: string
  category: string
  desc: string
  heroImg?: string
  logoImg?: string
  providerImage?: string
  rating: string
  reviews: string
  distance: string
  duration: string
  services: ServiceOption[]
  extras: ExtraOption[]
}

export const PROVIDERS: Record<string, ProviderConfig> = {
  'Scrubs Cleaning': {
    label: 'Scrubs Cleaning',
    category: 'Home Services',
    desc: 'Professional scrubs-grade cleaning you can trust.',
    heroImg: '/assets/scrubs-booking-hero-clean.png',
    logoImg: '/assets/scrubs-logo-clean.png',
    providerImage: '/assets/scrubs-leaf-logo-clean.png',
    rating: '4.8',
    reviews: '230',
    distance: '2.27 KM',
    duration: '~3 to 4 hours',
    services: [
      { label: 'General Cleaning', desc: 'Regular home cleaning and maintenance', price: 160, icon: Home, image: '/assets/scrubs-booking-hero-clean.png' },
      { label: 'Deep Cleaning', desc: 'Detailed kitchen, bath, and living area care', price: 240, icon: Sparkles, image: '/assets/ai-banner-home-cleaning.jpg' },
      { label: 'Move-in / Move-out', desc: 'Complete cleaning for new or empty spaces', price: 280, icon: Sofa, image: '/assets/scrubs-hero.png' },
      { label: 'Kitchen Deep Clean', desc: 'Degreasing counters, cabinets, appliances, and tiles', price: 190, icon: Refrigerator, image: '/assets/scrubs-card.png' },
      { label: 'Bathroom Sanitizing', desc: 'Detailed sanitizing for sinks, showers, mirrors, and floors', price: 150, icon: Droplets, image: '/assets/ai-avatar-cleanpro.jpg' },
    ],
    extras: [
      { label: 'Inside Fridge', price: 30, icon: Refrigerator },
      { label: 'Inside Oven', price: 30, icon: CalendarDays },
      { label: 'Laundry Wash & Fold', price: 25, icon: Shirt },
    ],
  },
  'Sparkle Auto Wash': {
    label: 'Sparkle Auto Wash',
    category: 'Car Services',
    desc: 'Premium car wash and detailing for a showroom-fresh finish.',
    heroImg: '/assets/ai-banner-sparkle-carwash.jpg',
    providerImage: '/assets/ai-profile-sparkle-carwash.jpg',
    rating: '4.7',
    reviews: '98',
    distance: '3.20 KM',
    duration: '~45 to 90 minutes',
    services: [
      { label: 'Basic Wash', desc: 'Exterior rinse, foam wash, and dry', price: 45, icon: Droplets, image: '/assets/ai-banner-sparkle-carwash.jpg' },
      { label: 'Premium Wash', desc: 'Exterior wash with interior vacuum', price: 75, icon: Car, image: '/assets/ai-profile-sparkle-carwash.jpg' },
      { label: 'Full Detail', desc: 'Interior detailing and exterior polish', price: 120, icon: Sparkles, image: '/assets/ai-banner-sparkle-carwash.jpg' },
      { label: 'Interior Vacuum', desc: 'Seats, mats, dashboard, and trunk vacuum care', price: 55, icon: Car, image: '/assets/ai-homecat-car-v6.png' },
      { label: 'Paint Polish', desc: 'Light exterior polish for a brighter finish', price: 140, icon: Shield, image: '/assets/ai-profile-sparkle-carwash.jpg' },
    ],
    extras: [
      { label: 'Wax Protection', price: 25, icon: Shield },
      { label: 'Interior Sanitizing', price: 20, icon: Sparkles },
      { label: 'Tire Shine', price: 15, icon: Car },
    ],
  },
  'Glow Salon & Spa': {
    label: 'Glow Salon & Spa',
    category: 'Salon & Spa',
    desc: 'Beauty and wellness treatments delivered by trusted professionals.',
    heroImg: '/assets/ai-banner-glow-salon.jpg',
    providerImage: '/assets/ai-profile-glow-salon.jpg',
    rating: '4.9',
    reviews: '215',
    distance: '5.10 KM',
    duration: '~60 to 120 minutes',
    services: [
      { label: 'Hair Styling', desc: 'Wash, blow dry, and polished styling', price: 80, icon: Scissors, image: '/assets/glow-service-hair-styling.jpg' },
      { label: 'Salon & Spa Package', desc: 'Relaxing beauty and wellness bundle', price: 120, icon: Flower2, image: '/assets/glow-service-salon-spa-package.jpg' },
      { label: 'Facial Treatment', desc: 'Cleanse, exfoliate, and hydration care', price: 95, icon: Sparkles, image: '/assets/glow-service-facial-treatment.jpg' },
      { label: 'Manicure & Pedicure', desc: 'Nail shaping, polish, and gentle hand care', price: 70, icon: Sparkles, image: '/assets/glow-service-manicure-pedicure.jpg' },
      { label: 'Relaxing Massage', desc: 'Calming spa massage for stress relief', price: 140, icon: Flower2, image: '/assets/glow-service-relaxing-massage.jpg' },
    ],
    extras: [
      { label: 'Manicure Add-on', price: 35, icon: Sparkles },
      { label: 'Hot Oil Treatment', price: 45, icon: Droplets },
      { label: 'Express Massage', price: 55, icon: Flower2 },
    ],
  },
  'Luxe Beauty Lounge': {
    label: 'Luxe Beauty Lounge',
    category: 'Salon & Spa',
    desc: 'Polished hair, beauty, and grooming services by trusted salon professionals.',
    heroImg: '/assets/ai-banner-glow-salon.jpg',
    providerImage: '/assets/ai-avatar-luxe.jpg',
    rating: '4.8',
    reviews: '143',
    distance: '3.80 KM',
    duration: '~45 to 120 minutes',
    services: [
      { label: 'Hair Styling', desc: 'Wash, blow dry, and polished everyday styling', price: 80, icon: Scissors, image: '/assets/glow-service-hair-styling.jpg' },
      { label: 'Makeup Session', desc: 'Clean natural makeup for events and evenings', price: 130, icon: Sparkles, image: '/assets/ai-avatar-luxe.jpg' },
      { label: 'Spa Refresh', desc: 'Relaxing facial and light wellness treatment', price: 115, icon: Flower2, image: '/assets/glow-service-salon-spa-package.jpg' },
      { label: 'Hair Treatment', desc: 'Moisture repair and shine treatment for tired hair', price: 95, icon: Droplets, image: '/assets/glow-service-hair-styling.jpg' },
      { label: 'Bridal Touch-up', desc: 'Soft glam finishing for small events and photos', price: 160, icon: Sparkles, image: '/assets/ai-banner-glow-salon.jpg' },
    ],
    extras: [
      { label: 'Nail Polish Add-on', price: 25, icon: Sparkles },
      { label: 'Hair Treatment', price: 45, icon: Droplets },
      { label: 'Home Visit Setup', price: 35, icon: Car },
    ],
  },
  'CleanPro Services': {
    label: 'CleanPro Services',
    category: 'Home Services',
    desc: 'Deep home cleaning, disinfecting, and practical organization.',
    heroImg: '/assets/ai-banner-home-cleaning.jpg',
    providerImage: '/assets/ai-avatar-cleanpro.jpg',
    rating: '4.6',
    reviews: '98',
    distance: '6.30 KM',
    duration: '~3 to 5 hours',
    services: [
      { label: 'Standard Clean', desc: 'Essential cleaning for everyday upkeep', price: 120, icon: Home, image: '/assets/ai-avatar-cleanpro.jpg' },
      { label: 'Deep Clean', desc: 'Detailed cleaning for high-touch areas', price: 160, icon: Sparkles, image: '/assets/ai-banner-home-cleaning.jpg' },
      { label: 'Move-out Clean', desc: 'Empty-space cleaning before handover', price: 200, icon: Sofa, image: '/assets/scrubs-hero.png' },
      { label: 'Sofa & Carpet Care', desc: 'Fabric refresh for seating and common area rugs', price: 180, icon: Sofa, image: '/assets/ai-banner-home-cleaning.jpg' },
      { label: 'Post-party Reset', desc: 'Fast cleaning after gatherings and family events', price: 170, icon: Home, image: '/assets/ai-avatar-happyhome.jpg' },
    ],
    extras: [
      { label: 'Window Cleaning', price: 40, icon: Sparkles },
      { label: 'Cabinet Interior', price: 35, icon: Home },
      { label: 'Balcony Wash', price: 30, icon: Droplets },
    ],
  },
  'Happy Home Services': {
    label: 'Happy Home Services',
    category: 'Home Services',
    desc: 'Friendly home care for weekly cleaning and deeper resets.',
    providerImage: '/assets/ai-avatar-happyhome.jpg',
    rating: '4.7',
    reviews: '185',
    distance: '4.10 KM',
    duration: '~2 to 4 hours',
    services: [
      { label: 'Regular Clean', desc: 'Kitchen, bathrooms, floors, and dusting', price: 140, icon: Home, image: '/assets/ai-avatar-happyhome.jpg' },
      { label: 'Deep Cleaning', desc: 'A fuller reset for busy homes', price: 220, icon: Sparkles, image: '/assets/ai-banner-home-cleaning.jpg' },
      { label: 'Office Clean', desc: 'Desk, floor, pantry, and meeting-room care', price: 180, icon: Wrench, image: '/assets/ai-avatar-cleanpro.jpg' },
      { label: 'Weekly Home Care', desc: 'Scheduled upkeep for busy households', price: 130, icon: CalendarDays, image: '/assets/scrubs-booking-hero-clean.png' },
      { label: 'Laundry Room Tidy', desc: 'Organize, wipe, and reset the laundry area', price: 95, icon: Shirt, image: '/assets/ai-provider-freshfold-real-wallpaper.png' },
    ],
    extras: [
      { label: 'Ironing', price: 20, icon: Shirt },
      { label: 'Inside Fridge', price: 30, icon: Refrigerator },
      { label: 'Storage Tidy-up', price: 35, icon: Home },
    ],
  },
  'FreshFold Laundry': {
    label: 'FreshFold Laundry',
    category: 'Laundry',
    desc: 'Professional wash, fold, ironing, and garment care with pickup-friendly service.',
    heroImg: '/assets/ai-provider-freshfold-real-wallpaper.png',
    providerImage: '/assets/ai-provider-freshfold-real-logo.png',
    rating: '4.8',
    reviews: '126',
    distance: '2.80 KM',
    duration: '~24 to 48 hours',
    services: [
      { label: 'Wash & Fold', desc: 'Everyday laundry washed, dried, and neatly folded', price: 35, icon: Shirt, image: '/assets/ai-provider-freshfold-real-wallpaper.png' },
      { label: 'Dry Cleaning', desc: 'Care for suits, dresses, abayas, and delicate garments', price: 55, icon: Sparkles, image: '/assets/freshfold-real-source.jpg' },
      { label: 'Ironing Bundle', desc: 'Pressed shirts, trousers, uniforms, and linens', price: 45, icon: Shield, image: '/assets/ai-provider-freshfold-wallpaper.png' },
      { label: 'Bedding Laundry', desc: 'Sheets, duvet covers, pillowcases, and towels', price: 65, icon: Home, image: '/assets/ai-provider-freshfold-real-wallpaper.jpg' },
      { label: 'Sneaker Cleaning', desc: 'Gentle cleaning for casual shoes and trainers', price: 50, icon: Sparkles, image: '/assets/freshfold-pexels-source.jpg' },
    ],
    extras: [
      { label: 'Express Same Day', price: 25, icon: Clock },
      { label: 'Pickup & Delivery', price: 15, icon: Car },
      { label: 'Hypoallergenic Detergent', price: 10, icon: Droplets },
    ],
  },
  'Pearl Laundry Care': {
    label: 'Pearl Laundry Care',
    category: 'Laundry',
    desc: 'Premium garment care for dry cleaning, ironing, and delicate laundry pickup.',
    heroImg: '/assets/ai-provider-freshfold-real-wallpaper.png',
    providerImage: '/assets/ai-homecat-laundry-modern.png',
    rating: '4.7',
    reviews: '91',
    distance: '3.60 KM',
    duration: '~24 to 48 hours',
    services: [
      { label: 'Dry Cleaning', desc: 'Care for suits, abayas, dresses, and delicate garments', price: 55, icon: Sparkles, image: '/assets/freshfold-real-source.jpg' },
      { label: 'Ironing Bundle', desc: 'Pressed shirts, trousers, uniforms, and linens', price: 45, icon: Shield, image: '/assets/ai-provider-freshfold-wallpaper.png' },
      { label: 'Premium Wash', desc: 'Gentle wash for everyday and delicate fabrics', price: 50, icon: Shirt, image: '/assets/ai-provider-freshfold-real-wallpaper.png' },
      { label: 'Curtain Cleaning', desc: 'Careful cleaning for light home curtains', price: 85, icon: Home, image: '/assets/ai-provider-freshfold-real-wallpaper.jpg' },
      { label: 'Bedding Refresh', desc: 'Wash and fold for sheets, covers, and towels', price: 65, icon: Shirt, image: '/assets/freshfold-pexels-source.jpg' },
    ],
    extras: [
      { label: 'Express Same Day', price: 25, icon: Clock },
      { label: 'Pickup & Delivery', price: 15, icon: Car },
      { label: 'Fabric Softener', price: 10, icon: Droplets },
    ],
  },
  'The Heritage': {
    label: 'The Heritage',
    category: 'Travel',
    desc: 'Curated Qatar travel packages with flight, hotel, and transfer support.',
    heroImg: '/assets/ai-banner-heritage.jpg',
    providerImage: '/assets/ai-banner-heritage.jpg',
    rating: '4.8',
    reviews: '164',
    distance: 'Online',
    duration: 'Instant confirmation',
    services: [
      { label: 'Flights & Hotels Package', desc: 'Bundled flight and hotel booking support', price: 320, icon: Plane, image: '/assets/ai-banner-heritage.jpg' },
      { label: 'Weekend Staycation', desc: 'Hotel stay with breakfast and late checkout', price: 420, icon: Hotel, image: '/assets/doha-katara-crescent-hero.png' },
      { label: 'Airport Transfer', desc: 'Private pickup or drop-off in Doha', price: 90, icon: Luggage, image: '/assets/ai-banner-heritage.jpg' },
      { label: 'Desert Tour Booking', desc: 'Private tour planning with pickup coordination', price: 260, icon: MapPin, image: '/assets/heritage-banner.png' },
      { label: 'Family Travel Plan', desc: 'Itinerary support for families visiting Qatar', price: 180, icon: Users, image: '/assets/doha-katara-hero.png' },
    ],
    extras: [
      { label: 'Travel Insurance', price: 45, icon: Shield },
      { label: 'VIP Airport Assist', price: 85, icon: Users },
      { label: 'Extra Baggage Help', price: 35, icon: Luggage },
    ],
  },
  'Doha Swift Delivery': {
    label: 'Doha Swift Delivery',
    category: 'Deliveries',
    desc: 'Reliable same-day pickup and delivery for documents, parcels, and small items across Doha.',
    heroImg: '/assets/ai-homecat-delivery.png',
    providerImage: '/assets/ai-homecat-delivery.png',
    rating: '4.7',
    reviews: '102',
    distance: '2.60 KM',
    duration: '~45 to 120 minutes',
    services: [
      { label: 'Same-day Delivery', desc: 'Door-to-door parcel delivery within Doha', price: 40, icon: Luggage, image: '/assets/ai-homecat-delivery.png' },
      { label: 'Document Courier', desc: 'Careful delivery for papers and small envelopes', price: 30, icon: Shield, image: '/assets/ai-homecat-delivery-blue.png' },
      { label: 'Scheduled Pickup', desc: 'Choose a pickup window for later today', price: 55, icon: CalendarDays, image: '/assets/ai-homecat-delivery-v2.png' },
      { label: 'Small Item Delivery', desc: 'Fast delivery for gifts, keys, chargers, and essentials', price: 35, icon: Luggage, image: '/assets/ai-homecat-delivery.png' },
      { label: 'Business Parcel Run', desc: 'Multi-stop delivery for office parcels and supplies', price: 75, icon: MapPin, image: '/assets/ai-homecat-delivery-blue.png' },
    ],
    extras: [
      { label: 'Priority Dispatch', price: 20, icon: Clock },
      { label: 'Proof of Delivery', price: 10, icon: Shield },
      { label: 'Extra Stop', price: 15, icon: MapPin },
    ],
  },
  'QuickFix Maintenance': {
    label: 'QuickFix Maintenance',
    category: 'Maintenance',
    desc: 'Fast maintenance support for AC, plumbing, and everyday repairs.',
    providerImage: '/assets/ai-avatar-quickfix.jpg',
    rating: '4.8',
    reviews: '156',
    distance: '4.40 KM',
    duration: '~60 to 120 minutes',
    services: [
      { label: 'AC Service', desc: 'Inspection, filter cleaning, and cooling check', price: 120, icon: Wind, image: '/assets/ai-avatar-quickfix.jpg' },
      { label: 'Plumbing Visit', desc: 'Leak checks and basic plumbing fixes', price: 90, icon: Wrench, image: '/assets/ai-avatar-fixit.jpg' },
      { label: 'General Repair', desc: 'Small home repairs by a technician', price: 110, icon: Shield, image: '/assets/ai-cat-maintenance-v4.png' },
      { label: 'Electrical Check', desc: 'Switches, outlets, lights, and basic safety inspection', price: 100, icon: Sparkles, image: '/assets/ai-cat-hardware-v4.png' },
      { label: 'Appliance Check', desc: 'Basic diagnosis for common household appliances', price: 130, icon: Refrigerator, image: '/assets/ai-avatar-quickfix.jpg' },
    ],
    extras: [
      { label: 'Urgent Visit', price: 40, icon: Clock },
      { label: 'Extra Unit Check', price: 30, icon: Wind },
      { label: 'Parts Pickup', price: 25, icon: Wrench },
    ],
  },
  'Fix It All Repairs': {
    label: 'Fix It All Repairs',
    category: 'Maintenance',
    desc: 'Practical repair visits for plumbing, fixtures, and small home maintenance jobs.',
    providerImage: '/assets/ai-avatar-fixit.jpg',
    rating: '4.6',
    reviews: '89',
    distance: '6.20 KM',
    duration: '~60 to 120 minutes',
    services: [
      { label: 'Plumbing Visit', desc: 'Leak checks, drain support, and basic plumbing fixes', price: 90, icon: Wrench, image: '/assets/ai-avatar-fixit.jpg' },
      { label: 'Fixture Repair', desc: 'Small home fixtures, fittings, and quick repairs', price: 85, icon: Shield, image: '/assets/ai-cat-maintenance-v4.png' },
      { label: 'Handyman Visit', desc: 'General repair help for everyday home issues', price: 110, icon: Home, image: '/assets/ai-cat-craft-v4.png' },
      { label: 'Wall Mounting', desc: 'Shelves, mirrors, small frames, and basic mounting help', price: 95, icon: Wrench, image: '/assets/ai-avatar-quickfix.jpg' },
      { label: 'Door & Lock Fix', desc: 'Minor door alignment, handles, and lock support', price: 105, icon: Shield, image: '/assets/ai-avatar-fixit.jpg' },
    ],
    extras: [
      { label: 'Urgent Visit', price: 40, icon: Clock },
      { label: 'Parts Pickup', price: 25, icon: Wrench },
      { label: 'Second Fix', price: 35, icon: Shield },
    ],
  },
  'Helpy Support': {
    label: 'Helpy Support',
    category: 'Support',
    desc: 'Customer support for bookings, payments, and account questions.',
    providerImage: '/assets/ai-avatar-support.jpg',
    rating: '4.9',
    reviews: '500',
    distance: 'Online',
    duration: 'Usually replies in minutes',
    services: [
      { label: 'Booking Help', desc: 'Get help changing or tracking a booking', price: 0, icon: CalendarDays, image: '/assets/ai-avatar-support.jpg' },
      { label: 'Payment Support', desc: 'Wallet, refund, and payment assistance', price: 0, icon: Shield, image: '/assets/ai-avatar-support.jpg' },
      { label: 'Account Support', desc: 'Profile, address, and app guidance', price: 0, icon: Headphones, image: '/assets/ai-avatar-support.jpg' },
    ],
    extras: [],
  },
  'ByteCare Digital': {
    label: 'ByteCare Digital',
    category: 'Digital',
    desc: 'Remote and in-home help for devices, apps, accounts, backups, and everyday tech setup.',
    heroImg: '/assets/ai-provider-bytecare-digital.png',
    providerImage: '/assets/ai-provider-bytecare-digital.png',
    rating: '4.8',
    reviews: '134',
    distance: 'Online',
    duration: '~45 to 90 minutes',
    services: [
      { label: 'Device Setup', desc: 'Phone, laptop, email, cloud, and app setup', price: 65, icon: MonitorSmartphone, image: '/assets/ai-provider-bytecare-digital.png' },
      { label: 'Data Backup', desc: 'Photos, documents, and account backup guidance', price: 85, icon: Shield, image: '/assets/ai-provider-bytecare-digital.png' },
      { label: 'Tech Troubleshooting', desc: 'Fix slow devices, Wi-Fi, and software issues', price: 95, icon: Wrench, image: '/assets/ai-provider-bytecare-digital.png' },
      { label: 'Smart Home Setup', desc: 'Configure smart speakers, cameras, and home devices', price: 110, icon: Home, image: '/assets/ai-provider-pixelnest-studio.png' },
      { label: 'Cyber Safety Check', desc: 'Password, privacy, and account safety review', price: 75, icon: Shield, image: '/assets/ai-provider-bytecare-digital.png' },
    ],
    extras: [
      { label: 'Priority Remote Slot', price: 25, icon: Clock },
      { label: 'Extra Device', price: 30, icon: Laptop },
      { label: 'Security Check', price: 35, icon: Shield },
    ],
  },
  'PixelNest Studio': {
    label: 'PixelNest Studio',
    category: 'Digital',
    desc: 'Clean websites, business profiles, and digital launch support for modern service brands.',
    heroImg: '/assets/ai-provider-pixelnest-studio.png',
    providerImage: '/assets/ai-provider-pixelnest-studio.png',
    rating: '4.9',
    reviews: '88',
    distance: 'Online',
    duration: '~2 to 5 business days',
    services: [
      { label: 'Website Starter', desc: 'One-page business site with polished sections', price: 180, icon: Code2, image: '/assets/ai-provider-pixelnest-studio.png' },
      { label: 'Booking Page Setup', desc: 'Service menu, contact flow, and inquiry form', price: 240, icon: CalendarDays, image: '/assets/ai-provider-pixelnest-studio.png' },
      { label: 'Brand Kit Refresh', desc: 'Colors, typography, and simple social templates', price: 210, icon: Sparkles, image: '/assets/ai-cat-design-v4.png' },
      { label: 'Logo Cleanup', desc: 'Polished logo export and profile-ready brand assets', price: 140, icon: Sparkles, image: '/assets/ref-cat-design.png' },
      { label: 'Social Media Kit', desc: 'Post templates, cover images, and launch visuals', price: 160, icon: MonitorSmartphone, image: '/assets/ai-provider-pixelnest-studio.png' },
    ],
    extras: [
      { label: 'Copywriting Polish', price: 60, icon: BookOpen },
      { label: 'Extra Page', price: 75, icon: Code2 },
      { label: 'Launch Support', price: 45, icon: Headphones },
    ],
  },
  'BrightPath Tutors': {
    label: 'BrightPath Tutors',
    category: 'Education',
    desc: 'Focused one-to-one tutoring for school subjects, homework support, and confidence building.',
    heroImg: '/assets/ai-provider-brightpath-tutors.png',
    providerImage: '/assets/ai-provider-brightpath-tutors.png',
    rating: '4.8',
    reviews: '112',
    distance: 'Online',
    duration: '~60 to 90 minutes',
    services: [
      { label: 'Math Tutoring', desc: 'Step-by-step support for school math topics', price: 95, icon: Calculator, image: '/assets/ai-provider-brightpath-tutors.png' },
      { label: 'Science Tutoring', desc: 'Concept review, homework, and exam practice', price: 105, icon: Sparkles, image: '/assets/ai-provider-brightpath-tutors.png' },
      { label: 'English Support', desc: 'Reading, writing, grammar, and speaking practice', price: 90, icon: Languages, image: '/assets/ai-provider-summit-learning.png' },
      { label: 'Homework Help', desc: 'Guided support for daily assignments and projects', price: 85, icon: BookOpen, image: '/assets/ai-provider-brightpath-tutors.png' },
      { label: 'Exam Revision', desc: 'Focused revision plan before upcoming tests', price: 115, icon: CalendarDays, image: '/assets/ai-provider-summit-learning.png' },
    ],
    extras: [
      { label: 'Homework Review', price: 20, icon: BookOpen },
      { label: 'Practice Worksheet', price: 25, icon: Calculator },
      { label: 'Parent Progress Note', price: 15, icon: Users },
    ],
  },
  'Summit Learning Hub': {
    label: 'Summit Learning Hub',
    category: 'Education',
    desc: 'Structured exam preparation with targeted practice, study plans, and progress tracking.',
    heroImg: '/assets/ai-provider-summit-learning.png',
    providerImage: '/assets/ai-provider-summit-learning.png',
    rating: '4.9',
    reviews: '76',
    distance: 'Online',
    duration: '~90 to 120 minutes',
    services: [
      { label: 'Exam Prep Session', desc: 'Timed practice and focused correction plan', price: 110, icon: BookOpen, image: '/assets/ai-provider-summit-learning.png' },
      { label: 'IELTS Coaching', desc: 'Speaking, writing, reading, and listening prep', price: 140, icon: Languages, image: '/assets/ai-provider-summit-learning.png' },
      { label: 'Study Plan Review', desc: 'Personal weekly schedule and subject priorities', price: 80, icon: CalendarDays, image: '/assets/ai-provider-brightpath-tutors.png' },
      { label: 'University Essay Review', desc: 'Structure, clarity, and application essay feedback', price: 150, icon: BookOpen, image: '/assets/ai-provider-summit-learning.png' },
      { label: 'Progress Coaching', desc: 'Weekly academic accountability and study check-in', price: 95, icon: Users, image: '/assets/ai-provider-brightpath-tutors.png' },
    ],
    extras: [
      { label: 'Mock Test Pack', price: 35, icon: BookOpen },
      { label: 'Writing Feedback', price: 30, icon: Languages },
      { label: 'Progress Report', price: 20, icon: Shield },
    ],
  },
}

export const DATES = [
  {label:'Today', day:'May 30'},
  {label:'Sun', day:'May 31'},
  {label:'Mon', day:'Jun 1'},
  {label:'Tue', day:'Jun 2'},
  {label:'Wed', day:'Jun 3'},
]

const TIMES = ['08:00 AM','10:00 AM','12:00 PM','02:00 PM','04:00 PM','06:00 PM','08:00 PM','10:00 PM']

export default function ServiceDetailPage() {
  const { goBack, navigate, params, addBooking } = useNav()
  const provider = params?.provider || 'Scrubs Cleaning'
  const cfg = PROVIDERS[provider] || PROVIDERS['Scrubs Cleaning']
  const initialService = cfg.services.find(s => s.label === params?.name)?.label || ''
  const isGlow = provider === 'Glow Salon & Spa'
  const useCheckoutFlow = true

  const [selSvc, setSelSvc] = useState(initialService)
  const [selectedGlowServices, setSelectedGlowServices] = useState<string[]>(initialService ? [initialService] : [])
  const [selDate, setSelDate] = useState(1)
  const [selTime, setSelTime] = useState('12:00 PM')
  const [extras, setExtras] = useState<string[]>([])
  const [equipment, setEquipment] = useState<'customer'|'scrubs'>('scrubs')
  const [liked, setLiked] = useState(false)
  const [showTotal, setShowTotal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [checkoutReady, setCheckoutReady] = useState(false)

  const active = cfg.services.find(s => s.label === selSvc) || cfg.services[0]
  const extrasTotal = extras.reduce((s,e)=>s+(cfg.extras.find(x=>x.label===e)?.price||0),0)
  const isScrubs = provider === 'Scrubs Cleaning'
  const equipmentAdjustment = isScrubs && equipment === 'customer' ? -25 : 0
  const selectedGlowOptions = cfg.services.filter(s => selectedGlowServices.includes(s.label))
  const servicesTotal = useCheckoutFlow ? selectedGlowOptions.reduce((sum, s) => sum + s.price, 0) : active.price
  const total = Math.max(0, servicesTotal + equipmentAdjustment + extrasTotal)
  const hasSelectedService = useCheckoutFlow ? selectedGlowServices.length > 0 : Boolean(selSvc)
  const providerImage = params?.providerImage || cfg.logoImg || cfg.providerImage
  const equipmentLabel = equipment === 'customer' ? 'Customer equipment' : 'Scrubs equipment'

  const toggleExtra = (e: string) => setExtras(prev => prev.includes(e) ? prev.filter(x=>x!==e) : [...prev,e])
  const toggleGlowService = (label: string) => {
    setCheckoutReady(false)
    setShowTotal(false)
    setSelectedGlowServices(prev => prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label])
  }

  const book = () => {
    if (!hasSelectedService) return
    const booking = {
      id: Date.now().toString(),
      provider,
      service: isGlow ? selectedGlowServices.join(', ') : isScrubs ? `${selSvc} - ${equipmentLabel}` : selSvc,
      date: DATES[selDate].day + ', 2026',
      time: selTime,
      price: total.toFixed(2),
      status: 'Confirmed' as const,
      providerBg: params?.providerBg || 'bg-blue-500',
      providerEmoji: params?.providerEmoji || cfg.label.slice(0, 2).toUpperCase(),
      providerImage,
    }
    addBooking(booking)
    navigate('booking-success', booking)
  }

  return (
    <div className="flex flex-col flex-1 bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-white pb-8">
        <div className="relative h-[300px] max-[360px]:h-[270px] shrink-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url('${params?.heroImg || cfg.heroImg || providerImage || '/assets/ai-banner-home-cleaning.jpg'}')`}} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/82" />
          <StatusBar />
          <div className="absolute top-14 left-4 right-4 flex items-center justify-between">
            <button onClick={goBack} className="w-11 h-11 bg-white/95 rounded-full shadow-md flex items-center justify-center">
              <ArrowLeft size={22} className="text-gray-800"/>
            </button>
            <button onClick={()=>setLiked(v=>!v)} className="w-11 h-11 bg-white/95 rounded-full shadow-md flex items-center justify-center">
              <Heart size={22} className={liked?'text-red-500 fill-red-500':'text-gray-900'}/>
            </button>
          </div>
          <div className="absolute left-5 right-5 bottom-3 flex items-center gap-4">
            <div className="w-[84px] h-[84px] max-[360px]:w-[72px] max-[360px]:h-[72px] rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden p-2">
              {providerImage ? <img src={providerImage} className={`w-full h-full ${provider === 'Scrubs Cleaning' ? 'object-contain' : 'object-cover rounded-full'}`}/> : <span className="text-[15px] font-black text-brand-500">{cfg.label.slice(0,2)}</span>}
            </div>
            <div className="flex-1 pt-5 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[25px] max-[360px]:text-[22px] font-black text-white drop-shadow truncate">{cfg.label}</h1>
                <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center"><Check size={13}/></span>
              </div>
              <span className="mt-1 inline-block rounded-lg bg-white/90 px-3 py-1 text-brand-500 text-[13px] font-bold">{cfg.category}</span>
              <div className="mt-3 flex items-center gap-4 text-white drop-shadow">
                <span className="flex items-center gap-1 text-[15px] font-semibold"><Star size={19} className="fill-brand-500 text-brand-500"/>{cfg.rating} ({cfg.reviews})</span>
                <span className="w-px h-5 bg-white/50"/>
                <span className="flex items-center gap-1 text-[15px] font-semibold"><MapPin size={17}/>{cfg.distance}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-1 space-y-6">
          <div className="rounded-[22px] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.10)] p-4 max-[360px]:p-3 flex items-center gap-4 max-[360px]:gap-3">
            <div className="min-w-[110px] max-[360px]:min-w-[96px]">
              <p className="text-[12px] text-[#667085]">Starting from</p>
              <p className="text-[26px] max-[360px]:text-[22px] font-black text-brand-500">{Math.min(...cfg.services.map(s=>s.price)).toFixed(2)} QR</p>
            </div>
            <div className="h-12 w-px bg-gray-100"/>
            <div className="flex-1 grid grid-cols-3 gap-2">
              {[{Icon:Shield,label:'Verified\nProvider'},{Icon:Users,label:'Trusted\nPros'},{Icon:Clock,label:'On-time\nService'}].map(({Icon,label})=>(
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Icon size={17} className="text-brand-500"/></div>
                  <p className="text-[9px] leading-[11px] text-gray-700 text-center font-semibold whitespace-pre-line">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <section>
            <p className="text-[16px] font-black text-gray-950 mb-3">1. Select Service</p>
            <div className={`${useCheckoutFlow ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-3 max-[360px]:grid-cols-2 gap-3'}`}>
              {cfg.services.map(s=>{
                const Icon = s.icon
                const selected = useCheckoutFlow ? selectedGlowServices.includes(s.label) : selSvc === s.label
                return (
                  <button key={s.label} onClick={()=>useCheckoutFlow ? toggleGlowService(s.label) : setSelSvc(s.label)}
                    className={`relative ${s.image ? 'min-h-[186px]' : 'min-h-[146px] max-[360px]:min-h-[132px]'} rounded-[18px] ${s.image ? 'p-2' : 'p-3 max-[360px]:p-2.5'} border text-center shadow-sm transition overflow-hidden ${selected?'border-brand-500 bg-blue-50':'border-gray-100 bg-white'}`}>
                    <span className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected?'border-brand-500 bg-brand-500':'border-gray-300 bg-white'}`}>
                      {selected&&<Check size={14} className="text-white"/>}
                    </span>
                    {s.image ? (
                      <div className="h-[90px] w-full overflow-hidden rounded-[14px] bg-pink-50">
                        <img src={s.image} alt="" className="h-full w-full object-cover object-center" />
                      </div>
                    ) : (
                      <div className="mt-2 mx-auto w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Icon size={25} className="text-brand-500"/>
                      </div>
                    )}
                    <p className={`${s.image ? 'mt-2' : 'mt-4 max-[360px]:mt-3'} text-[13px] leading-4 font-black text-gray-950`}>{s.label}</p>
                    <p className="mt-2 text-[11px] leading-4 max-[360px]:line-clamp-2 text-gray-600">{s.desc}</p>
                    <p className="mt-3 text-[14px] font-black text-brand-500">{s.price.toFixed(2)} QR</p>
                  </button>
                )
              })}
            </div>
          </section>

          {isScrubs && (
            <section>
              <p className="text-[16px] font-black text-gray-950 mb-3">2. Choose Equipment</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {id:'customer' as const, title:'I have equipment', desc:'Use your own supplies and cleaning tools.', price:'-25.00 QR'},
                  {id:'scrubs' as const, title:'Scrubs brings equipment', desc:'Our team brings professional supplies.', price:'Included'},
                ].map(option=>{
                  const selected = equipment === option.id
                  return (
                    <button key={option.id} onClick={()=>setEquipment(option.id)}
                      className={`relative min-h-[104px] rounded-[18px] border p-3 text-left shadow-sm transition ${selected?'border-brand-500 bg-blue-50':'border-gray-100 bg-white'}`}>
                      <span className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected?'border-brand-500 bg-brand-500':'border-gray-300 bg-white'}`}>
                        {selected&&<Check size={14} className="text-white"/>}
                      </span>
                      <p className="pr-8 text-[13px] leading-4 font-black text-gray-950">{option.title}</p>
                      <p className="mt-2 text-[11px] leading-4 text-gray-600">{option.desc}</p>
                      <p className={`mt-3 text-[13px] font-black ${option.id==='customer'?'text-green-600':'text-brand-500'}`}>{option.price}</p>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {!useCheckoutFlow && (
          <section>
            <p className="text-[16px] font-black text-gray-950 mb-3">{isScrubs ? '3' : '2'}. Select Date & Time</p>
            <div className="grid grid-cols-6 max-[360px]:grid-cols-3 gap-2">
              {DATES.map((d,i)=>(
                <button key={i} onClick={()=>setSelDate(i)}
                  className={`h-[62px] rounded-[15px] shadow-sm flex flex-col items-center justify-center text-[12px] font-bold ${selDate===i?'bg-brand-500 text-white':'bg-white text-gray-900'}`}>
                  <span>{d.label}</span>
                  <span className={selDate===i?'text-white/85':'text-gray-500'}>{d.day}</span>
                </button>
              ))}
              <button onClick={()=>setSelDate(0)} className="h-[62px] rounded-[15px] bg-white shadow-sm flex items-center justify-center"><CalendarDays size={22}/></button>
            </div>
            <div className="grid grid-cols-4 max-[360px]:grid-cols-2 gap-2 mt-3">
              {TIMES.map(t=>(
                <button key={t} onClick={()=>t!=='10:00 PM'&&setSelTime(t)}
                  className={`h-11 rounded-[14px] text-[13px] font-black shadow-sm transition ${selTime===t?'bg-brand-500 text-white':'bg-white text-gray-900'} ${t==='10:00 PM'?'opacity-35 pointer-events-none':''}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4 bg-blue-50 rounded-[18px] px-4 py-3">
              <Clock size={21} className="text-brand-500 shrink-0"/>
              <div className="flex-1">
                <p className="text-[13px] text-brand-500 font-black">Service duration: {cfg.duration}</p>
                <p className="text-[12px] text-gray-600">{cfg.desc}</p>
              </div>
              <Info size={20} className="text-brand-500"/>
            </div>
          </section>
          )}

          {!useCheckoutFlow && cfg.extras.length > 0 && (
            <section className={hasSelectedService?'pb-28':'pb-4'}>
              <p className="text-[16px] font-black text-gray-950 mb-3">{isScrubs ? '4' : '3'}. Add Extras (Optional)</p>
              <div className="grid grid-cols-3 max-[360px]:grid-cols-2 gap-3">
                {cfg.extras.map(({label, price, icon: Icon})=>{
                  const selected = extras.includes(label)
                  return (
                    <button key={label} onClick={()=>toggleExtra(label)}
                      className={`relative min-h-[112px] max-[360px]:min-h-[104px] rounded-[18px] p-3 text-left border shadow-sm transition ${selected?'border-brand-500 bg-blue-50':'border-gray-100 bg-white'}`}>
                      <span className={`absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center ${selected?'border-brand-500 bg-brand-500':'border-gray-300'}`}>
                        {selected&&<Check size={12} className="text-white"/>}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Icon size={20} className="text-brand-500"/></div>
                      <p className="mt-3 text-[13px] leading-4 font-black text-gray-950">{label}</p>
                      <p className="mt-2 text-[13px] font-black text-brand-500">+ {price.toFixed(2)} QR</p>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {isGlow && checkoutReady && hasSelectedService && (
            <section className="rounded-[22px] bg-white border border-gray-100 shadow-sm p-4 pb-28">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[16px] font-black text-gray-950">Checkout</p>
                  <p className="text-[12px] text-gray-500 mt-1">Review your salon booking before confirming.</p>
                </div>
                <button onClick={()=>setShowScheduleModal(true)} className="rounded-full bg-blue-50 px-3 py-2 text-[12px] font-black text-brand-500">
                  Edit time
                </button>
              </div>

              <div className="mt-4 rounded-[18px] bg-gray-50 p-3 space-y-2">
                <p className="text-[13px] font-black text-gray-950">Overview</p>
                {selectedGlowOptions.map(s => (
                  <div key={s.label} className="flex justify-between gap-3 text-[12px]">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="font-bold text-gray-950">{s.price.toFixed(2)} QR</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 flex justify-between gap-3 text-[12px]">
                  <span className="text-gray-600">{DATES[selDate].day}, 2026 at {selTime}</span>
                  <span className="font-bold text-brand-500">{cfg.duration}</span>
                </div>
              </div>

              {cfg.extras.length > 0 && (
                <div className="mt-5">
                  <p className="text-[15px] font-black text-gray-950 mb-3">Add Extras (Optional)</p>
                  <div className="grid grid-cols-3 max-[360px]:grid-cols-2 gap-3">
                    {cfg.extras.map(({label, price, icon: Icon})=>{
                      const selected = extras.includes(label)
                      return (
                        <button key={label} onClick={()=>toggleExtra(label)}
                          className={`relative min-h-[108px] rounded-[18px] p-3 text-left border shadow-sm transition ${selected?'border-brand-500 bg-blue-50':'border-gray-100 bg-white'}`}>
                          <span className={`absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center ${selected?'border-brand-500 bg-brand-500':'border-gray-300'}`}>
                            {selected&&<Check size={12} className="text-white"/>}
                          </span>
                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Icon size={20} className="text-brand-500"/></div>
                          <p className="mt-3 pr-4 text-[12px] leading-4 font-black text-gray-950">{label}</p>
                          <p className="mt-2 text-[12px] font-black text-brand-500">+ {price.toFixed(2)} QR</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between rounded-[18px] bg-blue-50 px-4 py-3">
                <div>
                  <p className="text-[12px] text-gray-500">Total Price</p>
                  <p className="text-[24px] font-black text-brand-500">{total.toFixed(2)} QR</p>
                </div>
                <button onClick={book} className="h-12 rounded-[16px] bg-brand-500 px-5 text-[14px] font-black text-white shadow-lg shadow-blue-200">
                  Confirm Booking
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {useCheckoutFlow && showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 px-4 pb-4">
          <div className="w-full max-w-[430px] max-h-[88vh] overflow-y-auto rounded-t-[26px] rounded-b-[22px] bg-white p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[18px] font-black text-gray-950">Select Date & Time</p>
                <p className="text-[12px] text-gray-500 mt-1">Choose a slot for {selectedGlowServices.length} selected service{selectedGlowServices.length === 1 ? '' : 's'}.</p>
              </div>
              <button onClick={()=>setShowScheduleModal(false)} className="w-9 h-9 rounded-full bg-gray-100 text-[20px] leading-none font-bold text-gray-700">x</button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {DATES.map((d,i)=>(
                <button key={i} onClick={()=>setSelDate(i)}
                  className={`h-[62px] rounded-[15px] shadow-sm flex flex-col items-center justify-center text-[12px] font-bold ${selDate===i?'bg-brand-500 text-white':'bg-gray-50 text-gray-900'}`}>
                  <span>{d.label}</span>
                  <span className={selDate===i?'text-white/85':'text-gray-500'}>{d.day}</span>
                </button>
              ))}
              <button onClick={()=>setSelDate(0)} className="h-[62px] rounded-[15px] bg-gray-50 shadow-sm flex items-center justify-center"><CalendarDays size={22}/></button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {TIMES.map(t=>(
                <button key={t} onClick={()=>t!=='10:00 PM'&&setSelTime(t)}
                  className={`h-11 rounded-[14px] text-[13px] font-black shadow-sm transition ${selTime===t?'bg-brand-500 text-white':'bg-gray-50 text-gray-900'} ${t==='10:00 PM'?'opacity-35 pointer-events-none':''}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4 bg-blue-50 rounded-[18px] px-4 py-3">
              <Clock size={21} className="text-brand-500 shrink-0"/>
              <div className="flex-1">
                <p className="text-[13px] text-brand-500 font-black">Service duration: {cfg.duration}</p>
                <p className="text-[12px] text-gray-600">{cfg.desc}</p>
              </div>
              <Info size={20} className="text-brand-500"/>
            </div>

            <button onClick={()=>navigate('booking-checkout', {
              provider,
              selectedServices: selectedGlowServices,
              selDate,
              selTime,
              providerImage,
              providerBg: params?.providerBg || (isGlow ? 'bg-pink-500' : 'bg-blue-500'),
              providerEmoji: params?.providerEmoji || cfg.label.slice(0, 2).toUpperCase(),
              equipmentLabel: isScrubs ? equipmentLabel : '',
              equipmentAdjustment: isScrubs ? equipmentAdjustment : 0,
            })} className="mt-4 h-[52px] w-full rounded-[18px] bg-brand-500 text-white text-[16px] font-black shadow-lg shadow-blue-200">
              Checkout
            </button>
          </div>
        </div>
      )}

      {hasSelectedService && (
        <div className="shrink-0 bg-white/96 backdrop-blur border-t border-gray-100 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] rounded-t-[22px]">
          <div className="flex items-center gap-3">
            <button onClick={()=>setShowTotal(v=>!v)} className="flex items-center gap-3 min-w-[145px] max-[360px]:min-w-[120px] text-left">
              <div>
                <p className="text-[12px] text-gray-400">Total Price</p>
                <p className="text-[24px] max-[360px]:text-[20px] font-black text-brand-500">{total.toFixed(2)} QR</p>
              </div>
              <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {showTotal?<ChevronDown size={18}/>:<ChevronUp size={18}/>}
              </span>
            </button>
            <button onClick={()=>useCheckoutFlow ? setShowScheduleModal(true) : book()} className="flex-1 h-[56px] rounded-[18px] bg-brand-500 text-white text-[16px] max-[360px]:text-[14px] font-black shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              {useCheckoutFlow ? 'Select Date & Time' : 'Continue to Details'} <ArrowRight size={21}/>
            </button>
          </div>
          {showTotal&&(
            <div className="bg-gray-50 rounded-xl p-3 mt-3 space-y-1.5">
              {isGlow ? selectedGlowOptions.map(s => (
                <div key={s.label} className="flex justify-between text-[12px]"><span className="text-gray-500">{s.label}</span><span className="font-semibold">{s.price.toFixed(2)} QR</span></div>
              )) : (
                <div className="flex justify-between text-[12px]"><span className="text-gray-500">{selSvc}</span><span className="font-semibold">{active.price.toFixed(2)} QR</span></div>
              )}
              {isScrubs && equipmentAdjustment !== 0 && (
                <div className="flex justify-between text-[12px]"><span className="text-gray-500">{equipmentLabel}</span><span className="font-semibold text-green-600">{equipmentAdjustment.toFixed(2)} QR</span></div>
              )}
              {isScrubs && equipmentAdjustment === 0 && (
                <div className="flex justify-between text-[12px]"><span className="text-gray-500">{equipmentLabel}</span><span className="font-semibold">Included</span></div>
              )}
              {extras.map(e=><div key={e} className="flex justify-between text-[12px]"><span className="text-gray-500">{e}</span><span className="font-semibold">+{cfg.extras.find(x=>x.label===e)?.price.toFixed(2)} QR</span></div>)}
              <div className="border-t border-gray-200 pt-1.5 flex justify-between text-[13px] font-bold"><span>Total</span><span className="text-brand-500">{total.toFixed(2)} QR</span></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
