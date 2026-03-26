import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './AuthPages.css';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [resendTimer, setResendTimer] = useState(0);
    const timerRef = useRef(null);

    const startResendTimer = useCallback(() => {
        setResendTimer(60);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) { clearInterval(timerRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await authAPI.forgotPassword(email);
            setMessage(res.data.message);
            startResendTimer();
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP');
        } finally { setLoading(false); }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (!otp.trim() || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }
        setLoading(true);
        try {
            const res = await authAPI.verifyOtp(email, otp);
            setMessage(res.data.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || 'OTP verification failed');
        } finally { setLoading(false); }
    };

    const handleResendOtp = async () => {
        setError(''); setMessage(''); setLoading(true);
        try {
            const res = await authAPI.forgotPassword(email);
            setMessage('New OTP sent! ' + res.data.message);
            setOtp('');
            startResendTimer();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend OTP');
        } finally { setLoading(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const res = await authAPI.resetPassword({ email, newPassword });
            setMessage(res.data.message);
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.error || 'Password reset failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page page">
            <div className="auth-container animate-in">
                <div className="auth-header">
                    <span className="auth-icon">🔐</span>
                    <h1>{step === 4 ? 'Password Reset!' : 'Forgot Password'}</h1>
                    <p>
                        {step === 1 && 'Enter your registered email to receive a reset OTP'}
                        {step === 2 && 'Enter the 6-digit OTP sent to your email'}
                        {step === 3 && 'Choose a new secure password'}
                        {step === 4 && 'Your password has been reset successfully'}
                    </p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {message && step !== 4 && <div className="alert alert-success">{message}</div>}

                {step === 1 && (
                    <form onSubmit={handleRequestOtp}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input className="form-input" type="email" value={email}
                                onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                        </div>
                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Sending OTP...' : '📧 Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-group">
                            <label>6-Digit OTP</label>
                            <input className="form-input otp-input" type="text" value={otp} maxLength={6}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="000000"
                                autoComplete="one-time-code" required />
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Verifying...' : '✅ Verify OTP'}
                        </button>

                        <div className="resend-otp">
                            {resendTimer > 0 ? (
                                <span className="resend-countdown">
                                    Resend OTP in <strong>{resendTimer}s</strong>
                                </span>
                            ) : (
                                <button type="button" className="btn-link resend-btn" onClick={handleResendOtp} disabled={loading}>
                                    🔄 Resend OTP
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* ── Step 3: New Password ── */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input className="form-input" type="password" value={newPassword}
                                onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" required />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input className="form-input" type="password" value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required />
                        </div>
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="password-mismatch">⚠️ Passwords do not match</p>
                        )}
                        <button type="submit" className="btn btn-primary auth-submit"
                            disabled={loading || (newPassword && confirmPassword && newPassword !== confirmPassword)}>
                            {loading ? 'Resetting...' : '🔑 Reset Password'}
                        </button>
                    </form>
                )}

                {/* ── Step 4: Success ── */}
                {step === 4 && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', margin: '16px 0' }}>✅</div>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '20px' }}>{message}</p>
                        <Link to="/login" className="btn btn-primary auth-submit" style={{ display: 'inline-block' }}>
                            ← Back to Login
                        </Link>
                    </div>
                )}

                {/* Step progress indicator */}
                {step < 4 && (
                    <div className="otp-steps">
                        <div className={`otp-step ${step >= 1 ? 'active' : ''}`}>1. Email</div>
                        <div className={`otp-step ${step >= 2 ? 'active' : ''}`}>2. OTP</div>
                        <div className={`otp-step ${step >= 3 ? 'active' : ''}`}>3. Reset</div>
                    </div>
                )}

                <p className="auth-footer">
                    Remember your password? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
