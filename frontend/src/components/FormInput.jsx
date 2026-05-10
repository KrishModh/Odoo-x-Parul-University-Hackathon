import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { classNames } from '../utils.js';
import '../styles/components/FormInput.css';

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  icon,
  onChange,
  onBlur,
  autoComplete,
  placeholder
}) {
  const [visible, setVisible] = useState(false);
  const inputType = type === 'password' && visible ? 'text' : type;

  return (
    <label className={classNames('field-shell', error && touched && 'field-shell--error')}>
      <span className="field-label">{label}</span>
      <span className="field-control">
        {icon && <span className="field-icon">{icon}</span>}
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        {type === 'password' && (
          <button
            className="password-toggle"
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </span>
      {error && touched && <span className="field-error">{error}</span>}
    </label>
  );
}
