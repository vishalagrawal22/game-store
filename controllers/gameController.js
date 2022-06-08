import async from "async";
import { query } from "express-validator";

import Game from "../models/Game.js";
import Category from "../models/Category.js";
import Device from "../models/Device.js";

export const gameList = [
  query("ageRating").customSanitizer((rating) => {
    return rating ? rating.replaceAll("+", " ") : "";
  }),
  (req, res, next) => {
    const filters = {};
    if (req.query.ageRating) {
      filters.ageRating = req.query.ageRating;
    }

    if (req.query.supportedDevice) {
      filters.supportedDevices = req.query.supportedDevice;
    }

    async.parallel(
      {
        games: (cb) => Game.find(filters, "name price quantity imageURL", cb),
        categories: (cb) => Category.find({}, "name", cb),
        devices: (cb) => Device.find({}, cb),
      },
      (err, { games, categories, devices }) => {
        if (err) {
          return next(err);
        }

        res.render("game-list", {
          games,
          categories,
          devices,
          home: !req.baseUrl,
          filters: req.query,
        });
      }
    );
  },
];

export function gameDetail(req, res, next) {
  async.parallel(
    {
      categories: (cb) => Category.find({}, "name", cb),
      game: (cb) =>
        Game.findById(req.params.id)
          .populate("categories")
          .populate("supportedDevices")
          .exec(cb),
    },
    (err, { categories, game }) => {
      if (err) {
        return next(err);
      }
      res.render("game-detail", { categories, game });
    }
  );
}

export function getGameCreate(req, res) {
  res.send("Not Implemented: Get Game Create");
}

export function postGameCreate(req, res) {
  res.send("Not Implemented: Post Game Create");
}

export function getGameUpdate(req, res) {
  res.send("Not Implemented: GET Game Update");
}

export function postGameUpdate(req, res) {
  res.send("Not Implemented: POST Game Update");
}

export function getGameDelete(req, res) {
  res.send("Not Implemented: GET Game Delete");
}

export function postGameDelete(req, res) {
  res.send("Not Implemented: POST Game Delete");
}
