import React, { useState } from 'react';

import {
	BasicFormZodExample,
	DynamicFormZodExample,
	MultiStepFormZodExample
} from './examples/zod-demo';
import {
	BasicFormYupExample,
	DynamicFormYupExample,
	MultiStepFormYupExample
} from './examples/yup-demo';

export const Demo: React.FC = () => {
	const [view, setView] = useState<'zod' | 'yup'>('zod');

	return (
		<div className='flex flex-col items-center gap-10'>
			<div className='flex max-w-28 items-center justify-center rounded-lg bg-zinc-400 p-1'>
				<button
					onClick={() => setView('zod')}
					className={`cursor-pointer rounded px-3 py-1 text-sm font-medium transition-colors ${
						view === 'zod'
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-zinc-700 hover:text-zinc-900'
					}`}
				>
					Zod
				</button>
				<button
					onClick={() => setView('yup')}
					className={`cursor-pointer rounded px-3 py-1 text-sm font-medium transition-colors ${
						view === 'yup'
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-zinc-700 hover:text-zinc-900'
					}`}
				>
					Yup
				</button>
			</div>
			<div className='flex flex-col gap-10'>
				{view === 'zod' ? (
					<>
						<section>
							<h2 className='mb-4 text-2xl font-semibold text-zinc-100'>
								1. Basic Registration Form with Zod
							</h2>
							<BasicFormZodExample />
						</section>
						<section>
							<h2 className='mb-4 text-2xl font-semibold text-zinc-100'>
								2. Dynamic Form with Field Arrays with Zod
							</h2>
							<DynamicFormZodExample />
						</section>
						<section>
							<h2 className='mb-4 text-2xl font-semibold text-zinc-100'>
								3. Multi-step Form with Zod
							</h2>
							<MultiStepFormZodExample />
						</section>
					</>
				) : (
					<>
						<section>
							<h2 className='mb-4 text-2xl font-semibold text-zinc-100'>
								1. Basic Registration Form with Yup
							</h2>
							<BasicFormYupExample />
						</section>
						<section>
							<h2 className='mb-4 text-2xl font-semibold text-zinc-100'>
								2. Dynamic Form with Field Arrays with Yup
							</h2>
							<DynamicFormYupExample />
						</section>
						<section>
							<h2 className='mb-4 text-2xl font-semibold text-zinc-100'>
								3. Multi-step Form with Yup
							</h2>
							<MultiStepFormYupExample />
						</section>
					</>
				)}
			</div>
		</div>
	);
};
