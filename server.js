// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
// create the express app
var app = express();
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.json());
// static content
app.use(express.static(__dirname + '/public/dist/public'));


var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/restaurants_db');

var ReviewSchema = new mongoose.Schema({
    name: {type: String},
    rating: {type: Number, default: 3},
    content: {type: String, default: ""},
    restId: {type: String, default: "None"}},
    {timestamps: true}
);

mongoose.model("Review", ReviewSchema);
var Review = mongoose.model("Review");

var RestaurantSchema = new mongoose.Schema({
    name: {type: String},
    cuisine: {type: String, default: "None"},
    reviews: [ReviewSchema]},
    {timestamps: true}
);

mongoose.model("Restaurant", RestaurantSchema);
var Restaurant = mongoose.model("Restaurant");


function restValid(data, rest) {
    var errors = [];

    if(data.name.trim().length < 3) {
        errors.push({
            error: "name",
            message: "Name must be 3+ characters long"
        });
    }
    else if(rest !== null) {
        errors.push({
            error: "name",
            message: "Name used. Please choose another."
        });
    }

    if(data.cuisine.trim().length < 3) {
        errors.push({
            error:"cuisine",
            message: "Cuisine must be 3 characters long"
        })
    }

    return errors;
}

function editValid(data, rest, id) {
    var errors = [];

    if(data.name.trim().length < 3) {
        errors.push({
            error: "name",
            message: "Name must be 3+ characters long"
        });
    }
    else if(rest !== null && rest._id != id) {
        errors.push({
            error: "name",
            message: "Name used. Please choose another."
        });
    }

    if(data.cuisine.trim().length < 3) {
        errors.push({
            error:"cuisine",
            message: "Cuisine must be 3 characters long"
        })
    }

    return errors;
}

function reviewValid(data) {
    var errors = [];

    if(data.name.trim().length < 3) {
        errors.push({
            error: "name",
            message: "Name must be 3+ characters long"
        });
    }

    if(data.rating < 1 || data.rating > 5) {
        errors.push({
            error: "rating",
            message: "Rating must be 1-5 stars"
        })
    }

    if(data.content.trim().length < 3) {
        errors.push({
            error: "content",
            message: "Content must be 3+ characters long"
        });
    }

    return errors;
}


app.get('/getRestaurants', function(req, res) {
    Restaurant.find({}, function(err, restaurants) {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(restaurants);
        }
    })
});

app.get("/getRestaurantById/:id", function(req, res) {
    Restaurant.findOne({_id: req.params.id}, function(err, restaurant) {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(restaurant);
        }
    })
});

app.post("/makeRest", function(req, res) {
    Restaurant.findOne({name: req.body.name}, function(err, rest) {
        var errors = restValid(req.body, rest);

        if(errors.length > 0) {
            return res.json({hasErrors: true, errors: errors});
        }
        else {
            var newRest = new Restaurant(req.body);
            newRest.save(function(err) {
                if(err) {
                    return res.json({hasErrors: true, errors: err});
                }
                else {
                    return res.json({hasErrors: false, errors: []});
                }
            });
        }
    })
})

app.put("/editRest/:id", function(req, res) {
    Restaurant.findOne({_id: req.params.id}, function(err, rest) {
        if(err) {
            return res.json({hasErrors: true, errors: err});
        }
        else {
            Restaurant.findOne({name: req.body.name}, function(err, otherRest) {
                var errors = editValid(req.body, otherRest, req.params.id);
        
                if(errors.length > 0) {
                    return res.json({hasErrors: true, errors: errors});
                }
                else {
                    rest.name = req.body.name;
                    rest.cuisine = req.body.cuisine;
                    rest.save(function(err) {
                        if(err) {
                            return res.json({hasErrors: true, errors: err});
                        }
                        else {
                            return res.json({hasErrors: false, errors: []});
                        }
                    });
                }
            });
        }
    });
});

app.get("/getReviews/:restId", function(req, res) {
    Review.find({restId: req.params.restId}).sort([["rating", -1]]).exec(function(err, reviews) {
        return res.json(reviews);
    })
})

app.post("/makeReview/:restId", function(req, res) {
    var errors = reviewValid(req.body);
    
    if(errors.length > 0) {
        return res.json({hasErrors: true, errors: errors});
    }

    else {
        var newReview = new Review(req.body);
        newReview.restId = req.params.restId;
        newReview.save(function(err) {
            if(err) {
                return res.json({hasErrors: true, errors: err});
            }
            else {
                Restaurant.update({_id: req.params.restId}, {$push: { reviews: newReview }}, function(err){
                    if(err) {
                        return res.json({hasErrors: true, errors: err});
                    }
                    else {
                        return res.json({hasErrors: false, errors: []});
                    }
                })
            }
        })
    }
})

app.delete("/deleteRest/:id", function(req, res) {
    Restaurant.remove({_id: req.params.id}, function(err) {
        Review.remove({restId: req.params.id}, function(err) {
            return res.json({success: "Success"});
        })
    })
})

app.all("*", (req,res,next) => {
    return res.sendFile(path.resolve("./public/dist/public/index.html"));
});




// tell the express app to listen on port 8000
app.listen(8000, function() {
 console.log("listening on port 8000");
});