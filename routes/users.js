var express = require('express');
var router = express.Router();
var authService = require('../services/auth');
var models = require('../models');
var passport = require('../services/passport');

//Signup
router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/signup', function (req, res, next) {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.username
      },
      defaults: {
        FirstName: req.body.firstname,
        LastName: req.body.lastname,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password),
        Admin: false
      }
    })
    .spread(function (result, created) {
      if (created) {
        res.redirect('/users/login');
      } else {
        res.send('There was an error in creating the account');
      }
    });
});

//Login

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username
    }
  })
    .then(user => {
      // console.log(user);
      if (!user) {
        console.log('User not found');
        return res.status(401).json({
          message: "Login failed"
        });
      } else {
        let passwordMatch = authService.comparePasswords(req.body.password, user.Password);
        if (passwordMatch) {
          let token = authService.signUser(user);
          res.cookie('jwt', token);
          if (user && user.Admin) {
            res.redirect('/users/admin/' + user.dataValues.UserId);
          }
          else if (user && !user.Admin) {
            res.redirect('/users/profile');
          } else {
            res.send('Sorry, there is no one in the database by the name.');
          }
        }
      }
    });
});

// router.get('/profile', function (req, res, next) {
//   let token = req.cookies.jwt;
//   if (token) {
//     authService.verifyUser(token)
//       .then(user => {
//         if (user && user.Admin) {
//           res.redirect('/users/admin');
//         } else if (user && !user.Admin) {
//           res.render('profile', {
//             Username: user.Username,
//             FirstName: user.FirstName,
//             LastName: user.LastName
//           });
//         } else {
//           res.status(401);
//           res.send('Must be logged in');
//         }
//       })
//   } else {
//     res.status(401);
//     res.send('Must be logged in');
//   }
// });

router.get('/profile', function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    console.log(token);
    authService.verifyUser(token)
      .then(user => {
        console.log(user);
        // models.users.findOne({
        //   where: {
        //     Username: user.Username
        //   },
        //   include: [{
        //     model: models.post,
        //     required: false
        //   }]
        // })
        //   .then(userInfo => {
        //     console.log(userInfo.posts);
        //     if (user && !user.Admin) {
        //       res.render('profile', {
        //         FirstName: user.FirstName,
        //         LastName: user.LastName,
        //         Email: user.Email,
        //         Username: user.Username,
        //         UserId: user.UserId,
        //         posts: userInfo.posts
        //       });
        //     } else if (user && user.Admin) {
        //       res.redirect('/users/admin');
        //     } else {
        //       res.status(401);
        //       res.send('Must be logged in');
        //     }
        //   });
      });
  }
});

router.get('/admin/:id', function (req, res, next) {
  let token = req.cookies.jwt;
  models.users.findOne({
    where: {
      UserId: req.params.id
    }
  })
    .then(user => {
      if (user.Admin) {
        res.render('adminProfile', {
          Username: user.Username,
          FirstName: user.FirstName,
          LastName: user.LastName
        });
      } else {
        res.send('You are not authorized to view this page.')
      }
    });
});

router.get('/profile', function (req, res, next) {
  res.render('profile');
});

router.get('/profile/posts', function (req, res, next) {
  let token = req.cookies.jwt

  if (token) {
    authService.verifyUser(token)
    .then(user => {
      models.post.findAll({})
      .then(result => {
        res.render('profile');
      })
    })
  } else {
    res.status(401);
    res.send('Unauthorised');
  }
})

module.exports = router;