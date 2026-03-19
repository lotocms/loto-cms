#!/usr/bin/env bash
set -euo pipefail

usage() {
  local c_reset="\033[0m"
  local c_title="\033[1;36m"
  local c_cmd="\033[1;33m"
  local c_desc="\033[0;37m"

  printf "${c_title}Usage:${c_reset} ${c_cmd}./cms.sh <command>${c_reset}\n\n"
  printf "${c_title}Commands:${c_reset}\n"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "deploy" "Build (full) and start pm2 app"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "restart-deploy" "Build (skip clean) and restart pm2 app"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "start" "Start pm2 app"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "stop" "Stop pm2 app"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "restart" "Restart pm2 app"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "reload" "Reload pm2 app"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "status" "Show pm2 app status"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "logs" "Show pm2 app logs"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "delete" "Delete pm2 app from pm2"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "save" "Save pm2 process list"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "startup" "Generate startup command from pm2"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "log-setup" "Install and configure pm2-logrotate"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "log-config" "Apply pm2-logrotate config file"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "log-status" "Show pm2-logrotate active config"
  printf "  ${c_cmd}%-16s${c_reset} ${c_desc}%s${c_reset}\n" "help" "Show this help message"
}

cmd="${1:-}"

if [[ -z "$cmd" ]]; then
  usage
  exit 1
fi

run() {
  npm run "$1"
}

case "$cmd" in
  deploy) run prod:deploy ;;
  restart-deploy) run prod:restart ;;
  start) run pm2:start ;;
  stop) run pm2:stop ;;
  restart) run pm2:restart ;;
  reload) run pm2:reload ;;
  status) run pm2:status ;;
  logs) run pm2:logs ;;
  delete) run pm2:delete ;;
  save) run pm2:save ;;
  startup) npx pm2 startup ;;
  log-setup) run pm2:log:setup ;;
  log-config) run pm2:log:config ;;
  log-status) run pm2:log:status ;;
  help) usage ;;
  *)
    usage
    exit 1
    ;;
esac
