const moment = require("moment");
const model = require("../models/index");
const User = model.User;
const bcrypt = require("bcrypt");
// thêm object toán tử của sequelize
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res) => {
    const { status, keyword } = req.query;
    const filter = {};
    if (status === "active" || status === "inactive") {
      filter.status = status === "active" ? true : false;
    }
    if (keyword) {
      filter[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      ];
    }
    const limit = 3; // sau này đưa limit vào file config
    const { page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const { rows: users, count } = await User.findAndCountAll({
      order: [["id", "desc"]],
      where: filter,
      limit,
      offset,
    });

    // console.log("users", users);
    const totalPage = Math.ceil(count / limit);

    res.render("users/index", { users, moment, totalPage, page, req });
  },

  add: async (req, res) => {
    // console.log("render ui");
    res.render("users/add");
  },

  handleAdd: async (req, res, next) => {
    const body = req.body;
    const hashedPassword = bcrypt.hashSync(body.password, 10);
    try {
      const user = await User.create({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        status: +body.status === 1,
      });
      //   console.log(user);

      if (user) {
        return res.redirect("/users");
      }
    } catch (err) {
      return next(e);
    }
  },

  edit: async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await User.findOne({
        where: { id },
      });
      //   console.log(user);

      if (!user) {
        throw new Error("User not found");
      }

      res.render("users/edit", { user });
    } catch (e) {
      return next(e);
    }
  },

  handleEdit: async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    try {
      const user = await User.findOne({
        where: { id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Update user information, excluding the password
      const status = await User.update(
        {
          name: body.name,
          email: body.email,
          status: +body.status === 1,
        },
        {
          where: { id },
        }
      );

      return res.redirect("/users");
    } catch (e) {
      return next(e);
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    await User.destroy({
      where: { id },
      force: true, // xóa vĩnh viễn
    });
    return res.redirect("/users");
  },
};
