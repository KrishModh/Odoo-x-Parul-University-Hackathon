import '../../styles/components/Select.css';

export default function Select({ label, icon, helper, error, className = '', children, ...props }) {
  return (
    <label className={`app-select-field ${className}`}>
      {label && <span className="app-select-label">{icon}{label}</span>}
      <select {...props}>{children}</select>
      {helper && !error && <small>{helper}</small>}
      {error && <small className="app-select-error">{error}</small>}
    </label>
  );
}
