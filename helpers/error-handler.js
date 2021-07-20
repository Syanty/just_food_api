// Handle errors.
module.exports = (err, req, res, next) => {
    //duplicate key error
    if (err.code === 11000 && err.name === "MongoError") {
      return res.status(400).send({
        error: `${Object.keys(err.keyPattern)[0]} already exist`
          .split(" ")
          .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
          .join(" "),
      });
    }
    if (err.name === "CastError") {
      return res.status(404).send({
        message: `${err.path} ObjectId not found`
          .split(" ")
          .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
          .join(" "),
      });
    }
  
    if (err.name === "ValidationError") {
      let errors = {};
  
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
  
      return res.status(400).send(errors);
    }
  
    return res.status(err.status || 500).send({
      error: err,
    });
  };