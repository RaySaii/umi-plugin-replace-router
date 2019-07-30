// ref:
// - https://umijs.org/plugin/develop.html
const fs = require('fs')
const path = require('path')
module.exports = function (api, options) {

    function delay(dur) {
        return new Promise(resolve => {
            setTimeout(_ => {
                resolve()
            }, dur)
        })
    }

    function modifyRouter() {
        const routerPath = path.resolve(api.paths.tmpDirPath, 'router.js')
        try {
            const data = fs.readFileSync(routerPath).toString()
            fs.writeFileSync(routerPath,
                data.replace(/import\s*renderRoutes[\s\S]*?;/, '')
                    .replace(/const\s*Router[\s\S]*?;/, '')
                    .replace(/import[\s\S]*?react-router-dom['"];/, `import {renderRoutes,Router} from 'freya-router-dom';
            `),
                err => {
                    api.log.error(err)
                })
        } catch (e) {
            console.log('======== error =========')
            console.log(e)
        }

    }

    if (process.env.NODE_ENV == 'production') {
        api.beforeBuildCompileAsync(modifyRouter)
    } else {
        api.onGenerateFiles(modifyRouter)
        api.beforeDevServer(modifyRouter)
    }

    api.modifyEntryHistory(_ => {
        return `
require('freya-router-dom').createBrowserHistory({
    basename: window.routerBase,
})
    `.trim()
    })
}
