const Admin = require("../models/Admin");

const Astrologer = require("../models/Astrologer");

const User = require("../models/User");

const Order = require("../models/Order");

const WalletTransaction = require("../models/WalletTransaction"); // ✅ NEW

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// Permanent image storage — selected images are received in memory by
// multer and pushed straight to Cloudinary (never to the local disk).
const {
  CLOUDINARY_FOLDERS,
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
  removeOldImage,
} = require("../utils/cloudinaryUpload");
 
/* =========================

   Register Admin

========================= */

const registerAdmin = async (req, res) => {

  try {

    const { name, email, password } = req.body;
 
    const existingAdmin = await Admin.findOne({ email });
 
    if (existingAdmin) {

      return res.status(400).json({

        success: false,

        message: "Admin already exists",

      });

    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    const admin = await Admin.create({

      name,

      email,

      password: hashedPassword,

    });
 
    res.status(201).json({

      success: true,

      message: "Admin registered successfully",

      admin: {

        _id: admin._id,

        name: admin.name,

        email: admin.email,

      },

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Login Admin

========================= */

const loginAdmin = async (req, res) => {

  try {

    const { email, password } = req.body;
 
    const admin = await Admin.findOne({ email });
 
    if (!admin) {

      return res.status(404).json({

        success: false,

        message: "Admin not found",

      });

    }
 
    const isMatch = await bcrypt.compare(password, admin.password);
 
    if (!isMatch) {

      return res.status(400).json({

        success: false,

        message: "Invalid credentials",

      });

    }
 
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {

      expiresIn: "7d",

    });
 
    res.status(200).json({

      success: true,

      token,

      admin: {

        _id: admin._id,

        name: admin.name,

        email: admin.email,

      },

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Get Profile

========================= */

const getProfile = async (req, res) => {

  try {

    const admin = await Admin.findById(req.admin.id).select("-password");
 
    if (!admin) {

      return res.status(404).json({

        success: false,

        message: "Admin not found",

      });

    }
 
    res.status(200).json({

      success: true,

      admin,

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Dashboard Stats (UPDATED)

========================= */

const getDashboardStats = async (req, res) => {

  try {

    const totalAstrologers = await Astrologer.countDocuments();

    const onlineAstrologers = await Astrologer.countDocuments({ status: "online" });

    const busyAstrologers = await Astrologer.countDocuments({ status: "busy" });

    const offlineAstrologers = await Astrologer.countDocuments({ status: "offline" });
 
    // Users Stats

    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({ status: "active" });
 
    // Orders Stats

    const totalOrders = await Order.countDocuments();

    const completedOrders = await Order.countDocuments({ status: "completed" });

    const pendingOrders = await Order.countDocuments({ status: "pending" });
 
    // Revenue Calculation

    const revenueData = await Order.aggregate([

      { $match: { status: "completed" } },

      { $group: { _id: null, total: { $sum: "$amount" } } },

    ]);
 
    const totalRevenue = revenueData[0]?.total || 0;
 
    res.status(200).json({

      success: true,

      stats: {

        totalAstrologers,

        onlineAstrologers,

        busyAstrologers,

        offlineAstrologers,

        totalUsers,

        activeUsers,

        totalOrders,

        completedOrders,

        pendingOrders,

        totalRevenue,

      },

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Get All Astrologers

========================= */

const getAstrologers = async (req, res) => {

  try {

    const page = Number(req.query.page) || 1;

    const limit = 10;

    const skip = (page - 1) * limit;

    const search = req.query.search || "";
 
    const query = {};

    if (search) {

      query.name = {

        $regex: search,

        $options: "i",

      };

    }
 
    const astrologers = await Astrologer.find(query)

      .sort({ createdAt: -1 })

      .skip(skip)

      .limit(limit);
 
    const total = await Astrologer.countDocuments(query);
 
    res.status(200).json({

      success: true,

      astrologers,

      page,

      totalPages: Math.ceil(total / limit),

      total,

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Create Astrologer

========================= */

const createAstrologer = async (req, res) => {

  try {

    // ✅ SAFE DEBUG LOG — password ka value kabhi log nahi hota
    console.log("========== CREATE ASTROLOGER ==========");

    console.log({
      email: req.body.email,
      passwordReceived: Boolean(req.body.password),
      hasFile: Boolean(req.file),
    });

    console.log("BODY keys:", Object.keys(req.body || {}));
 
    const { name, email, password, experience, pricePerMinute, rating, status, skills, languages } = req.body;

    if (!name || name.trim() === "") {

      return res.status(400).json({

        success: false,

        message: "Name is required",

      });

    }

    // Email + Password required for a NEW astrologer (login credentials)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {

      return res.status(400).json({

        success: false,

        message: "A valid email is required",

      });

    }

    if (!password || password.length < 6) {

      return res.status(400).json({

        success: false,

        message: "Password is required (minimum 6 characters)",

      });

    }

    // Duplicate email check (unique index se pehle friendly error)
    const existingAstrologer = await Astrologer.findOne({ email: email.trim().toLowerCase() });

    if (existingAstrologer) {

      return res.status(400).json({

        success: false,

        message: "An astrologer with this email already exists",

      });

    }

    // ✅ Password plaintext mein kabhi store nahi hota — bcrypt hash
    const hashedPassword = await bcrypt.hash(password, 10);
 
    let skillsArray = [];

    let languagesArray = [];
 
    if (skills) {

      skillsArray = typeof skills === 'string' ? JSON.parse(skills) : skills;

    }
 
    if (languages) {

      languagesArray = typeof languages === 'string' ? JSON.parse(languages) : languages;

    }
 
    // Upload the selected image straight to Cloudinary (memory → cloud).
    let uploadedImage = null;

    if (req.file) {
      try {
        uploadedImage = await uploadBufferToCloudinary(req.file, {
          folder: CLOUDINARY_FOLDERS.astrologers,
        });
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: uploadError.message,
        });
      }
    }

    let astrologer;

    try {

      astrologer = await Astrologer.create({

        name: name.trim(),

        email: email.trim().toLowerCase(),

        password: hashedPassword,

      experience: Number(experience) || 0,

      pricePerMinute: Number(pricePerMinute) || 10,

      rating: Number(rating) || 5,

      status: status || "online",

      skills: skillsArray,

      languages: languagesArray,

      image: uploadedImage ? uploadedImage.secure_url : "",

        imagePublicId: uploadedImage ? uploadedImage.public_id : "",

      });
    } catch (createError) {
      // DB write failed after upload → clean up the orphaned asset.
      if (uploadedImage) {
        destroyCloudinaryAsset(uploadedImage.public_id);
      }

      throw createError;
    }
 
    res.status(201).json({

      success: true,

      message: "Astrologer created successfully",

      astrologer,

    });

  } catch (error) {

    console.error("CREATE ERROR:", error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Update Astrologer

========================= */

const updateAstrologer = async (req, res) => {

  try {

    // ✅ SAFE DEBUG LOG — password ka value kabhi log nahi hota
    console.log("========== UPDATE ASTROLOGER ==========");

    console.log({
      email: req.body.email,
      passwordReceived: Boolean(req.body.password),
      hasFile: Boolean(req.file),
      id: req.params.id,
    });
 
    const astrologer = await Astrologer.findById(req.params.id);
 
    if (!astrologer) {

      return res.status(404).json({

        success: false,

        message: "Astrologer not found",

      });

    }
 
    const { name, email, password, experience, pricePerMinute, rating, status, skills, languages } = req.body;
 
    const updateData = {};

    // Email optional on update — sirf tab update karo jab bheja gaya ho
    if (email !== undefined) {

      const trimmedEmail = email.trim().toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {

        return res.status(400).json({

          success: false,

          message: "Please provide a valid email",

        });

      }

      const emailOwner = await Astrologer.findOne({ email: trimmedEmail });

      if (emailOwner && emailOwner._id.toString() !== req.params.id) {

        return res.status(400).json({

          success: false,

          message: "Another astrologer already uses this email",

        });

      }

      updateData.email = trimmedEmail;

    }

    // Password optional on update — blank matlb current password unchanged
    if (password) {

      if (password.length < 6) {

        return res.status(400).json({

          success: false,

          message: "Password must be at least 6 characters",

        });

      }

      updateData.password = await bcrypt.hash(password, 10);

    }
 
    if (name !== undefined) {

      if (name.trim() === "") {

        return res.status(400).json({

          success: false,

          message: "Name cannot be empty",

        });

      }

      updateData.name = name.trim();

    }
 
    if (experience !== undefined) {

      updateData.experience = Number(experience);

    }
 
    if (pricePerMinute !== undefined) {

      updateData.pricePerMinute = Number(pricePerMinute);

    }
 
    if (rating !== undefined) {

      updateData.rating = Number(rating);

    }
 
    if (status !== undefined) {

      updateData.status = status;

    }
 
    if (skills !== undefined) {

      updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;

    }
 
    if (languages !== undefined) {

      updateData.languages = typeof languages === 'string' ? JSON.parse(languages) : languages;

    }
 
    // Previous image — deleted ONLY after the replacement is saved.
    const previousImage = astrologer.image;
    const previousImagePublicId = astrologer.imagePublicId;

    let uploadedImage = null;

    if (req.file) {

      // Upload the replacement straight to Cloudinary (memory → cloud).
      try {
        uploadedImage = await uploadBufferToCloudinary(req.file, {
          folder: CLOUDINARY_FOLDERS.astrologers,
        });
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: uploadError.message,
        });
      }

      updateData.image = uploadedImage.secure_url;

      updateData.imagePublicId = uploadedImage.public_id;

    }
 
    if (Object.keys(updateData).length === 0) {

      return res.status(400).json({

        success: false,

        message: "No data to update",

      });

    }
 
    console.log("UPDATE DATA:", updateData);
 
    let updatedAstrologer;

    try {
      updatedAstrologer = await Astrologer.findByIdAndUpdate(

        req.params.id,

        updateData,

        {

          new: true,

          runValidators: true,

        }

      );
    } catch (updateError) {
      // DB write failed after upload → remove the orphaned new asset.
      if (uploadedImage) {
        destroyCloudinaryAsset(uploadedImage.public_id);
      }

      throw updateError;
    }

    // New image is saved — now it is safe to drop the previous one
    // (Cloudinary asset by public_id, or legacy /uploads/ file).
    if (uploadedImage && (previousImage || previousImagePublicId)) {
      removeOldImage({
        imageUrl: previousImage,
        publicId: previousImagePublicId,
      });
    }
 
    res.status(200).json({

      success: true,

      message: "Astrologer updated successfully",

      astrologer: updatedAstrologer,

    });

  } catch (error) {

    console.error("UPDATE ERROR:", error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Delete Astrologer

========================= */

const deleteAstrologer = async (req, res) => {

  try {

    const astrologer = await Astrologer.findById(req.params.id);
 
    if (!astrologer) {

      return res.status(404).json({

        success: false,

        message: "Astrologer not found",

      });

    }
 
    const imageUrl = astrologer.image;
    const imagePublicId = astrologer.imagePublicId;

    await Astrologer.findByIdAndDelete(req.params.id);

    // Best-effort cleanup of the Cloudinary asset (or legacy local file).
    removeOldImage({ imageUrl, publicId: imagePublicId });
 
    res.status(200).json({

      success: true,

      message: "Deleted Successfully",

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   USERS MANAGEMENT (NEW)

========================= */
 
/* =========================

   Get All Users

========================= */

const getUsers = async (req, res) => {

  try {

    const page = Number(req.query.page) || 1;

    const limit = 10;

    const skip = (page - 1) * limit;

    const search = req.query.search || "";
 
    const query = {};

    if (search) {

      query.$or = [

        { name: { $regex: search, $options: "i" } },

        { email: { $regex: search, $options: "i" } },

        { phone: { $regex: search, $options: "i" } },

      ];

    }
 
    const users = await User.find(query)

      .sort({ createdAt: -1 })

      .skip(skip)

      .limit(limit);
 
    const total = await User.countDocuments(query);
 
    res.status(200).json({

      success: true,

      users,

      page,

      totalPages: Math.ceil(total / limit),

      total,

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Get Single User

========================= */

const getUserById = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);
 
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }
 
    res.status(200).json({

      success: true,

      user,

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Update User

========================= */

const updateUser = async (req, res) => {

  try {

    console.log("========== UPDATE USER ==========");

    console.log("BODY:", req.body);

    console.log("ID:", req.params.id);
 
    const user = await User.findById(req.params.id);
 
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }
 
    const { name, email, phone, status } = req.body;
 
    const updateData = {};
 
    if (name !== undefined) {

      if (name.trim() === "") {

        return res.status(400).json({

          success: false,

          message: "Name cannot be empty",

        });

      }

      updateData.name = name.trim();

    }
 
    if (email !== undefined) {

      updateData.email = email;

    }
 
    if (phone !== undefined) {

      updateData.phone = phone;

    }
 
    if (status !== undefined) {

      updateData.status = status;

    }
 
    if (Object.keys(updateData).length === 0) {

      return res.status(400).json({

        success: false,

        message: "No data to update",

      });

    }
 
    const updatedUser = await User.findByIdAndUpdate(

      req.params.id,

      updateData,

      {

        new: true,

        runValidators: true,

      }

    );
 
    res.status(200).json({

      success: true,

      message: "User updated successfully",

      user: updatedUser,

    });

  } catch (error) {

    console.error("UPDATE USER ERROR:", error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Delete User

========================= */

const deleteUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);
 
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }
 
    await User.findByIdAndDelete(req.params.id);
 
    res.status(200).json({

      success: true,

      message: "User deleted successfully",

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   ORDERS MANAGEMENT (NEW)

========================= */
 
/* =========================

   Get All Orders

========================= */

const getOrders = async (req, res) => {

  try {

    const page = Number(req.query.page) || 1;

    const limit = 10;

    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const status = req.query.status || "";
 
    const query = {};
 
    if (search) {

      // Search in populated fields is complex, so we'll filter after population

    }
 
    if (status && status !== "all") {

      query.status = status;

    }
 
    const orders = await Order.find(query)

      .populate("userId", "name email phone")

      .populate("astrologerId", "name")

      .sort({ createdAt: -1 })

      .skip(skip)

      .limit(limit);
 
    // Filter by search if provided (after population)

    let filteredOrders = orders;

    if (search) {

      filteredOrders = orders.filter(order => {

        const userName = order.userId?.name?.toLowerCase() || "";

        const astrologerName = order.astrologerId?.name?.toLowerCase() || "";

        const searchTerm = search.toLowerCase();

        return userName.includes(searchTerm) || astrologerName.includes(searchTerm);

      });

    }
 
    const total = await Order.countDocuments(query);
 
    res.status(200).json({

      success: true,

      orders: filteredOrders,

      page,

      totalPages: Math.ceil(total / limit),

      total,

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Get Single Order

========================= */

const getOrderById = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id)

      .populate("userId", "name email phone")

      .populate("astrologerId", "name skills pricePerMinute");
 
    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found",

      });

    }
 
    res.status(200).json({

      success: true,

      order,

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Update Order

========================= */

const updateOrder = async (req, res) => {

  try {

    console.log("========== UPDATE ORDER ==========");

    console.log("BODY:", req.body);

    console.log("ID:", req.params.id);
 
    const order = await Order.findById(req.params.id);
 
    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found",

      });

    }
 
    const { status, amount, duration } = req.body;
 
    const updateData = {};
 
    if (status !== undefined) {

      const validStatuses = ["pending", "in-progress", "completed", "cancelled"];

      if (!validStatuses.includes(status)) {

        return res.status(400).json({

          success: false,

          message: "Invalid status",

        });

      }

      updateData.status = status;

    }
 
    if (amount !== undefined) {

      updateData.amount = Number(amount);

    }
 
    if (duration !== undefined) {

      updateData.duration = duration;

    }
 
    if (Object.keys(updateData).length === 0) {

      return res.status(400).json({

        success: false,

        message: "No data to update",

      });

    }
 
    const updatedOrder = await Order.findByIdAndUpdate(

      req.params.id,

      updateData,

      {

        new: true,

        runValidators: true,

      }

    )

      .populate("userId", "name email")

      .populate("astrologerId", "name");
 
    res.status(200).json({

      success: true,

      message: "Order updated successfully",

      order: updatedOrder,

    });

  } catch (error) {

    console.error("UPDATE ORDER ERROR:", error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   Delete Order

========================= */

const deleteOrder = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);
 
    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found",

      });

    }
 
    await Order.findByIdAndDelete(req.params.id);
 
    res.status(200).json({

      success: true,

      message: "Order deleted successfully",

    });

  } catch (error) {

    console.log(error);
 
    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
 
/* =========================

   ✅ NEW: GET ALL WALLET TRANSACTIONS

========================= */

const getAllTransactions = async (req, res) => {

  try {

    const transactions = await WalletTransaction.find({})

      .populate("userId", "name email phone")

      .sort({ createdAt: -1 });
 
    const totalRevenue = transactions

      .filter((t) => t.type === "credit" && t.reason === "Recharge")

      .reduce((sum, t) => sum + t.amount, 0);
 
    const totalSpent = transactions

      .filter((t) => t.type === "debit")

      .reduce((sum, t) => sum + t.amount, 0);
 
    res.json({

      success: true,

      count: transactions.length,

      totalRevenue,

      totalSpent,

      transactions,

    });

  } catch (err) {

    console.error("GET ALL TRANSACTIONS ERROR:", err);

    res.status(500).json({ success: false, message: err.message });

  }

};
 
module.exports = {

  registerAdmin,

  loginAdmin,

  getProfile,

  getDashboardStats,

  getAstrologers,

  createAstrologer,

  updateAstrologer,

  deleteAstrologer,

  // Users

  getUsers,

  getUserById,

  updateUser,

  deleteUser,

  // Orders

  getOrders,

  getOrderById,

  updateOrder,

  deleteOrder,

  // ✅ NEW: Transactions

  getAllTransactions,

};
 