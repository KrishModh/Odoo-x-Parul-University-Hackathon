import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiCompass,
  FiGlobe,
  FiGrid,
  FiMap,
  FiMenu,
  FiPieChart,
  FiShare2,
  FiShield,
  FiStar,
  FiX
} from 'react-icons/fi';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import '../styles/pages/LandingPage.css';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Preview', href: '#preview' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Destinations', href: '#destinations' }
];

const trustedBy = ['AI Trip Labs', 'Nomad Guild', 'Urban Trails', 'Voyage Capital'];

const features = [
  {
    icon: <FiCalendar />,
    title: 'AI itinerary builder',
    body: 'Generate day-wise plans that balance travel time, interests, opening hours, and pace.'
  },
  {
    icon: <FiPieChart />,
    title: 'Budget estimation',
    body: 'Forecast hotels, activities, food, transport, and buffers with adaptive smart ranges.'
  },
  {
    icon: <FiMap />,
    title: 'Multi-city planning',
    body: 'Connect cities, stays, transfers, and activities into one intelligent travel loop.'
  },
  {
    icon: <FiCompass />,
    title: 'Activity discovery',
    body: 'Find hidden gems, iconic stops, and local experiences based on your travel style.'
  },
  {
    icon: <FiShare2 />,
    title: 'Public sharing',
    body: 'Publish polished itineraries for friends, teams, communities, or travel clients.'
  },
  {
    icon: <FiBarChart2 />,
    title: 'Smart analytics',
    body: 'Understand spend, time density, travel load, and destination mix before booking.'
  }
];

const tripDays = [
  { time: '08:30', title: 'Old Delhi breakfast walk', meta: 'Food lane, 2.1 km' },
  { time: '11:45', title: 'Humayun heritage loop', meta: 'Monument pass ready' },
  { time: '16:20', title: 'Flight to Jaipur', meta: 'Terminal transfer synced' },
  { time: '20:10', title: 'Rooftop dinner check-in', meta: 'Budget optimized' }
];

const cityCards = [
  { city: 'Delhi', score: '94', tone: 'culture' },
  { city: 'Jaipur', score: '89', tone: 'heritage' },
  { city: 'Udaipur', score: '92', tone: 'slow travel' }
];

const steps = [
  { title: 'Create trip', body: 'Set dates, travelers, mood, and constraints.' },
  { title: 'Add destinations', body: 'Drop cities into a route that Traveloop can optimize.' },
  { title: 'Build itinerary', body: 'Let AI arrange stays, activities, transfers, and budgets.' },
  { title: 'Share & travel', body: 'Invite collaborators and carry a polished plan on the go.' }
];

const destinations = [
  {
    name: 'Jaipur',
    region: 'Rajasthan',
    tag: 'Royal city loop',
    image: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Varanasi',
    region: 'Uttar Pradesh',
    tag: 'Spiritual river trail',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Kerala',
    region: 'Backwaters',
    tag: 'Slow nature escape',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Ladakh',
    region: 'Himalayas',
    tag: 'High-altitude adventure',
    image: 'https://images.unsplash.com/photo-1589793907316-f94025b46850?auto=format&fit=crop&w=1200&q=80'
  }
];

const testimonials = [
  {
    quote: 'Traveloop made a complex India route feel calm, premium, and ready to share in minutes.',
    name: 'Aarav Mehta',
    role: 'Founder, Remote Trails'
  },
  {
    quote: 'The budget intelligence and itinerary density checks feel like the missing layer in travel planning.',
    name: 'Nisha Rao',
    role: 'Product Lead'
  },
  {
    quote: 'It looks like a SaaS product, but thinks like a personal travel strategist.',
    name: 'Kabir Sethi',
    role: 'Angel Investor'
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="landing-page">
      <div className="landing-aurora landing-aurora-one" />
      <div className="landing-aurora landing-aurora-two" />

      <header className={`landing-navbar ${scrolled ? 'landing-navbar--scrolled' : ''}`}>
        <Link to="/" aria-label="Traveloop home">
          <Logo />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <Link className="nav-login" to="/login">Login</Link>
          <Link className="nav-signup" to="/signup">Signup</Link>
          <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
            ))}
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </motion.nav>
        )}
      </header>

      <section className="landing-hero">
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <span className="hero-pill"><FiShield /> AI-powered travel command center</span>
          <h1>Plan cinematic journeys with an AI travel loop that thinks ahead.</h1>
          <p>
            Traveloop turns cities, budgets, activities, journals, and shared plans into one elegant
            operating system for modern travel.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/signup">Start planning <FiArrowRight /></Link>
            <a className="secondary-button" href="#preview">View product preview</a>
          </div>
          <div className="trusted-strip" aria-label="Trusted by">
            <span>Trusted by early travel builders</span>
            <div>
              {trustedBy.map((company) => <strong key={company}>{company}</strong>)}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.94, x: 28 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="dashboard-mockup">
            <div className="mockup-topbar">
              <span />
              <span />
              <span />
              <strong>India Golden Loop</strong>
            </div>
            <div className="mockup-grid">
              <div className="map-panel">
                <div className="route-line" />
                <span className="route-dot dot-delhi">DEL</span>
                <span className="route-dot dot-jaipur">JAI</span>
                <span className="route-dot dot-udaipur">UDR</span>
              </div>
              <div className="insight-panel">
                <FiActivity />
                <strong>92%</strong>
                <span>Trip confidence</span>
              </div>
              <div className="budget-panel">
                <span>Budget health</span>
                <strong>INR 42.8k</strong>
                <div><span style={{ width: '72%' }} /></div>
              </div>
            </div>
          </div>

          <motion.article className="floating-card floating-card-one" animate={{ y: [0, -12, 0] }} transition={{ duration: 4.4, repeat: Infinity }}>
            <FiGlobe />
            <div><strong>3 cities synced</strong><span>Route optimized</span></div>
          </motion.article>
          <motion.article className="floating-card floating-card-two" animate={{ y: [0, 14, 0] }} transition={{ duration: 5.2, repeat: Infinity }}>
            <FiStar />
            <div><strong>12 hidden gems</strong><span>Matched to your style</span></div>
          </motion.article>
        </motion.div>
      </section>

      <section className="section-block" id="features">
        <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
          <span className="eyebrow">Feature intelligence</span>
          <h2>Everything your trip needs, arranged before you ask.</h2>
          <p>Traveloop combines planning depth with SaaS clarity so every journey stays beautiful and executable.</p>
        </motion.div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <motion.article
              className="feature-card"
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              transition={{ delay: index * 0.04 }}
            >
              <span>{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="product-preview section-block" id="preview">
        <div className="preview-copy">
          <span className="eyebrow">Live trip preview</span>
          <h2>A premium dashboard for the messy middle of travel.</h2>
          <p>Preview timelines, compare city quality, track budgets, and spot planning pressure before the trip begins.</p>
        </div>

        <motion.div className="trip-console" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
          <div className="console-header">
            <div>
              <span>Workspace</span>
              <strong>Monsoon City Sprint</strong>
            </div>
            <button type="button"><FiShare2 /> Share plan</button>
          </div>
          <div className="console-grid">
            <div className="timeline-panel">
              <h3>Itinerary timeline</h3>
              {tripDays.map((day) => (
                <article key={day.time}>
                  <time>{day.time}</time>
                  <div><strong>{day.title}</strong><span>{day.meta}</span></div>
                </article>
              ))}
            </div>
            <div className="cities-panel">
              <h3>City fit</h3>
              {cityCards.map((city) => (
                <article key={city.city}>
                  <div><strong>{city.city}</strong><span>{city.tone}</span></div>
                  <b>{city.score}</b>
                </article>
              ))}
            </div>
            <div className="analytics-panel">
              <h3>Travel analytics</h3>
              <div className="analytics-ring"><span>76%</span></div>
              <p>Balanced pace with two high-energy days and one recovery window.</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-block" id="how-it-works">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>From idea to itinerary in four calm moves.</h2>
        </div>
        <div className="steps-timeline">
          {steps.map((step, index) => (
            <motion.article key={step.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.08 }}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-block" id="destinations">
        <div className="section-heading">
          <span className="eyebrow">Destination showcase</span>
          <h2>Built for India-scale travel complexity.</h2>
          <p>Plan royal circuits, spiritual trails, mountain escapes, and coastal slow travel with the same refined system.</p>
        </div>
        <div className="destination-grid">
          {destinations.map((destination) => (
            <article className="destination-showcase-card" key={destination.name} style={{ '--destination-image': `url(${destination.image})` }}>
              <div>
                <span>{destination.region}</span>
                <h3>{destination.name}</h3>
                <p>{destination.tag}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block testimonials-section">
        <div className="section-heading">
          <span className="eyebrow">Traveler signal</span>
          <h2>Designed for people who want their plans to feel intelligent.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <div><FiStar /><FiStar /><FiStar /><FiStar /><FiStar /></div>
              <p>{testimonial.quote}</p>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <FiGrid />
        <h2>Start Planning Your Dream Journey</h2>
        <p>Bring your cities, friends, budgets, and travel notes into one premium AI planning loop.</p>
        <Link className="primary-button" to="/signup">Create your Traveloop account <FiArrowRight /></Link>
      </section>

      <footer className="landing-footer">
        <div>
          <Logo />
          <p>AI-powered travel planning for modern explorers, teams, and itinerary creators.</p>
        </div>
        <nav>
          <strong>Product</strong>
          <a href="#features">Features</a>
          <a href="#preview">Preview</a>
          <a href="#destinations">Destinations</a>
        </nav>
        <nav>
          <strong>Company</strong>
          <a href="#how-it-works">How it works</a>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </nav>
        <nav>
          <strong>Legal</strong>
          <a href="/">Privacy</a>
          <a href="/">Terms</a>
          <a href="/">Security</a>
        </nav>
      </footer>
    </main>
  );
}
