module.exports = {
    mode: "development",
    
    entry: "./js/main.js",
    
    output:{
        path: `${__dirname}/js`,
        filename:"down.js"
    },
    
    module:{
        rules:[
            {
            test: /\.js$/,
            use:[
            {
                loader: "babel-loader",
                options:{
                    presets:[
                        "@babel/preset-env",
                    ]
                }
            }
        ]
        }
        ]
    }
};