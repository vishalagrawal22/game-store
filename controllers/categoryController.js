import async from "async";
import { body, validationResult } from "express-validator";

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

export function getCategoryCreate(req, res, next) {
  Category.find()
    .select("name")
    .exec((err, categories) => {
      if (err) {
        return next(err);
      }
      res.render("category-form", { categories });
    });
}

export const postCategoryCreate = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("name should be 3-100 characters long.")
    .escape(),
  body("description").trim().escape(),
  (req, res, next) => {
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Category.find()
        .select("name")
        .exec((err, categories) => {
          if (err) {
            return next(err);
          }
          res.render("category-form", {
            categories,
            category,
            errors: errors.array(),
          });
        });
    } else {
      category.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/categories");
      });
    }
  },
];

export function getCategoryUpdate(req, res, next) {
  async.parallel(
    {
      categories: (cb) => Category.find().select("name").exec(cb),
      category: (cb) => Category.findById(req.params.id).exec(cb),
    },
    (err, { categories, category }) => {
      if (err) {
        return next(err);
      }

      if (category === null) {
        res.redirect("/categories");
      }

      res.render("category-form", {
        categories,
        category,
      });
    }
  );
}

export const postCategoryUpdate = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("name should be 3-100 characters long.")
    .escape(),
  body("description").trim().escape(),
  (req, res, next) => {
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
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
          res.render("category-form", {
            categories,
            category,
            errors: errors.array(),
          });
        });
    } else {
      Category.findByIdAndUpdate(req.params.id, category, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/categories");
      });
    }
  },
];

export function getCategoryDelete(req, res) {
  res.send("Not Implemented: GET Category Delete");
}

export function postCategoryDelete(req, res) {
  res.send("Not Implemented: POST Category Delete");
}
