# Despliegue: SISINFO

La estructura, configuración y proceso de despliegue son iguales en ambos casos (dominio normal y qa), aunque estan en maquinas diferentes.

## 1. Acceso a las VMs

La conexión se hace por SSH. Desde Windows se recomienda usar **PuTTY**.

- **Host:** IP de la VM correspondiente (producción o QA)
- **Puerto:** 22
- **Usuario:** credenciales que te proporcionan

Para acceder desde fuera de la red de la universidad es necesario usar la VPN de la universidad o Tambien se puede configurar un túnel SSH (ver sección [Acceso desde fuera de la universidad](#acceso-desde-fuera-de-la-universidad)).

## 2. Verificar el estado del sistema

Una vez conectado a la VM, se puede revisar que todo esté corriendo correctamente.

**Verificar procesos Node.js (frontend y backend):**

```bash
cd SISINFO
pm2 list
```
Deben aparecer dos procesos en estado `online`: `web` y `api` cada uno en su respectivo puerto.

**Verificar Nginx:**
```bash
sudo systemctl status nginx
```

**Verificar la base de datos:**
```bash
sudo docker ps
```
Debe aparecer el contenedor `sisinfoDB` en estado `Up`.

---

## 3. Variables de entorno

El archivo de variables de entorno se encuentra en `config/.env` dentro del proyecto.
Las variables son:

```
DB_USERNAME=...
DB_PASSWORD=...
DB_NAME=...
DB_HOST=...
DB_PORT=...
NEXT_PUBLIC_API_URL=...
FRONT_URL=...
```
**Importante:** cada vez que se modifique el `.env` es necesario hacer un rebuild completo (`npm run build`) y reiniciar los procesos (`pm2 restart all`). Las variables `NEXT_PUBLIC_*` se embeben en tiempo de compilación y no se ve reflejado el cambio si solo se reinicia.

---

## 4. Despliegue completo

Estos son los pasos para hacer un despliegue limpio desde cero.

```bash
# 1. Eliminar procesos actuales
pm2 delete all

# 2. Limpiar builds anteriores
rm -rf apps/web/.next
rm -rf .turbo

# 3. Construir el proyecto
npm run build

# 4. Levantar los servidores
pm2 start "npx next start" --name web --cwd apps/web
pm2 start "node dist/main.js" --name api --cwd apps/api

# 5. Guardar el estado de pm2 
pm2 save
```

---

## 5. Reiniciar sin rebuild

Si solo se necesita reiniciar los procesos sin cambios en el código ni en el `.env`:

```bash
pm2 restart all
```

Para detenerlos temporalmente:
```bash
pm2 stop all
```

---

## 6. Configuración de Nginx

Nginx actúa como reverse proxy y gestiona SSL. La configuración específica de SISINFO está en:

```
/etc/nginx/sites-enabled/sisinfo
```

---

## 7. Acceso desde fuera de la universidad

Desde fuera de la red de la universidad con el dominio no carga. Para probar localmente se puede usar el túnel SSH de PuTTY:

En ese caso, el `.env` debe apuntar a `localhost` en lugar del dominio:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
FRONT_URL=http://localhost:3000
```

Hacer rebuild después de este cambio, y **volver a dejarlo con el dominio** despues de hacer pruebas.

---

## 8. Persistencia entre reinicios de la VM

Para que pm2 levante los procesos automáticamente si la VM se reinicia:

```bash
pm2 save
```
