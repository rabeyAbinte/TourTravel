const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tour-travel")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));

// Sample Places Data
const places = [
  {
    id: 1,
    name: "Cox's Bazar",
    description: "World longest sea beach",
  },
  {
    id: 2,
    name: "Sajek Valley",
    description: "Beautiful hill station in Bangladesh",
  },
  {
    id: 3,
    name: "Sylhet",
    description: "Land of tea gardens",
  },
  {
    id: 4,
    name: "Bandarban",
    description: "Mountain and natural beauty",
  },
];

// Root API
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Places API
app.get("/places", (req, res) => {
  res.json(places);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});