import { useState } from 'react';

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const updateValue = (name, value) => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setErrors(validate(nextValues));
  };

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    const nextValue = type === 'checkbox' ? checked : type === 'file' ? files?.[0] : value;
    updateValue(name, nextValue);
  };

  const handleBlur = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const validateAll = () => {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched(Object.keys(values).reduce((state, key) => ({ ...state, [key]: true }), {}));
    return Object.keys(nextErrors).length === 0;
  };

  return { values, errors, touched, handleChange, handleBlur, validateAll, setValues };
}
