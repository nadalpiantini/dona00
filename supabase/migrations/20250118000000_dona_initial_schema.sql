-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create enum types
CREATE TYPE dona_user_role AS ENUM ('super_admin', 'org_admin', 'org_member', 'driver', 'beneficiary', 'donor');
CREATE TYPE dona_donation_status AS ENUM ('pending', 'published', 'claimed', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE dona_delivery_status AS ENUM ('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE dona_center_status AS ENUM ('active', 'inactive', 'full', 'accepting');

-- Organizations table (transport companies)
CREATE TABLE dona_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    address JSONB,
    settings JSONB DEFAULT '{}',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (all user types)
CREATE TABLE dona_users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    role dona_user_role NOT NULL DEFAULT 'donor',
    organization_id UUID REFERENCES dona_organizations(id) ON DELETE SET NULL,
    address JSONB,
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collection centers
CREATE TABLE dona_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES dona_organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address JSONB NOT NULL,
    coordinates JSONB,
    phone VARCHAR(50),
    email VARCHAR(255),
    operating_hours JSONB,
    capacity_info JSONB,
    accepted_items JSONB DEFAULT '["ropa", "alimentos", "juguetes", "muebles", "electrodomésticos", "otros"]',
    status dona_center_status DEFAULT 'active',
    manager_id UUID REFERENCES dona_users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donation categories
CREATE TABLE dona_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    parent_id UUID REFERENCES dona_categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations table
CREATE TABLE dona_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES dona_organizations(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES dona_users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES dona_categories(id) ON DELETE SET NULL,
    center_id UUID REFERENCES dona_centers(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    condition VARCHAR(50) CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
    images JSONB DEFAULT '[]',
    pickup_address JSONB,
    pickup_coordinates JSONB,
    availability_schedule JSONB,
    status dona_donation_status DEFAULT 'pending',
    beneficiary_id UUID REFERENCES dona_users(id) ON DELETE SET NULL,
    claimed_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    is_urgent BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery requests and tracking
CREATE TABLE dona_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES dona_organizations(id) ON DELETE CASCADE,
    donation_id UUID NOT NULL REFERENCES dona_donations(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES dona_users(id) ON DELETE SET NULL,
    beneficiary_id UUID NOT NULL REFERENCES dona_users(id) ON DELETE CASCADE,
    pickup_address JSONB NOT NULL,
    delivery_address JSONB NOT NULL,
    pickup_coordinates JSONB,
    delivery_coordinates JSONB,
    scheduled_pickup_at TIMESTAMPTZ,
    actual_pickup_at TIMESTAMPTZ,
    scheduled_delivery_at TIMESTAMPTZ,
    actual_delivery_at TIMESTAMPTZ,
    status dona_delivery_status DEFAULT 'pending',
    delivery_fee DECIMAL(10, 2),
    payment_status VARCHAR(50),
    payment_method VARCHAR(50),
    tracking_number VARCHAR(100) UNIQUE,
    tracking_updates JSONB DEFAULT '[]',
    driver_notes TEXT,
    beneficiary_rating INTEGER CHECK (beneficiary_rating >= 1 AND beneficiary_rating <= 5),
    beneficiary_feedback TEXT,
    proof_of_delivery JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages/Chat system
CREATE TABLE dona_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES dona_organizations(id) ON DELETE CASCADE,
    donation_id UUID REFERENCES dona_donations(id) ON DELETE CASCADE,
    delivery_id UUID REFERENCES dona_deliveries(id) ON DELETE CASCADE,
    participants UUID[] NOT NULL,
    last_message_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE dona_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES dona_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES dona_users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Advertising/Banners
CREATE TABLE dona_advertisements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES dona_organizations(id) ON DELETE CASCADE,
    advertiser_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    target_url TEXT,
    placement VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics and metrics
CREATE TABLE dona_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES dona_organizations(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    user_id UUID REFERENCES dona_users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO dona_categories (name, slug, icon, color, sort_order) VALUES
('Ropa y Calzado', 'ropa-calzado', 'shirt', '#8B5CF6', 1),
('Alimentos', 'alimentos', 'utensils', '#10B981', 2),
('Muebles', 'muebles', 'sofa', '#F59E0B', 3),
('Electrodomésticos', 'electrodomesticos', 'tv', '#3B82F6', 4),
('Juguetes', 'juguetes', 'gamepad-2', '#EC4899', 5),
('Libros y Material Educativo', 'libros-educativo', 'book', '#6366F1', 6),
('Artículos del Hogar', 'articulos-hogar', 'home', '#14B8A6', 7),
('Otros', 'otros', 'package', '#6B7280', 8);

-- Create indexes for performance
CREATE INDEX idx_dona_organizations_slug ON dona_organizations(slug);
CREATE INDEX idx_dona_organizations_is_active ON dona_organizations(is_active);

CREATE INDEX idx_dona_users_email ON dona_users(email);
CREATE INDEX idx_dona_users_organization_id ON dona_users(organization_id);
CREATE INDEX idx_dona_users_role ON dona_users(role);

CREATE INDEX idx_dona_donations_organization_id ON dona_donations(organization_id);
CREATE INDEX idx_dona_donations_donor_id ON dona_donations(donor_id);
CREATE INDEX idx_dona_donations_status ON dona_donations(status);
CREATE INDEX idx_dona_donations_created_at ON dona_donations(created_at DESC);

CREATE INDEX idx_dona_deliveries_organization_id ON dona_deliveries(organization_id);
CREATE INDEX idx_dona_deliveries_donation_id ON dona_deliveries(donation_id);
CREATE INDEX idx_dona_deliveries_driver_id ON dona_deliveries(driver_id);
CREATE INDEX idx_dona_deliveries_status ON dona_deliveries(status);

CREATE INDEX idx_dona_messages_conversation_id ON dona_messages(conversation_id);
CREATE INDEX idx_dona_messages_sender_id ON dona_messages(sender_id);

-- Enable Row Level Security
ALTER TABLE dona_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dona_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dona_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dona_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dona_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dona_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dona_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dona_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dona_advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dona_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Organizations policies
CREATE POLICY "Public can view active organizations" ON dona_organizations
    FOR SELECT USING (is_active = true);

CREATE POLICY "Org admins can update their organization" ON dona_organizations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM dona_users
            WHERE dona_users.id = auth.uid()
            AND dona_users.organization_id = dona_organizations.id
            AND dona_users.role IN ('super_admin', 'org_admin')
        )
    );

-- Users policies
CREATE POLICY "Users can view their own profile" ON dona_users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON dona_users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Org members can view other org members" ON dona_users
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM dona_users WHERE id = auth.uid()
        )
    );

-- Donations policies
CREATE POLICY "Anyone can view published donations" ON dona_donations
    FOR SELECT USING (status = 'published');

CREATE POLICY "Donors can manage their own donations" ON dona_donations
    FOR ALL USING (donor_id = auth.uid());

CREATE POLICY "Org members can manage org donations" ON dona_donations
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM dona_users
            WHERE id = auth.uid()
            AND role IN ('org_admin', 'org_member')
        )
    );

-- Centers policies
CREATE POLICY "Public can view active centers" ON dona_centers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Org members can manage their centers" ON dona_centers
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM dona_users
            WHERE id = auth.uid()
            AND role IN ('org_admin', 'org_member')
        )
    );

-- Messages policies
CREATE POLICY "Users can view conversations they're part of" ON dona_conversations
    FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can send messages in their conversations" ON dona_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM dona_conversations
            WHERE dona_conversations.id = conversation_id
            AND auth.uid() = ANY(dona_conversations.participants)
        )
    );

CREATE POLICY "Users can view messages in their conversations" ON dona_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM dona_conversations
            WHERE dona_conversations.id = conversation_id
            AND auth.uid() = ANY(dona_conversations.participants)
        )
    );

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_dona_organizations_updated_at BEFORE UPDATE ON dona_organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dona_users_updated_at BEFORE UPDATE ON dona_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dona_centers_updated_at BEFORE UPDATE ON dona_centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dona_donations_updated_at BEFORE UPDATE ON dona_donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dona_deliveries_updated_at BEFORE UPDATE ON dona_deliveries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dona_advertisements_updated_at BEFORE UPDATE ON dona_advertisements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();