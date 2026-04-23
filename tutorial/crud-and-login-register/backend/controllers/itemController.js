const Item = require('../models/Item'); // นำเข้า Item Model

// @desc    ดึงข้อมูล Item ทั้งหมดของผู้ใช้ที่กำลังล็อกอิน (Read)
// @route   GET /api/items
// @access  Private
const getItems = async (req, res) => {
  try {
    // ค้นหา Item ทั้งหมดที่มี user id ตรงกับ req.user.id (ได้มาจาก authMiddleware)
    const items = await Item.find({ user: req.user.id });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    สร้าง Item ใหม่ (Create)
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // ตรวจสอบว่าส่งข้อมูลมาครบหรือไม่
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Please add all text fields' });
    }

    // สร้าง Item ใหม่และระบุว่าใครเป็นคนสร้าง
    const item = await Item.create({
      name,
      description,
      price,
      user: req.user.id, // ใส่ id ของผู้ใช้ที่ล็อกอิน
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    แก้ไข Item เดิม (Update)
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    // ค้นหา Item ตาม ID ที่ส่งมาใน URL
    const item = await Item.findById(req.params.id);

    // ถ้าไม่เจอ Item
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // ตรวจสอบว่าผู้ใช้ที่กำลังแก้ไข เป็นเจ้าของ Item นี้หรือไม่
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // อัปเดตข้อมูลด้วยข้อมูลใหม่ใน req.body และส่งข้อมูลที่อัปเดตแล้ว (new: true) กลับมา
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    ลบ Item (Delete)
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    // ค้นหา Item ตาม ID ที่ส่งมาใน URL
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // ตรวจสอบว่าผู้ใช้ที่กำลังลบ เป็นเจ้าของ Item นี้หรือไม่
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // สั่งลบ Item
    await item.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
};
