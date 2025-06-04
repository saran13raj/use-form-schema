import { useState } from 'react';
import * as yup from 'yup';

import { useFormSchema } from 'use-form-schema-hook';

// Example 1: Basic User Registration Form
export const BasicFormYupExample = () => {
	const userSchema = yup
		.object({
			email: yup.string().email('Please enter a valid email address').required(),
			password: yup
				.string()
				.min(8, 'Password must be at least 8 characters')
				.required(),
			confirmPassword: yup.string().required(),
			firstName: yup
				.string()
				.min(2, 'First name must be at least 2 characters')
				.required(),
			lastName: yup
				.string()
				.min(2, 'Last name must be at least 2 characters')
				.required(),
			acceptTerms: yup
				.boolean()
				.test('is-true', 'You must accept the terms', (val) => val === true)
		})
		.test('passwords-match', "Passwords don't match", function (values) {
			if (values.password !== values.confirmPassword) {
				return this.createError({
					path: 'confirmPassword',
					message: "Passwords don't match"
				});
			}
			return true;
		});

	type UserFormData = yup.InferType<typeof userSchema>;

	const form = useFormSchema<UserFormData>({
		schema: userSchema,
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
		}
	});

	return (
		<div className='mx-auto max-w-md rounded-lg bg-zinc-900 p-6 shadow-lg'>
			<h2 className='mb-6 text-2xl font-bold text-zinc-100'>Create Account</h2>
			<form onSubmit={form.handleSubmit} className='space-y-4'>
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='firstName'
							className='mb-1 block text-sm font-medium text-zinc-400'
						>
							First Name
						</label>
						<input
							{...form.getFieldProps('firstName')}
							type='text'
							id='firstName'
							className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
								form.errors.firstName && form.touched.firstName
									? 'border-red-500'
									: 'border-zinc-300'
							}`}
						/>
						{form.errors.firstName && form.touched.firstName && (
							<div
								{...form.getErrorProps('firstName')}
								className='mt-1 text-sm text-red-500'
							>
								{form.errors.firstName}
							</div>
						)}
					</div>
					<div>
						<label
							htmlFor='lastName'
							className='mb-1 block text-sm font-medium text-zinc-400'
						>
							Last Name
						</label>
						<input
							{...form.getFieldProps('lastName')}
							type='text'
							id='lastName'
							className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
								form.errors.lastName && form.touched.lastName
									? 'border-red-500'
									: 'border-zinc-300'
							}`}
						/>
						{form.errors.lastName && form.touched.lastName && (
							<div
								{...form.getErrorProps('lastName')}
								className='mt-1 text-sm text-red-500'
							>
								{form.errors.lastName}
							</div>
						)}
					</div>
				</div>

				<div>
					<label
						htmlFor='email'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						Email
					</label>
					<input
						{...form.getFieldProps('email')}
						type='email'
						id='email'
						className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
							form.errors.email && form.touched.email
								? 'border-red-500'
								: 'border-zinc-300'
						}`}
					/>
					{form.errors.email && form.touched.email && (
						<div
							{...form.getErrorProps('email')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.email}
						</div>
					)}
				</div>

				<div>
					<label
						htmlFor='password'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						Password
					</label>
					<input
						{...form.getFieldProps('password')}
						type='password'
						id='password'
						className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
							form.errors.password && form.touched.password
								? 'border-red-500'
								: 'border-zinc-300'
						}`}
					/>
					{form.errors.password && form.touched.password && (
						<div
							{...form.getErrorProps('password')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.password}
						</div>
					)}
				</div>

				<div>
					<label
						htmlFor='confirmPassword'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						Confirm Password
					</label>
					<input
						{...form.getFieldProps('confirmPassword')}
						type='password'
						id='confirmPassword'
						className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
							form.errors.confirmPassword && form.touched.confirmPassword
								? 'border-red-500'
								: 'border-zinc-300'
						}`}
					/>
					{form.errors.confirmPassword && form.touched.confirmPassword && (
						<div
							{...form.getErrorProps('confirmPassword')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.confirmPassword}
						</div>
					)}
				</div>

				<div className='flex items-center'>
					<input
						type='checkbox'
						id='acceptTerms'
						checked={form.values.acceptTerms}
						onChange={form.handleChange('acceptTerms')}
						onBlur={form.handleBlur('acceptTerms')}
						className='h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500'
					/>
					<label htmlFor='acceptTerms' className='ml-2 block text-sm text-zinc-400'>
						I accept the Terms and Conditions
					</label>
				</div>
				{form.errors.acceptTerms && form.touched.acceptTerms && (
					<div
						{...form.getErrorProps('acceptTerms')}
						className='text-sm text-red-500'
					>
						{form.errors.acceptTerms}
					</div>
				)}

				<button
					type='submit'
					disabled={form.isSubmitting}
					className='w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
				>
					{form.isSubmitting ? 'Creating Account...' : 'Create Account'}
				</button>
			</form>

			{/* Form State Debug */}
			<div className='mt-6 rounded-md bg-zinc-100 p-4'>
				<h3 className='mb-2 text-sm font-medium text-zinc-900'>Form State:</h3>
				<div className='text-xs text-zinc-900'>
					<div>Valid: {form.isValid ? '✅' : '❌'}</div>
					<div>Dirty: {form.isDirty ? '✅' : '❌'}</div>
					<div>
						Touched:{' '}
						<span className='font-semibold'>
							[ {Object.keys(form.touched).join(', ')} ]
						</span>
					</div>
					<div>Submitting: {form.isSubmitting ? '✅' : '❌'}</div>
					<div>Submit Attempt Count: {form.submitAttemptCount}</div>
					<div>
						Errors:{' '}
						<span className='font-semibold'>
							{JSON.stringify(form.errors, null, 2)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

// Example 2: Dynamic Form with Field Arrays
export const DynamicFormYupExample = () => {
	const skillSchema = yup.object({
		name: yup.string().min(1, 'Skill name is required').required(),
		level: yup
			.string()
			.oneOf(['Beginner', 'Intermediate', 'Advanced'])
			.required(),
		yearsExperience: yup.number().min(0, 'Years must be 0 or greater').required()
	});

	const profileSchema = yup.object({
		fullName: yup
			.string()
			.min(2, 'Full name must be at least 2 characters')
			.required(),
		jobTitle: yup.string().min(2, 'Job title is required').required(),
		bio: yup.string().max(500, 'Bio must be less than 500 characters').required(),
		skills: yup
			.array()
			.of(skillSchema)
			.min(1, 'At least one skill is required')
			.required()
	});

	type ProfileFormData = yup.InferType<typeof profileSchema>;

	const form = useFormSchema<ProfileFormData>({
		schema: profileSchema,
		initialValues: {
			fullName: '',
			jobTitle: '',
			bio: '',
			skills: [{ name: '', level: 'Beginner' as const, yearsExperience: 0 }]
		},
		onSubmit: async (values) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert(
				`Profile saved for ${values.fullName}! Skills: ${values.skills
					.map((s) => s.name)
					.join(', ')}`
			);
		}
	});

	const addSkill = () => {
		const newSkills = [
			...form.values.skills,
			{ name: '', level: 'Beginner' as const, yearsExperience: 0 }
		];
		form.handleChange('skills')({ target: { value: newSkills } } as any);
	};

	const removeSkill = (index: number) => {
		const newSkills = form.values.skills.filter((_, i) => i !== index);
		form.handleChange('skills')({ target: { value: newSkills } } as any);
	};

	const updateSkill = (
		index: number,
		field: keyof yup.InferType<typeof skillSchema>,
		value: any
	) => {
		const newSkills = [...form.values.skills];
		newSkills[index] = { ...newSkills[index], [field]: value };
		form.handleChange('skills')({ target: { value: newSkills } } as any);
	};

	return (
		<div className='mx-auto max-w-2xl rounded-lg bg-zinc-900 p-6 shadow-lg'>
			<h2 className='mb-6 text-2xl font-bold text-zinc-100'>
				Professional Profile
			</h2>
			<form onSubmit={form.handleSubmit} className='space-y-6'>
				<div>
					<label
						htmlFor='fullName'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						Full Name
					</label>
					<input
						{...form.getFieldProps('fullName')}
						type='text'
						id='fullName'
						className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
							form.errors.fullName ? 'border-red-500' : 'border-zinc-300'
						}`}
					/>
					{form.errors.fullName && (
						<div
							{...form.getErrorProps('fullName')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.fullName}
						</div>
					)}
				</div>

				<div>
					<label
						htmlFor='jobTitle'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						Job Title
					</label>
					<input
						{...form.getFieldProps('jobTitle')}
						type='text'
						id='jobTitle'
						className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
							form.errors.jobTitle ? 'border-red-500' : 'border-zinc-300'
						}`}
					/>
					{form.errors.jobTitle && (
						<div
							{...form.getErrorProps('jobTitle')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.jobTitle}
						</div>
					)}
				</div>

				<div>
					<label
						htmlFor='bio'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						Bio
					</label>
					<textarea
						{...form.getFieldProps('bio')}
						id='bio'
						rows={4}
						className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
							form.errors.bio && form.touched.bio
								? 'border-red-500'
								: 'border-zinc-300'
						}`}
						placeholder='Tell us about yourself...'
					/>
					<div className='mt-1 text-sm text-zinc-500'>
						{form.values.bio?.length || 0}/500 characters
					</div>
					{form.errors.bio && form.touched.bio && (
						<div {...form.getErrorProps('bio')} className='mt-1 text-sm text-red-500'>
							{form.errors.bio}
						</div>
					)}
				</div>

				<div>
					<div className='mb-4 flex items-center justify-between'>
						<label className='block text-sm font-medium text-zinc-400'>Skills</label>
						<button
							type='button'
							onClick={addSkill}
							className='rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none'
						>
							+ Add Skill
						</button>
					</div>

					{form.values.skills.map((skill, index) => (
						<div key={index} className='mb-4 rounded-md border border-zinc-200 p-4'>
							<div className='mb-3 flex items-start justify-between'>
								<h4 className='text-sm font-medium text-zinc-400'>
									Skill #{index + 1}
								</h4>
								{form.values.skills.length > 1 && (
									<button
										type='button'
										onClick={() => removeSkill(index)}
										className='text-sm text-red-600 hover:text-red-800'
									>
										X
									</button>
								)}
							</div>

							<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
								<div>
									<label className='mb-1 block text-sm font-medium text-zinc-400'>
										Skill Name
									</label>
									<input
										type='text'
										value={skill.name}
										onChange={(e) => updateSkill(index, 'name', e.target.value)}
										className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
										placeholder='e.g., JavaScript'
									/>
								</div>

								<div>
									<label className='mb-1 block text-sm font-medium text-zinc-400'>
										Level
									</label>
									<select
										value={skill.level}
										onChange={(e) => updateSkill(index, 'level', e.target.value)}
										className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
									>
										<option value='Beginner'>Beginner</option>
										<option value='Intermediate'>Intermediate</option>
										<option value='Advanced'>Advanced</option>
									</select>
								</div>

								<div>
									<label className='mb-1 block text-sm font-medium text-zinc-400'>
										Years Experience
									</label>
									<input
										type='number'
										min='0'
										value={skill.yearsExperience}
										onChange={(e) =>
											updateSkill(index, 'yearsExperience', parseInt(e.target.value) || 0)
										}
										className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
									/>
								</div>
							</div>
						</div>
					))}

					{form.errors.skills && (
						<div className='mt-1 text-sm text-red-500'>{form.errors.skills}</div>
					)}
				</div>

				<button
					type='submit'
					disabled={form.isSubmitting}
					className='w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
				>
					{form.isSubmitting ? 'Saving Profile...' : 'Save Profile'}
				</button>

				{/* Form State Debug */}
				<div className='mt-6 rounded-md bg-zinc-100 p-4'>
					<h3 className='mb-2 text-sm font-medium text-zinc-900'>Form State:</h3>
					<div className='text-xs text-zinc-900'>
						<div>Valid: {form.isValid ? '✅' : '❌'}</div>
						<div>Dirty: {form.isDirty ? '✅' : '❌'}</div>
						<div>
							Touched:{' '}
							<span className='font-semibold'>
								[ {Object.keys(form.touched).join(', ')} ]
							</span>
						</div>
						<div>Submitting: {form.isSubmitting ? '✅' : '❌'}</div>
						<div>Submit Attempt Count: {form.submitAttemptCount}</div>
						<div>
							Errors:{' '}
							<span className='font-semibold'>
								{JSON.stringify(form.errors, null, 2)}
							</span>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export const MultiStepFormYupExample = () => {
	const [currentStep, setCurrentStep] = useState(0);

	const personalInfoSchema = yup.object({
		firstName: yup
			.string()
			.min(2, 'First name must be at least 2 characters')
			.required(),
		lastName: yup
			.string()
			.min(2, 'Last name must be at least 2 characters')
			.required(),
		email: yup.string().email('Please enter a valid email address').required(),
		phone: yup
			.string()
			.min(10, 'Phone number must be at least 10 digits')
			.required()
	});

	const addressSchema = yup.object({
		street: yup.string().min(5, 'Street address is required').required(),
		city: yup.string().min(2, 'City is required').required(),
		state: yup.string().min(2, 'State is required').required(),
		zipCode: yup
			.string()
			.min(5, 'ZIP code must be at least 5 characters')
			.required(),
		country: yup.string().min(2, 'Country is required').required()
	});

	const preferencesSchema = yup.object({
		newsletter: yup.boolean().required(),
		notifications: yup.boolean().required(),
		marketingEmails: yup.boolean().required(),
		preferredContact: yup.string().oneOf(['email', 'phone', 'sms']).required()
	});

	const fullSchema = yup.object({
		...personalInfoSchema.fields,
		...addressSchema.fields,
		...preferencesSchema.fields
	});

	type FormData = yup.InferType<typeof fullSchema>;

	const form = useFormSchema<FormData>({
		schema: fullSchema,
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			street: '',
			city: '',
			state: '',
			zipCode: '',
			country: '',
			newsletter: false,
			notifications: true,
			marketingEmails: false,
			preferredContact: 'email' as const
		},
		onSubmit: async (values) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert(`Registration complete for ${values.firstName} ${values.lastName}!`);
			setCurrentStep(0);
			form.resetForm();
		}
	});

	const steps = [
		{ title: 'Personal Info', schema: personalInfoSchema },
		{ title: 'Address', schema: addressSchema },
		{ title: 'Preferences', schema: preferencesSchema }
	];

	const validateCurrentStep = async () => {
		try {
			const currentStepFields = Object.keys(steps[currentStep].schema.shape);
			const currentStepValues = Object.fromEntries(
				Object.entries(form.values).filter(([key]) =>
					currentStepFields.includes(key)
				)
			);

			await steps[currentStep].schema.validate(currentStepValues);

			// Clear errors for current step fields
			const clearedErrors = { ...form.errors };
			currentStepFields.forEach((field) => {
				delete clearedErrors[field as keyof FormData];
			});
			form.setErrors(clearedErrors);

			return true;
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				const errors: Partial<Record<keyof FormData, string>> = {};
				error.inner.forEach((err) => {
					const path = err.path as keyof FormData;
					if (path) {
						errors[path] = err.message;
					}
				});

				// Mark current step fields as touched
				const currentStepFields = Object.keys(steps[currentStep].schema.shape);
				currentStepFields.forEach((field) => {
					form.setTouched(field as keyof FormData, true);
				});

				// Set errors for current step
				form.setErrors({ ...form.errors, ...errors });
			}
			return false;
		}
	};

	const nextStep = async () => {
		if (await validateCurrentStep()) {
			setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
		}
	};

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const renderPersonalInfo = () => (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold text-zinc-100'>Personal Information</h3>
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<label
						htmlFor='firstName'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						First Name
					</label>
					<input
						{...form.getFieldProps('firstName')}
						type='text'
						className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
					/>
					{form.touched.firstName && form.errors.firstName && (
						<div
							{...form.getErrorProps('firstName')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.firstName}
						</div>
					)}
				</div>
				<div>
					<label
						htmlFor='lastName'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						Last Name
					</label>
					<input
						{...form.getFieldProps('lastName')}
						type='text'
						className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
					/>
					{form.touched.lastName && form.errors.lastName && (
						<div
							{...form.getErrorProps('lastName')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.lastName}
						</div>
					)}
				</div>
			</div>
			<div>
				<label
					htmlFor='email'
					className='mb-1 block text-sm font-medium text-zinc-400'
				>
					Email Address
				</label>
				<input
					{...form.getFieldProps('email')}
					type='email'
					className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
				/>
				{form.touched.email && form.errors.email && (
					<div
						{...form.getErrorProps('email')}
						className='mt-1 text-sm text-red-500'
					>
						{form.errors.email}
					</div>
				)}
			</div>
			<div>
				<label
					htmlFor='phone'
					className='mb-1 block text-sm font-medium text-zinc-400'
				>
					Phone Number
				</label>
				<input
					{...form.getFieldProps('phone')}
					type='tel'
					className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
				/>
				{form.touched.phone && form.errors.phone && (
					<div
						{...form.getErrorProps('phone')}
						className='mt-1 text-sm text-red-500'
					>
						{form.errors.phone}
					</div>
				)}
			</div>
		</div>
	);

	const renderAddress = () => (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold text-zinc-100'>Address Information</h3>
			<div>
				<label
					htmlFor='street'
					className='mb-1 block text-sm font-medium text-zinc-400'
				>
					Street Address
				</label>
				<input
					{...form.getFieldProps('street')}
					type='text'
					className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
				/>
				{form.touched.street && form.errors.street && (
					<div
						{...form.getErrorProps('street')}
						className='mt-1 text-sm text-red-500'
					>
						{form.errors.street}
					</div>
				)}
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<label
						htmlFor='city'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						City
					</label>
					<input
						{...form.getFieldProps('city')}
						type='text'
						className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
					/>
					{form.touched.city && form.errors.city && (
						<div
							{...form.getErrorProps('city')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.city}
						</div>
					)}
				</div>
				<div>
					<label
						htmlFor='state'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						State
					</label>
					<input
						{...form.getFieldProps('state')}
						type='text'
						className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
					/>
					{form.touched.state && form.errors.state && (
						<div
							{...form.getErrorProps('state')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.state}
						</div>
					)}
				</div>
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<label
						htmlFor='zipCode'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						ZIP Code
					</label>
					<input
						{...form.getFieldProps('zipCode')}
						type='text'
						className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
					/>
					{form.touched.zipCode && form.errors.zipCode && (
						<div
							{...form.getErrorProps('zipCode')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.zipCode}
						</div>
					)}
				</div>
				<div>
					<label
						htmlFor='country'
						className='mb-1 block text-sm font-medium text-zinc-400'
					>
						Country
					</label>
					<input
						{...form.getFieldProps('country')}
						type='text'
						className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
					/>
					{form.touched.country && form.errors.country && (
						<div
							{...form.getErrorProps('country')}
							className='mt-1 text-sm text-red-500'
						>
							{form.errors.country}
						</div>
					)}
				</div>
			</div>
		</div>
	);

	const renderPreferences = () => (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold text-zinc-100'>Preferences</h3>
			<div className='space-y-3'>
				<div className='flex items-center'>
					<input
						{...form.getFieldProps('newsletter')}
						type='checkbox'
						className='h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500'
					/>
					<label htmlFor='newsletter' className='ml-2 block text-sm text-zinc-400'>
						Subscribe to newsletter
					</label>
				</div>
				<div className='flex items-center'>
					<input
						{...form.getFieldProps('notifications')}
						type='checkbox'
						className='h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500'
					/>
					<label
						htmlFor='notifications'
						className='ml-2 block text-sm text-zinc-400'
					>
						Enable notifications
					</label>
				</div>
				<div className='flex items-center'>
					<input
						{...form.getFieldProps('marketingEmails')}
						type='checkbox'
						className='h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500'
					/>
					<label
						htmlFor='marketingEmails'
						className='ml-2 block text-sm text-zinc-400'
					>
						Receive marketing emails
					</label>
				</div>
			</div>
			<div>
				<label
					htmlFor='preferredContact'
					className='mb-1 block text-sm font-medium text-zinc-400'
				>
					Preferred Contact Method
				</label>
				<select
					{...form.getFieldProps('preferredContact')}
					className='w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
				>
					<option value='email'>Email</option>
					<option value='phone'>Phone</option>
					<option value='sms'>SMS</option>
				</select>
			</div>
		</div>
	);

	return (
		<div className='mx-auto max-w-2xl rounded-lg bg-zinc-900 p-6 shadow-lg'>
			<div className='mb-8'>
				<h2 className='mb-4 text-2xl font-bold text-zinc-100'>Registration</h2>
				<div className='flex items-center justify-between'>
					{steps.map((step, index) => (
						<div key={index} className='flex items-center'>
							<div
								className={`flex h-8 w-8 items-center justify-center rounded-full ${
									index <= currentStep
										? 'bg-blue-600 text-white'
										: 'bg-zinc-500 text-zinc-900'
								}`}
							>
								{index + 1}
							</div>
							<span
								className={`ml-2 text-sm ${
									index <= currentStep ? 'font-medium text-blue-600' : 'text-zinc-500'
								}`}
							>
								{step.title}
							</span>
							{index < steps.length - 1 && (
								<div
									className={`mx-4 h-1 w-12 ${
										index <= currentStep ? 'bg-blue-600' : 'bg-zinc-500'
									}`}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			<form onSubmit={form.handleSubmit} className='space-y-6'>
				{currentStep === 0 && renderPersonalInfo()}
				{currentStep === 1 && renderAddress()}
				{currentStep === 2 && renderPreferences()}

				<div className='flex justify-between pt-6'>
					<button
						type='button'
						onClick={prevStep}
						disabled={currentStep === 0}
						className='cursor-pointer rounded-md border border-zinc-300 bg-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-400 focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
					>
						Previous
					</button>

					{currentStep < steps.length - 1 && (
						<button
							type='button'
							onClick={nextStep}
							className='cursor-pointer rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
						>
							Next
						</button>
					)}
					{currentStep === steps.length - 1 && (
						<button
							type='submit'
							disabled={form.isSubmitting}
							className='cursor-pointer rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
						>
							{form.isSubmitting ? 'Submitting...' : 'Complete Registration'}
						</button>
					)}
				</div>
			</form>
		</div>
	);
};
