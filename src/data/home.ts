export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Sarah Mitchell", avatar: "https://picsum.photos/seed/sarah/100/100", rating: 5, text: "Absolutely love my purchases! The quality exceeded my expectations and shipping was incredibly fast. Will definitely be shopping here again." },
  { id: "t2", name: "James Rodriguez", avatar: "https://picsum.photos/seed/james/100/100", rating: 5, text: "Best online shopping experience I've had. The product descriptions are accurate, prices are competitive, and customer service is top-notch." },
  { id: "t3", name: "Emily Chen", avatar: "https://picsum.photos/seed/emily/100/100", rating: 4, text: "Great selection of products and easy checkout process. The only reason I'm not giving 5 stars is that one item took a bit longer to arrive." },
  { id: "t4", name: "Michael Thompson", avatar: "https://picsum.photos/seed/michael/100/100", rating: 5, text: "I've been a loyal customer for over a year now. The quality consistency and reliable delivery keep me coming back. Highly recommended!" },
];
