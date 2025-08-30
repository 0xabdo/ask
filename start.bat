@echo off
echo Starting Asking Platform...
echo.
echo Installing dependencies...
npm install
echo.
echo Installing client dependencies...
cd client
npm install
cd ..
echo.
echo Setting up database and admin user...
node setup.js
echo.
echo Starting the application...
npm run dev
pause

