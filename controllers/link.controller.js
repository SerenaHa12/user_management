const moment = require("moment");
const model = require("../models/index");
const Link = model.Link;
const bcrypt = require("bcrypt");
const shortId = require("shortid");

module.exports = {
  index: async (req, res) => {
    const limit = 3; // sau này đưa limit vào file config
    const { page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const { rows: links, count } = await Link.findAndCountAll({
      order: [["id", "desc"]],
      limit,
      offset,
    });
    const totalPage = Math.ceil(count / limit);
    res.render("links/index", { links, moment, totalPage, page, req });
  },

  add: (req, res, next) => {
    res.render("links/add");
  },

  handleAdd: async (req, res, next) => {
    const body = req.body;
    const id = shortId.generate();
    console.log(id);
    try {
      const link = await Link.create({
        full: body.full,
        short: id,
        password: body.password,
        click: body.click,
      });

      console.log(link);

      if (link) {
        return res.redirect("/links");
      }
    } catch (error) {
      return next(e);
    }
  },

  redirect: async (req, res, next) => {
    const { short } = req.params;
    try {
      const link = await Link.findOne({ where: { short } });
      console.log(link);
      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }
      link.clicks++;
      await link.save();
      res.redirect(link.full);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
