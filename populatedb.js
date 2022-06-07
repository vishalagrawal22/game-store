import async from "async";
import mongoose from "mongoose";

import Category from "./models/Category.js";
import Device from "./models/Device.js";
import Game from "./models/Game.js";

if (process.argv.length < 3) {
  throw new Error("connection string missing");
}

const mongoDB = process.argv[2];
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let categories;
let devices;

function categoryCreate(name, description, callback) {
  const categoryDetails = {
    name,
  };

  if (description) {
    categoryDetails.description = description;
  }

  const category = new Category(categoryDetails);
  category.save((err) => {
    if (err) {
      callback(err, null);
    }
    callback(null, category);
  });
}

function deviceCreate(name, callback) {
  const deviceDetails = {
    name,
  };

  const device = new Device(deviceDetails);
  device.save((err) => {
    if (err) {
      callback(err, null);
    }
    callback(null, device);
  });
}

function gameCreate(
  name,
  ageRating,
  description,
  imageURL,
  price,
  quantity,
  categories,
  supportedDevices,
  callback
) {
  const gameDetails = {
    name,
    ageRating,
  };

  if (description) {
    gameDetails.description = description;
  }

  if (imageURL) {
    gameDetails.imageURL = imageURL;
  }

  if (price) {
    gameDetails.price = price;
  }

  if (quantity) {
    gameDetails.quantity = quantity;
  }

  if (categories) {
    gameDetails.categories = categories;
  }

  if (supportedDevices) {
    gameDetails.supportedDevices = supportedDevices;
  }

  const game = new Game(gameDetails);
  game.save((err) => {
    if (err) {
      callback(err, null);
    }
    callback(null, game);
  });
}

function createDevices(callback) {
  async.parallel(
    {
      ps3: (cb) => {
        deviceCreate("PlayStation 3", cb);
      },
      ps4: (cb) => {
        deviceCreate("PlayStation 4", cb);
      },
      windows: (cb) => {
        deviceCreate("Microsoft Windows", cb);
      },
      mac: (cb) => {
        deviceCreate("MacOS", cb);
      },
      NS: (cb) => {
        deviceCreate("Nintendo Switch", cb);
      },
      XboxO: (cb) => {
        deviceCreate("Xbox One", cb);
      },
      XboxX: (cb) => {
        deviceCreate("Xbox Series X", cb);
      },
      XboxS: (cb) => {
        deviceCreate("Xbox Series S", cb);
      },
    },
    (err, results) => {
      if (err) {
        callback(err, null);
      }
      devices = results;
      callback(null, results);
    }
  );
}

function createCategories(callback) {
  async.parallel(
    {
      rpg: (cb) => {
        categoryCreate(
          "RPG",
          "A computer game in which players control the actions of characters in an imaginary world.",
          cb
        );
      },
      adventure: (cb) => {
        categoryCreate(
          "Adventure",
          "An adventure game is a video game in which the player assumes the role of a protagonist in an interactive story driven by exploration and/or puzzle-solving.",
          cb
        );
      },
      indie: (cb) => {
        categoryCreate(
          "Indie",
          "An indie game, short for independent video game, is a video game typically created by individuals or smaller development teams without the financial and technical support of a large game publisher",
          cb
        );
      },
      survival: (cb) => {
        categoryCreate(
          "Survival",
          "Survival games are a sub-genre of action video games, usually set in hostile, intense, open-world environments.",
          cb
        );
      },
      survivalHorror: (cb) => {
        categoryCreate("Survival horror", null, cb);
      },
      actionAdventure: (cb) => {
        categoryCreate(
          "Action-adventure",
          "The action-adventure genre is a video game genre that combines core elements from both the action game and adventure game genres",
          cb
        );
      },
    },
    (err, results) => {
      if (err) {
        callback(err, null);
      }
      categories = results;
      callback(null, results);
    }
  );
}

function createGames(callback) {
  async.parallel(
    {
      godOfWar: (cb) => {
        gameCreate(
          "God of War",
          "PEGI 18",
          "From Santa Monica Studio and creative director Cory Barlog comes a new beginning for God of War. Living as a man outside the shadow of the gods, Kratos must adapt to unfamiliar lands, unexpected threats, and a second chance at being a father. Together with his son Atreus, the pair will venture into the brutal Norse wilds and fight to fulfill a deeply personal quest.",
          "https://i.ibb.co/N3QQxhQ/God-of-war.jpg",
          3299,
          5,
          [categories.actionAdventure, categories.rpg],
          [devices.ps4, devices.windows],
          cb
        );
      },
      theLastOfUs: (cb) => {
        gameCreate(
          "The Last of Us",
          "PEGI 18",
          "The Last of Us is a 2013 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. Players control Joel, a smuggler tasked with escorting a teenage girl, Ellie, across a post-apocalyptic United States. The Last of Us is played from a third-person perspective. Players use firearms and improvised weapons, and can use stealth to defend against hostile humans and cannibalistic creatures infected by a mutated fungus in the genus Cordyceps.",
          "https://i.ibb.co/ZJQYsn9/The-last-of-us.jpg",
          2499,
          1,
          [categories.actionAdventure, categories.survivalHorror],
          [devices.ps3, devices.ps4],
          cb
        );
      },
      subnautica: (cb) => {
        gameCreate(
          "Subnautica",
          "PEGI 12",
          "You have crash-landed on an alien ocean world, and the only way to go is down. Descend into the depths of a vast underwater world filled with wonder and peril. Craft equipment, pilot submarines and out-smart wildlife to explore lush coral reefs, volcanoes, cave systems, and more - all while trying to survive.",
          "https://i.ibb.co/D9Wzxzp/Subnautica.webp",
          699,
          3,
          [categories.adventure, categories.indie, categories.survival],
          [
            devices.mac,
            devices.windows,
            devices.XboxO,
            devices.XboxS,
            devices.XboxX,
            devices.NS,
            devices.ps4,
            devices.ps5,
          ],
          cb
        );
      },
      test: (cb) => {
        gameCreate(
          "Test game",
          "PEGI 7",
          null,
          null,
          500,
          7,
          categories.adventure,
          devices.windows,
          cb
        );
      },
    },
    (err, results) => {
      if (err) {
        callback(err, null);
      }
      callback(null, results);
    }
  );
}

(function main() {
  async.series(
    [
      function (callback) {
        createCategories(callback);
      },
      function (callback) {
        createDevices(callback);
      },
      function (callback) {
        createGames(callback);
      },
    ],
    function (err, result) {
      if (err) {
        console.error(err);
      } else {
        console.log("Success");
        console.log(result);
      }
      db.close();
    }
  );
})();
