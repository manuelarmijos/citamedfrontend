module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ?
        '' : '/',

    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Sistema médico | Citas';
                args[0].meta = [
                    { viewport: 'width=device-width,initial-scale=1,user-scalable=no' }, {
                        name: 'og:title',
                        content: 'Sistema Web',
                    }, {
                        name: 'og:description',
                        content: 'Sistema de administración de citas médicas',
                    }, {
                        name: 'og:image',
                        content: `${process.env.VUE_APP_IMG_PREVIEW}`,
                    }
                ];
                return args;
            })
    },

    transpileDependencies: [
      'vuetify'
    ]
}
