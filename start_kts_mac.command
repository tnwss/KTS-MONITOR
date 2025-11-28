#!/bin/bash

# ==========================================
# kts-smart-monitor 一键启动脚本（macOS）
# 放在项目根目录（和 package.json、node-v24.11.1.pkg 同级）
#
# 逻辑：
#   STEP0 自己加执行权限（chmod +x $0）
#   STEP1 清理可能干扰的本地 npm
#   STEP2 检查 node，没有就用本地 pkg 安装，再自动找到 node
#   STEP3 检查 npm
#   STEP4 npm install（如无 node_modules）
#   STEP5 打开浏览器 + npm run dev（端口 3000）
# ==========================================

set -u  # 未定义变量直接报错退出，避免写错变量名

# ---------- STEP 0: 自己加执行权限 ----------
# 这一步对后续运行有用：第一次运行时给脚本加上 +x
chmod +x "$0" 2>/dev/null

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "=========================================="
echo "[INFO] kts-smart-monitor 一键启动（macOS）"
echo "[INFO] 当前目录: $SCRIPT_DIR"
echo "=========================================="
echo

# ---------- STEP 1: 清理本地 npm 干扰 ----------
echo "[STEP 1] 清理可能干扰的本地 npm..."

if [ -f "$SCRIPT_DIR/npm" ]; then
  echo "[INFO] 删除当前目录中的 npm 以避免冲突"
  rm -f "$SCRIPT_DIR/npm"
fi

if [ -d "$SCRIPT_DIR/node_modules/npm" ]; then
  echo "[INFO] 删除 node_modules/npm 以避免与全局 npm 冲突"
  rm -rf "$SCRIPT_DIR/node_modules/npm"
fi

echo "[STEP 1] 完成"
echo

# ---------- STEP 2: 确保安装并找到 node ----------
echo "[STEP 2] 检查 Node.js 是否已安装..."

if ! command -v node >/dev/null 2>&1; then
  echo "[INFO] 系统 PATH 中未检测到 node，尝试使用本地安装包安装..."

  PKG_PATH="$SCRIPT_DIR/node-v24.11.1.pkg"
  if [ ! -f "$PKG_PATH" ]; then
    echo "[错误] 未找到安装包: $PKG_PATH"
    echo "请确认 node-v24.11.1.pkg 位于项目根目录，或修改脚本中的文件名。"
    read -rp "按回车键退出..." _
    exit 1
  fi

  echo "[INFO] 开始安装 Node.js（需要管理员密码，使用系统 installer）..."
  sudo installer -pkg "$PKG_PATH" -target /
  if [ $? -ne 0 ]; then
    echo
    echo "[错误] Node.js 安装失败，请检查终端中的错误提示。"
    read -rp "按回车键退出..." _
    exit 1
  fi

  echo "[INFO] 安装完成，重新检测 node..."
  if ! command -v node >/dev/null 2>&1; then
    echo "[错误] 安装后仍未检测到 node。"
    echo "可能是安装包将 Node 安装到非默认路径，请手动检查后再试。"
    read -rp "按回车键退出..." _
    exit 1
  fi
fi

NODE_EXE="$(command -v node)"
echo "[INFO] 使用的 node: $NODE_EXE"
"$NODE_EXE" -v
echo
echo "[STEP 2] 完成"
echo

# ---------- STEP 3: 检查 npm ----------
echo "[STEP 3] 检查 npm..."

if ! command -v npm >/dev/null 2>&1; then
  echo "[错误] 未检测到 npm。"
  echo "请确认 Node 安装完整（通常 Node 官方 pkg 会自带 npm）。"
  read -rp "按回车键退出..." _
  exit 1
fi

NPM_CMD="$(command -v npm)"
echo "[INFO] 使用的 npm: $NPM_CMD"
"$NPM_CMD" -v
echo
echo "[STEP 3] 完成"
echo

# ---------- STEP 4: npm install（如需要） ----------
echo "[STEP 4] 准备安装依赖..."

if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  echo "========= 第一次运行：开始执行 npm install ========="
  "$NPM_CMD" install
  if [ $? -ne 0 ]; then
    echo
    echo "[错误] npm install 执行失败，请检查上方错误信息。"
    echo "如需重试，可以删除 node_modules 目录后重新双击本脚本。"
    read -rp "按回车键退出..." _
    exit 1
  fi
  echo "========= npm install 完成 ========="
else
  echo "[INFO] 已检测到 node_modules，跳过 npm install。"
fi

echo
echo "[STEP 4] 完成"
echo

# ---------- STEP 5: 打开浏览器 + npm run dev (端口 3000) ----------
echo "[STEP 5] 启动开发服务器并打开浏览器..."
echo "将访问地址: http://localhost:3000/"
echo

# 先打开默认浏览器访问页面
open "http://localhost:3000/"

echo "========= 开始执行：npm run dev ========="
echo "终端窗口会持续输出日志，如需停止请按 Ctrl + C。"
echo

# 在当前终端中运行 dev，保持窗口不自动关闭
"$NPM_CMD" run dev

echo
echo "[INFO] 开发服务器已退出。"
read -rp "按回车键关闭窗口..." _
exit 0
