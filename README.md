# DONA+ - Sistema de Gestión de Donaciones

Plataforma SaaS B2B2C para empresas de transporte que facilita la gestión de donaciones conectando donantes con beneficiarios.

## 🌐 Live Demo
- **Producción**: [dona.sujeto10.com](https://dona.sujeto10.com)
- **GitHub**: [github.com/nadalpiantini/dona00](https://github.com/nadalpiantini/dona00)

## 🚀 Características

### Dashboard Completo
- **Donaciones**: Gestión completa con estados (publicado, reclamado, en tránsito, entregado)
- **Centros de Acopio**: Control de capacidad, horarios y voluntarios
- **Entregas**: Tracking en tiempo real con asignación de conductores
- **Mensajes**: Sistema de chat integrado con soporte multimedia
- **Beneficiarios**: Verificación, calificaciones e historial
- **Reportes**: Analytics con KPIs y gráficos de impacto
- **Configuración**: Perfil, notificaciones, seguridad, facturación

## 🛠️ Stack Tecnológico
- **Frontend**: Next.js 14.2.18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel
- **Domain**: dona.sujeto10.com

## 📋 Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/nadalpiantini/dona00.git
cd dona00

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar migraciones
npx supabase db push

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3003](http://localhost:3003)

## 🔧 Configuración de Deployment

### Deploy con Vercel (Recomendado)

1. Instalar Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Configurar dominio personalizado en Vercel Dashboard

## 🔐 Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://nqzhxukuvmdlpewqytpv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://dona.sujeto10.com
```

## 📄 Licencia

Propiedad de DONA+ - Todos los derechos reservados

---

Desarrollado con ❤️ para el Banco Popular Dominicano
