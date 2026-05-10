import { FiCompass } from 'react-icons/fi';
import '../styles/components/Logo.css';

export default function Logo() {
  return (
    <div className="brand-lockup" aria-label="Traveloop">
      <span className="brand-mark">
        <FiCompass />
      </span>
      <span>Traveloop</span>
    </div>
  );
}
