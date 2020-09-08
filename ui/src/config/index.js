const config = {
  projectId: 23, // 项目iD
  productId: 8, // 产品Id
  homeName: 'home',
  projectName: 'hm-dev-platform',
  isDev: process.env.NODE_ENV === 'development',
  testServerDomain: 'https://test3.mhealth100.com',
  prodServerDomain: 'https://mp.mhealth100.com',
  testClientDomain: 'https://test3.mhealth100.com',
  prodClientDomain: 'https://mp.mhealth100.com',
  testProxyDomainProjectId: '108',
  prodProxyDomainProjectId: '109',
  useProdProxy: true, // 是否使用正式代理
  isTest: false,
}
export default config
