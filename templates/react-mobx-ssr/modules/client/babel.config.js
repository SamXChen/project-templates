const path = require('path')

module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				useBuiltIns: 'entry',
                corejs: { version: 2, proposals: true }
			}
		],
		'@babel/preset-typescript',
		'@babel/preset-react'
	],
	plugins: [
		'lodash',
		'react-hot-loader/babel',
		[
			'react-css-modules',
			{
				context: path.resolve(__dirname, '../../'),
				filetypes: {
					'.scss': {
						syntax: 'postcss-scss'
					}
				},
				webpackHotModuleReloading: true,
				exclude: 'node_modules',
				generateScopedName: '[name]_[local]_[hash:base64:5]'
			}
		],
		'react-loadable/babel',
		[
			'import',
			{
				libraryName: 'antd',
				style: true
			}
		],
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-syntax-import-meta',
		'@babel/plugin-proposal-json-strings',
		[
			'@babel/plugin-proposal-decorators',
			{
				legacy: true
			}
		],
		[
			'@babel/plugin-proposal-class-properties',
			{
				loose: true
			}
		],
		'@babel/plugin-proposal-function-sent',
		'@babel/plugin-proposal-export-namespace-from',
		'@babel/plugin-proposal-numeric-separator',
		'@babel/plugin-proposal-throw-expressions',
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-proposal-logical-assignment-operators',
		'@babel/plugin-proposal-optional-chaining',
		[
			'@babel/plugin-proposal-pipeline-operator',
			{
				proposal: 'minimal'
			}
		],
		'@babel/plugin-proposal-nullish-coalescing-operator',
		'@babel/plugin-proposal-do-expressions'
	]
}
