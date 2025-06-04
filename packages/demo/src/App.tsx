import { Demo } from './demo';

function App() {
	return (
		<div className='min-h-screen p-4'>
			<div className='mx-auto space-y-12'>
				<div className='flex flex-col items-center gap-10'>
					<h1 className='text-center text-3xl font-bold text-zinc-100'>
						Form Examples with useFormSchema hook
					</h1>
					<div className='flex gap-4'>
						<a
							className='underline underline-offset-2'
							href='https://github.com/saran13raj/use-form-schema'
							target='_blank'
						>
							GitHub
						</a>
						<a
							className='underline underline-offset-2'
							href='https://www.npmjs.com/package/use-form-schema-hook'
							target='_blank'
						>
							npm
						</a>
					</div>
				</div>
				<Demo />
			</div>
		</div>
	);
}

export default App;
