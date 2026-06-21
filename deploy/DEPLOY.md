# Guía de despliegue — web_project_api_full

Pasos para dejar la API y el front-end funcionando sobre un dominio con HTTPS.
Reemplazá en todos lados `tudominio.example`, `api.tudominio.example`, `USUARIO`
y la IP por tus valores reales.

---

## 0. Antes de subir: apuntar el front-end a tu API

El front-end tiene la URL de la API escrita en dos archivos. Editalos para que
apunten a tu subdominio **con https** ANTES de hacer el build:

- `frontend/src/utils/auth.js` → `export const BASE_URL = "https://api.tudominio.example";`
- `frontend/src/utils/api.js` → `address: "https://api.tudominio.example/"`  (con la barra final)

---

## 1. Preparar el servidor (una sola vez)

```bash
# Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# nginx
sudo apt-get install -y nginx

# PM2 global
sudo npm install -g pm2

# MongoDB Community (la API se conecta a mongodb://localhost:27017/aroundb)
# Seguí la guía oficial para tu versión de Ubuntu; luego:
sudo systemctl enable --now mongod
```

## 2. Subir el código

Asegurate de que `.git` esté solo en la raíz, y que las carpetas `frontend/` y
`backend/` no tengan `.git` propio.

```bash
# Clonando en el servidor
git clone <tu-repo> ~/web_project_api_full
# o copiando con scp desde tu máquina
# scp -r ./web_project_api_full USUARIO@IP:~/
```

## 3. Backend: variables de entorno + PM2

```bash
cd ~/web_project_api_full/backend
npm ci                      # instala dependencias desde package-lock

cp .env.example .env
# Editá .env y poné un JWT_SECRET real:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
nano .env

pm2 start ecosystem.config.js
pm2 save
pm2 startup                 # ejecutá el comando que imprime, para arrancar al reiniciar
pm2 status
```

La API queda escuchando en `127.0.0.1:3001`.

## 4. Frontend: build

Opción A — construir en tu máquina y copiar el resultado:

```bash
cd frontend
npm ci
npm run build
scp -r build USUARIO@IP:~/web_project_api_full/frontend/
```

Opción B — construir directamente en el servidor:

```bash
cd ~/web_project_api_full/frontend
npm ci
npm run build
```

El resultado queda en `frontend/build` (lo sirve nginx).

## 5. nginx

```bash
sudo cp deploy/nginx-frontend.conf /etc/nginx/sites-available/around-frontend
sudo cp deploy/nginx-api.conf      /etc/nginx/sites-available/around-api

# Editá ambos archivos y reemplazá dominio y ruta del build:
sudo nano /etc/nginx/sites-available/around-frontend
sudo nano /etc/nginx/sites-available/around-api

sudo ln -s /etc/nginx/sites-available/around-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/around-api       /etc/nginx/sites-enabled/

sudo nginx -t && sudo systemctl reload nginx
```

## 6. Dominio (FreeDNS) → IP del servidor

En FreeDNS creá dos registros **A** apuntando a la IP pública del servidor:

- `tudominio.example` → IP
- `api.tudominio.example` → IP

## 7. HTTPS con Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.example -d api.tudominio.example
```

Certbot agrega los bloques 443 y la redirección de HTTP a HTTPS
automáticamente en los archivos de nginx. Verificá la renovación:

```bash
sudo certbot renew --dry-run
```

## 8. Prueba de caída (PM2)

```bash
curl https://api.tudominio.example/crash-test     # tumba el proceso
pm2 status                                         # PM2 lo reinicia solo
curl https://api.tudominio.example/cards           # debe responder sin reiniciar a mano
```

> Recordá **eliminar el bloque `/crash-test` de `backend/app.js`** después de la
> revisión, y volver a hacer `pm2 restart around-api`.

## 9. Checklist final

- [ ] Registro y login funcionan sobre el dominio
- [ ] Editar perfil y avatar
- [ ] Agregar y eliminar tarjetas
- [ ] Agregar y quitar "me gusta"
- [ ] HTTPS activo en front-end y API
- [ ] Dominio agregado al `README.md` de la raíz
