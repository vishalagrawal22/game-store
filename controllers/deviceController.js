import async from "async";

import Device from "../models/Device.js";
import Category from "../models/Category.js";
import Game from "../models/Game.js";
import { body, validationResult } from "express-validator";

export function deviceList(req, res, next) {
  async.parallel(
    {
      devices: (cb) => Device.find().exec(cb),
      categories: (cb) => Category.find().select("name").exec(cb),
    },
    (err, { devices, categories }) => {
      if (err) {
        return next(err);
      }
      res.render("device-list.pug", { devices, categories });
    }
  );
}

export function deviceDetail(req, res, next) {
  async.parallel(
    {
      games: (cb) =>
        Game.find({
          supportedDevices: req.params.id,
        })
          .select({
            name: 1,
            price: 1,
            quantity: 1,
            imageURL: 1,
          })
          .exec(cb),
      categories: (cb) => Category.find({}, "name", cb),
      device: (cb) => Device.findById(req.params.id).exec(cb),
    },
    (err, { categories, device, games }) => {
      if (err) {
        return next(err);
      }
      res.render("device-detail", { categories, device, games });
    }
  );
}

export function getDeviceCreate(req, res, next) {
  Category.find()
    .select("name")
    .exec((err, categories) => {
      if (err) {
        return next(err);
      }
      res.render("device-form", { categories });
    });
}

export const postDeviceCreate = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("name should be 3-100 characters long.")
    .escape(),
  (req, res, next) => {
    const device = new Device({
      name: req.body.name,
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Category.find()
        .select("name")
        .exec((err, categories) => {
          if (err) {
            return next(err);
          }
          res.render("device-form", {
            categories,
            device,
            errors: errors.array(),
          });
        });
    } else {
      device.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/devices");
      });
    }
  },
];

export function getDeviceUpdate(req, res, next) {
  async.parallel(
    {
      categories: (cb) => Category.find().select("name").exec(cb),
      device: (cb) => Device.findById(req.params.id).exec(cb),
    },
    (err, { categories, device }) => {
      if (err) {
        return next(err);
      }

      if (device === null) {
        res.redirect("/devices");
      }

      res.render("device-form", {
        categories,
        device,
      });
    }
  );
}

export const postDeviceUpdate = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("name should be 3-100 characters long.")
    .escape(),
  (req, res, next) => {
    const device = new Device({
      name: req.body.name,
      _id: req.params.id,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Category.find()
        .select("name")
        .exec((err, categories) => {
          if (err) {
            return next(err);
          }
          res.render("device-form", {
            categories,
            device,
            errors: errors.array(),
          });
        });
    } else {
      Device.findByIdAndUpdate(req.params.id, device, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/devices");
      });
    }
  },
];

export function getDeviceDelete(req, res) {
  res.send("Not Implemented: GET Device Delete");
}

export function postDeviceDelete(req, res) {
  res.send("Not Implemented: POST Device Delete");
}
