#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Script de instalación para la VM de Google Cloud (Ubuntu).
# Se pega COMPLETO en la consola SSH del navegador.
#
# 1) Completá los 4 valores de abajo.
# 2) Copiá todo el archivo y pegalo en la terminal SSH del navegador.
# 3) Esperá a que termine (instala Node, nginx, PM2, clona el repo,
#    construye el front, levanta la API y configura nginx en el puerto 80).
#
# El HTTPS (certbot) va aparte, DESPUÉS de apuntar el dominio a la IP.
# ───────────────────────────────────────────────────────────────

set -e

# ====== COMPLETAR ESTOS 4 VALORES ======
REPO_URL="https://github.com/jorgevasquez55/web_project_api_full.git"   # tu repo (público)
DOMAIN="tudominio.example"             # dominio principal (front)
API_SUBDOMAIN="api.tudominio.example"  # subdominio de la API
MONGODB_URI="PEGA_AQUI_LA_URI_DE_ATLAS"  # mongodb+srv://...mongodb.net/aroundb?...
# =======================================

APP_DIR="$HOME/app"

echo "==> 1/8 Actualizando el sistema"
sudo apt-get update -y

echo "==> 2/8 Instalando Node.js 20, git, nginx"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx

echo "==> 3/8 Instalando PM2"
sudo npm install -g pm2

echo "==> 4/8 Clonando el repositorio"
rm -rf "$APP_DIR"
git clone "$REPO_URL" "$APP_DIR"

echo "==> 5/8 Backend: dependencias y archivo .env"
cd "$APP_DIR/backend"
npm ci
JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
cat > .env <<EOF
NODE_ENV=production
JWT_SECRET=$JWT_SECRET
PORT=3001
MONGODB_URI=$MONGODB_URI
EOF
pm2 start ecosystem.config.js
pm2 save
sudo env PATH=$PATH pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | bash || true

echo "==> 6/8 Frontend: apuntando a la API y construyendo"
cd "$APP_DIR/frontend"
# Reemplaza la URL vieja de la API por tu subdominio (https)
sed -i "s#https://api.aroundeua.aroundproject.cloudns.be#https://$API_SUBDOMAIN#g" \
  src/utils/auth.js src/utils/api.js
npm ci
npm run build

echo "==> 7/8 Configurando nginx (front + API)"
sudo cp "$APP_DIR/deploy/nginx-frontend.conf" /etc/nginx/sites-available/around-frontend
sudo cp "$APP_DIR/deploy/nginx-api.conf"      /etc/nginx/sites-available/around-api
sudo sed -i "s#tudominio.example#$DOMAIN#g" /etc/nginx/sites-available/around-frontend
sudo sed -i "s#/home/USUARIO/web_project_api_full/frontend/build#$APP_DIR/frontend/build#g" \
  /etc/nginx/sites-available/around-frontend
sudo sed -i "s#api.tudominio.example#$API_SUBDOMAIN#g" /etc/nginx/sites-available/around-api
sudo ln -sf /etc/nginx/sites-available/around-frontend /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/around-api       /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo "==> 8/8 Listo (HTTP). Estado de la API:"
pm2 status

echo ""
echo "============================================================"
echo " Backend escuchando en 127.0.0.1:3001 detrás de nginx."
echo " Front servido desde: $APP_DIR/frontend/build"
echo ""
echo " AHORA, en FreeDNS, apuntá estos dos registros A a la IP de la VM:"
echo "   $DOMAIN        -> IP externa de la VM"
echo "   $API_SUBDOMAIN -> IP externa de la VM"
echo ""
echo " Cuando el DNS ya resuelva, activá HTTPS pegando esto:"
echo "   sudo apt-get install -y certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d $DOMAIN -d $API_SUBDOMAIN"
echo "============================================================"
