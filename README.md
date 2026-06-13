# Polla Familiar Mundial 2026

Aplicación web para llevar la polla familiar del Mundial 2026: ranking, resultados en vivo y cartilla personal por participante.

## Archivos principales

- `polla-completa.html` — aplicación principal (abrir en el navegador o publicar en hosting)
- `polla-data.js` / `polla-data.json` — datos de partidos y participantes
- `parse-polla.js` — scripts para regenerar datos desde Excel (uso local)

## Uso local

Abre `polla-completa.html` en el navegador. Los resultados se guardan en `localStorage` del dispositivo.

## Publicar en GitHub Pages

1. Sube este repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, elige la rama `main` y la carpeta `/ (root)`.
4. Guarda. La URL será algo como: `https://TU_USUARIO.github.io/NOMBRE-REPO/`

`index.html` redirige automáticamente a `polla-completa.html`.

## Conectar Firebase (sincronización entre dispositivos)

El proyecto ya tiene la configuración de Firebase en `polla-completa.html` (proyecto `polla-mundial-2026-6b0cc`).

### 1. Realtime Database

1. Entra a [Firebase Console](https://console.firebase.google.com/) → tu proyecto.
2. **Build → Realtime Database → Create Database** (si aún no existe).
3. En la pestaña **Rules**, publica las reglas de `database.rules.json` (o desplégalas con Firebase CLI).

### 2. Hosting (recomendado)

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

Eso publica la web y las reglas de la base de datos. La URL quedará en `https://polla-mundial-2026-6b0cc.web.app`.

### 3. Dominios autorizados

En Firebase → **Authentication → Settings → Authorized domains**, agrega tu dominio de GitHub Pages si usas esa opción en lugar de Firebase Hosting.

## Desarrollo / actualizar datos

```bash
npm install
node parse-polla.js
```

## Notas

- `node_modules/` no se sube a Git (está en `.gitignore`).
- Haz **Exportar** desde la app antes de cambiar de dispositivo si Firebase no está activo.
- Las reglas actuales de la base de datos permiten lectura y escritura pública en `polla2026/state` (adecuado para una polla familiar; ajústalas si quieres más control).
