// ref:
// - https://umijs.org/plugin/develop.html

module.exports = function (api, options) {
  api.modifyEntryRender(_=>{
    return `window.g_isBrowser = true;
  const rootContainer =  React.createElement(require('../../router').default)
  ReactDOM.render(
    rootContainer,
    document.getElementById('${api.config.mountElementId||'root'}'),
  );`.trim()
  })
}
