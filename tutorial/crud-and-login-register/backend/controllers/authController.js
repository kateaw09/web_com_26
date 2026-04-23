// นำเข้าไลบรารี jsonwebtoken สำหรับสร้าง Token และ bcryptjs สำหรับเข้ารหัสรหัสผ่าน
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // นำเข้า User Model

// ฟังก์ชันสำหรับสร้าง JWT Token (รับ id เป็นพารามิเตอร์)
const generateToken = (id) => {
  // สร้างและคืนค่า Token ที่เซ็นด้วย JWT_SECRET และกำหนดให้หมดอายุใน 30 วัน
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    สมัครสมาชิกใหม่ (Register new user)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // เช็คว่ามีผู้ใช้นี้ในระบบหรือยัง
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ทำการเข้ารหัส Password
    const salt = await bcrypt.genSalt(10); // สร้าง Salt สำหรับผสมกับรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, salt); // เข้ารหัสรหัสผ่านด้วย Salt

    // สร้างผู้ใช้ใหม่และบันทึกลงฐานข้อมูล
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      // ถ้าสร้างสำเร็จ ให้ส่งข้อมูลกลับพร้อมกับ Token
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    เข้าสู่ระบบ (Authenticate a user)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ค้นหาผู้ใช้จากอีเมล
    const user = await User.findOne({ email });

    // ตรวจสอบว่าเจอผู้ใช้ และ รหัสผ่านที่รับมา (เมื่อเข้ารหัสแล้ว) ตรงกับในฐานข้อมูลหรือไม่
    if (user && (await bcrypt.compare(password, user.password))) {
      // ถ้าตรงกัน ให้ส่งข้อมูลและ Token กลับไป
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ส่งออกฟังก์ชันเพื่อนำไปใช้ในไฟล์ Routes
module.exports = {
  registerUser,
  loginUser,
};
