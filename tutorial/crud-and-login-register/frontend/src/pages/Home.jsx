import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit2, Trash2 } from 'lucide-react'; // ไอคอนแก้ไขและลบ

const Home = () => {
  const [items, setItems] = useState([]); // state เก็บรายการสินค้า
  const [loading, setLoading] = useState(true); // state สำหรับแสดง Loading
  const { user } = useAuth(); // ดึงข้อมูลผู้ใช้ปัจจุบัน รวมถึง Token

  // ทำงานครั้งแรกเมื่อหน้าเพจโหลดเสร็จ (เหมือน componentDidMount)
  useEffect(() => {
    fetchItems();
  }, []);

  // ฟังก์ชันดึงข้อมูล Items (Read)
  const fetchItems = async () => {
    try {
      // เรียก API ไปดึงข้อมูล และแนบ Header Authorization ไปด้วยเพื่อพิสูจน์ตัวตน
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get('http://localhost:5000/api/items', config);
      setItems(res.data); // เอาข้อมูลที่ได้ไปอัปเดตใส่ state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items', error);
      setLoading(false);
    }
  };

  // ฟังก์ชันลบ Item (Delete)
  const handleDelete = async (id) => {
    // ถามยืนยันก่อนลบ
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        // เรียก API แบบ DELETE พร้อมส่ง ID ของ Item ไปที่ URL
        await axios.delete(`http://localhost:5000/api/items/${id}`, config);
        // เมื่อลบที่ฐานข้อมูลสำเร็จ ก็ให้คัดลอกข้อมูล Item อันที่โดนลบออกไปจากหน้าจอ
        setItems(items.filter((item) => item._id !== id));
      } catch (error) {
        console.error('Error deleting item', error);
      }
    }
  };

  // ถ้าระบบกำลังดึงข้อมูล ให้แสดงหน้าโหลด
  if (loading) {
    return <div className="loading">Loading your items...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Items</h1>
      </div>

      {/* ถ้าไม่มีข้อมูลเลย ให้แสดงคำว่าว่างเปล่า */}
      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No items found</h3>
          <p>You haven't created any items yet. Let's create one!</p>
          <Link to="/create-item" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Create First Item
          </Link>
        </div>
      ) : (
        /* แต่ถ้ามีข้อมูล ก็เอามา Loop สร้งเป็น Card ทีละอัน */
        <div className="item-grid">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <div className="item-header">
                <h3 className="item-title">{item.name}</h3>
                <span className="item-price">${item.price}</span>
              </div>
              <p className="item-desc">{item.description}</p>
              
              <div className="item-actions">
                {/* ปุ่มไปหน้าแก้ไข */}
                <Link to={`/edit-item/${item._id}`} className="btn btn-outline" style={{ flex: 1 }}>
                  <Edit2 size={16} /> Edit
                </Link>
                {/* ปุ่มลบ */}
                <button onClick={() => handleDelete(item._id)} className="btn btn-danger" style={{ flex: 1 }}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
