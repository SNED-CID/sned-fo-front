
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/sned-fo-front/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 28286, hash: 'a219f9a5082ae42f1b1814f0642b58da564a86a17e1078be6cd32dcd65b6c5ed', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6785, hash: '405dd64fae6677414608bf25fb2f860864ea2a8447f32507bb1db03eceb8d9d2', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-SJ3COSMD.css': {size: 151316, hash: 'vXqf6Vgn6pA', text: () => import('./assets-chunks/styles-SJ3COSMD_css.mjs').then(m => m.default)}
  },
};
