# Instrucciones para Actualizar el Avatar de RudiBot

## Paso 1: Guardar la Imagen
Guarda la imagen del robot (image_4.png) que adjuntaste en esta carpeta con el nombre:
```
rudibot-avatar.png
```

## Paso 2: Actualizar el Componente
Abre el archivo: `components/ChatbotFAB.js`

Busca la línea (aproximadamente línea 168):
```javascript
const botAvatarUrl = '/rudibot-avatar.svg'; // Cambia a .png cuando guardes la imagen
```

Cámbiala a:
```javascript
const botAvatarUrl = '/rudibot-avatar.png';
```

## Paso 3: Recargar el Navegador
El avatar del robot ahora aparecerá en:
- El header del chatbot (tamaño grande)
- Junto a cada mensaje del bot (tamaño pequeño)
- En el indicador de "respondiendo..."

## Fallback Automático
Si la imagen no se carga, el componente automáticamente mostrará el emoji 🤖 como fallback.

## Estilo del Avatar
El avatar está configurado para:
- Ser circular con `border-radius: 50%`
- Mantener las proporciones con `object-fit: contain`
- Mostrar elementos decorativos (estrellas/planetas) alrededor del robot
- Tener un fondo degradado suave (indigo-50 to blue-100)
- Borde de 2px en color indigo-200
