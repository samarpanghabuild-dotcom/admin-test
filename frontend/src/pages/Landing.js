import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Clock, Wallet, History, LogOut, Shield } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const gameModes = [
    { duration: '30s', time: 30, color: '#00FF94' },
    { duration: '1min', time: 60, color: '#00E0FF' },
    { duration: '3min', time: 180, color: '#FF0055' },
    { duration: '5min', time: 300, color: '#FFD600' }
  ];

  return (
    <div className="min-h-screen noise-bg" style={{ background: '#050505' }}>
      {/* Header */}
      <nav className="glass-panel border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Unbounded' }}>
            <span className="neon-green">WINGO</span>X
          </h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <button
                    data-testid="admin-panel-btn"
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
                    style={{ background: '#FFD600', color: '#000' }}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}
                <button
                  data-testid="wallet-btn"
                  onClick={() => navigate('/wallet')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass-panel hover:border-[#00FF94]/50 transition-colors"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline mono">₹{user.balance?.toFixed(2) || '0.00'}</span>
                </button>
                <button
                  data-testid="history-btn"
                  onClick={() => navigate('/history')}
                  className="p-2 rounded-lg glass-panel hover:border-[#00FF94]/50 transition-colors"
                >
                  <History className="w-5 h-5" />
                </button>
                <button
                  data-testid="logout-btn"
                  onClick={logout}
                  className="p-2 rounded-lg glass-panel hover:border-[#FF0055]/50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                data-testid="login-btn"
                onClick={() => navigate('/auth')}
                className="px-6 py-2 font-bold uppercase tracking-wider transition-all skew-btn"
                style={{ background: '#00FF94', color: '#000', boxShadow: '0 0 20px rgba(0, 255, 148, 0.3)' }}
              >
                <span style={{ display: 'inline-block', transform: 'skewX(10deg)' }}>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1701377000907-64f247c931f0?crop=entropy&cs=srgb&fm=jpg&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
          <h2 
            className="text-5xl md:text-7xl font-black mb-6" 
            style={{ fontFamily: 'Unbounded' }}
          >
            WIN BIG WITH <span className="neon-green">WINGO</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12" style={{ color: '#A1A1AA' }}>
            Fast-paced color prediction game. Choose your time, place your bet, and win!
          </p>
          {!user && (
            <button
              data-testid="get-started-btn"
              onClick={() => navigate('/auth')}
              className="px-8 py-4 text-lg font-bold uppercase tracking-wider transition-all skew-btn"
              style={{ background: '#00FF94', color: '#000', boxShadow: '0 0 20px rgba(0, 255, 148, 0.3)' }}
            >
              <span style={{ display: 'inline-block', transform: 'skewX(10deg)' }}>Get Started</span>
            </button>
          )}
        </div>
      </div>

      {/* Game Modes */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Unbounded' }}>
          Choose Your <span className="neon-green">Game Mode</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {gameModes.map((mode) => (
            <button
              key={mode.duration}
              data-testid={`game-mode-${mode.duration}`}
              onClick={() => {
                if (!user) {
                  navigate('/auth');
                } else {
                  navigate(`/game/${mode.duration}`);
                }
              }}
              className="group relative overflow-hidden glass-panel hover:border-white/20 transition-all aspect-square flex flex-col items-center justify-center gap-4 p-6"
              style={{ borderColor: `${mode.color}20` }}
            >
              <Clock className="w-12 h-12 md:w-16 md:h-16" style={{ color: mode.color }} />
              <div className="text-center">
                <div 
                  className="text-3xl md:text-4xl font-bold mono mb-2"
                  style={{ color: mode.color }}
                >
                  {mode.duration}
                </div>
                <div className="text-sm" style={{ color: '#A1A1AA' }}>FAST GAME</div>
              </div>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ 
                  background: `linear-gradient(135deg, ${mode.color}10 0%, transparent 100%)` 
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* How to Play */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Unbounded' }}>
          How to <span className="neon-green">Play</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 text-center">
            <div 
              className="text-4xl font-bold mb-4 neon-green"
              style={{ fontFamily: 'Unbounded' }}
            >
              01
            </div>
            <h4 className="text-xl font-bold mb-2">Choose Mode</h4>
            <p style={{ color: '#A1A1AA' }}>Select your preferred game duration: 30s, 1min, 3min, or 5min</p>
          </div>
          <div className="glass-panel p-6 text-center">
            <div 
              className="text-4xl font-bold mb-4 neon-green"
              style={{ fontFamily: 'Unbounded' }}
            >
              02
            </div>
            <h4 className="text-xl font-bold mb-2">Place Bet</h4>
            <p style={{ color: '#A1A1AA' }}>Bet on Green, Violet, Red, or a specific number (0-9)</p>
          </div>
          <div className="glass-panel p-6 text-center">
            <div 
              className="text-4xl font-bold mb-4 neon-green"
              style={{ fontFamily: 'Unbounded' }}
            >
              03
            </div>
            <h4 className="text-xl font-bold mb-2">Win Big</h4>
            <p style={{ color: '#A1A1AA' }}>Color: 2x-4.5x | Number: 9x your bet amount!</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center" style={{ color: '#A1A1AA' }}>
          <p>&copy; 2024 WingoX. Play responsibly. 18+ only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;