import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  ArrowLeft, Shield, Users, TrendingUp, TrendingDown, 
  Search, Plus, Minus, Lock, Unlock, CheckCircle, XCircle,
  Upload, Settings, BarChart3, Eye
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Payment settings
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [upiId, setUpiId] = useState('');
  
  // Modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectType, setRejectType] = useState('');
  const [rejectId, setRejectId] = useState('');
  
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerAction, setPlayerAction] = useState('');
  const [playerAmount, setPlayerAmount] = useState('');
  const [playerReason, setPlayerReason] = useState('');
  
  const [showDepositDetail, setShowDepositDetail] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'dashboard') {
        const statsRes = await axios.get(`${API}/admin/dashboard-stats`);
        setDashboardStats(statsRes.data);
      } else if (activeTab === 'deposits') {
        const depositsRes = await axios.get(`${API}/admin/deposits`);
        setDeposits(depositsRes.data);
      } else if (activeTab === 'withdrawals') {
        const withdrawalsRes = await axios.get(`${API}/admin/withdrawals`);
        setWithdrawals(withdrawalsRes.data);
      } else if (activeTab === 'users') {
        const usersRes = await axios.get(`${API}/admin/users`);
        setUsers(usersRes.data);
      } else if (activeTab === 'settings') {
        const settingsRes = await axios.get(`${API}/admin/payment-settings`);
        setQrCodeUrl(settingsRes.data.qr_code_url || '');
        setUpiId(settingsRes.data.upi_id || '');
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await axios.get(`${API}/admin/search-player?query=${searchQuery}`);
      setSearchResults(response.data);
      if (response.data.length === 0) {
        toast.info('No players found');
      }
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleDepositAction = async (depositId, action) => {
    if (action === 'reject') {
      setRejectType('deposit');
      setRejectId(depositId);
      setShowRejectModal(true);
      return;
    }

    try {
      await axios.put(`${API}/admin/deposit/${depositId}/${action}`);
      toast.success(`Deposit ${action}d successfully`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || `Failed to ${action} deposit`);
    }
  };

  const handleReject = async () => {
    try {
      if (rejectType === 'deposit') {
        await axios.put(`${API}/admin/deposit/${rejectId}/reject?reason=${encodeURIComponent(rejectReason)}`);
      } else {
        await axios.put(`${API}/admin/withdrawal/${rejectId}/reject?reason=${encodeURIComponent(rejectReason)}`);
      }
      toast.success(`${rejectType} rejected successfully`);
      setShowRejectModal(false);
      setRejectReason('');
      fetchData();
    } catch (error) {
      toast.error(`Failed to reject ${rejectType}`);
    }
  };

  const handleWithdrawalAction = async (withdrawalId, action) => {
    if (action === 'reject') {
      setRejectType('withdrawal');
      setRejectId(withdrawalId);
      setShowRejectModal(true);
      return;
    }

    try {
      await axios.put(`${API}/admin/withdrawal/${withdrawalId}/${action}`);
      toast.success(`Withdrawal ${action}d successfully`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || `Failed to ${action} withdrawal`);
    }
  };

  const handlePlayerAction = async () => {
    try {
      await axios.post(`${API}/admin/player-management`, {
        user_id: selectedPlayer.id,
        action: playerAction,
        amount: playerAmount ? Number(playerAmount) : null,
        reason: playerReason || null
      });
      toast.success('Player action completed');
      setShowPlayerModal(false);
      setPlayerAmount('');
      setPlayerReason('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Action failed');
    }
  };

  const handleUpdatePaymentSettings = async () => {
    try {
      await axios.put(`${API}/admin/payment-settings?qr_code_url=${encodeURIComponent(qrCodeUrl)}&upi_id=${encodeURIComponent(upiId)}`);
      toast.success('Payment settings updated!');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

  return (
    <div className="min-h-screen noise-bg" style={{ background: '#050505' }}>
      {/* Header */}
      <nav className="glass-panel border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            data-testid="back-to-home-btn"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-[#00FF94] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Unbounded' }}>
            <Shield className="w-5 h-5 inline mr-2" />
            Admin Panel
          </h1>
          <div />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
            { id: 'deposits', icon: TrendingUp, label: 'Deposits' },
            { id: 'withdrawals', icon: TrendingDown, label: 'Withdrawals' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'player-search', icon: Search, label: 'Search' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              data-testid={`${tab.id}-tab`}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 font-bold uppercase tracking-wider transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab.id ? '#00FF94' : 'rgba(0, 255, 148, 0.1)',
                color: activeTab === tab.id ? '#000' : '#00FF94',
                border: '1px solid rgba(0, 255, 148, 0.3)'
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-panel p-6">
                <div className="text-sm mb-2" style={{ color: '#A1A1AA' }}>Total Users</div>
                <div className="text-3xl font-bold mono neon-green">{dashboardStats.total_users || 0}</div>
              </div>
              <div className="glass-panel p-6">
                <div className="text-sm mb-2" style={{ color: '#A1A1AA' }}>Today Deposits</div>
                <div className="text-3xl font-bold mono" style={{ color: '#00E0FF' }}>
                  {dashboardStats.today_deposits || 0}
                </div>
              </div>
              <div className="glass-panel p-6">
                <div className="text-sm mb-2" style={{ color: '#A1A1AA' }}>Today Withdrawals</div>
                <div className="text-3xl font-bold mono" style={{ color: '#FF0055' }}>
                  {dashboardStats.today_withdrawals || 0}
                </div>
              </div>
              <div className="glass-panel p-6">
                <div className="text-sm mb-2" style={{ color: '#A1A1AA' }}>Total Balance</div>
                <div className="text-3xl font-bold mono" style={{ color: '#FFD600' }}>
                  ₹{dashboardStats.total_active_balance?.toFixed(0) || 0}
                </div>
              </div>
            </div>
          </div>
        )}