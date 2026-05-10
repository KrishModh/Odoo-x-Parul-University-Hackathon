import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCamera, FiCheckCircle, FiEdit3, FiLock, FiLogOut, FiSave, FiTrash2, FiUploadCloud, FiUser } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTrips } from '../context/TripContext.jsx';
import { userService } from '../services/userService.js';
import '../styles/pages/UserProfile.css';

const fallbackAvatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, updateStoredUser, logout } = useAuth();
  const { trips, refreshTrips } = useTrips();
  const [profile, setProfile] = useState(user);
  const [form, setForm] = useState(user || {});
  const [imageFile, setImageFile] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return profile?.profile_image || fallbackAvatar;
  }, [imageFile, profile?.profile_image]);

  useEffect(() => {
    userService.getProfile()
      .then((payload) => {
        setProfile(payload.user);
        setForm(payload.user);
        updateStoredUser(payload.user);
      })
      .catch((profileError) => setError(profileError.message));
    refreshTrips();
  }, [refreshTrips]);

  useEffect(() => {
    return () => {
      if (imageFile && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    };
  }, [imageFile, imagePreview]);

  const completedTrips = trips.filter((trip) => new Date(trip.end_date) < new Date());
  const recentTrips = trips.slice(0, 3);

  const flash = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const payload = new FormData();
    ['first_name', 'last_name', 'username', 'email', 'phone', 'country', 'bio', 'preferred_theme'].forEach((key) => {
      payload.append(key, form?.[key] || '');
    });
    if (imageFile) payload.append('profile_image', imageFile);

    try {
      const result = await userService.updateProfile(payload);
      setProfile(result.user);
      setForm(result.user);
      updateStoredUser(result.user);
      setImageFile(null);
      flash('Profile updated successfully.');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value || ''));
    payload.append('remove_image', 'true');
    const result = await userService.updateProfile(payload);
    setProfile(result.user);
    setForm(result.user);
    updateStoredUser(result.user);
    setImageFile(null);
    flash('Profile image removed.');
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    try {
      await userService.updatePassword(passwordForm);
      setPasswordForm({ current_password: '', new_password: '' });
      flash('Password updated securely.');
    } catch (passwordError) {
      setError(passwordError.message);
    }
  };

  const handleDeleteAccount = async () => {
    await userService.deleteAccount();
    logout();
    navigate('/');
  };

  return (
    <main className="profile-page">
      <header className="profile-header">
        <div className="profile-identity">
          <img src={imagePreview} alt="Profile" />
          <div>
            <span className="eyebrow"><FiUser /> Traveler profile</span>
            <h1>{profile?.first_name} {profile?.last_name}</h1>
            <p>@{profile?.username} · {profile?.email}</p>
            <small>Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'recently'}</small>
          </div>
        </div>
        <div className="profile-header-actions">
          <ThemeToggle />
          <button className="primary-button" type="button" onClick={() => document.getElementById('profile-form')?.scrollIntoView({ behavior: 'smooth' })}><FiEdit3 /> Edit profile</button>
        </div>
      </header>

      {toast && <div className="profile-toast"><FiCheckCircle /> {toast}</div>}
      {error && <div className="form-alert">{error}</div>}

      <section className="profile-stats">
        <article><strong>{trips.length}</strong><span>Total trips</span></article>
        <article><strong>{completedTrips.length}</strong><span>Previous trips</span></article>
        <article><strong>{trips.reduce((sum, trip) => sum + (trip.sections?.length || 0), 0)}</strong><span>Planned cities</span></article>
      </section>

      <section className="profile-layout">
        <form id="profile-form" className="profile-card profile-form" onSubmit={handleSaveProfile}>
          <h2>User information</h2>
          <div className="profile-image-manager">
            <label>
              <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
              <FiUploadCloud />
              <span>Upload new image</span>
            </label>
            <button type="button" onClick={handleRemoveImage}><FiTrash2 /> Remove image</button>
          </div>
          <div className="profile-form-grid">
            {['first_name', 'last_name', 'username', 'email', 'phone', 'country'].map((field) => (
              <label key={field}>
                <span>{field.replace('_', ' ')}</span>
                <input value={form?.[field] || ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
              </label>
            ))}
          </div>
          <label>
            <span>Bio / About</span>
            <textarea value={form?.bio || ''} onChange={(event) => setForm({ ...form, bio: event.target.value })} placeholder="Tell Traveloop about your travel style." />
          </label>
          <label>
            <span>Preferred theme</span>
            <select value={form?.preferred_theme || 'dark'} onChange={(event) => setForm({ ...form, preferred_theme: event.target.value })}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          <button className="primary-button" type="submit" disabled={loading}>{loading ? <span className="spinner" /> : <><FiSave /> Save profile</>}</button>
        </form>

        <aside className="profile-side-stack">
          <section className="profile-card">
            <h2>Preferred trips</h2>
            <div className="profile-trip-list">
              {recentTrips.length ? recentTrips.map((trip) => (
                <button key={trip.id} type="button" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>
                  <span>{trip.trip_name}</span>
                  <small>{trip.destination}</small>
                </button>
              )) : <p>No trips yet.</p>}
            </div>
          </section>

          <section className="profile-card">
            <h2>Previous trips</h2>
            <div className="profile-trip-list">
              {completedTrips.length ? completedTrips.map((trip) => (
                <button key={trip.id} type="button" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>
                  <span>{trip.trip_name}</span>
                  <small>{trip.destination}</small>
                </button>
              )) : <p>Completed trips will appear here.</p>}
            </div>
          </section>

          <motion.section className="profile-card account-settings" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <h2>Account settings</h2>
            <form onSubmit={handlePasswordUpdate}>
              <input type="password" value={passwordForm.current_password} onChange={(event) => setPasswordForm({ ...passwordForm, current_password: event.target.value })} placeholder="Current password" />
              <input type="password" value={passwordForm.new_password} onChange={(event) => setPasswordForm({ ...passwordForm, new_password: event.target.value })} placeholder="New secure password" />
              <button type="submit"><FiLock /> Change password</button>
            </form>
            <select defaultValue="en">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="fr">French</option>
            </select>
            <button type="button" onClick={logout}><FiLogOut /> Logout</button>
            <button className="danger" type="button" onClick={handleDeleteAccount}><FiTrash2 /> Delete account</button>
          </motion.section>
        </aside>
      </section>
    </main>
  );
}
