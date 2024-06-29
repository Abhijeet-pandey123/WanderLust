const Listing= require("../models/listing");

module.exports.index= async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./Listings/index.ejs", { allListings });
}

module.exports.renderNewForm= async (req, res) => {
   
    res.render("./Listings/new.ejs");
}

module.exports.showListing= async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate({path: "reviews",populate:{path: "author"}}).populate("owner");
    if (!list) {
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("./Listings/show.ejs", { list });
}

module.exports.createListing=async (req, res,next) => {
    let url = req.file.path;
    let filename= req.file.filename;
    let newList = new Listing(req.body.listings);
    newList.owner= req.user._id;
    newList.image= {url,filename};
    await newList.save();
    req.flash("success","New Listing created!");
    res.redirect("/listings");
}

module.exports.renderEditForm= async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    let originalUrl = list.image.url;
    originalUrl= originalUrl.replace("/upload","/upload/w_250,h_200");
    res.render("./Listings/edit.ejs", { list, originalUrl });
}

module.exports.updateListing= async (req, res) => {

    let { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    if(typeof req.file!=undefined){
        let {path:url, filename}= req.file;
        listing.image= {url,filename};
        listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);

}

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}