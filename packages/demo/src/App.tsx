import { GithubIcon, NpmIcon } from 'raster-react';

import { Demo } from './demo';

function App() {
	return (
		<div className='min-h-screen p-4 py-12'>
			<div className='mx-auto space-y-8'>
				<div className='flex flex-col items-center gap-8'>
					<h1 className='text-center text-3xl font-bold text-zinc-50'>
						Form Examples with useFormSchema hook
					</h1>
					<div className='flex gap-4'>
						<a
							className='flex items-center gap-1 text-zinc-50 underline underline-offset-2'
							href='https://github.com/saran13raj/use-form-schema'
							target='_blank'
						>
							GitHub
							<GithubIcon className='h-6 w-6' />
						</a>
						<a
							className='flex items-center gap-1 text-zinc-50 underline underline-offset-2'
							href='https://www.npmjs.com/package/use-form-schema-hook'
							target='_blank'
						>
							npm
							<NpmIcon className='h-6 w-6' />
						</a>
					</div>
				</div>
				<Demo />
			</div>
		</div>
	);
}

export default App;
