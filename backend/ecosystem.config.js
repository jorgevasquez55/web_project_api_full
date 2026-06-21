// PM2 ejecuta la API y la reinicia automáticamente si se cae
// (esto es lo que recupera el proceso tras la prueba /crash-test).
//
// Uso desde la carpeta backend/ en el servidor:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup        // genera el comando para arrancar PM2 al reiniciar el servidor
//
// Ver estado / logs:
//   pm2 status
//   pm2 logs around-api

module.exports = {
  apps: [
    {
      name: 'around-api',
      script: 'app.js',
      cwd: './', // se arranca desde la carpeta backend/, donde está .env
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      // dotenv lee .env desde cwd; este env es solo un respaldo.
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
