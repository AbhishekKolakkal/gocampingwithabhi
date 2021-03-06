var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allcampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});          
        }
    });
  
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampGrounds = {name: name, image: image, price: price, description: desc, author: author};
    
    Campground.create(newCampGrounds, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
            res.redirect("/campgrounds");        
       }
    });
    
   
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/newCampGrounds");
});

router.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgrounds){
       if(err || !foundCampgrounds) {
            req.flash("error", "Campground Not Found");
            res.redirect("back");
       } else {
           console.log(foundCampgrounds);
            res.render("campgrounds/show", {campground: foundCampgrounds});
       }
    });
});

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground}); 
    });
});

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err) {
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   }); 
});

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
    });
});




module.exports = router;