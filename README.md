# Dashboard de Ventas - SuperStore

Este proyecto proporciona un **Dashboard de Ventas** que permite visualizar y analizar diferentes métricas de una tienda, incluyendo el crecimiento de ventas, retención de clientes, impacto de productos, georreferenciación de clientes, y más.

## Tabla de Contenidos
- [Descripción](#descripción)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura de Archivos](#estructura-de-archivos)
- [Uso](#uso)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## Descripción
Este dashboard utiliza datos de ventas de un archivo CSV (`SuperStore_Sales_dataset.csv`) para generar múltiples visualizaciones interactivas. El objetivo es proporcionar un análisis completo del rendimiento de la tienda, incluyendo análisis temporal, georreferenciación, análisis de productos, y más.

## Características
- **Crecimiento/Decrecimiento de Ventas:** Gráfico de línea que muestra la variación de ventas mensuales.
- **Fidelización y Retención de Clientes:** Gráfico de barras que compara clientes nuevos y recurrentes.
- **Impacto de Productos en Ventas:** Gráfico de barras para los productos más vendidos.
- **Análisis Temporal:** Gráfico de líneas para observar las ventas por periodo.
- **Distribución Geográfica de Clientes:** Mapa interactivo que muestra la ubicación de los clientes.
- **Cantidad y Clase de Servicios:** Gráfico de barras que representa las diferentes clases de servicios y su frecuencia.

## Requisitos Previos
- Navegador Web
- [Node.js](https://nodejs.org/) (opcional, si se desea configurar un servidor local para desarrollo)
- Conexión a Internet para cargar los recursos de Leaflet.js desde el CDN.

## Instalación
1. **Clonar este repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/dashboard-superstore.git
