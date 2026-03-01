# ENV


## DEV
.env.dev

```ENV
# 开发调试
ENV_FILE=.env.dev
APP_DEBUG = true
PAGE_SIZE = 20
LIMIT_MAX = 300

# jwt配置
JWT_SECRET = HlxCMS
JWT_EXPIRES_IN = 1d
JWT_REFRESH = false

# salt 加盐
PASSWORD_SALT = 12
USER_SALT = 12
AES_SALT = lotoDefault-aes-dev

# WAF 防护等级
WAF_LEVEL = 0

# DB数据库配置
DB_HOST = localhost
DB_USER = root
DB_PASS = root123
DB_PORT = 3306
DB_DATABASE = cms-test
DB_DEBUG = false
DB_POOL_MIN = 0
DB_POOL_MAX = 2
DB_CLIENT = mysql2
DB_FILENAME = ./data/lotocms.sqlite

# 站点配置
PORT = 3000
BODY_LIMIT = 300kb
CORS_ORIGIN = *

# 日志 combined  common  dev  tiny  short chancms
LOGGER_LEVEL = chancms

# node环境
NODE_ENV = dev

# 邮箱配置
EMAIL_HOST = smtp.qq.com
EMAIL_PORT = 587
EMAIL_USER = you-email@qq.com
EMAIL_PASS = you-email-pass
EMAIL_FROM = you-email@qq.com
EMAIL_SECURE = true
EMAIL_CODE = 1234
# 收件人
EMAIL_TO = lanbery@gmail.com


# 微信公众号配置(微信公众号内登录)
WECHAT_APPID=wx-you-appid
WECHAT_APPSECRET=wx-you-xxx
WECHAT_REDIRECT_URI=
WECHAT_TOKEN=123

## 微信开放平台配置（PC端扫码登录 正式）
WECHAT_OPEN_APPID=wx-you-appid
WECHAT_OPEN_APPSECRET=wx-you-appsecret

# 微信小程序配置
MINIPROGRAM_APPID=wx-you-appsecret
MINIPROGRAM_APPSECRET=your-miniprogram-appsecret
```