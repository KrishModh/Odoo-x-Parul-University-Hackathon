import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiMail } from 'react-icons/fi';
import AuthLayout from '../layouts/AuthLayout.jsx';
import FormInput from '../components/FormInput.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../hooks/useForm.js';
import '../styles/pages/Login.css';

const initialValues = {
  email: '',
  password: '',
  remember: true
};

function validateLogin(values) {
  const errors = {};
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (!values.password) errors.password = 'Password is required.';
  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const form = useForm(initialValues, validateLogin);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    if (!form.validateAll()) return;

    try {
      setLoading(true);
      await login({ email: form.values.email, password: form.values.password });
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="login">
      <div className="auth-heading">
        <span>Welcome back</span>
        <h2>Log in to Traveloop</h2>
        <p>Resume your trips, shared plans, budgets, and journals.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={form.values.email}
          error={form.errors.email}
          touched={form.touched.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          autoComplete="email"
          placeholder="you@traveloop.ai"
          icon={<FiMail />}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.values.password}
          error={form.errors.password}
          touched={form.touched.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          autoComplete="current-password"
          placeholder="Enter your password"
          icon={<FiLock />}
        />

        <div className="form-row">
          <label className="check-row">
            <input name="remember" type="checkbox" checked={form.values.remember} onChange={form.handleChange} />
            <span>Remember me</span>
          </label>
          <a href="mailto:support@traveloop.ai">Forgot password?</a>
        </div>

        {serverError && <div className="form-alert">{serverError}</div>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Login'}
        </button>

      </form>

      <p className="switch-copy">
        New to Traveloop? <Link to="/signup">Create your account</Link>
      </p>
    </AuthLayout>
  );
}
