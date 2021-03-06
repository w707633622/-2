// npm如果遇到injectBabelPlugin is not a function的问题, 就把react-app-rewired 进行降级 
// 降级到react-app-rewired@2.0.2-next.0

/* create-react-app@1.x */

// const { injectBabelPlugin } = require('react-app-rewired');
// const rewireLess = require('react-app-rewire-less');

// module.exports = function override(config, env) {
//     config = injectBabelPlugin(
//         ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
//     config,
//     );
//     config = rewireLess.withLoaderOptions({
//         modifyVars: { "@primary-color": "#40a9ff" },
//         javascriptEnabled: true,
//     }) (config, env);
//     return config;
// };


/* create-react-app@2.x */
const { override, fixBabelImports, addLessLoader, } = require('customize-cra')

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { "@primary-color": "#40a9ff" }
    })
);
