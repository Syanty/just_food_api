const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("../config/nodemailer")
const User = require("../models/user");

router.post("/signup/", async (req, res, next) => {
  passport.authenticate("signup", async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(info.statusCode).send({ message: info.message })
    }
    res.status(201).send({
      message: info.message,
      user: user
    });

    nodemailer.sendConfirmationEmail(
      user.email,
      user.confirmationCode
    )

  })(req, res, next);
});


router.get("/verify/:confirmationCode/", async (req, res) => {
  const token_status = verifyToken(req.params.confirmationCode, res)
  if (token_status) {
    User.findOne({
      confirmationCode: req.params.confirmationCode,
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
        if (user.status == 'Active') {
          return res.status(200).send({
            message: "Email already verified"
          })
        }
        user.status = "Active";
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.status(200).send({ message: "Account verified" })
        });

      })
      .catch((e) => console.log("error", e));

  }

})

router.get("/resend/:email/confirmation-link/", async (req, res) => {

  const email = req.params.email
  User.findOne({ email: email }).then(user => {
    if (!user) return res.status(404).send({ message: "Email is not registered" })

    if (user.status === 'Pending') {
      const token = jwt.sign({ email: email }, process.env.SECRET, {
        expiresIn: "1h",
      });
      res.status(200).send({
        message: "Verification link has been sent to your email",
      });

      nodemailer.sendConfirmationEmail(
        user.email,
        user.confirmationCode
      )

    } else {
      res.status(400).send({
        message: "Email is already verified"
      })
    }
  }).catch(err => {
    console.log(err)
  })
})

router.post("/login/", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(info.statusCode).send({ message: info.message });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next({ error: error, message: info.message });

        const body = {
          _id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        };
        const token = jwt.sign({ user: body }, process.env.SECRET, {
          expiresIn: "1d",
        });

        res.status(200).send({ message: info.message, token: token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

//plug in jwt auth to secure route
router.get(
  "/user/profile/",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res, done) => {
    try {
      await User.findById(req.user._id)
        .select("-password -confirmationCode")
        .then((user) => {
          if (!user) return done({
            status: 404,
            message: "Unable to find user"
          })
          res.status(200).send({ user });
        });
    } catch (error) {
      done(error);
    }
  }
);

router.get("/logout/", (req, res) => {
  req.logout();
});

module.exports = router;

function verifyToken(token_id, res) {
  const verify = jwt.verify(token_id, process.env.SECRET, function (err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        res.status(400).send({
          message: "Token has Expired"
        })
      } else {
        res.status(400).send({
          message: "Invalid token"
        })
      }
      return false

    } else {
      return true
    }
  });
  return verify
}