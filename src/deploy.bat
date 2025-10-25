@echo off
echo.
echo FNG App Deployment Script
echo ==========================
echo.

REM Step 1: Fix _redirects
echo Step 1/3: Fixing _redirects file...
if exist "public\_redirects\" (
    rmdir /s /q "public\_redirects"
)
if exist "public\_redirects" (
    del "public\_redirects"
)
echo /* /index.html 200 > "public\_redirects"

if exist "public\_redirects" (
    echo SUCCESS: _redirects file created
    echo Content:
    type "public\_redirects"
) else (
    echo ERROR: Failed to create _redirects file
    pause
    exit /b 1
)

echo.

REM Step 2: Commit
echo Step 2/3: Committing changes...
git add .
git commit -m "Deploy FNG app - %date% %time%"

echo.

REM Step 3: Push
echo Step 3/3: Pushing to GitHub...
git push

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! Deployment initiated
    echo.
    echo Your site will be live in ~3 minutes
    echo Check status at: https://app.netlify.com
    echo.
) else (
    echo.
    echo ERROR: Failed to push to GitHub
    echo Check your internet connection and Git configuration
    echo.
    pause
    exit /b 1
)

pause
