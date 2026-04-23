import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileEdit, ArrowLeft } from 'lucide-react';

// หน้านี้สามารถทำงานได้ 2 แบบ คือเอาไว้สร้างข้อมูลใหม่ หรือเอาไว้แก้ข้อมูลเดิม 
// โดยดูว่ามี :id แนบมาใน URL ไหม ถ้ามีคือโหมดแก้ไข (Edit) ถ้าไม่มีคือโหมดสร้าง (Create)
const ItemForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams(); // ดึง id จาก URL เช่น /edit-item/12345 (ถ้ามี)
  const navigate = useNavigate();
  const { user } = useAuth();

  // เช็คว่าถ้าเป็นโหมดแก้ไข (มี id) ให้ไปดึงข้อมูลเก่ามาแสดงในฟอร์มก่อน
  useEffect(() => {
    if (id) {
      // ถ้ารู้สึกว่าระบบกำลังแก้ข้อมูล ให้ดึงข้อมูลมาแสดงที่หน้าจอ
      const fetchItem = async () => {
        try {
          // เนื่องจากไม่มี API สำหรับดึงข้อมูลชิ้นเดียว (ตามที่เขียนไว้ใน backend)
          // เลยต้องดึงข้อมูลทั้งหมด แล้วค่อยกรองเอาเฉพาะอันที่ตรงกับ id
          const config = {
            headers: { Authorization: `Bearer ${user.token}` },
          };
          const res = await axios.get('http://localhost:5000/api/items', config);
          const currentItem = res.data.find(item => item._id === id);
          
          if (currentItem) {
            // เอาข้อมูลเก่ามาใส่ในฟอร์ม
            setFormData({
              name: currentItem.name,
              description: currentItem.description,
              price: currentItem.price,
            });
          }
        } catch (error) {
          setError('Could not fetch item data');
        }
      };
      fetchItem();
    }
  }, [id, user.token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // แนบ Token ไปด้วยเสมอ
        },
      };

      if (id) {
        // ถ้าเป็นโหมดแก้ไข ให้ยิง API แบบ PUT (Update)
        await axios.put(`http://localhost:5000/api/items/${id}`, formData, config);
      } else {
        // ถ้าเป็นโหมดสร้าง ให้ยิง API แบบ POST (Create)
        await axios.post('http://localhost:5000/api/items', formData, config);
      }
      
      // เสร็จแล้วเด้งกลับไปหน้าแรก
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '20px' }}>
        {/* ปุ่มกดย้อนกลับไปหน้าแรก */}
        <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px' }}>
          <ArrowLeft size={16} /> Back
        </Link>
      </div>
      
      <div className="form-container" style={{ margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <FileEdit color="var(--primary-color)" /> {id ? 'Edit Item' : 'Create New Item'}
        </h2>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger-color)', padding: '10px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Item Name</label>
            <input
              type="text"
              className="form-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Mechanical Keyboard"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              className="form-input"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="e.g. 150"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter product description here..."
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading} style={{ marginTop: '10px' }}>
            {isLoading ? 'Saving...' : (id ? 'Update Item' : 'Create Item')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
