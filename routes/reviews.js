const express = require("express");
const router = express.Router({mergeParams: true});
const Listing =require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../Schema.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
router.post("/",wrapAsync( async (req, res) => {
     const { id } = req.params; 
   let listing = await Listing.findById(id).populate("reviews");
    let newReview = new Review(req.body.review); 
               
 let { error } = reviewSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.details.map(el => el.message).join(","));
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);7
}));


router.delete("/:reviewId",async(req,res)=>{
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})
module.exports = router;