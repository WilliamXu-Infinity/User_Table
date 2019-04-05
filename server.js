// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var fs = require('fs');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});
var upload = multer({storage: storage});

// 2nd part -- connect database and add data table
var User     = require('./app/models/user');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds139919.mlab.com:39919/userlist'); // connect to our database
//err handoling


// 2nd part

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 5000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// 2nd part -- add actual routing
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// if the request start with '/api' go to the router
app.use('/api', router);

// more routes for our API will happen here
// 2nd part

// 3rd part - insert a user POST
// on routes that end in /users
// ----------------------------------------------------
router.route('/user')

    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(upload.single('imgFace'), function(req, res) {

        console.log(req.file);
        
        var user = new User();      // create a new instance of the user model
        user.imgFile = req.body.imgFile;
        user.name = req.body.name;  // set the users name (comes from the request)
        user.title = req.body.title;
        user.sex = req.body.sex;
        user.startDate = req.body.startDate;
        user.officePhone = req.body.officePhone;
        user.cellPhone = req.body.cellPhone;
        user.sms = req.body.sms;
        user.email = req.body.email;
        user.managerId = req.body.managerId;
        user.managerName = req.body.managerName;
        user.numberOfDirectReports = req.body.numberOfDirectReports;

        // save the user and check for errors
        user.save(function(err, savedUser) {
            if (err) res.send(err);
            const userId = savedUser._id;

            // change user manager numberOfDirectReports info
            if(user.managerId !== ""){
                User.findById(savedUser.managerId, function(err, manager) {
                    if (err) res.send(err);
                    manager.numberOfDirectReports.push(userId);
                    manager.save(function(err) {
                        if (err) res.send(err);
                        console.log("message: User manager numberOfDirectReports update!");
                        res.json({ message: 'User created!'});
                    })
                })
            }
            else 
                res.json({ message: 'User created!'});
            

            // // change user numberOfDirectReports manager info
            // for(let i = 0; i < savedUser.numberOfDirectReports.length; i++){
            //     User.findById(savedUser.numberOfDirectReports[i], function(err, directReport) {
            //         if (err) res.send(err);
            //         directReport.manager = userId;
            //         directReport.save(function(err) {
            //             if (err) res.send(err);
            //             console.log("message: User numberOfDirectReports manager update!");
            //         })
            //     })
            // }

            
        });
    })
	//;
// 3rd part

// 4th part -- get the user list
// get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);
            res.json(users);
        });
    });
// 4th part

// 5th part - access an individual user
// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/user/:user_id')

    // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);
            res.json(user);
        });
    })
	//;
// 5th part

// 6th part -- update
// update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(function(req, res) {

        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

            user.imgFile = req.body.imgFile;
            user.name = req.body.name;  // update the users info
            user.title = req.body.title;
            user.sex = req.body.sex;
            user.startDate = req.body.startDate;
            user.officePhone = req.body.officePhone;
            user.cellPhone = req.body.cellPhone;
            user.sms = req.body.sms;
            user.email = req.body.email;
            user.managerId = req.body.managerId;
            user.managerName = req.body.managerName;
            user.numberOfDirectReports = req.body.numberOfDirectReports;

            // check if manager has been changed
            if(user.managerId !== req.body.managerId){
                // remove the old manager numberOfDirectReports info and add new one to new manager numberOfDirectReports
                if(user.managerId !== ""){
                    User.findById(user.managerId, function(err, manager) {
                        if(err) res.send(err);
                        const index = manager.numberOfDirectReports.indexOf(req.params.user_id);
                        if(index !== -1) {
                            manager.numberOfDirectReports.splice(index, 1);
                            manager.save(function(err) {
                                if(err) res.send(err);
                                console.log("message: User manager numberOfDirectReports has been removed")
                        })}
                    });
                }

                // User manager numberOfDirectReports has been added
                if(req.body.managerId !== ""){
                    User.findById(req.body.managerId, function(err, manager) {
                        if(err) res.send(err);
                        manager.numberOfDirectReports.push(req.params.user_id);
                        manager.save(function(err) {
                            if(err) res.send(err);
                            console.log("message: User manager numberOfDirectReports has been added")
                        })
                    });
                }
            }

            // save the user
            user.save(function(err) {
                if (err) res.send(err);

                res.json({ message: 'User updated!' });
            });

            // // check if numberOfDirectReports has been changed
            // var arrOld = user.numberOfDirectReports;
            // var arrNew = req.body.numberOfDirectReports
            // var arrRemove = [];
            // for(let i = 0; i < arrOld.length; i++){
            //     // arrOld[i] as been removed
            //     let index = arrNew.indexOf(arrOld[i]);
            //     if(index === -1){
            //         arrRemove.push(arrOld[i]);
            //     }
            //     else {
            //         arrNew.splice(index, 1);
            //     }
            // }
            // // remove arrRemove
            // for(let i = 0; i < arrRemove.length; i++){
            //     User.findById(arrRemove[i], function(err, directReport) {
            //         directReport.manager = "";
            //         directReport.save(function(err) {
            //             if(err) res.send(err);
            //             console.log("message: User numberOfDirectReports manager has been removed");
            //         })
            //     })
            // }

            // // add arrNew
            // for(let i = 0; i < arrNew.length; i++){
            //     User.findById(arrNew[i], function(err, directReport) {
            //         directReport.manager = arrNew[i];
            //         directReport.save(function(err) {
            //             if(err) res.send(err);
            //             console.log("message: User numberOfDirectReports manager has been saved");
            //         })
            //     })
            // }
        });
    })
	//;
// 6th part

// 7th part - delete
// delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function(req, res) {

        //delete the user manager's numberOfDirectReports's info 
        User.findById(req.params.user_id, function(err, user) {
            if(err) res.send(err);

            //delete the user manager's numberOfDirectReports's info
            console.log("delect check: manager is: " + JSON.stringify(user));
            if(user.managerId !== ""){
                User.findById(user.managerId, function(err, manager) {
                    if(err) res.send(err);
                    console.log("delect check: " + JSON.stringify(manager));
                    const index = manager.numberOfDirectReports.indexOf(req.params.user_id);
                    if(index !== -1) {
                        manager.numberOfDirectReports.splice(index, 1);
                        manager.save(function(err) {
                        if(err) res.send(err);
                        console.log("message: User manager numberOfDirectReports has been removed")
                    })}

                    //delete the user numberOfDirectReports manager info
                    console.log("delete user's nodr's manager info: " + JSON.stringify(user.numberOfDirectReports) )
                    for(let i = 0; i < user.numberOfDirectReports.length; i++){
                        User.findById(user.numberOfDirectReports[i], function(err, directReport){
                            directReport.managerId = "";
                            directReport.managerName = "";
                            directReport.save(function(err) {
                                if(err) res.send(err);
                                console.log("message: User numberOfDirectReports manager has been removed");
                            })
                        })
                    }

                    User.remove({_id: req.params.user_id}, function(err, user) {
                        if (err)
                            res.send(err);
            
                        res.json({ message: 'Successfully deleted' });
                    });
                })
            }

            
        })
    });
// 7th part 

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
