const express = require('express');

module.exports = (Collection) => {

  // ======
  // Create
  // ======
  const create = (req, res) => {
    const newEntry = req.body;
    new Collection(newEntry).save((e, newEntry) => {
      if (e) {
        res.sendStatus(500);
      } else {
        res.send(newEntry);
      }
    })
  };

  // =========
  // Read many
  // =========
  const readMany = (req, res) => {
    Collection.find((e, result) => {
      if (e) {
        res.status(500).send(e);
      } else {
        res.send(result);
      }
    });
  };

  // ========
  // Read one
  // ========
  const readOne = (req, res) => {
    const { _id } = req.params;

    Collection.findById(_id, (e, result) => {
      if (e) {
        res.status(500).send(e);
      } else {
        res.send(result);
      }
    });
  };

  // ======
  // Update
  // ======
  const update = (req, res) => {
    const changedEntry = req.body;
    Collection.findByIdAndUpdate(req.params._id, changedEntry, { new: true }, (e) => {
      if (e)
        res.sendStatus(500);
      else
        res.sendStatus(200);
    });
  };

  // ======
  // Remove
  // ======
  const remove = (req, res) => {
    Collection.findByIdAndRemove( req.params._id, (e) => {
      if (e)
        res.status(500).send(e);
      else
        res.sendStatus(200);
    });
  };

  // ======
  // Routes
  // ======

  let router = express.Router();

  router.post('/', create);
  router.get('/', readMany);
  router.get('/:_id', readOne);
  router.put('/:_id', update);
  router.delete('/:_id', remove);

  return router;

}