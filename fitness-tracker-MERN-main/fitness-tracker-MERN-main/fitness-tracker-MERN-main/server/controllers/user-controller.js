const { User } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  // get a single user by id or username
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
    })
      .select("-__v")
      .populate("cardio")
      .populate("resistance")

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }

    res.json(foundUser);
  },

  // create a user, sign a token, and send it back to sign up page
  async createUser({ body }, res) {
    try {
      const { username, email, password } = body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required." });
      }

      const user = await User.create({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const token = signToken(user);
      return res.status(201).json({ token, user });
    } catch (err) {
      if (err?.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || "username or email";
        return res.status(409).json({ message: `That ${field} is already in use.` });
      }

      if (err?.name === "ValidationError") {
        const message = Object.values(err.errors)
          .map((validationError) => validationError.message)
          .join(" ");
        return res.status(400).json({ message });
      }

      console.error("Unable to create user:", err);
      return res.status(500).json({ message: "Unable to create the account. Please try again later." });
    }
  },

  // login a user, sign a token, and send it back to login page
  async login({ body }, res) {
    const user = await User.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });
    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Wrong password!" });
    }
    const token = signToken(user);
    res.json({ token, user });
  },
};
