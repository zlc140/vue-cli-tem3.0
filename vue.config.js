/**
* Created By zlc
* Author zlc140@163.com
* Describe javascript
* @data 2018/12/20
**/

'use strict'

const path = require('path')

function resolve(dir){
	return path.join(__dirname, dir)
}

//
 const exportConfig = {
	
	//webpack链式配置
	 chainWebpack: (config) => {
	 	// config.resolve.extensions = ['.vue', '.js', '.styl']
	 	config.resolve.alias
		    .set('@',resolve('src'))
		    .set('@assets', resolve('src/assets'))
		    .set('@components', resolve('src/components'))
		    .set('@config',resolve('src/config'))
		    .set('@utils',resolve('src/utils'))
	 },
	 css: {
	 	loaderOptions: {
	 		css: {
				test: /\.styl$/,
				loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
		    }
	    }
	 }
}

if(process.env.NODE_ENV === 'product') {

}

if(process.env.NODE_ENV === 'development') {
	Object.assign(exportConfig, {
	//添加devServe
		devServer: {
			clientLogLevel: 'warning',
			historyApiFallback: true,
			hot: true,
			// 是否启用资源压缩
			compress: true,
			// host: 'localhost',
			// port: '8080',
			// 是否自动打开浏览器
			open: true,
			// overlay: false ? {warnings: false, errors: true} : false,
			// 公开的路径目录
			publicPath: '/',
			// 接口代理配置
			proxy: require('./config/proxy.js'),
			quiet: true, // necessary for FriendlyErrorsPlugin
			watchOptions: {
				poll: true,
			}
		},
		configureWebpack: config => {
			config.devtool = 'source-map'
		}
	})
}

module.exports = exportConfig