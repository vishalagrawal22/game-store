import async from "async";

import Device from "../models/Device.js";
import Category from "../models/Category.js";

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

export function deviceDetail(req, res) {
  res.send("Not Implemented: Device Detail");
}

export function getDeviceCreate(req, res) {
  res.send("Not Implemented: Get Device Create");
}

export function postDeviceCreate(req, res) {
  res.send("Not Implemented: Post Device Create");
}

export function getDeviceUpdate(req, res) {
  res.send("Not Implemented: GET Device Update");
}

export function postDeviceUpdate(req, res) {
  res.send("Not Implemented: POST Device Update");
}

export function getDeviceDelete(req, res) {
  res.send("Not Implemented: GET Device Delete");
}

export function postDeviceDelete(req, res) {
  res.send("Not Implemented: POST Device Delete");
}
