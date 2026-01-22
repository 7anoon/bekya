import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function ManageOffers() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    discount_percentage: '',
    category: '',
    target_location: '',
    end_date: ''
  });

  const getCategoryName = (category) => {
    const names = {
      electronics: 'إلكترونيات',
      furniture: 'أثاث',
      clothes: 'ملابس',
      books: 'كتب',
      toys: 'ألعاب',
      other: 'أخرى'
    };
    return names[category] || category;
  };

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadOffers();
  }, [profile, navigate]);

  const loadOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      console.error('Error loading offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      alert('يجب إدخال العنوان والوصف');
      return;
    }

    try {
      const { data: offer, error } = await supabase
        .from('offers')
        .insert({
          ...formData,
          discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : null,
          category: formData.category || null,
          target_location: formData.target_location || null,
          end_date: formData.end_date || null,
          created_by: profile.id
        })
        .select()
        .single();

      if (error) throw error;

      // إرسال إشعارات للمستخدمين
      await sendOfferNotifications(offer);

      alert('تم إضافة العرض بنجاح!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        image: '',
        discount_percentage: '',
        category: '',
        target_location: '',
        end_date: ''
      });
      loadOffers();
    } catch (err) {
      console.error('Error creating offer:', err);
      alert('حدث خطأ في إضافة العرض');
    }
  };

  const sendOfferNotifications = async (offer) => {
    try {
      let query = supabase.from('profiles').select('id');
      
      // إذا كان العرض لمنطقة معينة
      if (offer.target_location) {
        query = query.eq('location', offer.target_location);
      }

      const { data: users } = await query;

      if (users && users.length > 0) {
        const notifications = users.map(user => ({
          user_id: user.id,
          message: `عرض جديد: ${offer.title}`,
          type: 'offer'
        }));

        await supabase.from('notifications').insert(notifications);
      }
    } catch (err) {
      console.error('Error sending notifications:', err);
    }
  };

  const toggleOfferStatus = async (offerId, currentStatus) => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .update({ is_active: !currentStatus })
        .eq('id', offerId)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      alert(currentStatus ? 'تم إيقاف العرض بنجاح' : 'تم تفعيل العرض بنجاح');
      loadOffers();
    } catch (err) {
      console.error('Error toggling offer:', err);
      alert(`حدث خطأ في تحديث العرض: ${err.message}`);
    }
  };

  const deleteOffer = async (offerId) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;

    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) throw error;
      loadOffers();
    } catch (err) {
      console.error('Error deleting offer:', err);
      alert('حدث خطأ في حذف العرض');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={styles.header}>
        <h1 style={styles.title}>إدارة العروض</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'إلغاء' : '+ إضافة عرض جديد'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={styles.formCard}>
          <h2 style={styles.formTitle}>عرض جديد</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>عنوان العرض *</label>
              <input
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="مثال: خصم 50% على الأثاث"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>وصف العرض *</label>
              <textarea
                className="input"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="تفاصيل العرض..."
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>رابط الصورة (اختياري)</label>
              <input
                type="url"
                className="input"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>نسبة الخصم % (اختياري)</label>
                <input
                  type="number"
                  className="input"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                  placeholder="50"
                  min="0"
                  max="100"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>الفئة المستهدفة (اختياري)</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">كل الفئات</option>
                  <option value="electronics">إلكترونيات</option>
                  <option value="furniture">أثاث</option>
                  <option value="clothes">ملابس</option>
                  <option value="books">كتب</option>
                  <option value="toys">ألعاب</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>المنطقة المستهدفة (اختياري)</label>
              <input
                type="text"
                className="input"
                value={formData.target_location}
                onChange={(e) => setFormData({...formData, target_location: e.target.value})}
                placeholder="اتركه فارغاً لكل المناطق"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>تاريخ انتهاء العرض (اختياري)</label>
              <input
                type="datetime-local"
                className="input"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
              نشر العرض
            </button>
          </form>
        </div>
      )}

      <div style={styles.offersList}>
        {offers.length === 0 ? (
          <div className="card" style={styles.empty}>
            <p>لا توجد عروض حالياً</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="card" style={styles.offerCard}>
              {offer.image && (
                <img src={offer.image} alt={offer.title} style={styles.offerImage} />
              )}
              
              <div style={styles.offerContent}>
                <div style={styles.offerHeader}>
                  <h3 style={styles.offerTitle}>{offer.title}</h3>
                  <span style={{
                    ...styles.statusBadge,
                    background: offer.is_active ? '#10b981' : '#ef4444'
                  }}>
                    {offer.is_active ? 'نشط' : 'متوقف'}
                  </span>
                </div>

                <p style={styles.offerDesc}>{offer.description}</p>

                <div style={styles.offerDetails}>
                  {offer.discount_percentage && (
                    <span style={styles.discountBadge}>
                      خصم {offer.discount_percentage}%
                    </span>
                  )}
                  {offer.category && (
                    <span style={styles.categoryBadge}>
                      📦 {getCategoryName(offer.category)}
                    </span>
                  )}
                  {offer.target_location && (
                    <span style={styles.locationBadge}>
                      📍 {offer.target_location}
                    </span>
                  )}
                  {offer.end_date && (
                    <span style={styles.dateBadge}>
                      ⏰ ينتهي: {new Date(offer.end_date).toLocaleDateString('ar-EG')}
                    </span>
                  )}
                </div>

                <div style={styles.offerActions}>
                  <button
                    className="btn"
                    style={{
                      background: offer.is_active ? '#f59e0b' : '#10b981',
                      color: 'white'
                    }}
                    onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                  >
                    {offer.is_active ? 'إيقاف' : 'تفعيل'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteOffer(offer.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '32px',
    color: '#10b981',
    margin: 0
  },
  formCard: {
    marginBottom: '30px'
  },
  formTitle: {
    fontSize: '24px',
    color: '#374151',
    marginBottom: '20px'
  },
  field: {
    marginBottom: '20px',
    flex: 1
  },
  row: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151'
  },
  submitBtn: {
    width: '100%',
    padding: '12px'
  },
  offersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280'
  },
  offerCard: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  offerImage: {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  offerContent: {
    flex: 1,
    minWidth: '300px'
  },
  offerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    gap: '12px'
  },
  offerTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600'
  },
  offerDesc: {
    color: '#6b7280',
    marginBottom: '16px',
    lineHeight: '1.6'
  },
  offerDetails: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '16px'
  },
  discountBadge: {
    background: '#fef3c7',
    color: '#92400e',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600'
  },
  categoryBadge: {
    background: '#dbeafe',
    color: '#1e40af',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px'
  },
  locationBadge: {
    background: '#dbeafe',
    color: '#1e40af',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px'
  },
  dateBadge: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px'
  },
  offerActions: {
    display: 'flex',
    gap: '12px'
  }
};
