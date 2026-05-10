import '../styles/components/PasswordStrength.css';

const labels = ['Weak', 'Fair', 'Good', 'Strong'];

export function getPasswordScore(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export default function PasswordStrength({ password }) {
  const score = getPasswordScore(password);

  return (
    <div className="password-strength" aria-live="polite">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((bar) => (
          <span key={bar} className={bar <= score ? `active active-${score}` : ''} />
        ))}
      </div>
      <span>{password ? labels[Math.max(score - 1, 0)] : 'Use 8+ chars, case mix, number, symbol'}</span>
    </div>
  );
}
