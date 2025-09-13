const express = require("express");
const router = express.Router();
const Listing =require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const multer = require("multer");
const { upload } = require("../cloudConfig.js");
const User = require("../models/User.js");

router.get("/", async(req, res)=>{
    const allListings = await Listing.find();
    res.render("./listings/index.ejs",{allListings});
});
router.get("/setOwners", async (req, res) => {
  const user = await User.findOne(); // first user as owner
  const result = await Listing.updateMany(
    { owner: { $exists: false } },
    { $set: { owner: user._id } }
  );
  res.send(`${result.modifiedCount} listings updated`);
});

router.get("/new",isLoggedIn, (req,res)=>{
    res.render("./listings/new.ejs");
    }

);
router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q) return res.redirect("/listings"); // agar empty ho to saare listings

  let filter = {
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
    ]
  };


  if (!isNaN(q)) {
    filter.$or.push({ price: parseInt(q) });
  }

  try {
    const listings = await Listing.find(filter);
res.render("listings/index.ejs", { allListings: listings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error while searching");
  }
});

// show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    return res.status(404).send("Listing not found");
  }
  res.render("./listings/show.ejs", { listing });
}));
//create route
router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  wrapAsync(async (req, res) => {
    const listingData = req.body.listing;

    if (req.file) {
      const { path: url, filename } = req.file;
      listingData.image = { url, filename };
    } else {
      listingData.image = null; // default if no image
    }

    const newListing = new Listing(listingData);
    await newListing.save();
    res.redirect("/listings");
  })
);




//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing})
}));

// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  wrapAsync(async (req, res) => {
    let { id } = req.params;

  
    const listing = await Listing.findById(id);

    listing.title = req.body.listing.title;
    listing.price = req.body.listing.price;
    listing.description = req.body.listing.description;
    listing.country = req.body.listing.country;
    listing.location = req.body.listing.location;

 
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

  
    await listing.save();

    res.redirect(`/listings/${id}`);
  })
);




router.delete, isOwner("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
  await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;