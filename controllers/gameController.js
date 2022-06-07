import async from "async";

import Game from "../models/Game.js";
import Category from "../models/Category.js";

export function gameList(req, res, next) {
  async.parallel(
    {
      games: (cb) => Game.find({}, cb),
      categories: (cb) => Category.find({}, cb),
    },
    (err, { games, categories }) => {
      if (err) {
        return next(err);
      }
      res.render("game-list", {
        games,
        categories,
        home: !req.baseUrl,
      });
    }
  );
}

export function gameDetail(req, res) {
  res.send("Not Implemented: Game Detail");
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
