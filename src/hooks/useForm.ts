import { useState, useCallback, ChangeEvent } from 'react';

interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

interface FieldConfig<T> {
  initialValue: T;
  validators?: ValidationRule<T>[];
  required?: boolean;
}

type FormConfig<T> = {
  [K in keyof T]: FieldConfig<T[K]>;
};

type FormValues<T> = {
  [K in keyof T]: T[K];
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

type FormTouched<T> = {
  [K in keyof T]?: boolean;
};

/**
 * Custom hook for form state management with validation
 */
export const useForm = <T extends Record<string, any>>(config: FormConfig<T>) => {
  const initialValues = Object.keys(config).reduce((acc, key) => {
    acc[key as keyof T] = config[key as keyof T].initialValue;
    return acc;
  }, {} as FormValues<T>);

  const [values, setValues] = useState<FormValues<T>>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | undefined => {
      const fieldConfig = config[name];

      // Check required
      if (fieldConfig.required && !value) {
        return `${String(name)} is required`;
      }

      // Run validators
      if (fieldConfig.validators) {
        for (const validator of fieldConfig.validators) {
          if (!validator.validate(value)) {
            return validator.message;
          }
        }
      }

      return undefined;
    },
    [config]
  );

  /**
   * Validate all fields
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors<T> = {};
    let isValid = true;

    Object.keys(config).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [config, values, validateField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (name: keyof T) => (value: T[keyof T]) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Validate on change if field was touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate on blur
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [values, validateField]
  );

  /**
   * Set a specific field value
   */
  const setFieldValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Set a specific field error
   */
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  /**
   * Set a field as touched
   */
  const setFieldTouched = useCallback((name: keyof T, isTouched: boolean = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }));
  }, []);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (onSubmit: (values: FormValues<T>) => void | Promise<void>) => async () => {
      // Mark all fields as touched
      const allTouched = Object.keys(config).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as FormTouched<T>);
      setTouched(allTouched);

      // Validate
      const isValid = validateForm();

      if (isValid) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [config, values, validateForm]
  );

  /**
   * Check if form is valid
   */
  const isValid = Object.keys(errors).length === 0;

  /**
   * Check if form has been modified
   */
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    handleSubmit,
    validateForm,
  };
};

export default useForm;
