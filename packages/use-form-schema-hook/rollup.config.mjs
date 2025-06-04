import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import filesize from 'rollup-plugin-filesize';

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: 'dist/index.js',
				format: 'cjs',
				sourcemap: true
			},
			{
				file: 'dist/index.esm.js',
				format: 'esm',
				sourcemap: true
			}
		],
		external: ['react'],
		plugins: [commonjs(), typescript(), filesize()]
	},
	{
		input: 'src/index.ts',
		output: [
			{
				file: 'dist/index.d.ts',
				format: 'es'
			}
		],
		plugins: [dts()],
		external: ['react']
	}
];
