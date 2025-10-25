@echo off
echo.
echo Fixing _redirects file...
echo.

REM Remove the _redirects directory if it exists
if exist "public\_redirects\" (
    echo Found _redirects as a directory - deleting...
    rmdir /s /q "public\_redirects"
)

REM Remove the _redirects file if it exists (to start fresh)
if exist "public\_redirects" (
    echo Removing old _redirects file...
    del "public\_redirects"
)

REM Create proper _redirects file
echo /* /index.html 200 > "public\_redirects"

REM Verify it was created
if exist "public\_redirects" (
    echo.
    echo SUCCESS! _redirects file created properly
    echo.
    echo File content:
    type "public\_redirects"
    echo.
    echo You can now deploy to Netlify!
    echo.
) else (
    echo.
    echo ERROR: Failed to create _redirects file
    echo Please create it manually in /public/_redirects
    echo.
)

pause
