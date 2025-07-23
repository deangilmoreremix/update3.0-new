pkill -9 -f vite 2>/dev/null || true
pkill -9 -f npm 2>/dev/null || true
cd /workspaces/update3.0-new
chmod +x clean-build.sh
./clean-build.sh
