import Place from '../models/Place.js';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop";

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=600&auto=format&fit=crop"
];

// Helper to fetch images from Unsplash API
const fetchUnsplashImages = async (query) => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn("UNSPLASH_ACCESS_KEY is not defined. Using fallback image.");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`
        }
      }
    );
    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const urls = data.results.map(item => item.urls.regular);
      return {
        image: urls[0],
        gallery: urls.slice(1, 4) // Next 3 images for the gallery
      };
    }
    return null;
  } catch (err) {
    console.error(`Error querying Unsplash API for "${query}":`, err.message);
    return null;
  }
};

// Sample initial places data
const defaultPlaces = [
  {
    id: 1,
    name: "Cox's Bazar",
    description: "World longest sea beach",
    location: "Chattogram Division",
    price: 50,
    image: "/images/coxs_bazar.png",
    rating: 4.8,
    gallery: []
  },
  {
    id: 2,
    name: "Sajek Valley",
    description: "Beautiful hill station in Bangladesh",
    location: "Rangamati",
    price: 65,
    image: "/images/sajek_valley.png",
    rating: 4.9,
    gallery: []
  },
  {
    id: 3,
    name: "Sylhet",
    description: "Land of tea gardens",
    location: "Sylhet Division",
    price: 45,
    image: "/images/sylhet_tea_garden.png",
    rating: 4.7,
    gallery: []
  },
  {
    id: 4,
    name: "Bandarban",
    description: "Mountain and natural beauty",
    location: "Chattogram Division",
    price: 55,
    image: "/images/bandarban.png",
    rating: 4.8,
    gallery: []
  },
];

// @desc    Get all places (with auto-seeding if empty)
// @route   GET /places
// @access  Public
export const getPlaces = async (req, res) => {
  try {
    let places = await Place.find().sort({ id: 1 });
    
    // Auto-seed if database has no places
    if (places.length === 0) {
      await Place.insertMany(defaultPlaces);
      places = await Place.find().sort({ id: 1 });
    }

    // Check and update places that have local/placeholder images or are missing Unsplash images
    let updatedAny = false;
    for (let place of places) {
      const needsUnsplash = !place.image || place.image.startsWith("/images/") || place.image.includes("placeholder");
      if (needsUnsplash) {
        console.log(`Resolving Unsplash images for: ${place.name}`);
        const unsplashData = await fetchUnsplashImages(place.name);
        if (unsplashData) {
          place.image = unsplashData.image;
          place.gallery = unsplashData.gallery;
        } else {
          place.image = FALLBACK_IMAGE;
          place.gallery = FALLBACK_GALLERY;
        }
        await place.save();
        updatedAny = true;
      }
    }

    if (updatedAny) {
      places = await Place.find().sort({ id: 1 });
    }
    
    res.json(places);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Create a new place
// @route   POST /places
// @access  Private/Admin
export const createPlace = async (req, res) => {
  try {
    const { name, location, description, price, rating } = req.body;
    let newPlace = new Place({
      name,
      location: location || 'Bangladesh',
      description: description || 'No description available',
      price: Number(price) || 0,
      rating: Number(rating) || 0,
      image: FALLBACK_IMAGE,
      gallery: FALLBACK_GALLERY
    });

    const unsplashData = await fetchUnsplashImages(name);
    if (unsplashData) {
      newPlace.image = unsplashData.image;
      newPlace.gallery = unsplashData.gallery;
    }

    const place = await newPlace.save();
    res.json(place);
  } catch (err) {
    console.error("Error creating place:", err);
    res.status(500).send("Server error: " + err.message);
  }
};

// @desc    Update a place
// @route   PUT /places/:id
// @access  Private/Admin
export const updatePlace = async (req, res) => {
  try {
    const { name, location, description, price, rating } = req.body;
    let place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ msg: 'Place not found' });
    }

    const nameChanged = name && name !== place.name;
    if (name) place.name = name;
    if (location) place.location = location;
    if (description) place.description = description;
    if (price !== undefined) place.price = Number(price) || place.price;
    if (rating !== undefined) place.rating = Number(rating) || place.rating;

    if (nameChanged) {
      const unsplashData = await fetchUnsplashImages(name);
      if (unsplashData) {
        place.image = unsplashData.image;
        place.gallery = unsplashData.gallery;
      }
    }

    await place.save();
    res.json(place);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Delete a place
// @route   DELETE /places/:id
// @access  Private/Admin
export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ msg: 'Place not found' });
    }

    await Place.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Place removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
