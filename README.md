<h1 align="center">LotoCMS</h1>
<p align="center" >
  <a href="https://github.com/lotocms" target="blank">
    <img src="https://ucarecdn.com/eac2c945-177d-4fc9-8bc1-fa2be48ad3a2/lotolab_golden.svg" width="100" alt="Tsai Logo" />
  </a>
</p>

LotoCMS 是一个基于 Node.js + Express 5 + MySQL 的内容管理系统，项目内置 CMS、基础管理、Web 前台、系统管理与代理能力，代码组织按模块划分，便于扩展。

> 项目基于 `@lotomic/chanjs` 运行框架扩展实现。

> 感谢🎉🎉🎉🎉👉👉👉👉 [ChanCMS](https://github.com/chancms) 👍👍👍👍👍

## 项目概览

- 后端框架：Express 5（运行于 `@lotomic/chanjs`）
- 数据访问：Knex + MySQL2
- 模板引擎：art-template / express-art-template
- 认证鉴权：JWT + bcryptjs
- 运行管理：PM2（含 `pm2-logrotate` 日志轮转支持）
- 代码构建：Babel（源码构建到 `dist/`）
- 支持ES6: 支持Controller method 装饰注解@Comment('some comments')

## 功能模块

当前默认启用模块（见 `config/modules.js`）：

- `base`
- `cms`
- `web`
- `proxy`
- `system`

仓库内还包含 `user`、`vip`、`wechat` 等模块代码，可按需接入。

## 目录结构

```text
.
├─ app/                    # 业务源码（controller/service/middleware）
├─ config/                 # 应用配置（数据库、JWT、WAF、模块开关等）
├─ public/                 # 静态资源
├─ docs/                   # 文档与 SQL
├─ scripts/                # 辅助脚本（如 pm2-logrotate 配置）
├─ logs/                   # 运行日志
├─ dist/                   # 构建产物
├─ app.js                  # 入口文件（开发运行 dist/app.js）
├─ ecosystem.config.cjs    # PM2 配置
├─ cms.sh                  # Linux/macOS 部署脚本
└─ cms.ps1                 # Windows PowerShell 部署脚本
```

## 环境要求

- Node.js 20+（建议）
- npm 10+（或同等版本包管理器）
- MySQL 8+
- PM2（生产部署时）

## 快速开始（开发环境）

1. 拉取代码与子模块（文档仓库）

```bash
git clone <your-repo-url>
cd loto-cms
git submodule update --init --recursive
```

2. 准备本地依赖（重要）

项目依赖声明包含：

```json
"@lotomic/chanjs": ">=0.0.10"
```

3. 安装依赖

```bash
npm install
```

4. 配置环境变量

- 开发环境默认使用 `.env.dev`
- 生产环境默认使用 `.env.prd`
- 可参考 `env.example.md`

5. 启动开发模式

```bash
npm run dev
```

默认访问：

- `http://localhost:4000`
- `http://localhost:4000/public/admin`

## 构建与生产运行

### 构建

```bash
npm run build
```

### 生产启动（非 PM2）

```bash
npm run start:prd
```

## PM2 部署

### 常用命令

```bash
npm run pm2:start
npm run pm2:status
npm run pm2:logs
npm run pm2:restart
npm run pm2:reload
npm run pm2:stop
npm run pm2:delete
npm run pm2:save
```

### 一键部署/重启部署

```bash
npm run prod:deploy   # build + pm2 start
npm run prod:restart  # skip clean build + pm2 restart
```

### 日志轮转（pm2-logrotate）

```bash
npm run pm2:log:install
npm run pm2:log:config
npm run pm2:log:status
```

配置文件：`pm2-logrotate.json`

## 脚本入口（跨平台）

- Linux/macOS：`./cms.sh <command>`
- Windows：`.\cms.ps1 <command>`

支持命令：`deploy`、`restart-deploy`、`start`、`stop`、`restart`、`reload`、`status`、`logs`、`delete`、`save`、`startup`、`log-setup`、`log-config`、`log-status`、`help`。

## 常用 npm scripts

- `npm run dev`：开发模式（构建 + 监听 + 自动重启）
- `npm run build`：完整构建到 `dist/`
- `npm run start`：运行 `dist/app.js`
- `npm run start:prd`：使用 `.env.prd` 启动
- `npm run prod:deploy`：生产部署（构建并以 PM2 启动）
- `npm run prod:restart`：生产重启部署（跳过 clean）

## 常见问题

### 1) `npm install` 时找不到 `@lotomic/chanjs`

原因：该依赖使用本地路径 `file:../loto-chanjs`。  
解决：确保目录结构中存在与 `loto-cms` 同级的 `loto-chanjs`。

### 2) 启动后无法连接数据库

请检查 `.env.dev` / `.env.prd` 中以下配置：

- `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASS` / `DB_DATABASE`
- `SYSDB_HOST` / `SYSDB_PORT` / `SYSDB_USER` / `SYSDB_PASS` / `SYSDB_DATABASE`

并确认已导入 `docs/wiki/sql/` 对应脚本。

## License

MIT
