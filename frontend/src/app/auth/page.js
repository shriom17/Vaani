'use client';

import { useState } from 'react';
import styles from './auth.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match for signup
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    // TODO: Replace with actual API call
    setTimeout(() => {
      console.log(isLogin ? 'Login' : 'Signup', formData);
      alert(`${isLogin ? 'Login' : 'Signup'} successful!`);
      setIsLoading(false);
      // Redirect to main app
      // window.location.href = '/';
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🤖</div>
          <h1 className={styles.logoText}>Vaani</h1>
          <p className={styles.logoSubtext}>Your AI Assistant</p>
        </div>

        {/* Toggle Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your name"
                required={!isLogin}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder="Confirm your password"
                required={!isLogin}
                minLength={6}
              />
            </div>
          )}

          {isLogin && (
            <div className={styles.forgotPassword}>
              <a href="#" className={styles.link}>
                Forgot Password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loading}>Loading...</span>
            ) : (
              isLogin ? 'Login' : 'Sign Up'
            )}
          </button>
        </form>

        {/* Social Login */}
        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        <div className={styles.socialButtons}>
          <button className={styles.socialButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button className={styles.socialButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Toggle Text */}
        <div className={styles.toggleText}>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={toggleMode} className={styles.toggleLink}>
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={toggleMode} className={styles.toggleLink}>
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}