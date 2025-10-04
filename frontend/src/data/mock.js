// Mock data for KMK Homes website
export const properties = [
  {
    id: 1,
    villa_number: "KMK-001",
    status: "Available",
    plot_size: 2400, // Sq. Yds
    built_up_area: 3200, // Sq. Ft
    facing: "East",
    location: "Jubilee Hills, Hyderabad",
    price_range: "₹2.5 - 3.2 Cr",
    gallery_images: [
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/e9f5ygj3_IMG_9413.jpeg",
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/o0b7p5qk_IMG_9414.jpeg",
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/6wd7nnfd_IMG_9415.jpeg"
    ],
    description: "Ultra Luxury Triplex Villa with modern architecture, premium finishes, and world-class amenities. Perfect for families seeking luxury living in prime location.",
    amenities: ["Swimming Pool", "Clubhouse", "Kids Play Area", "Solar Power", "24/7 Security", "Power Backup"],
    enquiry_link: "https://wa.me/919876543210",
    map_link: "https://maps.google.com/?q=Jubilee+Hills+Hyderabad",
    featured: true
  },
  {
    id: 2,
    villa_number: "KMK-002",
    status: "Available", 
    plot_size: 2000,
    built_up_area: 2800,
    facing: "West",
    location: "Banjara Hills, Hyderabad",
    price_range: "₹2.2 - 2.8 Cr",
    gallery_images: [
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/8xyjt9jf_IMG_9421.jpeg",
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/52snr89o_IMG_9420.jpeg",
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/e9f5ygj3_IMG_9413.jpeg"
    ],
    description: "Contemporary Villa Design with sophisticated interiors and premium lifestyle amenities in the heart of Banjara Hills.",
    amenities: ["Gymnasium", "Garden", "Parking", "Solar Power", "24/7 Security", "Water Supply"],
    enquiry_link: "https://wa.me/919876543210",
    map_link: "https://maps.google.com/?q=Banjara+Hills+Hyderabad",
    featured: true
  },
  {
    id: 3,
    villa_number: "KMK-003",
    status: "Sold Out",
    plot_size: 1800,
    built_up_area: 2400,
    facing: "South-East",
    location: "Kondapur, Hyderabad",
    price_range: "₹1.8 - 2.3 Cr",
    gallery_images: [
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/6wd7nnfd_IMG_9415.jpeg",
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/o0b7p5qk_IMG_9414.jpeg"
    ],
    description: "Modern Villa with excellent connectivity and premium amenities in the IT corridor of Kondapur.",
    amenities: ["Swimming Pool", "Clubhouse", "Parking", "Security", "Power Backup"],
    enquiry_link: "https://wa.me/919876543210", 
    map_link: "https://maps.google.com/?q=Kondapur+Hyderabad",
    featured: false
  },
  {
    id: 4,
    villa_number: "KMK-004",
    status: "Available",
    plot_size: 2200,
    built_up_area: 3000,
    facing: "North",
    location: "Gachibowli, Hyderabad", 
    price_range: "₹2.4 - 3.0 Cr",
    gallery_images: [
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/52snr89o_IMG_9420.jpeg",
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/8xyjt9jf_IMG_9421.jpeg"
    ],
    description: "Premium Villa in the prime IT hub with modern amenities and excellent investment potential.",
    amenities: ["Clubhouse", "Garden", "Parking", "Solar Power", "24/7 Security", "Water Supply"],
    enquiry_link: "https://wa.me/919876543210",
    map_link: "https://maps.google.com/?q=Gachibowli+Hyderabad",
    featured: true
  },
  {
    id: 5,
    villa_number: "KMK-005",
    status: "Available",
    plot_size: 2600,
    built_up_area: 3400,
    facing: "East",
    location: "Madhapur, Hyderabad",
    price_range: "₹2.8 - 3.5 Cr",
    gallery_images: [
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/e9f5ygj3_IMG_9413.jpeg",
      "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/6wd7nnfd_IMG_9415.jpeg"
    ],
    description: "Luxury Villa with spacious layout and premium finishes in the heart of Hyderabad's IT corridor.",
    amenities: ["Swimming Pool", "Gymnasium", "Kids Play Area", "Parking", "24/7 Security", "Power Backup"],
    enquiry_link: "https://wa.me/919876543210",
    map_link: "https://maps.google.com/?q=Madhapur+Hyderabad", 
    featured: false
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Jubilee Hills Villa Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    testimonial: "KMK Homes delivered exactly what they promised. The quality of construction and attention to detail is exceptional. Our dream villa became a reality!"
  },
  {
    id: 2,
    name: "Priya Sharma", 
    location: "Banjara Hills Villa Owner",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    testimonial: "Professional team, transparent process, and outstanding results. KMK Homes made our home buying journey smooth and stress-free."
  },
  {
    id: 3,
    name: "David Johnson",
    location: "NRI Investor - USA",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", 
    testimonial: "As an NRI, I was concerned about the investment process. KMK Homes provided complete support and made everything seamless from abroad."
  }
];

export const amenitiesData = [
  {
    icon: "Shield",
    title: "24/7 Security",
    description: "Round-the-clock security with CCTV surveillance and trained guards"
  },
  {
    icon: "Zap", 
    title: "Power Backup",
    description: "Uninterrupted power supply with diesel generators and solar panels"
  },
  {
    icon: "Waves",
    title: "Swimming Pool", 
    description: "Luxurious swimming pool with kids section and poolside amenities"
  },
  {
    icon: "Dumbbell",
    title: "Fitness Center",
    description: "Fully equipped gymnasium with modern equipment and trainers"
  },
  {
    icon: "Trees",
    title: "Landscaped Gardens",
    description: "Beautiful green spaces with walking paths and recreational areas"
  },
  {
    icon: "Car", 
    title: "Covered Parking",
    description: "Secure covered parking for residents and guest vehicles"
  }
];

export const newsEvents = [
  {
    id: 1,
    title: "KMK Homes Launches New Premium Villa Project in Gachibowli",
    date: "December 15, 2024",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
    excerpt: "New ultra-luxury villa project with modern amenities and premium finishes now open for bookings."
  },
  {
    id: 2,
    title: "Special NRI Investment Program Announced",
    date: "December 10, 2024", 
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
    excerpt: "Exclusive benefits and support services for Non-Resident Indian investors in our villa projects."
  },
  {
    id: 3,
    title: "Sustainable Living Initiative with Solar Power Integration",
    date: "December 5, 2024",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
    excerpt: "All new villas will feature integrated solar power systems for eco-friendly living."
  }
];

export const companyInfo = {
  phone: "+91 98765 43210",
  email: "info@kmkhomes.com",
  whatsapp: "919876543210",
  address: "Plot No. 123, Road No. 36, Jubilee Hills, Hyderabad - 500033",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.35148728277!2d78.24323262812499!3d17.412608040492422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1645678901234!5m2!1sen!2sin"
};