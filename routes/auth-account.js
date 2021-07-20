const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
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
      user:user
    });
  })(req, res, next);
});

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

        return res.json({ message: info.message, token: token });
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
        .select("-password")
        .populate("friends friends_requests friends_requested", "first_name last_name slug")
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