import async from "async";

import Game from "../models/Game.js";
import Category from "../models/Category.js";
import Device from "../models/Device.js";

export const getFilteredGames = (category, queryParams, callback) => {
  const filters = {};
  if (category) {
    filters.categories = category;
  }

  if (queryParams.ageRating) {
    filters.ageRating = queryParams.ageRating.replaceAll("+", " ");
  }

  if (queryParams.supportedDevice) {
    filters.supportedDevices = queryParams.supportedDevice;
  }

  Game.find(filters)
    .select({
      name: 1,
      price: 1,
      quantity: 1,
      imageURL: 1,
    })
    .exec(callback);
};

export function gameList(req, res, next) {
  async.parallel(
    {
      games: (cb) => getFilteredGames(null, req.query, cb),
      categories: (cb) => Category.find().select("name").exec(cb),
      devices: (cb) => Device.find().exec(cb),
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
}

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
