import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with username:', username);
      await signIn(username, password);
      console.log('Login successful');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="login-container">
      <div style={styles.leftSide} className="login-left-side">
        <div style={styles.brandContainer}>
          <h1 style={styles.brandTitle}>بيكيا بتناديك! 🛒</h1>
          <p style={styles.brandSubtitle}>بيع واشتري بكل سهولة</p>
          <p style={styles.brandDescription}>
            منصتك المفضلة لبيع وشراء المنتجات<br/>
            مع تحليل ذكي وأسعار عادلة
          </p>
        </div>
      </div>
      
      <div className="card login-card" style={styles.card}>
        {/* Mobile Brand Header */}
        <div className="mobile-brand-header">
          <h1 style={styles.mobileBrandTitle}>بيكيا بتناديك! 🛒</h1>
        </div>
        
        <h1 style={styles.title} className="login-title">تسجيل الدخول</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>اسم المستخدم</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>كلمة المرور</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'جاري التسجيل...' : 'دخول'}
          </button>
        </form>

        <p style={styles.footer}>
          ليس لديك حساب؟ <Link to="/signup" style={styles.link}>سجل الآن</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    padding: '0'
  },
  leftSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px'
  },
  brandContainer: {
    maxWidth: '600px'
  },
  brandTitle: {
    fontSize: '72px !important',
    fontWeight: '900 !important',
    color: '#000000 !important',
    marginBottom: '20px',
    textShadow: 'none !important',
    fontFamily: "'Cairo', 'Segoe UI', sans-serif",
    lineHeight: '1.2',
    WebkitTextFillColor: '#000000'
  },
  brandSubtitle: {
    fontSize: '32px',
    color: '#1a1a1a',
    marginBottom: '16px',
    fontWeight: '700'
  },
  brandDescription: {
    fontSize: '22px',
    color: '#2d2d2d',
    lineHeight: '1.8',
    fontWeight: '500'
  },
  card: {
    maxWidth: '500px',
    width: '100%',
    minHeight: '100vh',
    padding: '60px 50px',
    borderRadius: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    fontSize: '28px',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#10b981'
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: '600',
    color: '#374151'
  },
  submitBtn: {
    width: '100%',
    marginTop: '8px'
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#6b7280'
  },
  link: {
    color: '#10b981',
    fontWeight: '600',
    textDecoration: 'none'
  },
  mobileBrandTitle: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: '24px',
    display: 'none'
  }
};

// Add responsive CSS
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .mobile-brand-header {
      display: none;
    }
    
    @media (max-width: 768px) {
      .login-container {
        flex-direction: column !important;
        padding: 0 !important;
      }
      
      .login-left-side {
        display: none !important;
      }
      
      .mobile-brand-header {
        display: block !important;
        background: linear-gradient(135deg, #1e4d3d 0%, #2d6a4f 50%, #40916c 100%);
        padding: 40px 20px;
        margin: -30px -20px 30px -20px;
        border-radius: 16px 16px 0 0;
      }
      
      .mobile-brand-header h1 {
        display: block !important;
        color: #ffffff !important;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      }
      
      .login-card {
        max-width: 100% !important;
        min-height: auto !important;
        padding: 30px 20px !important;
        border-radius: 16px !important;
        margin: 20px;
      }
      
      .login-title {
        font-size: 24px !important;
      }
    }
    
    @media (max-width: 480px) {
      .mobile-brand-header {
        padding: 30px 16px;
        margin: -20px -16px 20px -16px;
      }
      
      .mobile-brand-header h1 {
        font-size: 28px !important;
      }
      
      .login-card {
        padding: 20px 16px !important;
        margin: 16px;
      }
      
      .login-title {
        font-size: 22px !important;
      }
    }
  `;
  document.head.appendChild(style);
}
