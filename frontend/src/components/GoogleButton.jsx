import { FcGoogle } from 'react-icons/fc';
import '../styles/components/GoogleButton.css';

export default function GoogleButton({ label, onClick, loading }) {
  return (
    <button className="google-button" type="button" onClick={onClick} disabled={loading}>
      <FcGoogle />
      <span>{label}</span>
    </button>
  );
}
