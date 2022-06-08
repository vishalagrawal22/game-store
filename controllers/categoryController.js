import async from "async";

import Category from "../models/Category.js";
import Device from "../models/Device.js";

import { getFilteredGames } from "./gameController.js";

export function categoryList(req, res, next) {
  Category.find({}, (err, categories) => {
    if (err) {
      return next(err);
    }
    res.render("category-list", { categories });
  });
}

export function categoryDetail(req, res, next) {
  async.parallel(
    {
      games: (cb) => getFilteredGames(req.params.id, req.query, cb),
      devices: (cb) => Device.find().exec(cb),
      categories: (cb) => Category.find().select("name").exec(cb),
      category: (cb) => Category.findById(req.params.id).exec(cb),
    },
    (err, { games, category, categories, devices }) => {
      if (err) {
        return next(err);
      }
      res.render("category-detail", {
        games,
        category,
        categories,
        devices,
        filters: req.query,
      });
    }
  );
}

export function getCategoryCreate(req, res) {
  res.send("Not Implemented: Get Category Create");
}

export function postCategoryCreate(req, res) {
  res.send("Not Implemented: Post Category Create");
}

export function getCategoryUpdate(req, res) {
  res.send("Not Implemented: GET Category Update");
}

export function postCategoryUpdate(req, res) {
  res.send("Not Implemented: POST Category Update");
}

export function getCategoryDelete(req, res) {
  res.send("Not Implemented: GET Category Delete");
}

export function postCategoryDelete(req, res) {
  res.send("Not Implemented: POST Category Delete");
}
