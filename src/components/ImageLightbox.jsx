import { useState } from 'react';

export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') handlePrev();
    if (e.key === 'ArrowLeft') handleNext();
  };

  return (
    <div 
      style={styles.overlay} 
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <button style={styles.closeBtn} onClick={onClose}>
        ✕
      </button>

      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <img 
          src={images[currentIndex]} 
          alt={`صورة ${currentIndex + 1}`}
          style={styles.image}
        />

        {images.length > 1 && (
          <>
            <button 
              style={{...styles.navBtn, ...styles.prevBtn}} 
              onClick={handlePrev}
            >
              ❮
            </button>
            <button 
              style={{...styles.navBtn, ...styles.nextBtn}} 
              onClick={handleNext}
            >
              ❯
            </button>

            <div style={styles.counter}>
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    cursor: 'pointer',
    animation: 'fadeIn 0.3s ease'
  },
  content: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    cursor: 'default',
    animation: 'zoomIn 0.3s ease'
  },
  image: {
    maxWidth: '90vw',
    maxHeight: '90vh',
    objectFit: 'contain',
    borderRadius: '8px'
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    transition: 'background 0.3s'
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s'
  },
  prevBtn: {
    right: '-60px'
  },
  nextBtn: {
    left: '-60px'
  },
  counter: {
    position: 'absolute',
    bottom: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  }
};
