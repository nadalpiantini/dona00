# Product Requirements Document (PRD)
# DONA+ - Sistema de Gestión de Donaciones

**Versión:** 1.0
**Fecha:** Noviembre 2025
**Producto:** DONA+
**URL:** https://dona.sujeto10.com
**Cliente:** Banco Popular Dominicano

---

## 1. Resumen Ejecutivo

### 1.1 Visión del Producto
DONA+ es una plataforma SaaS B2B2C que revoluciona la gestión de donaciones conectando empresas de transporte con donantes y beneficiarios, facilitando la logística de donaciones a través de una infraestructura existente de transporte.

### 1.2 Propuesta de Valor

**Para Empresas de Transporte (B2B):**
- Monetización de capacidad ociosa en rutas existentes
- Responsabilidad social corporativa medible
- Dashboard completo de gestión operativa
- Analytics y reportes de impacto social

**Para Donantes (B2C):**
- Proceso simplificado de donación con verificación de entrega
- Transparencia total del ciclo de vida de la donación
- Trazabilidad en tiempo real
- Certificación de impacto social

**Para Beneficiarios (B2C):**
- Acceso verificado a donaciones
- Sistema de calificación y confianza
- Notificaciones de donaciones disponibles
- Historial de recepción

### 1.3 Objetivos de Negocio

1. **Escalabilidad:** Plataforma multi-tenant para múltiples empresas de transporte
2. **Eficiencia:** Reducir costos logísticos de donaciones en 60%
3. **Impacto:** Facilitar 10,000+ donaciones en primer año
4. **Engagement:** 80% tasa de completitud de donaciones
5. **Crecimiento:** Modelo freemium con planes premium

---

## 2. Stakeholders y Usuarios

### 2.1 Tipos de Usuario

| Rol | Descripción | Necesidades Principales |
|-----|-------------|------------------------|
| **Super Admin** | Administrador de plataforma | Gestión global, analytics, facturación |
| **Org Admin** | Admin de empresa de transporte | Configuración org, gestión de equipo |
| **Org Member** | Empleado de empresa | Gestión operativa diaria |
| **Driver** | Conductor asignado a entregas | App móvil, rutas, confirmaciones |
| **Donor** | Persona/empresa que dona | Publicar donaciones, tracking |
| **Beneficiary** | Receptor de donaciones | Reclamar donaciones, historial |

### 2.2 User Personas

#### Persona 1: María - Coordinadora de Logística (Org Admin)
- **Edad:** 35 años
- **Contexto:** Gerente de operaciones en empresa de transporte mediana
- **Goals:** Optimizar rutas, maximizar utilización de flota, impacto social
- **Pain Points:** Capacidad ociosa, falta de visibilidad, gestión manual
- **Uso:** Dashboard diario, reportes semanales, configuración de centros

#### Persona 2: Juan - Donante Frecuente (Donor)
- **Edad:** 42 años
- **Contexto:** Empresario que dona regularmente
- **Goals:** Transparencia, certificación fiscal, impacto medible
- **Pain Points:** Falta de confianza en entrega, proceso complicado
- **Uso:** Publicar donaciones 2-3 veces/mes, verificar entregas

#### Persona 3: Carmen - Beneficiaria (Beneficiary)
- **Edad:** 28 años
- **Contexto:** Madre trabajadora en comunidad de bajos recursos
- **Goals:** Acceder a donaciones necesarias, proceso digno
- **Pain Points:** Información limitada, procesos complicados
- **Uso:** Revisar donaciones disponibles, reclamar, confirmar recepción

---

## 3. Estado Actual del Producto (v1.0)

### 3.1 Funcionalidades Implementadas

#### 3.1.1 Sistema de Autenticación
- **Registro/Login** con email y contraseña
- **Recuperación de contraseña** via email
- **Gestión de sesiones** con Supabase Auth
- **Protección de rutas** basada en roles
- **Perfil de usuario** editable

#### 3.1.2 Dashboard Principal
**Módulos Activos:**

1. **Donaciones**
   - Listado completo con filtros (estado, categoría, búsqueda)
   - Crear nueva donación con formulario validado
   - Estados del ciclo de vida:
     - Pending → Publicado → Reclamado → En tránsito → Entregado/Cancelado
   - Vista detallada con historial de cambios
   - Asignación de beneficiario
   - Edición y cancelación

2. **Centros de Acopio**
   - Gestión de ubicaciones de recolección
   - Control de capacidad y disponibilidad
   - Horarios de operación
   - Estados: activo, inactivo, lleno, aceptando
   - Asignación de voluntarios
   - Geolocalización (preparado para Google Maps)

3. **Entregas**
   - Asignación de conductores
   - Tracking de estados (pendiente, aceptado, recogido, en tránsito, entregado)
   - Ruta de pickup → delivery
   - Confirmaciones de recogida y entrega
   - Notas y evidencia fotográfica (preparado)

4. **Beneficiarios**
   - Verificación de identidad
   - Sistema de calificaciones (1-5 estrellas)
   - Historial de donaciones recibidas
   - Información de contacto y ubicación
   - Gestión de estado activo/inactivo

5. **Mensajes**
   - Sistema de chat integrado (preparado)
   - Comunicación donor ↔ beneficiary
   - Soporte multimedia
   - Notificaciones en tiempo real

6. **Reportes**
   - KPIs principales:
     - Total de donaciones
     - Donaciones completadas vs pendientes
     - Tasa de éxito
     - Impacto social medido
   - Gráficos de tendencias (Recharts)
   - Exportación de datos (preparado)
   - Analytics por período

7. **Configuración**
   - Perfil de organización
   - Configuración de notificaciones
   - Seguridad y privacidad
   - Facturación (preparado)
   - Preferencias de usuario

### 3.2 Stack Tecnológico

**Frontend:**
- Next.js 14.2.18 (App Router)
- TypeScript (strict mode)
- React 18
- Tailwind CSS 3.4.1
- Radix UI (componentes accesibles)
- React Hook Form + Zod (validaciones)
- Recharts (gráficos)
- date-fns (manejo de fechas)

**Backend:**
- Supabase (PostgreSQL, Auth, Realtime)
- Row Level Security (RLS)
- Database migrations
- Edge Functions (preparado)

**DevOps:**
- Vercel (hosting y CI/CD)
- GitHub Actions (deployment automático)
- GitHub (control de versiones)

**Infraestructura:**
- Domain: dona.sujeto10.com
- SSL/TLS automático
- CDN global (Vercel)
- Database backups automáticos (Supabase)

### 3.3 Modelo de Datos Actual

**Tablas Principales:**
```
dona_organizations (empresas de transporte)
dona_users (todos los tipos de usuario)
dona_categories (categorías de donación)
dona_centers (centros de acopio)
dona_donations (donaciones)
dona_deliveries (asignaciones de entrega)
dona_delivery_items (items en entregas)
dona_messages (mensajería)
dona_message_attachments (archivos adjuntos)
dona_ratings (calificaciones)
```

**Enums:**
- `dona_user_role`: super_admin, org_admin, org_member, driver, beneficiary, donor
- `dona_donation_status`: pending, published, claimed, in_transit, delivered, cancelled
- `dona_delivery_status`: pending, accepted, picked_up, in_transit, delivered, cancelled
- `dona_center_status`: active, inactive, full, accepting

---

## 4. Roadmap de Desarrollo

### 4.1 Fase 2: Optimización y Experiencia de Usuario (Q1 2026)

#### 4.1.1 Mejoras Críticas
- [ ] **TypeScript/ESLint Compliance**: Eliminar `ignoreBuildErrors` y corregir todos los errores
- [ ] **Testing Suite**: Implementar tests unitarios (Jest) y E2E (Playwright)
- [ ] **Performance Optimization**: Code splitting, lazy loading, image optimization
- [ ] **Error Handling**: Sistema robusto de manejo de errores y fallbacks
- [ ] **Loading States**: Skeletons y optimistic updates

#### 4.1.2 Funcionalidades Nuevas
- [ ] **Notificaciones Push**: Web push notifications y email automático
- [ ] **App Móvil (Conductores)**: React Native app para drivers
- [ ] **Sistema de Matching**: Algoritmo de matching donor ↔ beneficiary
- [ ] **Calendario Integrado**: Programación de entregas con vista de calendario
- [ ] **Export/Import**: CSV/Excel export de reportes y datos

### 4.2 Fase 3: Inteligencia y Automatización (Q2 2026)

#### 4.2.1 Analytics Avanzados
- [ ] **Predictive Analytics**: ML para predecir demanda y optimizar rutas
- [ ] **Dashboards Personalizados**: Widgets configurables por usuario
- [ ] **Business Intelligence**: Integración con Power BI / Tableau
- [ ] **Reportes Automatizados**: Generación y envío automático de reportes

#### 4.2.2 Automatización
- [ ] **Auto-Assignment**: Asignación automática de conductores basada en:
  - Proximidad geográfica
  - Disponibilidad
  - Historial de desempeño
- [ ] **Route Optimization**: Optimización de rutas multi-pickup/multi-drop
- [ ] **Smart Notifications**: Notificaciones inteligentes basadas en comportamiento
- [ ] **Chatbot**: AI chatbot para soporte y preguntas frecuentes

### 4.3 Fase 4: Escalabilidad y Monetización (Q3 2026)

#### 4.3.1 Plataforma Multi-Tenant
- [ ] **White-Label**: Personalización por organización (branding, dominio)
- [ ] **API Pública**: REST API para integraciones externas
- [ ] **Webhooks**: Eventos en tiempo real para sistemas externos
- [ ] **SSO Integration**: SAML/OAuth para empresas corporativas

#### 4.3.2 Monetización
- [ ] **Planes de Subscripción**:
  - **Free**: 100 donaciones/mes, 1 centro
  - **Pro**: $99/mes - 500 donaciones/mes, 5 centros, analytics
  - **Enterprise**: Custom pricing - ilimitado, white-label, soporte dedicado
- [ ] **Marketplace de Servicios**: Servicios premium (fotografía, empaque, etc.)
- [ ] **Comisiones**: % opcional sobre donaciones corporativas grandes

#### 4.3.3 Integraciones
- [ ] **Payment Gateways**: Stripe, PayPal para donaciones monetarias
- [ ] **Shipping APIs**: Integración con APIs de transporte existentes
- [ ] **CRM Integration**: Salesforce, HubSpot
- [ ] **Accounting**: QuickBooks, Xero para facturación

### 4.4 Fase 5: Expansión y Impacto (Q4 2026)

#### 4.4.1 Nuevas Funcionalidades
- [ ] **Gamificación**: Sistema de puntos, badges, leaderboards
- [ ] **Comunidad**: Foros, grupos, eventos de donación
- [ ] **Impacto Medible**: Calculadora de CO2 ahorrado, familias ayudadas
- [ ] **Certificaciones**: Certificados de donación para incentivos fiscales
- [ ] **Blockchain**: Certificación inmutable de donaciones (opcional)

#### 4.4.2 Expansión Geográfica
- [ ] **Multi-idioma**: i18n completo (ES, EN, PT)
- [ ] **Multi-moneda**: Soporte para múltiples monedas
- [ ] **Localización**: Adaptación por país/región
- [ ] **Partnerships**: Alianzas estratégicas con ONGs

---

## 5. Requisitos Funcionales Detallados

### 5.1 RF-01: Gestión de Donaciones

**Prioridad:** Alta
**Estado:** Implementado (v1.0)

**Descripción:**
Sistema completo de ciclo de vida de donaciones desde publicación hasta entrega.

**Requisitos Específicos:**
- RF-01.1: Donante puede crear donación con título, descripción, categoría, imágenes
- RF-01.2: Sistema asigna estados automáticamente según flujo
- RF-01.3: Beneficiario puede reclamar donación disponible
- RF-01.4: Org Admin asigna conductor y vehículo para entrega
- RF-01.5: Tracking en tiempo real visible para donante y beneficiario
- RF-01.6: Confirmación de entrega con firma digital (planificado)
- RF-01.7: Sistema de calificación post-entrega

**Criterios de Aceptación:**
- ✅ Donación creada visible en dashboard en <2 segundos
- ✅ Estados se actualizan en tiempo real (Supabase Realtime)
- ✅ Notificaciones push a stakeholders en cambios de estado
- ✅ 99% disponibilidad del servicio

### 5.2 RF-02: Sistema de Matching Inteligente

**Prioridad:** Alta
**Estado:** Planificado (Fase 3)

**Descripción:**
Algoritmo que empareja donaciones con beneficiarios basado en:
- Proximidad geográfica
- Necesidades declaradas por beneficiario
- Historial de calificaciones
- Urgencia de la donación

**Requisitos Específicos:**
- RF-02.1: Análisis de ubicación donor ↔ beneficiary
- RF-02.2: Perfilado de necesidades por categoría
- RF-02.3: Score de confianza basado en historial
- RF-02.4: Notificaciones proactivas a beneficiarios con alta coincidencia

### 5.3 RF-03: Optimización de Rutas

**Prioridad:** Media
**Estado:** Planificado (Fase 3)

**Descripción:**
Optimización automática de rutas de entrega considerando:
- Múltiples pickups en misma ruta
- Ventanas de tiempo de centros de acopio
- Capacidad del vehículo
- Tráfico en tiempo real (Google Maps API)

**Requisitos Específicos:**
- RF-03.1: Integración con Google Maps Directions API
- RF-03.2: Algoritmo de TSP (Traveling Salesman Problem) simplificado
- RF-03.3: Re-optimización dinámica en caso de cambios
- RF-03.4: Estimación precisa de tiempos de entrega

### 5.4 RF-04: App Móvil para Conductores

**Prioridad:** Alta
**Estado:** Planificado (Fase 2)

**Descripción:**
Aplicación móvil nativa (iOS/Android) para conductores.

**Funcionalidades:**
- Login con credenciales de plataforma
- Vista de entregas asignadas del día
- Navegación GPS integrada
- Confirmación de pickup con foto
- Confirmación de entrega con firma digital
- Chat con dispatcher
- Modo offline para áreas sin cobertura

**Tecnología:** React Native + Expo

### 5.5 RF-05: Portal de Transparencia Pública

**Prioridad:** Baja
**Estado:** Planificado (Fase 5)

**Descripción:**
Página pública que muestra impacto social agregado sin datos sensibles.

**Métricas Públicas:**
- Total de donaciones facilitadas
- Familias ayudadas
- Empresas participantes
- CO2 ahorrado (vs transporte dedicado)
- Mapa de calor de impacto geográfico

---

## 6. Requisitos No Funcionales

### 6.1 RNF-01: Performance

**Objetivo:** Aplicación web responsiva y rápida

**Métricas:**
- **Time to First Byte (TTFB):** <200ms
- **Largest Contentful Paint (LCP):** <2.5s
- **First Input Delay (FID):** <100ms
- **Cumulative Layout Shift (CLS):** <0.1
- **Bundle Size:** <500KB (initial load)

**Estrategias:**
- Code splitting por ruta
- Lazy loading de componentes pesados
- Image optimization (WebP, AVIF)
- CDN global (Vercel Edge Network)
- Database query optimization (indices, views)

### 6.2 RNF-02: Seguridad

**Prioridad:** Crítica

**Requisitos:**
- HTTPS obligatorio (TLS 1.3)
- Row Level Security (RLS) en todas las tablas
- Sanitización de inputs (Zod validation)
- CSRF protection
- Rate limiting en API endpoints (10 req/s por IP)
- SQL injection prevention (Supabase parameterized queries)
- XSS prevention (React auto-escaping)
- Auditoría de dependencias (npm audit)
- 2FA para admins (planificado)
- Encriptación de datos sensibles en reposo

### 6.3 RNF-03: Escalabilidad

**Objetivo:** Soportar crecimiento sin degradación

**Requisitos:**
- **Usuarios concurrentes:** 10,000+ sin degradación
- **Database:** Auto-scaling (Supabase)
- **Hosting:** Serverless functions (Vercel)
- **Caching:** Redis para queries frecuentes (planificado)
- **CDN:** Assets estáticos en edge locations

### 6.4 RNF-04: Disponibilidad

**SLA Target:** 99.9% uptime (8.76 horas downtime/año)

**Estrategias:**
- Multi-region deployment (Vercel)
- Database replication (Supabase)
- Health checks automáticos
- Failover automático
- Backups diarios con retention de 30 días

### 6.5 RNF-05: Usabilidad

**Principios:**
- Mobile-first responsive design
- WCAG 2.1 Level AA compliance (accesibilidad)
- Soporte para screen readers
- Navegación por teclado completa
- Contraste de colores >4.5:1
- Textos en español dominicano (localización)

### 6.6 RNF-06: Mantenibilidad

**Estándares:**
- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- Tests: >80% code coverage (objetivo)
- Documentación inline (JSDoc)
- README actualizado
- CLAUDE.md para onboarding

---

## 7. Modelos de Datos Clave

### 7.1 Donación (dona_donations)

```typescript
interface Donation {
  id: UUID
  title: string // "Ropa de niño talla 8-10"
  description: string
  category_id: UUID // ref dona_categories
  donor_id: UUID // ref dona_users
  beneficiary_id?: UUID // ref dona_users (null hasta reclamado)
  organization_id: UUID // empresa de transporte
  center_id?: UUID // centro de acopio
  status: DonationStatus
  quantity: number
  unit: string // "piezas", "cajas", "kg"
  estimated_value?: number // valor estimado en DOP
  pickup_address?: JSONB
  delivery_address?: JSONB
  pickup_date?: Date
  delivery_date?: Date
  images?: string[] // URLs de Supabase Storage
  tags?: string[]
  metadata?: JSONB
  created_at: Date
  updated_at: Date
}
```

### 7.2 Usuario (dona_users)

```typescript
interface User {
  id: UUID // sync con auth.users
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: UserRole
  organization_id?: UUID
  address?: JSONB {
    street: string
    city: string
    province: string
    postal_code: string
    country: string
    lat?: number
    lng?: number
  }
  preferences?: JSONB {
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    categories: UUID[] // intereses
  }
  is_active: boolean
  is_verified: boolean
  verified_at?: Date
  created_at: Date
  updated_at: Date
}
```

### 7.3 Entrega (dona_deliveries)

```typescript
interface Delivery {
  id: UUID
  organization_id: UUID
  driver_id: UUID
  vehicle_id?: UUID
  status: DeliveryStatus
  pickup_location: JSONB
  delivery_location: JSONB
  pickup_time?: Date
  delivery_time?: Date
  distance_km?: number
  duration_minutes?: number
  route?: JSONB // Google Maps encoded polyline
  proof_of_pickup?: string[] // image URLs
  proof_of_delivery?: string[] // image URLs
  signature?: string // base64 signature
  notes?: string
  created_at: Date
  updated_at: Date
}
```

---

## 8. Flujos de Usuario Principales

### 8.1 Flujo: Crear y Donar

**Actor:** Donante
**Precondición:** Usuario registrado como Donor

**Pasos:**
1. Usuario navega a "Crear Donación"
2. Completa formulario:
   - Título y descripción
   - Categoría (ropa, alimentos, muebles, etc.)
   - Cantidad y unidad
   - Imágenes (opcional)
   - Ubicación de pickup
   - Fecha preferida de pickup
3. Sistema valida datos (Zod schema)
4. Sistema crea donación con estado "pending"
5. Sistema notifica a Org Admin de nueva donación
6. Org Admin revisa y publica (estado → "published")
7. Sistema notifica a beneficiarios potenciales
8. Beneficiario reclama donación (estado → "claimed")
9. Org Admin asigna conductor (estado → "in_transit")
10. Conductor confirma pickup y delivery
11. Estado final → "delivered"
12. Ambas partes califican experiencia

**Variaciones:**
- Donación rechazada por Org Admin → estado "cancelled"
- Beneficiario no confirma en 48h → auto-release
- Conductor no disponible → re-asignación automática

### 8.2 Flujo: Reclamar Donación

**Actor:** Beneficiario
**Precondición:** Usuario verificado como Beneficiary

**Pasos:**
1. Usuario navega a "Donaciones Disponibles"
2. Aplica filtros (categoría, ubicación, distancia)
3. Ve listado de donaciones "published"
4. Selecciona donación de interés
5. Ve detalles completos (fotos, descripción, ubicación)
6. Click "Reclamar Donación"
7. Sistema verifica:
   - Usuario verificado ✓
   - Sin donaciones pendientes excesivas ✓
   - Calificación mínima 3.0 ✓
8. Sistema asigna donación a beneficiario
9. Estado → "claimed"
10. Sistema notifica a donante y Org Admin
11. Beneficiario espera asignación de conductor
12. Recibe notificación con fecha/hora estimada
13. Confirma recepción al recibir
14. Califica experiencia

---

## 9. Métricas de Éxito

### 9.1 KPIs Primarios

| Métrica | Objetivo Q1 2026 | Objetivo Q4 2026 |
|---------|------------------|------------------|
| **Donaciones Completadas** | 1,000 | 10,000 |
| **Usuarios Activos Mensuales** | 500 | 5,000 |
| **Empresas Registradas** | 5 | 50 |
| **Tasa de Completitud** | 70% | 85% |
| **NPS (Net Promoter Score)** | 40 | 60 |
| **Tiempo Promedio de Entrega** | 5 días | 3 días |

### 9.2 KPIs Secundarios

- **Engagement:** Usuarios activos semanales / MAU > 40%
- **Retención:** 60% usuarios activos mes 2
- **Satisfacción:** Rating promedio > 4.0/5.0
- **Performance:** LCP < 2.5s en 75% de pageviews
- **Disponibilidad:** 99.9% uptime
- **Revenue:** $10K MRR (Q4 2026)

### 9.3 Métricas de Impacto Social

- **Familias Ayudadas:** 2,000 en primer año
- **CO2 Ahorrado:** 50 toneladas vs transporte dedicado
- **Items Desviados de Landfills:** 20,000 items
- **Horas Voluntarias:** 5,000 horas de conductores

---

## 10. Riesgos y Mitigaciones

### 10.1 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Escalabilidad DB** | Media | Alto | Supabase auto-scaling, índices optimizados, caching |
| **Bugs en Producción** | Alta | Medio | Testing suite, CI/CD, feature flags, rollback automático |
| **Dependencia Supabase** | Baja | Alto | Backups diarios, plan de migración a self-hosted |
| **Performance en Móvil** | Media | Medio | PWA optimizado, lazy loading, code splitting |

### 10.2 Riesgos de Negocio

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Baja Adopción** | Media | Alto | Marketing agresivo, onboarding simplificado, freemium |
| **Fraude en Donaciones** | Media | Alto | Verificación de usuarios, sistema de ratings, moderación |
| **Competencia** | Alta | Medio | Diferenciación por integración logística, UX superior |
| **Regulación** | Baja | Alto | Legal compliance, términos claros, privacidad |

### 10.3 Riesgos Operativos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Soporte Insuficiente** | Media | Medio | Chatbot, FAQs, documentación exhaustiva |
| **Calidad de Datos** | Alta | Medio | Validaciones estrictas, limpieza periódica |
| **Seguridad** | Baja | Crítico | Auditorías regulares, bug bounty, pentesting |

---

## 11. Plan de Lanzamiento

### 11.1 Fase Actual: MVP en Producción ✅
**Status:** Live en dona.sujeto10.com
**Fecha:** Noviembre 2025

**Completado:**
- ✅ Dashboard completo funcional
- ✅ Auth y gestión de usuarios
- ✅ CRUD de donaciones
- ✅ Gestión de centros y entregas
- ✅ Reportes básicos
- ✅ Deployment en Vercel
- ✅ Base de datos Supabase configurada

### 11.2 Fase 2: Beta Privada (Enero 2026)
**Objetivo:** Validar con usuarios reales

**Actividades:**
- Invitar 5 empresas de transporte piloto
- 50 usuarios beta (donantes y beneficiarios)
- Recolectar feedback intensivo
- Iterar rápidamente basado en uso real
- Monitoreo 24/7 de métricas

**Criterio de Éxito:** 100 donaciones completadas con >4.0 rating

### 11.3 Fase 3: Lanzamiento Público (Abril 2026)
**Objetivo:** Apertura al mercado general

**Actividades:**
- Campaña de marketing digital
- PR en medios locales
- Eventos de lanzamiento
- Partnerships con ONGs
- Programa de referidos

**Objetivo:** 1,000 usuarios en primer mes

### 11.4 Fase 4: Expansión Regional (Julio 2026)
**Objetivo:** República Dominicana completa

**Actividades:**
- Localización por región
- Partnerships con transportistas regionales
- Expansión de centros de acopio
- Marketing regional

---

## 12. Apéndices

### 12.1 Glosario

- **B2B2C:** Business-to-Business-to-Consumer
- **SaaS:** Software as a Service
- **RLS:** Row Level Security (seguridad a nivel de fila en DB)
- **MVP:** Minimum Viable Product
- **LCP:** Largest Contentful Paint
- **NPS:** Net Promoter Score
- **MRR:** Monthly Recurring Revenue

### 12.2 Referencias

- **Repositorio GitHub:** https://github.com/nadalpiantini/dona00
- **Producción:** https://dona.sujeto10.com
- **Supabase Project:** nqzhxukuvmdlpewqytpv.supabase.co
- **Documentación Técnica:** Ver CLAUDE.md en repo

### 12.3 Historial de Versiones

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0 | Nov 2025 | Documento inicial completo | Equipo DONA+ |

---

**Documento Confidencial - Banco Popular Dominicano**
**© 2025 DONA+ - Todos los derechos reservados**
