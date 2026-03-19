# LotoCMS 生产环境部署文档（PM2）

本文档说明如何将 `loto-cms` 部署到生产环境，并基于 `pm2` 完成进程管理。

## 1. 环境准备

- Node.js: 建议 `v22.18.0+`
- npm: 建议 `v10+`
- PM2: 使用 `npx pm2`（已在脚本中内置）或全局安装 `pm2`
- MySQL: 按项目配置准备好数据库

## 2. 生产环境变量

在项目根目录创建生产环境文件：

```bash
cp .env.dev .env.prd
```

Windows PowerShell 可使用：

```powershell
Copy-Item .env.dev .env.prd
```

然后按生产环境实际情况修改 `.env.prd` 中至少以下配置：

- `PORT`
- `NODE_ENV=production`
- `DB_HOST / DB_USER / DB_PASS / DB_DATABASE / DB_PORT`
- `SYSDB_HOST / SYSDB_USER / SYSDB_PASS / SYSDB_DATABASE / SYSDB_PORT`
- `JWT_SECRET`
- `WAF_ENABLED=true`（建议）

## 3. 构建产物

执行生产构建：

```bash
npm run build:prd
```

说明：

- `build:prd` 会先清理 `dist`，适合首次部署或停服后全量构建。
- 若服务运行中需要更新，可使用 `npm run build:prd:skip-clean`（不删除 `dist`）。

构建后产物目录为：

- `dist/app.js`
- `dist/app/**`
- `dist/config/**`
- `dist/public/**`

## 4. PM2 配置说明

项目已提供 `ecosystem.config.cjs`，核心配置：

- 应用名：`loto-cms`
- 启动入口：`dist/app.js`
- 启动参数：`--env-file=.env.prd`
- 日志文件：`<项目根目录>/logs/loto-cms.log`（与 `package.json` 平级）
- 运行模式：`fork`
- 实例数：`1`
- 环境：`NODE_ENV=production`

## 5. 常用部署脚本

### 5.1 首次部署（构建 + 启动）

```bash
npm run prod:deploy
```

### 5.2 代码更新后部署（构建 + 重启）

```bash
npm run prod:restart
```

该命令内部使用 `build:prd:skip-clean`，可避免 Windows 环境下 `dist` 目录占用导致的清理失败。

### 5.3 仅启动（PM2）

```bash
npm run pm2:start
```

### 5.4 停用服务

```bash
npm run pm2:stop
```

### 5.5 重启服务

```bash
npm run pm2:restart
```

### 5.6 平滑重载

```bash
npm run pm2:reload
```

### 5.7 查看运行状态

```bash
npm run pm2:status
```

### 5.8 查看日志

```bash
npm run pm2:logs
```

说明：

- PM2 启动后，应用日志会写入 `logs/loto-cms.log`
- PM2 启动后，应用日志会写入 `<项目根目录>/logs/loto-cms.log`
- 同时可通过 `npm run pm2:logs` 实时查看

### 5.9 删除 PM2 进程

```bash
npm run pm2:delete
```

### 5.10 配置日志按日期切分（保留 90 天）

一键安装并配置 `pm2-logrotate`：

```bash
npm run pm2:log:setup
```

等价分步命令：

```bash
npm run pm2:log:install
npm run pm2:log:config
npm run pm2:log:status
```

配置文件位置：

- `pm2-logrotate.json`

当前默认配置含义：

- `rotateInterval = 0 0 * * *`：每天 00:00 切分日志
- `dateFormat = YYYY-MM-DD`：切分文件名附带日期
- `retain = 90`：最多保留 90 个历史文件（按天可近似理解为 90 天）
- `compress = true`：历史日志压缩保存

最佳实践建议：

- 将日志策略固定在 `pm2-logrotate.json`，避免把大量 `pm2 set` 参数散落在 `package.json`。
- 修改保留天数、切分时间时，只改配置文件后执行 `npm run pm2:log:config` 即可生效。
- 生产环境建议把该配置纳入版本管理，并在变更记录中注明生效时间与回滚策略。

### 5.11 跨平台 PM2 管理脚本（根目录）

项目根目录提供了两个生产运维脚本：

- Linux: `pm2-prod-linux.sh`
- Windows: `pm2-prod-windows.ps1`

Linux 示例：

```bash
chmod +x ./pm2-prod-linux.sh
./pm2-prod-linux.sh deploy
./pm2-prod-linux.sh status
./pm2-prod-linux.sh logs
```

Windows PowerShell 示例：

```powershell
.\pm2-prod-windows.ps1 deploy
.\pm2-prod-windows.ps1 status
.\pm2-prod-windows.ps1 logs
```

支持命令：

- `deploy`：构建并启动（首次部署）
- `restart-deploy`：构建并重启（更新部署）
- `start` / `stop` / `restart` / `reload`
- `status` / `logs` / `delete`
- `save` / `startup`
- `logrotate-setup` / `logrotate-config` / `logrotate-status`

## 6. 开机自启（推荐）

```bash
npx pm2 startup
npm run pm2:save
```

说明：

- `pm2 startup` 会输出一条需要管理员权限执行的命令，按提示执行即可。
- `pm2 save` 会持久化当前进程列表，系统重启后自动拉起。

## 7. 快速检查清单

- `.env.prd` 是否存在且配置正确
- 数据库是否可连接
- `npm run build:prd` 是否成功
- `npm run pm2:status` 是否显示 `online`
- 访问 `http://<服务器IP>:<PORT>/public/admin` 是否正常
