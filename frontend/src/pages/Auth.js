import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Login successful!');
      } else {
        await register(email, password, name);
        toast.success('Account created successfully!');
      }
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen noise-bg flex items-center justify-center p-4" style={{ background: '#050505' }}>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          data-testid="back-btn"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-8 hover:text-[#00FF94] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        {/* Auth Card */}
        <div className="glass-panel p-8">
          <h2 className="text-3xl font-bold mb-2 text-center" style={{ fontFamily: 'Unbounded' }}>
            <span className="neon-green">WINGO</span>X
          </h2>
          <p className="text-center mb-8" style={{ color: '#A1A1AA' }}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#A1A1AA' }}>
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#A1A1AA' }} />
                  <input
                    data-testid="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-colors mono"
                    style={{ 
                      background: '#0A0A0B', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#FFFFFF'
                    }}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#A1A1AA' }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#A1A1AA' }} />
                <input
                  data-testid="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-colors mono"
                  style={{ 
                    background: '#0A0A0B', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#FFFFFF'
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#A1A1AA' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#A1A1AA' }} />
                <input
                  data-testid="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-colors mono"
                  style={{ 
                    background: '#0A0A0B', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#FFFFFF'
                  }}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              data-testid="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold uppercase tracking-wider transition-all skew-btn"
              style={{ 
                background: '#00FF94', 
                color: '#000', 
                boxShadow: '0 0 20px rgba(0, 255, 148, 0.3)',
                opacity: loading ? 0.7 : 1
              }}
            >
              <span style={{ display: 'inline-block', transform: 'skewX(10deg)' }}>
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              data-testid="toggle-auth-mode"
              onClick={() => setIsLogin(!isLogin)}
              className="hover:text-[#00FF94] transition-colors"
              style={{ color: '#A1A1AA' }}
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;