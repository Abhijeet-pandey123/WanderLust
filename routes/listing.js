const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage })




//Show all listings route and post route for adding new list from given form
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listings[image]'),validateListing, wrapAsync(listingController.createListing));
    // .post(upload.single('listings[image]'),(req,res)=>{
    //     res.send(req.file);
    // })


//New List Add route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//Show one specific list route and update rout and delete route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,upload.single('listings[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



//edit listing 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;