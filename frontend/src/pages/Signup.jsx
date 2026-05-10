import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAtSign, FiCheckCircle, FiImage, FiLock, FiMail, FiPhone, FiShield, FiUser } from 'react-icons/fi';
import AuthLayout from '../layouts/AuthLayout.jsx';
import FormInput from '../components/FormInput.jsx';
import PasswordStrength, { getPasswordScore } from '../components/PasswordStrength.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../hooks/useForm.js';
import '../styles/pages/Signup.css';
import { loadGoogleCodeClient } from '../services/googleAuth.js';

const initialValues = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirm_password: '',
  terms: false,
  profile_image: null
};

function validateSignup(values) {
  const errors = {};
  if (values.first_name.trim().length < 2) errors.first_name = 'First name needs at least 2 characters.';
  if (values.last_name.trim().length < 2) errors.last_name = 'Last name needs at least 2 characters.';
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(values.username)) errors.username = 'Use 3-24 letters, numbers, or underscores.';
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (!/^\+?[0-9\s-]{8,18}$/.test(values.phone)) errors.phone = 'Enter a valid phone number.';
  if (getPasswordScore(values.password) < 4) errors.password = 'Use a stronger password.';
  if (values.confirm_password !== values.password) errors.confirm_password = 'Passwords do not match.';
  if (!values.terms) errors.terms = 'Accept the terms to continue.';
  return errors;
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup, verifyGoogleEmail } = useAuth();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailVerification, setEmailVerification] = useState({
    verified: false,
    email: '',
    token: ''
  });
  const form = useForm(initialValues, validateSignup);

  const previewUrl = useMemo(() => {
    if (!form.values.profile_image) return '';
    return URL.createObjectURL(form.values.profile_image);
  }, [form.values.profile_image]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const typedEmail = form.values.email.trim().toLowerCase();
    if (emailVerification.verified && emailVerification.email !== typedEmail) {
      setEmailVerification({ verified: false, email: '', token: '' });
    }
  }, [form.values.email, emailVerification.verified, emailVerification.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    if (!form.validateAll()) return;

    const payload = new FormData();
    Object.entries(form.values).forEach(([key, value]) => {
      if (key !== 'confirm_password' && value !== null) payload.append(key, value);
    });
    payload.append('email_verification_token', emailVerification.token);

    try {
      setLoading(true);
      await signup(payload);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = () => {
    setServerError('');

    if (!/^\S+@\S+\.\S+$/.test(form.values.email)) {
      form.validateAll();
      setServerError('Enter a valid email before Google verification.');
      return;
    }

    try {
      const codeClient = loadGoogleCodeClient(async (response) => {
        if (!response.code) {
          setServerError('Google verification was cancelled.');
          return;
        }

        try {
          setVerifyingEmail(true);
          const result = await verifyGoogleEmail({
            code: response.code,
            email: form.values.email.trim().toLowerCase()
          });
          setEmailVerification({
            verified: true,
            email: result.email,
            token: result.email_verification_token
          });
        } catch (err) {
          setEmailVerification({ verified: false, email: '', token: '' });
          setServerError(err.message);
        } finally {
          setVerifyingEmail(false);
        }
      });

      codeClient.requestCode();
    } catch (err) {
      setServerError(err.message);
    }
  };


  return (
    <AuthLayout mode="signup">
      <div className="auth-heading">
        <span>Launch your loop</span>
        <h2>Create account</h2>
        <p>Set up a secure profile for intelligent trip planning.</p>
      </div>

      <form className="auth-form signup-form" onSubmit={handleSubmit} noValidate>
        <label className="upload-dropzone">
          <input name="profile_image" type="file" accept="image/*" onChange={form.handleChange} />
          {previewUrl ? <img src={previewUrl} alt="Profile preview" /> : <FiImage />}
          <span>{form.values.profile_image ? form.values.profile_image.name : 'Upload profile image'}</span>
        </label>

        <div className="two-column">
          <FormInput label="First name" name="first_name" value={form.values.first_name} error={form.errors.first_name} touched={form.touched.first_name} onChange={form.handleChange} onBlur={form.handleBlur} icon={<FiUser />} />
          <FormInput label="Last name" name="last_name" value={form.values.last_name} error={form.errors.last_name} touched={form.touched.last_name} onChange={form.handleChange} onBlur={form.handleBlur} icon={<FiUser />} />
        </div>

        <FormInput label="Username" name="username" value={form.values.username} error={form.errors.username} touched={form.touched.username} onChange={form.handleChange} onBlur={form.handleBlur} icon={<FiAtSign />} />
        <div className="email-verification-block">
          <FormInput label="Email" name="email" type="email" value={form.values.email} error={form.errors.email} touched={form.touched.email} onChange={form.handleChange} onBlur={form.handleBlur} autoComplete="email" icon={<FiMail />} />
          <button className="verify-email-button" type="button" onClick={handleVerifyEmail} disabled={verifyingEmail || loading}>
            {verifyingEmail ? <span className="spinner" /> : emailVerification.verified ? <FiCheckCircle /> : <FiShield />}
            <span>{emailVerification.verified ? 'Email verified' : 'Verify Email with Google'}</span>
          </button>
          {emailVerification.verified && (
            <div className="verified-badge">
              <FiCheckCircle />
              <span>{emailVerification.email} verified by Google</span>
            </div>
          )}
        </div>
        <FormInput label="Phone number" name="phone" type="tel" value={form.values.phone} error={form.errors.phone} touched={form.touched.phone} onChange={form.handleChange} onBlur={form.handleBlur} icon={<FiPhone />} />
        <FormInput label="Password" name="password" type="password" value={form.values.password} error={form.errors.password} touched={form.touched.password} onChange={form.handleChange} onBlur={form.handleBlur} autoComplete="new-password" icon={<FiLock />} />
        <PasswordStrength password={form.values.password} />
        <FormInput label="Confirm password" name="confirm_password" type="password" value={form.values.confirm_password} error={form.errors.confirm_password} touched={form.touched.confirm_password} onChange={form.handleChange} onBlur={form.handleBlur} autoComplete="new-password" icon={<FiLock />} />

        <label className="check-row terms-row">
          <input name="terms" type="checkbox" checked={form.values.terms} onChange={form.handleChange} onBlur={form.handleBlur} />
          <span>I agree to Traveloop terms and privacy policy.</span>
        </label>
        {form.errors.terms && form.touched.terms && <span className="field-error">{form.errors.terms}</span>}
        {serverError && <div className="form-alert">{serverError}</div>}

        <button className="primary-button" type="submit" disabled={loading || !emailVerification.verified}>
          {loading ? <span className="spinner" /> : 'Create secure account'}
        </button>
      </form>

      <p className="switch-copy">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
}
