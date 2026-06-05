# QAPHoy - Especificación Funcional

## Descripción General

QAPHoy es una aplicación web extremadamente simple orientada a radioaficionados.

Su objetivo es permitir que cualquier radioaficionado publique temporalmente cuándo estará disponible para realizar contactos por radio y en qué frecuencia estará operando.

La aplicación debe estar optimizada para dispositivos móviles y requerir la menor cantidad posible de acciones por parte del usuario.

Los registros publicados deben eliminarse automáticamente 24 horas después de su creación.

---

# Objetivos

Permitir que los radioaficionados puedan:

* Informar que estarán disponibles en radio.
* Indicar la frecuencia en la que operarán.
* Indicar el horario en el que estarán activos.
* Consultar rápidamente quiénes están disponibles.
* Acceder desde teléfonos móviles sin instalar aplicaciones.

---

# Público Objetivo

Radioaficionados.

Uso principal:

* VHF
* UHF
* HF
* Redes de emergencia
* Ruedas de radio
* Encuentros informales

---

# Requisitos Generales

* Interfaz simple.
* Diseño Mobile First.
* Sin autenticación obligatoria en la primera versión.
* Sin instalación.
* Accesible desde navegador.
* Publicación rápida en menos de 15 segundos.

---

# Flujo Principal

## Publicar Disponibilidad

El usuario completa un formulario.

Campos:

### Indicativo

Tipo: texto

Ejemplos:

* LU4ABC
* LW8XYZ
* LU1AAA

Obligatorio.

---

### Frecuencia

Dos campos separados para mejor UX móvil:

**Campo 1: Número**
- Tipo: texto
- Separador decimal: punto (`.`)
- Ejemplos: 7100.000, 146.520, 7.100, 1.296

**Campo 2: Unidad**
- Tipo: lista desplegable
- Opciones: kHz, MHz, GHz

Ejemplos de combinación:

* 7100.000 + kHz
* 146.520 + MHz
* 145.750 + MHz
* 7.100 + MHz
* 1.296 + GHz

Validaciones:

* Campo de número obligatorio.
* Debe utilizar punto como separador decimal.
* La unidad se selecciona del desplegable (siempre válida).
* La aplicación debe mostrar un mensaje de error claro cuando el formato sea incorrecto.

La banda (HF, VHF o UHF) se determina automáticamente a partir de la frecuencia combinada.

---

### Hora Desde

Tipo: hora

Ejemplo:

18:00

Obligatorio.

---

### Hora Hasta

Tipo: hora

Ejemplo:

20:00

Obligatorio.

---

### Estado

Tipo: lista desplegable.

Opciones:

* QAP
* A la escucha
* Monitoreando
* Móvil
* Base

Obligatorio.

---

### Observaciones

Tipo: texto.

Opcional.

Ejemplos:

* También monitoreo APRS
* Escucha secundaria en 433.500
* Operando desde móvil

---

### Botón

Texto:

"Publicar"

---

# Consulta de Disponibilidad

La pantalla principal debe mostrar directamente los registros activos.

No debe ser necesario navegar a otra pantalla.

---

# Diseño de Visualización

No utilizar tablas en dispositivos móviles.

Cada registro debe mostrarse como una tarjeta.

Ejemplo:

Indicativo: LU4ABC

Estado: QAP

Frecuencia: 146.520 MHz

Horario: 18:00 - 20:00

Observación: También monitoreo APRS

Publicado hace: 15 minutos

---

# Ordenamiento

Ordenar por:

1. Hora de inicio.
2. Fecha de publicación más reciente.

---

# Filtros

Implementar filtros rápidos.

Botones:

* Todas
* HF
* VHF
* UHF

La clasificación puede realizarse automáticamente según la frecuencia ingresada.

---

# Eliminación Automática

Cada registro debe tener:

* fecha_creacion
* fecha_expiracion

La fecha de expiración será:

fecha_creacion + 24 horas

Los registros vencidos no deben mostrarse.

---

# Indicador de Actividad

Mostrar un indicador visual.

### Verde

Publicado hace menos de 30 minutos.

### Amarillo

Publicado hace menos de 2 horas.

### Gris

Publicado hace más de 2 horas.

---

# Función Rápida

Agregar botón destacado:

"Estoy en frecuencia ahora"

Al presionarlo:

* Solicitar indicativo.
* Solicitar frecuencia.
* Validar el formato de frecuencia según las reglas definidas.
* Crear registro automáticamente.
* Estado = QAP.
* Horario = ahora + 2 horas.

---

# Función Morse (Opcional)

No implementar en la primera versión.

Dejar preparada una sección futura para:

* Convertir texto a Morse.
* Reproducir Morse mediante audio.
* Reproducir indicativos en Morse.

---

# Diseño Visual

Inspiración:

* Aplicaciones modernas.
* WhatsApp.
* Telegram.

Características:

* Limpio.
* Fondo claro.
* Tipografía grande.
* Botones amplios.
* Excelente legibilidad bajo luz solar.

---

# Tecnologías

## Frontend

* Next.js 15
* TypeScript
* Tailwind CSS

## Backend

* API Routes de Next.js

## Base de Datos

* PostgreSQL

## ORM

No utilizar ORM.

Utilizar consultas SQL mediante la librería pg.

---

# Esquema de Base de Datos

Tabla:

disponibilidades

Campos:

* id
* indicativo
* frecuencia
* banda
* estado
* hora_desde
* hora_hasta
* observaciones
* fecha_creacion
* fecha_expiracion

---

# API

## Crear disponibilidad

POST

/api/disponibilidades

Validar que el campo frecuencia cumpla con el formato definido antes de almacenar el registro.

---

## Obtener disponibilidades activas

GET

/api/disponibilidades

Retornar únicamente registros no vencidos.

---

## Eliminar disponibilidad

DELETE

/api/disponibilidades/[id]

---

# Requisitos de UX

* Menos de 15 segundos para publicar.
* Menos de 3 segundos para encontrar una estación disponible.
* No requerir conocimientos técnicos.
* Totalmente funcional desde teléfonos Android e iPhone.
* Mostrar ejemplos de frecuencia válidos junto al campo para facilitar la carga.

---
