import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageLightbox from './ImageLightbox';

export default function ProductCard({ product }) {
  const [showLightbox, setShowLightbox] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleImageClick = (e) => {
    e.stopPropagation(); // منع انتقال الحدث للكارد
    setShowLightbox(true);
  };

  return (
    <>
      <div className="card" style={styles.card} onClick={handleCardClick}>
        <div 
          style={styles.imageContainer}
          onClick={handleImageClick}
        >
          <img 
            src={product.images[0]} 
            alt={product.title}
            style={styles.image}
          />
          {product.images.length > 1 && (
            <div style={styles.imageCount}>
              📷 {product.images.length}
            </div>
          )}
        </div>
      
      <div style={styles.content}>
        <h3 style={styles.title}>{product.title}</h3>
        <p style={styles.description}>{product.description}</p>
        
        <div style={styles.details}>
          <div style={styles.priceContainer}>
            {product.active_offer ? (
              <>
                <div style={styles.offerBadge}>
                  🎉 خصم {product.active_offer.discount_percentage}%
                </div>
                <div style={styles.priceWithDiscount}>
                  <span style={styles.oldPrice}>{product.original_final_price} جنيه</span>
                  <span style={styles.newPrice}>{product.final_price} جنيه</span>
                </div>
              </>
            ) : (
              <span style={styles.price}>{product.final_price} جنيه</span>
            )}
          </div>
          <span style={styles.condition}>{product.condition}</span>
        </div>

        <div style={styles.seller}>
          <span>البائع: {product.profiles?.username}</span>
          <span>📍 {product.profiles?.location}</span>
        </div>
      </div>
    </div>

    {showLightbox && (
      <ImageLightbox 
        images={product.images}
        onClose={() => setShowLightbox(false)}
      />
    )}
  </>
  );
}

const styles = {
  card: {
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    background: '#f3f4f6',
    position: 'relative',
    cursor: 'pointer'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s'
  },
  imageCount: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  content: {
    padding: '16px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1f2937'
  },
  description: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '12px',
    lineHeight: '1.5'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px'
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  offerBadge: {
    background: '#dc2626',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    alignSelf: 'flex-start'
  },
  priceWithDiscount: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  oldPrice: {
    fontSize: '16px',
    color: '#9ca3af',
    textDecoration: 'line-through'
  },
  newPrice: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#dc2626'
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#10b981'
  },
  condition: {
    background: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px'
  },
  seller: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#6b7280',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb'
  }
};
