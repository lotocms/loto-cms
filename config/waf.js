/**
 * WAF (Web Application Firewall) 配置
 * 在 packages/index.js 的 loadMiddleware 中使用
 */

export default {
  enabled: true,

  // 限流配置
  rateLimit: {
    key: 'waf_rate_limit',          // Cookie 名称
    max: 200,                        // 1小时最多200次请求
    windowMs: '1h',                  // 时间窗口
    secretKey: 'chancms',            // JWT 密钥（生产环境建议修改）
    httpOnly: true,                  // 禁止 JS 访问 Cookie
    secure: ['prd', 'production'].includes(process.env.NODE_ENV),  // HTTPS only
    sameSite: 'Strict',              // CSRF 防护
    ignorePaths: [                   // 忽略限流的路径
      '/health',
      '/favicon.ico',
      '/static',
      '/public',
    ],
  },
};

