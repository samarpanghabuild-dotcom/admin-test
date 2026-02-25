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

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [upiId, setUpiId] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectType, setRejectType] = useState('');
  const [rejectId, setRejectId] = useState('');

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerAction, setPlayerAction] = useState('');
  const [playerAmount, setPlayerAmount] = useState('');
  const [playerReason, setPlayerReason] = useState('');

  const [showDepositDetail, setShowDepositDetail] = useState(null);

  // ✅ Keep fetchData as standalone function
  const fetchData = async () => {
    try {
      if (user?.role !== 'admin') {
        navigate('/');
        return;
      }

      if (activeTab === 'dashboard') {
        const statsRes = await axios.get(`${API}/admin/dashboard-stats`);
        setDashboardStats(statsRes.data);
      } 
      else if (activeTab === 'deposits') {
        const depositsRes = await axios.get(`${API}/admin/deposits`);
        setDeposits(depositsRes.data);
      } 
      else if (activeTab === 'withdrawals') {
        const withdrawalsRes = await axios.get(`${API}/admin/withdrawals`);
        setWithdrawals(withdrawalsRes.data);
      } 
      else if (activeTab === 'users') {
        const usersRes = await axios.get(`${API}/admin/users`);
        setUsers(usersRes.data);
      } 
      else if (activeTab === 'settings') {
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

  // ✅ Clean useEffect
  useEffect(() => {
    fetchData();
  }, [user, activeTab]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `${API}/admin/search-player?query=${searchQuery}`
      );

      setSearchResults(response.data);

      if (response.data.length === 0) {
        toast.info('No players found');
      }

    } catch (error) {
      toast.error('Search failed');
    }
  };
return (
  <div>Admin Panel</div>
);
};

export default Admin;
