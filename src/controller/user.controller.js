const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
async function register(req, res) {
  try {
    const { name, email, password, role, created_by } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }
    if (!created_by) {
      return res.status(400).json({ message: "Created by Id is required." });
    }
    const userExists = await User.find({ email });
    if (userExists.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
      role,
      created_by,
    });
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(201).json({ user: userObj });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    const { name, email, password, role, created_by } = req.body;
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role) user.role = role;
    if (created_by) user.created_by = created_by;

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({ user: userObj });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: `90d`,
      }
    );
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(200).json({
      userObj,
      token,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
}

async function getUsers(req, res) {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await User.find({created_by:req.user.id})
      .skip((page - 1) * limit)
      .limit(limit);
    const totalRecords = await User.countDocuments({created_by:req.user.id});
    const data = {
      totalRecords,
      total: users?.length,
      users,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalRecords / limit),
    };
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
}

async function getSingleUser(req, res) {
  const { id } = req.params;
  console.log(id, "fasdlfjhadslf");
  try {
    const response = await User.findById(id);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
  }
}

async function deleteUser(req, res) {
  try {
    const response = await User.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(400).json({
        message: "User does not exists.",
      });
    }
    return res
      .status(200)
      .json({ message: "User has been deleted successfully." });
  } catch (e) {
    console.log(e);
  }
}
module.exports = {
  register,
  login,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
