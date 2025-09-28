
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/sned-fo-front/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 16762, hash: 'adc6b7ff5116b415bc7d602601a4c6cbcdb1f15521b82d7a54f8f0957e7e81dd', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6785, hash: '6473a7987fd0e4e88aaa7a78d8a631caad84f90a97597ddbd79267ef05ce8538', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-TNPEMCRX.css': {size: 136691, hash: 'eQwv4jy3kGQ', text: () => import('./assets-chunks/styles-TNPEMCRX_css.mjs').then(m => m.default)}
  },
};
