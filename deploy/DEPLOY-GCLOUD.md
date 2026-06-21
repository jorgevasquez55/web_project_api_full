# Despliegue en Google Cloud (VM) + MongoDB Atlas

Flujo pensado para hacerse casi todo desde el navegador. Lo único tipo
"terminal" es **pegar** el script `setup-vm.sh` en la consola SSH del navegador
(no hay que escribir comandos a mano).

Orden: Atlas → VM → DNS → pegar script → HTTPS.

---

## 1. Base de datos: MongoDB Atlas (navegador, gratis)

1. Entrá a https://www.mongodb.com/cloud/atlas/register y creá la cuenta.
2. Creá un cluster **M0 (Free)**. Elegí proveedor/región (cualquiera sirve).
3. **Database Access** → creá un usuario de base con contraseña (anotala).
4. **Network Access** → Add IP Address → **0.0.0.0/0** (permite que la VM conecte).
5. **Database → Connect → Drivers** → copiá la cadena `mongodb+srv://...`
   y agregale el nombre de la base antes del `?`:
   `mongodb+srv://usuario:clave@cluster0.xxxx.mongodb.net/aroundb?retryWrites=true&w=majority`

Esa cadena es tu `MONGODB_URI`.

## 2. La VM en Google Cloud (navegador)

Console → **Compute Engine → VM instances → Create instance**. Para que sea
**gratis** (Always Free), configurá exactamente así:

- **Region**: `us-central1`, `us-east1` o `us-west1` (solo estas son gratis).
- **Machine type**: `e2-micro`.
- **Boot disk** → Change → tipo **Standard persistent disk**, 30 GB, Ubuntu 22.04 LTS.
- **Data protection**: No backups.
- **Observability**: destildá "Install Ops Agent".
- **Firewall**: tildá **Allow HTTP traffic** y **Allow HTTPS traffic**.
- Create.

Anotá la **IP externa** que te muestra la lista de VMs.

## 3. Apuntar el dominio (FreeDNS, navegador)

En FreeDNS creá dos registros **A** apuntando a la IP externa de la VM:

- `tudominio.example` → IP
- `api.tudominio.example` → IP

## 4. Instalar todo: pegar el script

1. En la lista de VMs, clic en el botón **SSH** (abre una terminal en el navegador).
2. Abrí `deploy/setup-vm.sh` de este proyecto y completá arriba los 4 valores:
   `REPO_URL`, `DOMAIN`, `API_SUBDOMAIN`, `MONGODB_URI`.
3. Copiá **todo** el contenido del script y pegalo en la ventana SSH. Enter.

El script instala Node, nginx y PM2, clona el repo, crea el `.env` (con un
`JWT_SECRET` aleatorio), apunta el front a tu subdominio de API, construye el
front, levanta la API con PM2 y deja nginx sirviendo en el puerto 80.

> El repo debe ser **público** para que `git clone` funcione sin credenciales.
> Si es privado, hacelo público un momento, o usá un token de acceso.

## 5. HTTPS (al final, cuando el DNS ya resuelva)

En la misma ventana SSH pegá:

```
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.example -d api.tudominio.example
```

Certbot agrega los certificados y la redirección a HTTPS solo.

## 6. Prueba de caída (PM2) y checklist

```
curl https://api.tudominio.example/crash-test   # tumba el proceso
pm2 status                                       # PM2 lo reinicia solo
curl https://api.tudominio.example/cards         # responde sin tocar nada
```

- [ ] Registro y login sobre el dominio
- [ ] Editar perfil y avatar
- [ ] Agregar / eliminar tarjetas y "me gusta"
- [ ] HTTPS activo en front y API
- [ ] Quitar el bloque `/crash-test` de `backend/app.js` tras la revisión
      (`pm2 restart around-api` después)
- [ ] Dominio agregado al `README.md` de la raíz
