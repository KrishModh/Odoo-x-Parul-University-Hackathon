import { motion } from 'framer-motion';
import { FiMapPin, FiNavigation, FiTrendingUp } from 'react-icons/fi';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import '../styles/layouts/AuthLayout.css';

const destinations = [
  { city: 'Leh', detail: 'AI route ready', icon: <FiMapPin /> },
  { city: 'Aasam', detail: 'Budget synced', icon: <FiTrendingUp /> },
  { city: 'Meghalaya', detail: 'Journal prompt live', icon: <FiNavigation /> }
];

export default function AuthLayout({ children, mode }) {
  return (
    <main className="auth-page">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <section className="auth-hero">
        <div className="auth-topbar">
          <Logo />
          <ThemeToggle />
        </div>

        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="eyebrow">AI travel operating system</span>
          <h1>{mode === 'signup' ? 'Start planning where life happens next.' : 'Your next journey already has a pulse.'}</h1>
          <p>
            Build itineraries, budgets, shared plans, and travel journals with a calmer intelligence
            designed for modern explorers.
          </p>
        </motion.div>

        <motion.div
          className="globe-stage"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.8 }}
        >
          <div className="globe-core">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="orbit orbit-three" />
          </div>
          {destinations.map((destination, index) => (
            <motion.article
              className={`destination-card destination-card-${index + 1}`}
              key={destination.city}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
            >
              {destination.icon}
              <div>
                <strong>{destination.city}</strong>
                <span>{destination.detail}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="auth-panel">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </section>
    </main>
  );
}
