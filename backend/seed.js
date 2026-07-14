import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Place from './models/Place.js';

dotenv.config();

const places = [
  {
    name: "Cox's Bazar",
    location: "Chattogram Division",
    description: "The longest natural sea beach in the world with stunning sunsets, golden sand, and moon-shaped Sampan boats.",
    image: "/images/coxs_bazar.png",
    rating: 4.8,
    price: 50
  },
  {
    name: "Sajek Valley",
    location: "Rangamati",
    description: "Known as the Queen of Hills, floating in a sea of white clouds over lush green mountains.",
    image: "/images/sajek_valley.png",
    rating: 4.9,
    price: 65
  },
  {
    name: "Sylhet",
    location: "Sylhet Division",
    description: "Famous for its vibrant rolling green tea gardens, clear rivers, and the Ratargul Swamp Forest.",
    image: "/images/sylhet_tea_garden.png",
    rating: 4.7,
    price: 45
  },
  {
    name: "Bandarban",
    location: "Chattogram Division",
    description: "A beautiful hilly district featuring majestic peaks, cloud viewpoints like Nilgiri, and waterfalls.",
    image: "/images/bandarban.png",
    rating: 4.8,
    price: 55
  },
  {
    name: "Saint Martin's Island",
    location: "Bay of Bengal",
    description: "The only coral island of Bangladesh, featuring turquoise water, white sand shores, and leaning coconut trees.",
    image: "/images/saint_martins.png",
    rating: 4.9,
    price: 80
  },
  {
    name: "Sundarbans",
    location: "Khulna Division",
    description: "The world's largest mangrove forest, featuring mysterious river channels, Royal Bengal Tigers, and Sundari trees.",
    image: "/images/sundarbans.png",
    rating: 4.8,
    price: 70
  }
];

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tour-travel")
  .then(async () => {
    console.log('MongoDB connected for seeding');
    try {
      await Place.collection.drop();
    } catch(err) {
      // Collection might not exist
    }
    await Place.insertMany(places);
    console.log('Places seeded successfully');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
