const Review = require("../models/review");
const Listing = require("../models/listing");


module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review({ ...req.body.review });
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    newReview.save();
    listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}