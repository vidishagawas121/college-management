import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCollege } from '../../context/CollegeContext';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';
import Button from '../../components/common/Button';
import { ShieldCheck, Lock, Mail, GraduationCap, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const { collegeInfo, settings } = useCollege();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect to /admin/dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      error('Please enter both username/email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login({ usernameOrEmail, password });
      if (res.success) {
        success(`Welcome back, ${res.admin.fullName || 'Administrator'}!`);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Invalid administrator credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const collegeName = collegeInfo?.collegeName || settings?.collegeName || 'Apex Institute of Technology & Sciences';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO title="Administrator Authentication Portal" />

      {/* Decorative background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-800/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3 px-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl font-bold">
          <GraduationCap className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
          Admin CMS Portal
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto">
          {collegeName} — Single Administrative Control Center
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
          <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-200">
            <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              Restricted area. Only authorized administrative officers are permitted to log in.
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="admin@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={submitting}
                className="w-full py-3"
              >
                <span>Authenticate & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-700/60 text-center">
            <a
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
            >
              &larr; Return to Public College Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
