# useFormSchema

A powerful, TypeScript-first React hook for form with schema support. Built for modern React applications with built-in accessibility, async validation, and seamless integration with popular schema validation libraries.

## Features

- 📝 **TypeScript-first** with full type safety
- 🎯 **Schema validation** support (Zod, Yup)
- ⚡ **Async validation** with debouncing
- ♿ **Accessibility** built-in (ARIA attributes)
- 🎨 **Flexible API** - use with any UI library
- 🔄 **Real-time validation** on change/blur
- 🎪 **Advanced features** - field props, error props, form state management

## Installation

```bash
pnpm install use-form-schema-hook

# Peer dependencies
pnpm install react zod # or yup
```

## Quick Start

### With Zod

Example: [ Zod Demo File ](https://github.com/saran13raj/use-form-schema/blob/main/packages/demo/src/examples/zod-demo.tsx)

```typescript
import { z } from 'zod';
import { useFormSchema } from 'use-form-schema-hook';

const userSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

type UserFormData = z.infer<typeof userSchema>;

function MyForm() {
  const form = useFormSchema<UserFormData>({
    schema: userSchema,
    initialValues: {
      email: '',
      password: '',
      name: ''
    },
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
      // Handle form submission
    },
	resetOnSubmit: true,
	debounceMs: 2000 // debounces validation logic to 2000 ms
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <input
          {...form.getFieldProps('email')}
          type="email"
          placeholder="Email"
        />
        {form.errors.email && form.touched.email && (
          <div {...form.getErrorProps('email')}>
            {form.errors.email}
          </div>
        )}
      </div>

      <div>
        <input
          {...form.getFieldProps('password')}
          type="password"
          placeholder="Password"
        />
        {form.errors.password && form.touched.password && (
          <div {...form.getErrorProps('password')}>
            {form.errors.password}
          </div>
        )}
      </div>

      <div>
        <input
          {...form.getFieldProps('name')}
          type="text"
          placeholder="Name"
        />
        {form.errors.name && form.touched.name && (
          <div {...form.getErrorProps('name')}>
            {form.errors.name}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting || !form.isValid}
      >
        {form.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### With Yup

Example: [ Yup Demo File ](https://github.com/saran13raj/use-form-schema/blob/main/packages/demo/src/examples/yup-demo.tsx)

```typescript
import * as yup from 'yup';
import { useFormSchema } from 'use-form-schema-hook';

const userSchema = yup.object({
	email: yup.string().email('Please enter a valid email address').required(),
	password: yup
		.string()
		.min(8, 'Password must be at least 8 characters')
		.required(),
	name: yup.string().min(2, 'Name must be at least 2 characters').required()
});

type UserFormData = yup.InferType<typeof userSchema>;

// Usage is identical to Zod example
```

## API Reference

### useFormSchema(options)

#### Options

| Property             | Type                                   | Default  | Description                            |
| -------------------- | -------------------------------------- | -------- | -------------------------------------- |
| `schema`             | `ZodSchema \| YupSchema`               | Required | Validation schema (Zod or Yup)         |
| `initialValues`      | `T`                                    | Required | Initial form values                    |
| `onSubmit`           | `(values: T) => Promise<void> \| void` | Required | Form submission handler                |
| `validateOnChange`   | `boolean`                              | `true`   | Validate on field change               |
| `validateOnBlur`     | `boolean`                              | `true`   | Validate on field blur                 |
| `resetOnSubmit`      | `boolean`                              | `false`  | Reset form after successful submission |
| `debounceMs`         | `number`                               | `300`    | Debounce delay for validation (ms)     |
| `enableReinitialize` | `boolean`                              | `false`  | Reinitialize when initialValues change |

#### Return Value

| Property             | Type                                                 | Description                       |
| -------------------- | ---------------------------------------------------- | --------------------------------- |
| `values`             | `T`                                                  | Current form values               |
| `errors`             | `Partial<Record<keyof T, string>>`                   | Form validation errors            |
| `touched`            | `Partial<Record<keyof T, boolean>>`                  | Fields that have been touched     |
| `isSubmitting`       | `boolean`                                            | Form submission state             |
| `isValidating`       | `boolean`                                            | Form validation state             |
| `isDirty`            | `boolean`                                            | Form has been modified            |
| `isValid`            | `boolean`                                            | Form is valid                     |
| `submitAttemptCount` | `number`                                             | Number of submission attempts     |
| `handleChange`       | `(field: keyof T) => (event) => void`                | Field change handler              |
| `handleBlur`         | `(field: keyof T) => (event) => void`                | Field blur handler                |
| `setValue`           | `(field: keyof T, value: any) => void`               | Set single field value            |
| `setValues`          | `(values: Partial<T>) => void`                       | Set multiple field values         |
| `setError`           | `(field: keyof T, error: string) => void`            | Set single field error            |
| `setErrors`          | `(errors: Partial<Record<keyof T, string>>) => void` | Set multiple field errors         |
| `setTouched`         | `(field: keyof T, touched?: boolean) => void`        | Set field touched state           |
| `resetForm`          | `(values?: T) => void`                               | Reset form to initial state       |
| `handleSubmit`       | `(event?: React.FormEvent) => Promise<void>`         | Form submission handler           |
| `validate`           | `(values?: T) => Promise<boolean>`                   | Manual validation trigger         |
| `getFieldProps`      | `(field: keyof T) => FieldProps`                     | Get field props for input         |
| `getErrorProps`      | `(field: keyof T) => ErrorProps`                     | Get error props for accessibility |

## Advanced Examples

### Complex Validation with Cross-Field Dependencies

```typescript
const registrationSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

function RegistrationForm() {
  const form = useFormSchema<RegistrationFormData>({
    schema: registrationSchema,
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      acceptTerms: false
    },
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Welcome, ${values.firstName} ${values.lastName}!`);
    },
    resetOnSubmit: true
  });

  return (
    <form onSubmit={form.handleSubmit}>
      {/* Email field */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...form.getFieldProps('email')}
        />
        {form.errors.email && form.touched.email && (
          <div {...form.getErrorProps('email')}>
            {form.errors.email}
          </div>
        )}
      </div>

      {/* Password field */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...form.getFieldProps('password')}
        />
        {form.errors.password && form.touched.password && (
          <div {...form.getErrorProps('password')}>
            {form.errors.password}
          </div>
        )}
      </div>

      {/* Confirm Password field */}
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...form.getFieldProps('confirmPassword')}
        />
        {form.errors.confirmPassword && form.touched.confirmPassword && (
          <div {...form.getErrorProps('confirmPassword')}>
            {form.errors.confirmPassword}
          </div>
        )}
      </div>

      {/* First Name field */}
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          {...form.getFieldProps('firstName')}
        />
        {form.errors.firstName && form.touched.firstName && (
          <div {...form.getErrorProps('firstName')}>
            {form.errors.firstName}
          </div>
        )}
      </div>

      {/* Last Name field */}
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          {...form.getFieldProps('lastName')}
        />
        {form.errors.lastName && form.touched.lastName && (
          <div {...form.getErrorProps('lastName')}>
            {form.errors.lastName}
          </div>
        )}
      </div>

      {/* Accept Terms checkbox */}
      <div>
        <label>
          <input
            type="checkbox"
            {...form.getFieldProps('acceptTerms')}
            checked={form.values.acceptTerms}
          />
          I accept the terms and conditions
        </label>
        {form.errors.acceptTerms && form.touched.acceptTerms && (
          <div {...form.getErrorProps('acceptTerms')}>
            {form.errors.acceptTerms}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting || !form.isValid}
      >
        {form.isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>

      {/* Form state display */}
      <div>
        <p>Form Valid: {form.isValid ? '✅' : '❌'}</p>
        <p>Form Dirty: {form.isDirty ? '✅' : '❌'}</p>
        <p>Submit Count: {form.submitAttemptCount}</p>
      </div>
    </form>
  );
}
```

### Manual Field Control

```typescript
function ManualControlForm() {
  const form = useFormSchema<UserFormData>({
    schema: userSchema,
    initialValues: { email: '', password: '', name: '' },
    onSubmit: async (values) => {
      console.log(values);
    }
  });

  const handleCustomChange = (field: keyof UserFormData, value: any) => {
    form.setValue(field, value);

    // Trigger validation manually if needed
    form.validate();
  };

  const handleReset = () => {
    form.resetForm({
      email: 'new@example.com',
      password: '',
      name: 'New Name'
    });
  };

  return (
		<div
			style={{
				display: 'flex',
				width: '100%',
				flexDirection: 'column',
				gap: 13,
				maxWidth: '40rem'
			}}
		>
			<input
				style={{ border: '1px solid aqua' }}
				value={form.values.email}
				onChange={(e) => handleCustomChange('email', e.target.value)}
				onBlur={form.handleBlur('email')}
			/>

			<button
				style={{ border: '1px solid blue' }}
				onClick={() => form.setError('email', 'Custom error')}
			>
				Set Custom Error
			</button>

			<button style={{ border: '1px solid blue' }} onClick={handleReset}>
				Reset with New Values
			</button>

			<button
				style={{ border: '1px solid blue' }}
				onClick={() => form.validate()}
			>
				Validate Manually
			</button>
			<div>
				Errors:{' '}
				<span>
					{JSON.stringify(form.errors, null, 2)}
				</span>
			</div>
		</div>
  );
}
```

### With Different Input Types

```typescript
function MultiInputForm() {
  const schema = z.object({
    text: z.string().min(1, 'Required'),
    email: z.string().email('Invalid email'),
    number: z.number().min(0, 'Must be positive'),
    select: z.string().min(1, 'Please select an option'),
    textarea: z.string().min(10, 'Must be at least 10 characters'),
    checkbox: z.boolean().refine(val => val, 'Must be checked'),
    radio: z.enum(['option1', 'option2'], {
      errorMap: () => ({ message: 'Please select an option' })
    })
  });

  const form = useFormSchema({
    schema,
    initialValues: {
      text: '',
      email: '',
      number: 0,
      select: '',
      textarea: '',
      checkbox: false,
      radio: '' as any
    },
    onSubmit: async (values) => console.log(values)
  });

  return (
    <form onSubmit={form.handleSubmit}>
      {/* Text input */}
      <input type="text" {...form.getFieldProps('text')} />

      {/* Email input */}
      <input type="email" {...form.getFieldProps('email')} />

      {/* Number input */}
      <input
        type="number"
        {...form.getFieldProps('number')}
        onChange={(e) => form.setValue('number', parseInt(e.target.value) || 0)}
      />

      {/* Select */}
      <select {...form.getFieldProps('select')}>
        <option value="">Choose...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>

      {/* Textarea */}
      <textarea {...form.getFieldProps('textarea')} />

      {/* Checkbox */}
      <input
        type="checkbox"
        {...form.getFieldProps('checkbox')}
        checked={form.values.checkbox}
      />

      {/* Radio buttons */}
      <input
        type="radio"
        name="radio"
        value="option1"
        checked={form.values.radio === 'option1'}
        onChange={() => form.setValue('radio', 'option1')}
      />
      <input
        type="radio"
        name="radio"
        value="option2"
        checked={form.values.radio === 'option2'}
        onChange={() => form.setValue('radio', 'option2')}
      />

      <button type="submit">Submit</button>

	  <div>
		Errors: <span>{JSON.stringify(form.errors, null, 2)}</span>
	  </div>
    </form>
  );
}
```

## Integration with UI Libraries

### With Material-UI

```typescript
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';

function MaterialUIForm() {
  const form = useFormSchema({
    schema: userSchema,
    initialValues: { email: '', password: '', acceptTerms: false },
    onSubmit: async (values) => console.log(values)
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <TextField
        label="Email"
        type="email"
        value={form.values.email}
        onChange={(e) => form.setValue('email', e.target.value)}
        onBlur={form.handleBlur('email')}
        error={!!(form.errors.email && form.touched.email)}
        helperText={form.touched.email && form.errors.email}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Password"
        type="password"
        value={form.values.password}
        onChange={(e) => form.setValue('password', e.target.value)}
        onBlur={form.handleBlur('password')}
        error={!!(form.errors.password && form.touched.password)}
        helperText={form.touched.password && form.errors.password}
        fullWidth
        margin="normal"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={form.values.acceptTerms}
            onChange={(e) => form.setValue('acceptTerms', e.target.checked)}
          />
        }
        label="Accept Terms"
      />

      <Button
        type="submit"
        variant="contained"
        disabled={form.isSubmitting || !form.isValid}
        fullWidth
      >
        Submit
      </Button>
    </form>
  );
}
```

## Best Practices

### 1. Type Safety

Always use TypeScript and infer types from your schema:

```typescript
const schema = z.object({
	email: z.string().email(),
	age: z.number().min(18)
});

type FormData = z.infer<typeof schema>; // ✅ Type-safe

const form = useFormSchema<FormData>({
	// ✅ Fully typed
	schema,
	initialValues: { email: '', age: 0 },
	onSubmit: async (values) => {
		// values is fully typed as FormData
	}
});
```

### 2. Error Handling

Always handle errors gracefully:

```typescript
const form = useFormSchema({
	// ... config
	onSubmit: async (values) => {
		try {
			await submitToAPI(values);
		} catch (error) {
			// Handle API errors
			if (error.field) {
				form.setError(error.field, error.message);
			} else {
				// Handle general errors
				alert('Submission failed. Please try again.');
			}
		}
	}
});
```

### 3. Performance Optimization

Use debouncing for expensive validations:

```typescript
const form = useFormSchema({
	schema: expensiveSchema,
	debounceMs: 500, // Delay validation by 500ms
	validateOnChange: true
	// ... other config
});
```

### 4. Accessibility

Always use the provided accessibility props:

```typescript
<input {...form.getFieldProps('email')} />
{form.errors.email && form.touched.email && (
  <div {...form.getErrorProps('email')}>
    {form.errors.email}
  </div>
)}
```

## Contributing

Contributions are welcome! Please submit pull requests to our GitHub repository.

## License

ISC

## Support

- 📧 Email: saran13work@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/saran13raj/use-form-schema/issues)

---

Made with ❤️ for the React community
