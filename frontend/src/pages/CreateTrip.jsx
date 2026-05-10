import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiCompass,
  FiCreditCard,
  FiFileText,
  FiImage,
  FiMapPin,
  FiTag,
  FiUploadCloud,
  FiUsers
} from 'react-icons/fi';
import FormInput from '../components/FormInput.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useTrips } from '../context/TripContext.jsx';
import { useForm } from '../hooks/useForm.js';
import { tripService } from '../services/tripService.js';
import '../styles/pages/CreateTrip.css';

const initialValues = {
  trip_name: '',
  destination: '',
  start_date: '',
  end_date: '',
  description: '',
  estimated_budget: '',
  travelers_count: '1',
  travel_type: 'solo',
  visibility: 'private',
  tags: '',
  notes: '',
  cover_image: null
};

const travelTypes = [
  { value: 'solo', label: 'Solo' },
  { value: 'family', label: 'Family' },
  { value: 'friends', label: 'Friends' },
  { value: 'business', label: 'Business' },
  { value: 'couple', label: 'Couple' }
];

function validateTrip(values) {
  const errors = {};
  if (values.trip_name.trim().length < 3) errors.trip_name = 'Trip name must be at least 3 characters.';
  if (values.destination.trim().length < 2) errors.destination = 'Destination is required.';
  if (!values.start_date) errors.start_date = 'Start date is required.';
  if (!values.end_date) errors.end_date = 'End date is required.';
  if (values.start_date && values.end_date && values.end_date < values.start_date) errors.end_date = 'End date cannot be before start date.';
  if (values.description.trim().length < 10) errors.description = 'Description must be at least 10 characters.';
  if (!values.estimated_budget || Number(values.estimated_budget) <= 0) errors.estimated_budget = 'Budget must be positive.';
  if (!values.travelers_count || Number(values.travelers_count) <= 0) errors.travelers_count = 'Travelers must be at least 1.';
  if (!values.cover_image) errors.cover_image = 'Upload a cover image for the trip.';
  return errors;
}

export default function CreateTrip() {
  const navigate = useNavigate();
  const { upsertTrip, refreshTrips } = useTrips();
  const form = useForm(initialValues, validateTrip);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);

  const previewUrl = useMemo(() => {
    if (!form.values.cover_image) return '';
    return URL.createObjectURL(form.values.cover_image);
  }, [form.values.cover_image]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setCoverImage = (file) => {
    if (!file) return;
    form.updateValue('cover_image', file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    setCoverImage(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    setSuccess(false);

    if (!form.validateAll()) return;

    const payload = new FormData();
    Object.entries(form.values).forEach(([key, value]) => {
      if (value !== null && value !== '') payload.append(key, value);
    });

    try {
      setLoading(true);
      const result = await tripService.createTrip(payload);
      upsertTrip(result.trip);
      await refreshTrips();
      setSuccess(true);
      window.setTimeout(() => navigate('/dashboard'), 1100);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-trip-page">
      <div className="create-trip-aurora create-trip-aurora-one" />
      <div className="create-trip-aurora create-trip-aurora-two" />

      <header className="create-trip-header">
        <Link to="/dashboard" className="back-link"><FiArrowLeft /> Dashboard</Link>
        <ThemeToggle />
      </header>

      <section className="create-trip-shell">
        <motion.div
          className="create-trip-intro"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="eyebrow"><FiCompass /> Create New Trip</span>
          <h1>Turn a travel idea into a real saved plan.</h1>
          <p>
            Add the core trip details, upload a cinematic cover, and Traveloop will store it securely
            in your travel workspace.
          </p>
          <div className="trip-creation-stats">
            <article><strong>JWT</strong><span>Protected API</span></article>
            <article><strong>Cloudinary</strong><span>Cover upload</span></article>
            <article><strong>PostgreSQL</strong><span>Real trip data</span></article>
          </div>
        </motion.div>

        <motion.form
          className="create-trip-form-card"
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <label
            className={`trip-upload-zone ${dragging ? 'trip-upload-zone--dragging' : ''} ${form.errors.cover_image && form.touched.cover_image ? 'trip-upload-zone--error' : ''}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input name="cover_image" type="file" accept="image/*" onChange={(event) => setCoverImage(event.target.files?.[0])} />
            {previewUrl ? (
              <img src={previewUrl} alt="Trip cover preview" />
            ) : (
              <span className="upload-placeholder"><FiUploadCloud /> Drop cover image or browse</span>
            )}
            <small>Recommended 1400 x 900. Stored securely on Cloudinary.</small>
          </label>
          {form.errors.cover_image && form.touched.cover_image && <span className="field-error">{form.errors.cover_image}</span>}

          <div className="create-trip-grid">
            <FormInput label="Trip Name" name="trip_name" value={form.values.trip_name} error={form.errors.trip_name} touched={form.touched.trip_name} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="Jaipur Heritage Loop" icon={<FiFileText />} />
            <FormInput label="Destination / Main City" name="destination" value={form.values.destination} error={form.errors.destination} touched={form.touched.destination} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="Jaipur" icon={<FiMapPin />} />
            <FormInput label="Start Date" name="start_date" type="date" value={form.values.start_date} error={form.errors.start_date} touched={form.touched.start_date} onChange={form.handleChange} onBlur={form.handleBlur} icon={<FiCalendar />} />
            <FormInput label="End Date" name="end_date" type="date" value={form.values.end_date} error={form.errors.end_date} touched={form.touched.end_date} onChange={form.handleChange} onBlur={form.handleBlur} icon={<FiCalendar />} />
            <FormInput label="Estimated Budget" name="estimated_budget" type="number" value={form.values.estimated_budget} error={form.errors.estimated_budget} touched={form.touched.estimated_budget} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="58000" icon={<FiCreditCard />} />
            <FormInput label="Number of Travelers" name="travelers_count" type="number" value={form.values.travelers_count} error={form.errors.travelers_count} touched={form.touched.travelers_count} onChange={form.handleChange} onBlur={form.handleBlur} icon={<FiUsers />} />
          </div>

          <div className="segmented-field">
            <span className="field-label">Travel Type</span>
            <div>
              {travelTypes.map((type) => (
                <button
                  className={form.values.travel_type === type.value ? 'active' : ''}
                  key={type.value}
                  type="button"
                  onClick={() => form.updateValue('travel_type', type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="segmented-field">
            <span className="field-label">Trip Visibility</span>
            <div>
              {['private', 'public'].map((visibility) => (
                <button
                  className={form.values.visibility === visibility ? 'active' : ''}
                  key={visibility}
                  type="button"
                  onClick={() => form.updateValue('visibility', visibility)}
                >
                  {visibility}
                </button>
              ))}
            </div>
          </div>

          <label className="textarea-field">
            <span className="field-label">Trip Description</span>
            <textarea name="description" value={form.values.description} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="Describe the mood, route, and purpose of this trip." />
            {form.errors.description && form.touched.description && <span className="field-error">{form.errors.description}</span>}
          </label>

          <div className="create-trip-grid">
            <FormInput label="Tags" name="tags" value={form.values.tags} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="heritage, food, weekend" icon={<FiTag />} />
            <label className="textarea-field compact">
              <span className="field-label">Notes</span>
              <textarea name="notes" value={form.values.notes} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="Anything important for future itinerary generation." />
            </label>
          </div>

          {serverError && <div className="form-alert">{serverError}</div>}
          {success && (
            <div className="success-alert">
              <FiCheckCircle />
              <span>Trip created successfully. Redirecting to dashboard...</span>
            </div>
          )}

          <button className="primary-button create-trip-submit" type="submit" disabled={loading || success}>
            {loading ? <span className="spinner" /> : <><FiImage /> Create Trip</>}
          </button>
        </motion.form>
      </section>
    </main>
  );
}
