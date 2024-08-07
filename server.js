/*
  File Name: server.js
  Purpose:  Social networking online website.
            It create two collections (users and posts)
            in the DB and manage the interaction with 
            Mongo database using Mongoose module.
            It manages also the static files redirection.
            it has five html pages:
            index.html, login.html, post.html, register.html.
            profile.html.
            it has 3 css files global.css, index.css,
            and post.css

            people can collaborate with others by creating
            their accounts by using the sign-up function,
            then they can add post, comment / like
            others' posts, and lots of features

            It has 16 API's can be categorized as:
            - User profile/login/get management
            - image upload/download prcessing management
            - post creation/modification/deletion management
            - Post's Comments creation/deletion management
            - Post's Likes like/unlike management 
            
            Authors: Ahmad Gaber and Victor
  Class: CSC 337
 */

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const multer = require('multer');
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const imageUpload = multer({storage: multerStorage});

const host = 'localhost';
const port = 3000;

// construct web express server app
const app = express();
// construct DB connection
const db = mongoose.connection;
// mongo connection string
const mongoDBURL = 'mongodb://localhost/social';

// enable JASON support
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// JSON beautifier
app.set('json spaces', ' ');
app.set('json replacer', ' ');


var sessionKeys = {};
const sessionLength = 1000000000;

// establish Mango DB connection
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
// in case of error
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

var Schema = mongoose.Schema;

//User Schema - collection
const UserSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: String,
    createdDate: {
      type: Date,
      default: Date.now
    },
    company: {
        type: String,
    },
    website: String,
    bio: String
  });
  
  User = mongoose.model('user', UserSchema);


  //Posts Schema - collection
  const PostSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    text: String,
    postImage: String,
    likes: [
      { type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        commentByUser: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        commentText: {
          type: String,
          required: true,
        },
        commentDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    postDate: {
      type: Date,
      default: Date.now,
    },
  }); 
  
  Post = mongoose.model("post", PostSchema);

// static files
app.use(express.static('public_html'));

// register new user's complete profile information
app.post('/user', (req, res) => {
  let userObj = req.body;
  User.find({ email: userObj.email })
  .exec((error, results) => {
      if (results.length == 0) {
          user = new User({ name:userObj.name, 
                          email: userObj.email, 
                          password: userObj.password,
                          avatar: userObj.avatar,
                          company:userObj.company,
                          website:userObj.website,
                          bio:userObj.bio
                          });
          user.save((err) => { if (err) { console.log('Could not save user.') }});
        console.log('Username successfuly registered.');  
          res.send('SUCCESS');
      } else {
        console.log('Username already exists.');  
        res.send('DUPLICATE_EMAIL');
      }     
  });
});

//User login and save username in cookie
app.post('/login', (req, res) => {
    var emailObj = req.body.email;
    let userJson = {
        email: emailObj,
        password: req.body.password
    }
  
    console.log(userJson);
  
    User.find(userJson)
      .exec((error,results) => { 
        if ( results.length==1 ) {
          let sessionKey = Math.floor(Math.random() * 1000);
          sessionKeys[emailObj] = sessionKey;
  
          res.cookie("login",emailObj, { key: sessionKey, maxAge: sessionLength });
          res.send('LOGIN_OK');
        } else {
          res.send('LOGIN_FAIL');
        }
      });
  });

// get all users
app.get('/user', (req, res) => {
  User.find({}).exec((error, results) =>  res.json(results));
});

// get specific user by using the email in the parameter 
app.get('/user/:email', (req, res) => {
User.find({email:req.params.email}).exec((error, results) =>  res.json(results));
});

//upload image
app.post('/imageAPI', imageUpload.single('image'), (req, res) => { 
    //console.log(req.file);
    res.json('/image uplpaded successfully'); 
  });
  
  //download image
  app.get('/imageAPI/:filename', (req, res) => {
    let filename  = req.params.filename;
    
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'images/' + filename);
    
    return res.sendFile(fullfilepath);
  });

// add new post
app.post('/post', (req, res) => {
  let postObj = req.body;
  console.log("postObj.email = " + postObj.email);
  User.find({ email: postObj.email })
      .exec((error, results) => {
      if (results.length == 1) {
          // creating Post
          let user = results[0];
          post = new Post({ 
              user: user._id,
              text: postObj.text,
              postImage: postObj.postImage
          });
          post.save((err) => { if (err) { console.log('Could not save Post.') }});
      
      } else {
          console.log('Could not find user.');
      }
  });
  res.send();
});

// get all existed posts
app.get('/post', (req, res) => {
    Post.find({}).populate('user').populate('comments.commentByUser').exec((error, results) => res.json(results));
});

// get specific post by using the postid in the parameter
app.get('/post/:postid', (req, res) => {
  Post.find({_id:req.params.postid}).populate('user').populate('comments.commentByUser')
  .populate('likes').exec((error, results) => res.json(results));
});

// delete a specific post by using the postid in the parameter
app.delete('/post/:postid', (req, res) => {
  console.log('calling delete of post id ' + req.params.postid );
  Post.findByIdAndRemove({_id:req.params.postid}).exec((error, results) =>{ 
    res.json(results)
  });
}); 

// update specific post by using the postid in the parameter
app.put('/post/:postid', (req, res) => {
  console.log('update API of post id ' + req.params.postid );
  updatedJson = {};
  if(req.body.postImage){
    updatedJson = { text: req.body.text , postImage: req.body.postImage };
  }else{
    updatedJson = { text: req.body.text }
  }
  Post.findByIdAndUpdate(req.params.postid, updatedJson,
                            function (err, docs) {
    if (err){
        console.log(err)
    }
  });
res.send(); 
}); 

// add or remove user's like from/to a post likes list
app.post('/like', (req, res) => {
  let reqBody = req.body;
  let emailVar = reqBody.email  ;
  let userId = '';
  User.find({ email: emailVar })
    .exec((error, results) => {
          userId = results[0]._id;
          console.log('userid who likes the post is '+userId);

          Post.find({ _id: reqBody.postId })
                .exec((error, postResults) => {
                if (results.length == 1) {
                  post = postResults[0];
                  
                  if( post.likes.includes(userId) ){
                    console.log("Remove this user from Likes' list.");
                    post.likes.pop(userId);
                  }else{
                    console.log("Add this user to Likes' list.");
                    post.likes.push(userId);
                  }
                  post.save();
                } else {
                    console.log('Could not find Post.');
                }
            });
  });
  res.send();
});

// add new comment to the comments' list of the post
app.post('/comment', (req, res) => {
  let reqBody = req.body;
  let emailVar = reqBody.email  ;
  let userId = '';
  User.find({ email: emailVar })
    .exec((error, results) => {
          userId = results[0]._id;
          console.log('userid who comment on post is '+userId);

          Post.find({ _id: reqBody.postId })
              .exec((error, postResults) => {
              if (postResults.length == 1) {
                post = postResults[0];
                post.comments.push({
                  commentByUser: userId,
                  commentText: reqBody.commentText
                });
                post.save();
              } else {
                  console.log('Could not find Post.');
              }
          });
  });
  res.send();
});

// delete comment from the comments' list of the post
app.delete('/comment', (req, res) => {
  let reqBody = req.body;
  
  Post.find({ _id: reqBody.postId })
    .exec((error, results) => {
          if (results.length == 1) {
            post = results[0];

            for (let [i, comment] of post.comments.entries()) {
              if (comment._id == reqBody.commentId) {
                post.comments.splice(i, 1);
              }
          }
            post.save();
          } else {
              console.log('Could not find Post.');
          }
      });

  res.send();
});

//  clearing the DB when needed
app.get('/clear', (req, res) => {
    db.dropDatabase();
    console.log('Database is clear');
    res.send();
  });

// redirect any other URL's (no in the defined API's) to the root
app.all('*', (req, res) => res.redirect('/'));

// start the server listener
app.listen(port, () => console.log('Server is up and running'));