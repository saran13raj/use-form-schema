import { Demo } from './demo';

function App() {
	return (
		<div className='min-h-screen p-4'>
			<div className='mx-auto space-y-12'>
				<h1 className='text-center text-3xl font-bold text-zinc-100'>
					Form Examples with useFormSchema hook
				</h1>
				<Demo />
			</div>
		</div>
	);
}

export default App;
