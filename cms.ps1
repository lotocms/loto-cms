param(
  [Parameter(Mandatory = $true)]
  [ValidateSet(
    "deploy",
    "restart-deploy",
    "start",
    "stop",
    "restart",
    "reload",
    "status",
    "logs",
    "delete",
    "save",
    "startup",
    "log-setup",
    "log-config",
    "log-status",
    "help"
  )]
  [string]$Command
)

$ErrorActionPreference = "Stop"

function Show-Usage {
  Write-Host "Usage: " -NoNewline -ForegroundColor Cyan
  Write-Host ".\cms.ps1 <command>" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Commands:" -ForegroundColor Cyan
  Write-Host "  deploy          Build (full) and start pm2 app" -ForegroundColor Gray
  Write-Host "  restart-deploy  Build (skip clean) and restart pm2 app" -ForegroundColor Gray
  Write-Host "  start           Start pm2 app" -ForegroundColor Gray
  Write-Host "  stop            Stop pm2 app" -ForegroundColor Gray
  Write-Host "  restart         Restart pm2 app" -ForegroundColor Gray
  Write-Host "  reload          Reload pm2 app" -ForegroundColor Gray
  Write-Host "  status          Show pm2 app status" -ForegroundColor Gray
  Write-Host "  logs            Show pm2 app logs" -ForegroundColor Gray
  Write-Host "  delete          Delete pm2 app from pm2" -ForegroundColor Gray
  Write-Host "  save            Save pm2 process list" -ForegroundColor Gray
  Write-Host "  startup         Generate startup command from pm2" -ForegroundColor Gray
  Write-Host "  log-setup       Install and configure pm2-logrotate" -ForegroundColor Gray
  Write-Host "  log-config      Apply pm2-logrotate config file" -ForegroundColor Gray
  Write-Host "  log-status      Show pm2-logrotate active config" -ForegroundColor Gray
  Write-Host "  help            Show this help message" -ForegroundColor Gray
}

function Invoke-NpmScript {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ScriptName
  )
  npm run $ScriptName
}

switch ($Command) {
  "deploy" { Invoke-NpmScript "prod:deploy" }
  "restart-deploy" { Invoke-NpmScript "prod:restart" }
  "start" { Invoke-NpmScript "pm2:start" }
  "stop" { Invoke-NpmScript "pm2:stop" }
  "restart" { Invoke-NpmScript "pm2:restart" }
  "reload" { Invoke-NpmScript "pm2:reload" }
  "status" { Invoke-NpmScript "pm2:status" }
  "logs" { Invoke-NpmScript "pm2:logs" }
  "delete" { Invoke-NpmScript "pm2:delete" }
  "save" { Invoke-NpmScript "pm2:save" }
  "startup" { npx pm2 startup }
  "log-setup" { Invoke-NpmScript "pm2:log:setup" }
  "log-config" { Invoke-NpmScript "pm2:log:config" }
  "log-status" { Invoke-NpmScript "pm2:log:status" }
  "help" { Show-Usage }
}
