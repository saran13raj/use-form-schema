import { useReducer, useEffect, useCallback, useRef } from 'react';

type FormState<T = any> = {
	values: T;
	errors: Partial<Record<keyof T, string>>;
	touched: Partial<Record<keyof T, boolean>>;
	isSubmitting: boolean;
	isValidating: boolean;
	isDirty: boolean;
	isValid: boolean;
	submitAttemptCount: number;
};

type FormAction<T = any> = {
	type:
		| 'SET_VALUE'
		| 'SET_VALUES'
		| 'SET_ERROR'
		| 'SET_ERRORS'
		| 'SET_TOUCHED'
		| 'SET_SUBMITTING'
		| 'SET_VALIDATING'
		| 'RESET'
		| 'SUBMIT_ATTEMPT';
	payload?: any;
	field?: keyof T;
};

export type UseFormSchemaOptions<T = any> = {
	schema:
		| { parseAsync: (values: T) => void }
		| { validate: (value: T, options?: Record<string, any>) => Promise<T> };
	initialValues: T;
	onSubmit: (values: T) => Promise<void> | void;
	validateOnChange?: boolean;
	validateOnBlur?: boolean;
	resetOnSubmit?: boolean;
	debounceMs?: number;
	enableReinitialize?: boolean;
};

type AsyncValidator<T = any> = {
	field: keyof T;
	validator: (value: any, values: T) => Promise<string | null>;
	debounceMs?: number;
};

export type UseFormSchemaReturn<T = any> = {
	values: T;
	errors: Partial<Record<keyof T, string>>;
	touched: Partial<Record<keyof T, boolean>>;
	isSubmitting: boolean;
	isValidating: boolean;
	isDirty: boolean;
	isValid: boolean;
	submitAttemptCount: number;
	handleChange: (
		field: keyof T
	) => (
		event: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => void;
	handleBlur: (field: keyof T) => (event: React.FocusEvent) => void;
	setValue: (field: keyof T, value: any) => void;
	setValues: (values: Partial<T>) => void;
	setError: (field: keyof T, error: string) => void;
	setErrors: (errors: Partial<Record<keyof T, string>>) => void;
	setTouched: (field: keyof T, touched?: boolean) => void;
	resetForm: (values?: T) => void;
	handleSubmit: (event?: React.FormEvent) => Promise<void>;
	validate: (values?: T) => Promise<boolean>;
	getFieldProps: (field: keyof T) => {
		name: string;
		value: any;
		onChange: (
			event: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>
		) => void;
		onBlur: (event: React.FocusEvent) => void;
		'aria-invalid': boolean;
		'aria-describedby': string;
	};
	getErrorProps: (field: keyof T) => {
		id: string;
		role: 'alert';
		'aria-live': 'polite';
	};
};

function detectSchemaType(schema: any): 'unknown' | 'zod' | 'yup' {
	if (!schema || typeof schema !== 'object') return 'unknown';

	// Detect Zod
	// Zod schemas have a property: "_def" (almost always present).
	// Zod schemas have a name: ZodEffects on the constructor.
	// Zod schemas have a method: .safeParse().
	if (typeof schema.safeParse === 'function' && schema._def !== undefined) {
		return 'zod';
	}

	// Detect Yup
	// Yup schemas have a property: __isYupSchema__ set to true.
	// Yup schemas have a method: .validate().
	if (schema.__isYupSchema__ === true && typeof schema.validate === 'function') {
		return 'yup';
	}

	return 'unknown';
}

// Form reducer
function formReducer<T>(
	state: FormState<T>,
	action: FormAction<T>
): FormState<T> {
	switch (action.type) {
		case 'SET_VALUE':
			return {
				...state,
				values: {
					...state.values,
					[action.field!]: action.payload
				},
				isDirty: true
			};

		case 'SET_VALUES':
			return {
				...state,
				values: { ...state.values, ...action.payload },
				isDirty: true
			};

		case 'SET_ERROR':
			return {
				...state,
				errors: {
					...state.errors,
					[action.field!]: action.payload
				},
				isValid: false
			};

		case 'SET_ERRORS':
			return {
				...state,
				errors: action.payload,
				isValid: Object.keys(action.payload || {}).length === 0
			};

		case 'SET_TOUCHED':
			return {
				...state,
				touched: {
					...state.touched,
					[action.field!]: action.payload ?? true
				}
			};

		case 'SET_SUBMITTING':
			return {
				...state,
				isSubmitting: action.payload,
				isValid: action.payload
			};

		case 'SET_VALIDATING':
			return {
				...state,
				isValidating: action.payload
			};

		case 'SUBMIT_ATTEMPT':
			return {
				...state,
				submitAttemptCount: state.submitAttemptCount + 1
			};

		case 'RESET':
			return {
				values: action.payload || state.values,
				errors: {},
				touched: {},
				isSubmitting: false,
				isValidating: false,
				isDirty: false,
				isValid: true,
				submitAttemptCount: 0
			};

		default:
			return state;
	}
}

// Debounce utility
function useDebounce<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
): T {
	const timeoutRef = useRef<number>(null);

	return useCallback(
		((...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => callback(...args), delay);
		}) as T,
		[callback, delay]
	);
}

// Main hook
export function useFormSchema<T extends Record<string, any>>({
	schema,
	initialValues,
	onSubmit,
	validateOnChange = true,
	validateOnBlur = true,
	resetOnSubmit = false,
	debounceMs = 300,
	enableReinitialize = false
}: UseFormSchemaOptions<T>): UseFormSchemaReturn<T> {
	const [state, dispatch] = useReducer(formReducer<T>, {
		values: initialValues,
		errors: {},
		touched: {},
		isSubmitting: false,
		isValidating: false,
		isDirty: false,
		isValid: false,
		submitAttemptCount: 0
	});

	const asyncValidators = useRef<AsyncValidator<T>[]>([]);
	const validationTimeouts = useRef<Map<keyof T, number>>(new Map());
	const schemaType = useRef(detectSchemaType(schema));

	// Validation function
	const validate = useCallback(
		async (values: T = state.values): Promise<boolean> => {
			try {
				dispatch({ type: 'SET_VALIDATING', payload: true });

				// Auto-detect and handle schema validation
				if (schemaType.current === 'zod') {
					// Zod validation
					await (schema as any).parseAsync(values);
				} else if (schemaType.current === 'yup') {
					// Yup validation
					await (schema as any).validate(values, { abortEarly: false });
				} else {
					throw new Error('Unsupported schema type. Please use Zod or Yup schema.');
				}

				// Clear schema validation errors
				dispatch({ type: 'SET_ERRORS', payload: {} });

				// Run async validators
				const asyncErrors: Partial<Record<keyof T, string>> = {};
				for (const asyncValidator of asyncValidators.current) {
					try {
						const error = await asyncValidator.validator(
							values[asyncValidator.field],
							values
						);
						if (error) {
							asyncErrors[asyncValidator.field] = error;
						}
					} catch (err) {
						asyncErrors[asyncValidator.field] = 'Validation error occurred';
					}
				}

				if (Object.keys(asyncErrors).length > 0) {
					dispatch({ type: 'SET_ERRORS', payload: asyncErrors });
					return false;
				}

				return true;
			} catch (error) {
				// Handle Zod errors
				if (schemaType.current === 'zod') {
					const errors: Partial<Record<keyof T, string>> = {};
					error.errors.forEach((err: any) => {
						const path = err.path[0] as keyof T;
						if (path) {
							errors[path] = err.message;
						}
					});
					dispatch({ type: 'SET_ERRORS', payload: errors });
				}
				// Handle Yup errors
				else if (error && typeof error === 'object' && 'inner' in error) {
					const errors: Partial<Record<keyof T, string>> = {};
					(error as any).inner?.forEach((err: any) => {
						if (err.path) {
							errors[err.path as keyof T] = err.message;
						}
					});
					dispatch({ type: 'SET_ERRORS', payload: errors });
				}
				// Handle single Yup error
				else if (
					error &&
					typeof error === 'object' &&
					'path' in error &&
					'message' in error
				) {
					const errors: Partial<Record<keyof T, string>> = {};
					if ((error as any).path) {
						errors[(error as any).path as keyof T] = (error as any).message;
					}
					dispatch({ type: 'SET_ERRORS', payload: errors });
				}
				return false;
			} finally {
				dispatch({ type: 'SET_VALIDATING', payload: false });
			}
		},
		[schema, state.values]
	);

	// Debounced validation
	const debouncedValidate = useDebounce(validate, debounceMs);

	// Field change handler
	const handleChange = useCallback(
		(field: keyof T) =>
			(
				event: React.ChangeEvent<
					HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
				>
			) => {
				const value =
					event.target.type === 'checkbox'
						? (event.target as HTMLInputElement).checked
						: event.target.value;

				dispatch({ type: 'SET_VALUE', field, payload: value });

				if (validateOnChange) {
					debouncedValidate();
				}
			},
		[validateOnChange, debouncedValidate]
	);

	// Field blur handler
	const handleBlur = useCallback(
		(field: keyof T) => (event: React.FocusEvent) => {
			event.preventDefault();
			dispatch({ type: 'SET_TOUCHED', field, payload: true });

			if (validateOnBlur) {
				validate();
			}
		},
		[validateOnBlur, validate]
	);

	// Set single value
	const setValue = useCallback((field: keyof T, value: any) => {
		dispatch({ type: 'SET_VALUE', field, payload: value });
	}, []);

	// Set multiple values
	const setValues = useCallback((values: Partial<T>) => {
		dispatch({ type: 'SET_VALUES', payload: values });
	}, []);

	// Set single error
	const setError = useCallback((field: keyof T, error: string) => {
		dispatch({ type: 'SET_ERROR', field, payload: error });
	}, []);

	// Set multiple errors
	const setErrors = useCallback((errors: Partial<Record<keyof T, string>>) => {
		dispatch({ type: 'SET_ERRORS', payload: errors });
	}, []);

	// Set touched state
	const setTouched = useCallback((field: keyof T, touched: boolean = true) => {
		dispatch({ type: 'SET_TOUCHED', field, payload: touched });
	}, []);

	// Reset form
	const resetForm = useCallback(
		(values?: T) => {
			dispatch({ type: 'RESET', payload: values || initialValues });
		},
		[initialValues]
	);

	// Submit handler
	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			if (event) {
				event.preventDefault();
			}

			dispatch({ type: 'SUBMIT_ATTEMPT' });

			// Mark all fields as touched
			// const touchedFields: Partial<Record<keyof T, boolean>> = {};
			// Object.keys(state.values).forEach((key) => {
			// 	touchedFields[key as keyof T] = true;
			// });

			// dispatch({ type: 'SET_TOUCHED', payload: touchedFields });

			const isValid = await validate();

			if (isValid) {
				try {
					dispatch({ type: 'SET_SUBMITTING', payload: true });
					await onSubmit(state.values);

					if (resetOnSubmit) {
						resetForm();
					}
				} catch (error) {
					console.error('Form submission error:', error);
				} finally {
					dispatch({ type: 'SET_SUBMITTING', payload: false });
				}
			}
		},
		[state.values, validate, onSubmit]
	);

	// Get field props for easy integration
	const getFieldProps = useCallback(
		(field: keyof T) => ({
			name: String(field),
			value: state.values[field] || '',
			onChange: handleChange(field),
			onBlur: handleBlur(field),
			'aria-invalid': !!state.errors[field],
			'aria-describedby': `${String(field)}-error`
		}),
		[state.values, state.errors, handleChange, handleBlur]
	);

	// Get error props for accessibility
	const getErrorProps = useCallback(
		(field: keyof T) => ({
			id: `${String(field)}-error`,
			role: 'alert' as const,
			'aria-live': 'polite' as const
		}),
		[]
	);

	// Effect for reinitializing form when initialValues change
	useEffect(() => {
		if (enableReinitialize) {
			dispatch({ type: 'RESET', payload: initialValues });
		}
	}, [initialValues, enableReinitialize]);

	// Cleanup timeouts on unmount
	useEffect(() => {
		return () => {
			validationTimeouts.current.forEach((timeout) => {
				clearTimeout(timeout);
			});
		};
	}, []);

	return {
		values: state.values,
		errors: state.errors,
		touched: state.touched,
		isSubmitting: state.isSubmitting,
		isValidating: state.isValidating,
		isDirty: state.isDirty,
		isValid: state.isValid,
		submitAttemptCount: state.submitAttemptCount,
		handleChange,
		handleBlur,
		setValue,
		setValues,
		setError,
		setErrors,
		setTouched,
		resetForm,
		handleSubmit,
		validate,
		getFieldProps,
		getErrorProps
	};
}
