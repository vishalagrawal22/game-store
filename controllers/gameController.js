import async from "async";
import multer from "multer";
import imgur from "imgur";

import Game from "../models/Game.js";
import Category from "../models/Category.js";
import Device from "../models/Device.js";
import { body, validationResult } from "express-validator";

const upload = multer();

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

export function getGameCreate(req, res, next) {
  async.parallel(
    {
      categories: (cb) => Category.find().select("name").exec(cb),
      devices: (cb) => Device.find().select("name").exec(cb),
    },
    (err, { categories, devices }) => {
      if (err) {
        return next(err);
      }
      res.render("game-form", { categories, devices });
    }
  );
}

const convertToArray = (items) => {
  if (Array.isArray(items)) {
    return items;
  } else if (items) {
    return [items];
  } else {
    return [];
  }
};

const gameSetup = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("name should be 3-100 characters long")
    .escape(),
  body("description").trim().escape(),
  body("price")
    .isInt({ min: 0 })
    .withMessage("price should be an integer >= 0")
    .toInt()
    .optional({ checkFalsy: true }),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("quantity should be an integer >= 0")
    .toInt()
    .optional({ checkFalsy: true }),
  body("ageRating")
    .isIn(["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18"])
    .withMessage(
      "age rating should be one of PEGI 3, PEGI 7, PEGI 12, PEGI 16, PEGI 18"
    ),
  body("gameImageType")
    .isIn(["url", "file"])
    .withMessage("game image type should be url or file"),
  body("categories").customSanitizer((categories) =>
    convertToArray(categories)
  ),
  body("supportedDevices").customSanitizer((supportedDevices) =>
    convertToArray(supportedDevices)
  ),
  async (req, res, next) => {
    if (req.body.gameImageType === "url") {
      req.body.imageURL = req.body.gameImageURL;
    } else if (req.body.gameImageType === "file") {
      req.body.imageURL = "";
      if (req.file) {
        try {
          const client = new imgur.ImgurClient({
            clientId: process.env.IMGUR_CLIENT_ID,
          });

          const response = await client.upload({
            image: req.file.buffer,
            type: "stream",
          });

          const url = response?.data?.link;
          if (url) {
            req.body.imageURL = url;
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    next();
  },
];

export const postGameCreate = [
  upload.single("gameImageFile"),
  gameSetup,
  (req, res, next) => {
    const errors = validationResult(req);
    const {
      name,
      description,
      price,
      quantity,
      ageRating,
      imageURL,
      categories,
      supportedDevices,
    } = req.body;

    const gameData = {
      name,
      ageRating,
      categories,
      supportedDevices,
    };

    if (description) {
      gameData.description = description;
    }
    if (price) {
      gameData.price = price;
    }
    if (quantity) {
      gameData.quantity = quantity;
    }
    if (imageURL) {
      gameData.imageURL = imageURL;
    }

    const game = new Game(gameData);
    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories: (cb) => Category.find().select("name").exec(cb),
          devices: (cb) => Device.find().select("name").exec(cb),
        },
        (err, { categories, devices }) => {
          if (err) {
            return next(err);
          }

          res.render("game-form", {
            categories,
            devices,
            game,
            errors: errors.array(),
          });
        }
      );
    } else {
      game.save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect("/games");
      });
    }
  },
];

export function getGameUpdate(req, res, next) {
  async.parallel(
    {
      categories: (cb) => Category.find().select("name").exec(cb),
      devices: (cb) => Device.find().select("name").exec(cb),
      game: (cb) => Game.findById(req.params.id).exec(cb),
    },
    (err, { categories, devices, game }) => {
      if (err) {
        return next(err);
      }

      if (game === null) {
        res.redirect("/games");
      }

      res.render("game-form", { categories, devices, game });
    }
  );
}

export const postGameUpdate = [
  upload.single("gameImageFile"),
  gameSetup,
  (req, res, next) => {
    const errors = validationResult(req);
    const {
      name,
      description,
      price,
      quantity,
      ageRating,
      imageURL,
      categories,
      supportedDevices,
    } = req.body;

    const gameData = {
      name,
      ageRating,
      categories,
      supportedDevices,
      _id: req.params.id,
    };

    if (description) {
      gameData.description = description;
    }
    if (price) {
      gameData.price = price;
    }
    if (quantity) {
      gameData.quantity = quantity;
    }
    if (imageURL) {
      gameData.imageURL = imageURL;
    }

    const game = new Game(gameData);
    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories: (cb) => Category.find().select("name").exec(cb),
          devices: (cb) => Device.find().select("name").exec(cb),
        },
        (err, { categories, devices }) => {
          if (err) {
            return next(err);
          }

          res.render("game-form", {
            categories,
            devices,
            game,
            errors: errors.array(),
          });
        }
      );
    } else {
      Game.findByIdAndUpdate(req.params.id, game, (err) => {
        if (err) {
          return next(err);
        }

        res.redirect("/games");
      });
    }
  },
];

export function getGameDelete(req, res, next) {
  async.parallel(
    {
      categories: (cb) => Category.find().exec(cb),
      game: (cb) => Game.findById(req.params.id).select("name").exec(cb),
    },
    (err, { categories, game }) => {
      if (err) {
        return next(err);
      }

      if (game === null) {
        res.redirect("/games");
      }

      res.render("game-delete", { categories, game });
    }
  );
}

export function postGameDelete(req, res, next) {
  Game.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/games");
  });
}
