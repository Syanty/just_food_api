const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    validate: {
      validator: function (v) {
        return v.length <= 15;
      },
      message: `Firstname should be of atmost 15 character`
    }
  },
  last_name: {
    type: String,
    validate: {
      validator: function (v) {
        return v.length <= 15;
      },
      message: `Lastname should be of atmost 15 character`
    }
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(v).toLowerCase());
      },
      message: "Invalid email address"
    }
  },
  password: {
    type: String,
    validate: {
      validator: function (v) {
        return v.length >= 8;
      },
      message: `Password should be of atleast 8 character`
    }
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  confirmationCode: {
    type: String,
    unique: true
  },
  status: {
    type: String, 
    enum: ['Pending', 'Active'],
    default: 'Pending'
  },
  phone: {
    type: Number,
    validate: {
      validator: function (v) {
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  phoneConfirmed:{
    type: String, 
    enum: ['Pending', 'Confirmed'],
    default: 'Pending'
  },
  resetPasswordCode: {
    type: String,
    unique: true
  },
  date_created: { type: Date, default: Date.now }
});

UserSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.isValidPassword = async function isValidPassword(data) {
  return await bcrypt.compare(data, this.password);
};

module.exports = mongoose.model("User", UserSchema);