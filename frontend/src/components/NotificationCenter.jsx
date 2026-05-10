import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCalendar, FiCheckCircle, FiCreditCard, FiMap } from 'react-icons/fi';
import { useTrips } from '../context/TripContext.jsx';
import { checklistService } from '../services/checklistService.js';
import '../styles/components/NotificationCenter.css';

function daysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

function activityCost(trip) {
  return (trip.sections || [])
    .flatMap((section) => section.activities || [])
    .reduce((sum, activity) => sum + Number(activity.estimated_cost || 0), 0);
}

export default function NotificationCenter({ className = '' }) {
  const { trips } = useTrips();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => JSON.parse(localStorage.getItem('traveloop_read_notifications') || '[]'));
  const [checklistByTrip, setChecklistByTrip] = useState({});
  const wrapperRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    let active = true;
    async function loadChecklist() {
      const results = await Promise.allSettled(
        trips.slice(0, 8).map(async (trip) => [trip.id, await checklistService.getChecklist(trip.id)])
      );
      if (!active) return;
      const next = {};
      results.forEach((result) => {
        if (result.status === 'fulfilled') next[result.value[0]] = result.value[1].items || [];
      });
      setChecklistByTrip(next);
    }
    if (trips.length) loadChecklist();
    return () => {
      active = false;
    };
  }, [trips]);

  const notifications = useMemo(() => {
    const next = [];
    trips.forEach((trip) => {
      const startIn = daysUntil(trip.start_date);
      if (startIn >= 0 && startIn <= 7) {
        next.push({
          id: `start-${trip.id}`,
          icon: <FiCalendar />,
          title: `${trip.trip_name} starts ${startIn === 0 ? 'today' : `in ${startIn} day${startIn > 1 ? 's' : ''}`}.`,
          detail: trip.destination,
          tone: 'accent'
        });
      }

      const budget = Number(trip.estimated_budget || 0);
      const spent = activityCost(trip);
      if (budget && spent / budget >= 0.8) {
        next.push({
          id: `budget-${trip.id}`,
          icon: <FiCreditCard />,
          title: `${trip.trip_name} budget is reaching ${Math.round((spent / budget) * 100)}%.`,
          detail: `INR ${spent.toLocaleString()} planned`,
          tone: 'warning'
        });
      }

      const emptySections = (trip.sections || []).filter((section) => !(section.activities || []).length);
      if (emptySections.length) {
        next.push({
          id: `sections-${trip.id}`,
          icon: <FiMap />,
          title: `${emptySections.length} itinerary section${emptySections.length > 1 ? 's need' : ' needs'} activities.`,
          detail: trip.trip_name,
          tone: 'neutral'
        });
      }

      const checklist = checklistByTrip[trip.id] || [];
      const packed = checklist.filter((item) => item.is_completed).length;
      if (checklist.length && packed < checklist.length) {
        next.push({
          id: `packing-${trip.id}`,
          icon: <FiCheckCircle />,
          title: `${checklist.length - packed} packing item${checklist.length - packed > 1 ? 's' : ''} left.`,
          detail: trip.trip_name,
          tone: 'accent'
        });
      }
    });
    return next.slice(0, 8);
  }, [trips, checklistByTrip]);

  const unreadCount = notifications.filter((item) => !readIds.includes(item.id)).length;

  const markAllRead = () => {
    const next = [...new Set([...readIds, ...notifications.map((item) => item.id)])];
    setReadIds(next);
    localStorage.setItem('traveloop_read_notifications', JSON.stringify(next));
  };

  return (
    <div className={`notification-center ${className}`} ref={wrapperRef}>
      <button className="notification-trigger" type="button" onClick={() => setOpen((current) => !current)} aria-label="Notifications">
        <FiBell />
        {unreadCount > 0 && <span>{unreadCount}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notification-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <div className="notification-heading">
              <div>
                <span>Travel signals</span>
                <strong>{unreadCount} unread</strong>
              </div>
              <button type="button" onClick={markAllRead}>Mark read</button>
            </div>
            {notifications.length ? (
              <div className="notification-list">
                {notifications.map((item) => (
                  <article className={readIds.includes(item.id) ? 'read' : ''} key={item.id}>
                    <span data-tone={item.tone}>{item.icon}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="notification-empty">No active alerts. Your travel graph is calm.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
