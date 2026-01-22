import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';

export default function Profile() {
  const { profile } = useAuthStore();
  const { fetchUserProducts, acceptNegotiation, rejectNegotiation } = useProductStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategoryName = (category) => {
    const categories = {
      electronics: 'إلكترونيات',
      furniture: 'أثاث',
      clothes: 'ملابس',
      books: 'كتب',
      toys: 'ألعاب',
      appliances: 'أجهزة منزلية',
      sports: 'رياضة',
      jewelry: 'مجوهرات وإكسسوارات',
      other: 'أخرى'
    };
    return categories[category] || category;
  };

  useEffect(() => {
    loadUserProducts();
  }, []);

  const loadUserProducts = async () => {
    try {
      const data = await fetchUserProducts(profile.id);
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptNegotiation = async (productId) => {
    if (confirm('هل تريد قبول عرض السعر الجديد؟')) {
      try {
        await acceptNegotiation(productId);
        alert('تم قبول العرض! سيتم عرض منتجك للبيع');
        loadUserProducts();
      } catch (err) {
        alert('خطأ في قبول العرض');
      }
    }
  };

  const handleRejectNegotiation = async (productId) => {
    if (confirm('هل تريد رفض عرض السعر؟ سيتم إرسال طلبك للإدارة للتفاوض مرة أخرى')) {
      try {
        await rejectNegotiation(productId);
        alert('سيتم مراجعة طلبك من قبل الإدارة');
        // إعادة تحميل المنتجات للرجوع للصفحة
        loadUserProducts();
      } catch (err) {
        alert('خطأ في رفض العرض');
      }
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'قيد المراجعة',
      approved: 'تم الموافقة',
      rejected: 'مرفوض',
      awaiting_seller: 'في انتظار موافقتك'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
      awaiting_seller: '#3b82f6'
    };
    return colorMap[status] || '#6b7280';
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
      <div className="card" style={styles.profileCard}>
        <h1 style={styles.title}>الملف الشخصي</h1>
        
        <div style={styles.info}>
          <div style={styles.infoRow}>
            <span style={styles.label}>اسم المستخدم:</span>
            <span style={styles.value}>{profile.username}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>البريد الإلكتروني:</span>
            <span style={styles.value}>{profile.email}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>الموقع:</span>
            <span style={styles.value}>{profile.location}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>رقم الهاتف:</span>
            <span style={styles.value}>{profile.phone}</span>
          </div>
        </div>
      </div>

      <div style={styles.productsSection}>
        <h2 style={styles.subtitle}>منتجاتي ({products.length})</h2>
        
        {products.length === 0 ? (
          <div style={styles.empty}>
            <p>لم تقم بإضافة أي منتجات بعد</p>
          </div>
        ) : (
          <div style={styles.productsList}>
            {products.map((product) => (
              <div key={product.id} className="card" style={styles.productCard}>
                <div style={styles.productLayout}>
                  {/* صور المنتج */}
                  {product.images && product.images.length > 0 && (
                    <div style={styles.productImages}>
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        style={styles.productImage}
                      />
                      {product.images.length > 1 && (
                        <div style={styles.imageCount}>
                          +{product.images.length - 1}
                        </div>
                      )}
                    </div>
                  )}

                  {/* معلومات المنتج */}
                  <div style={styles.productInfo}>
                    <div style={styles.productHeader}>
                      <h3 style={styles.productTitle}>{product.title}</h3>
                      <span 
                        style={{
                          ...styles.status,
                          background: getStatusColor(product.status) + '20',
                          color: getStatusColor(product.status)
                        }}
                      >
                        {getStatusText(product.status)}
                      </span>
                    </div>
                    
                    <p style={styles.productDesc}>{product.description}</p>
                    
                    <div style={styles.productDetails}>
                      {product.category && <span>الفئة: {getCategoryName(product.category)}</span>}
                      {product.weight && <span>الوزن: {product.weight} كجم</span>}
                      {product.condition && <span>الحالة: {product.condition}</span>}
                      <span>
                        {product.choice_type === 'recycle' ? 'إعادة تدوير' : product.suggested_price ? `${product.suggested_price} جنيه` : 'في انتظار التسعير'}
                      </span>
                    </div>

                    {product.choice_type === 'recycle' && product.recycle_idea && (
                      <div style={styles.recycleInfo}>
                        <strong>💡 فكرة إعادة التدوير:</strong>
                        <p>{product.recycle_idea}</p>
                      </div>
                    )}

                    {/* عرض التفاوض */}
                    {product.status === 'awaiting_seller' && product.negotiated_price && (
                      <div style={styles.negotiationOffer}>
                        <h4 style={styles.negotiationTitle}>🤝 عرض سعر جديد من الإدارة</h4>
                        <div style={styles.priceComparison}>
                          <div>
                            <span style={styles.priceLabel}>السعر المقترح منك:</span>
                            <span style={styles.oldPrice}>{product.suggested_price} جنيه</span>
                          </div>
                          <div>
                            <span style={styles.priceLabel}>العرض الجديد:</span>
                            <span style={styles.newPrice}>{product.negotiated_price} جنيه</span>
                          </div>
                        </div>
                        {product.negotiation_note && (
                          <p style={styles.negotiationNote}>
                            <strong>ملاحظة:</strong> {product.negotiation_note}
                          </p>
                        )}
                        <div style={styles.negotiationActions}>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAcceptNegotiation(product.id)}
                          >
                            قبول العرض
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRejectNegotiation(product.id)}
                          >
                            رفض العرض
                          </button>
                        </div>
                      </div>
                    )}

                    {product.rejection_reason && (
                      <div style={styles.rejection}>
                        <strong>سبب الرفض:</strong> {product.rejection_reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  profileCard: {
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    color: '#10b981',
    marginBottom: '24px'
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '8px'
  },
  label: {
    fontWeight: '600',
    color: '#374151'
  },
  value: {
    color: '#6b7280'
  },
  productsSection: {
    marginTop: '30px'
  },
  subtitle: {
    fontSize: '24px',
    color: '#374151',
    marginBottom: '20px'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  productCard: {
    transition: 'transform 0.2s'
  },
  productLayout: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  productImages: {
    position: 'relative',
    flex: '0 0 150px',
    height: '150px'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  imageCount: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  productInfo: {
    flex: '1',
    minWidth: '250px'
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  productTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937'
  },
  status: {
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  productDesc: {
    color: '#6b7280',
    marginBottom: '12px'
  },
  productDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
    fontSize: '14px',
    color: '#374151',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb'
  },
  rejection: {
    marginTop: '12px',
    padding: '12px',
    background: '#fee2e2',
    color: '#dc2626',
    borderRadius: '6px',
    fontSize: '14px'
  },
  recycleInfo: {
    marginTop: '12px',
    padding: '12px',
    background: '#f0fdf4',
    color: '#166534',
    borderRadius: '6px',
    fontSize: '14px',
    border: '1px solid #bbf7d0'
  },
  negotiationOffer: {
    marginTop: '12px',
    padding: '16px',
    background: '#eff6ff',
    borderRadius: '8px',
    border: '2px solid #3b82f6'
  },
  negotiationTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: '12px'
  },
  priceComparison: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '12px',
    gap: '16px',
    flexWrap: 'wrap'
  },
  priceLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px'
  },
  oldPrice: {
    display: 'block',
    fontSize: '18px',
    fontWeight: '600',
    color: '#6b7280',
    textDecoration: 'line-through'
  },
  newPrice: {
    display: 'block',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#10b981'
  },
  negotiationNote: {
    background: 'white',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '12px',
    color: '#374151'
  },
  negotiationActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  }
};
