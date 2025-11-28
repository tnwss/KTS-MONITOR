@echo off
chcp 65001 >nul
setlocal ENABLEDELAYEDEXPANSION

REM ==========================================
REM kts-smart-monitor 一键启动脚本（Windows / CMD）
REM 放在項目根目錄（和 package.json、node-v24.11.1-x64.msi 同級）
REM 逻辑：
REM   STEP1 清理可能干扰的本地 npm
REM   STEP2 檢查 node，沒有就用 msi 安裝，再自動找到 node.exe
REM   STEP3 自動找到 npm.cmd
REM   STEP4 npm install（如無 node_modules）
REM   STEP5 打開瀏覽器 + npm run dev（端口 3000）
REM ==========================================

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo ==========================================
echo [INFO] kts-smart-monitor 一鍵啟動
echo [INFO] 當前目錄: %CD%
echo ==========================================
echo.

REM ---------- STEP 1: 清理本地 npm 干擾 ----------
echo [STEP 1] 清理可能干擾的本地 npm...
IF EXIST "%PROJECT_DIR%npm.cmd" (
    echo [INFO] 刪除當前目錄中的 npm.cmd 以避免衝突
    del /f /q "%PROJECT_DIR%npm.cmd"
)

IF EXIST "%PROJECT_DIR%node_modules\npm" (
    echo [INFO] 刪除 node_modules\npm 以避免與全局 npm 衝突
    rmdir /s /q "%PROJECT_DIR%node_modules\npm"
)
echo [STEP 1] 完成
echo.

REM ---------- STEP 2: 確保安裝並找到 node.exe ----------
echo [STEP 2] 檢查 Node.js 是否已安裝...

REM 先在 PATH 中查找 node
where node >"%TEMP%\_where_node.txt" 2>nul
IF ERRORLEVEL 1 (
    echo [INFO] PATH 中未找到 node，嘗試用本地 msi 安裝...
    IF NOT EXIST "%PROJECT_DIR%node-v24.11.1-x64.msi" (
        echo [錯誤] 未找到安裝包: %PROJECT_DIR%node-v24.11.1-x64.msi
        echo 請確認安裝包位於項目根目錄。
        pause
        goto :EOF
    )

    echo [INFO] 開始靜默安裝 Node.js（可能需要幾十秒）...
    msiexec /i "%PROJECT_DIR%node-v24.11.1-x64.msi" /qn /norestart
    IF ERRORLEVEL 1 (
        echo.
        echo [錯誤] Node.js 安裝失敗，請檢查系統提示。
        pause
        goto :EOF
    )

    echo [INFO] 安裝完成，重新檢測 node...
    where node >"%TEMP%\_where_node.txt" 2>nul
    IF ERRORLEVEL 1 (
        echo [錯誤] 安裝後仍然找不到 node。
        echo 可能是安裝包將 Node 裝在了非默認路徑，需人工檢查。
        pause
        goto :EOF
    )
)

SET "NODE_EXE="
FOR /F "usebackq delims=" %%I IN ("%TEMP%\_where_node.txt") DO (
    IF NOT DEFINED NODE_EXE SET "NODE_EXE=%%I"
)

IF NOT DEFINED NODE_EXE (
    echo [錯誤] 無法解析 node 路徑。
    pause
    goto :EOF
)

echo [INFO] 使用的 node: "%NODE_EXE%"
"%NODE_EXE%" -v
echo.
echo [STEP 2] 完成
echo.

REM ---------- STEP 3: 找到 npm.cmd ----------
echo [STEP 3] 檢查 npm...

where npm >"%TEMP%\_where_npm.txt" 2>nul
IF ERRORLEVEL 1 (
    echo [錯誤] 未找到 npm 命令。
    echo 請確認 Node 安裝正常，然後重新運行本腳本。
    pause
    goto :EOF
)

SET "NPM_CMD="
FOR /F "usebackq delims=" %%I IN ("%TEMP%\_where_npm.txt") DO (
    IF NOT DEFINED NPM_CMD SET "NPM_CMD=%%I"
)

IF NOT DEFINED NPM_CMD (
    echo [錯誤] 無法解析 npm 路徑。
    pause
    goto :EOF
)

echo [INFO] 使用的 npm: "%NPM_CMD%"
call "%NPM_CMD%" -v
echo.
echo [STEP 3] 完成
echo.

REM ---------- STEP 4: npm install（如需要） ----------
echo [STEP 4] 準備安裝依賴...

IF NOT EXIST "node_modules" (
    echo ========= 第一次運行：開始執行 npm install =========
    call "%NPM_CMD%" install
    IF ERRORLEVEL 1 (
        echo.
        echo [錯誤] npm install 執行失敗，請查看上方報錯信息。
        echo 如需重試，可刪除整個 node_modules 目錄後再運行本腳本。
        pause
        goto :EOF
    )
    echo ========= npm install 完成 =========
) ELSE (
    echo [INFO] 已檢測到 node_modules，跳過 npm install。
)
echo.
echo [STEP 4] 完成
echo.

REM ---------- STEP 5: 打開瀏覽器 + npm run dev (端口 3000) ----------
echo [STEP 5] 啟動開發服務器並打開瀏覽器...
echo 將訪問地址: http://localhost:3000/
echo.

start "" "http://localhost:3000/"

echo ========= 開始執行：npm run dev =========
echo 此窗口會持續輸出日誌，如需停止請按 Ctrl + C 並確認。
echo.

call "%NPM_CMD%" run dev

echo.
echo [INFO] 開發服務器已退出。按任意鍵關閉窗口。
pause

endlocal
