-- ============================================================
-- GIVASHU AGROTECH - COMPLETE DATABASE DUMP
-- ============================================================
-- Generated: April 2024
-- Tables: 16
-- Total Records: 47+ entries
-- ============================================================

-- Drop tables if they exist (for clean import)
DROP TABLE IF EXISTS traceability CASCADE;
DROP TABLE IF EXISTS nutrition_facts CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS loyalty_history CASCADE;
DROP TABLE IF EXISTS loyalty_points CASCADE;
DROP TABLE IF EXISTS bulk_orders CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS farmers CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (name, slug, image_url, description, display_order) VALUES
('Makhana', 'makhana', 'https://images.pexels.com/photos/62097/pexels-photo-62097.jpeg?auto=compress&cs=tinysrgb&w=400', 'Premium fox nuts - healthy snacking', 1),
('Mangoes', 'mangoes', 'https://images.pexels.com/photos/39303/mango-tropical-fruit-juicy-sweet-39303.jpeg?auto=compress&cs=tinysrgb&w=400', 'Fresh farm mangoes - King of fruits', 2),
('Spices', 'spices', 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400', 'Authentic Indian spices', 3),
('Grains', 'grains', 'https://images.pexels.com/photos/60021/grain-wheat-cereals-agriculture-60021.jpeg?auto=compress&cs=tinysrgb&w=400', 'Organic food grains & pulses', 4),
('Dry Fruits', 'dry-fruits', 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400', 'Premium nuts and dried fruits', 5),
('Vegetables', 'vegetables', 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=400', 'Fresh organic vegetables', 6);

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price INTEGER NOT NULL,
    original_price INTEGER DEFAULT 0,
    image_url TEXT,
    description TEXT,
    rating NUMERIC(2,1) DEFAULT 4.5,
    featured BOOLEAN DEFAULT FALSE,
    stock INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO products (name, category, price, original_price, image_url, description, rating, featured, stock) VALUES
('Premium Roasted Makhana - Peri Peri', 'makhana', 249, 299, 'https://images.pexels.com/photos/62097/pexels-photo-62097.jpeg?auto=compress&cs=tinysrgb&w=400', 'Spicy peri peri flavored roasted fox nuts, perfect healthy snack', 4.8, TRUE, 150),
('Classic Salted Makhana', 'makhana', 199, 229, 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400', 'Lightly salted crispy fox nuts, gluten-free and high protein', 4.7, TRUE, 200),
('Cream & Onion Makhana', 'makhana', 229, 259, 'https://images.pexels.com/photos/62097/pexels-photo-62097.jpeg?auto=compress&cs=tinysrgb&w=400', 'Delicious cream and onion flavored roasted makhana', 4.6, FALSE, 100),
('Alphonso Mangoes - 1 Dozen', 'mangoes', 899, 1099, 'https://images.pexels.com/photos/39303/mango-tropical-fruit-juicy-sweet-39303.jpeg?auto=compress&cs=tinysrgb&w=400', 'Premium Devgad Alphonso mangoes, naturally ripened', 4.9, TRUE, 50),
('Dasheri Mangoes - 5kg Box', 'mangoes', 599, 749, 'https://images.pexels.com/photos/2294472/pexels-photo-2294472.jpeg?auto=compress&cs=tinysrgb&w=400', 'Sweet and aromatic Dasheri mangoes from Malihabad', 4.7, FALSE, 80),
('Organic Turmeric Powder', 'spices', 149, 189, 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400', 'Pure organic turmeric powder with high curcumin content', 4.8, TRUE, 300),
('Red Chili Powder', 'spices', 129, 159, 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400', 'Premium Kashmiri red chili powder for rich color', 4.6, FALSE, 250),
('Garam Masala', 'spices', 179, 219, 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400', 'Authentic blend of whole spices, freshly ground', 4.9, TRUE, 180),
('Organic Basmati Rice', 'grains', 349, 399, 'https://images.pexels.com/photos/60021/grain-wheat-cereals-agriculture-60021.jpeg?auto=compress&cs=tinysrgb&w=400', 'Long grain aromatic basmati rice aged for 2 years', 4.8, TRUE, 120),
('Quinoa Seeds', 'grains', 279, 329, 'https://images.pexels.com/photos/60021/grain-wheat-cereals-agriculture-60021.jpeg?auto=compress&cs=tinysrgb&w=400', 'Protein-rich quinoa, perfect for healthy meals', 4.5, FALSE, 100),
('Organic Chana Dal', 'grains', 159, 189, 'https://images.pexels.com/photos/60021/grain-wheat-cereals-agriculture-60021.jpeg?auto=compress&cs=tinysrgb&w=400', 'Split Bengal gram, high protein pulse', 4.7, FALSE, 200),
('Premium Almonds', 'dry-fruits', 699, 799, 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400', 'California almonds, rich in Vitamin E and healthy fats', 4.9, TRUE, 90);

-- ============================================================
-- TABLE: testimonials
-- ============================================================
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    rating INTEGER DEFAULT 5,
    text TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO testimonials (name, location, rating, text, avatar_url) VALUES
('Priya Sharma', 'New Delhi', 5, 'The quality of makhana from Givashu Agrotech is exceptional! Perfectly roasted and so fresh. My family loves the peri peri flavor. Will definitely order again!', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'),
('Rajesh Kumar', 'Mumbai', 5, 'Best Alphonso mangoes I''ve ever tasted! They were perfectly ripe and sweet. The packaging was excellent too. Highly recommended for mango lovers.', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'),
('Anita Patel', 'Bangalore', 5, 'I love that they support local farmers. The organic spices are so aromatic and authentic. The turmeric powder has such a rich color and flavor. Great initiative!', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'),
('Vikram Singh', 'Hyderabad', 5, 'Fast delivery and excellent customer service. The dry fruits are premium quality and fresh. Their almonds are the best I''ve found online. Keep up the good work!', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'),
('Sunita Gupta', 'Chennai', 5, 'Finally found a trustworthy source for organic grains. The basmati rice is fragrant and cooks perfectly. Love their commitment to organic farming!', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100'),
('Amit Mishra', 'Lucknow', 5, 'The Dasheri mangoes reminded me of my childhood in Malihabad. Absolutely delicious and authentic. Givashu Agrotech delivers on their promise of quality.', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100');

-- ============================================================
-- TABLE: blogs
-- ============================================================
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT,
    image_url TEXT,
    excerpt TEXT,
    content TEXT,
    tags JSONB,
    read_time INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO blogs (title, slug, category, image_url, excerpt, content, read_time) VALUES
('5 Healthy Makhana Recipes for Weight Loss', 'healthy-makhana-recipes', 'Recipes', 'https://images.pexels.com/photos/62097/pexels-photo-62097.jpeg', 'Discover delicious and healthy ways to incorporate makhana into your diet.', 'Makhana is a superfood perfect for healthy snacking and weight management.', 5),
('The Journey of an Alphonso Mango', 'alphonso-mango-journey', 'Farmer Stories', 'https://images.pexels.com/photos/39303/mango-tropical-fruit-juicy-sweet-39303.jpeg', 'Learn how the king of fruits travels from our partner farms to your home.', 'The Alphonso mango from Ratnagiri is known worldwide for its sweetness.', 7),
('Understanding Organic Certifications', 'organic-certifications-guide', 'Education', 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg', 'A complete guide to understanding organic labels in India.', 'Organic certifications ensure products meet strict quality standards.', 6),
('Benefits of Turmeric', 'turmeric-benefits', 'Health', 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg', 'Discover why turmeric is called the golden spice of India.', 'Turmeric has powerful anti-inflammatory properties.', 4),
('How to Store Dry Fruits', 'dry-fruits-storage-guide', 'How To', 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', 'Simple tips to keep your dry fruits fresh.', 'Proper storage extends shelf life significantly.', 3);

-- ============================================================
-- TABLE: farmers
-- ============================================================
CREATE TABLE farmers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    image_url TEXT,
    story TEXT,
    products JSONB,
    years_farming INTEGER,
    farm_size TEXT,
    certifications JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO farmers (name, location, image_url, story, years_farming, farm_size) VALUES
('Ram Singh Patel', 'Ratnagiri, Maharashtra', 'https://images.pexels.com/photos/2889440/pexels-photo-2889440.jpeg', 'Ram Singh has been cultivating Alphonso mangoes for over 30 years using organic methods.', 30, '25 acres'),
('Lakshmi Devi', 'Darbhanga, Bihar', 'https://images.pexels.com/photos/2889440/pexels-photo-2889440.jpeg', 'Lakshmi leads a women''s cooperative producing premium makhana.', 15, '15 acres'),
('Gurmeet Singh', 'Amritsar, Punjab', 'https://images.pexels.com/photos/2889440/pexels-photo-2889440.jpeg', 'Gurmeet revolutionized organic wheat farming in Punjab.', 25, '50 acres'),
('Meera Bai', 'Jodhpur, Rajasthan', 'https://images.pexels.com/photos/2889440/pexels-photo-2889440.jpeg', 'Meera Bai grows spices using water conservation techniques.', 20, '20 acres'),
('Karthik Reddy', 'Anantapur, Andhra Pradesh', 'https://images.pexels.com/photos/2889440/pexels-photo-2889440.jpeg', 'Karthik''s family grows almonds and walnuts sustainably.', 18, '40 acres');

-- ============================================================
-- TABLE: certifications
-- ============================================================
CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    valid_until TIMESTAMPTZ
);

INSERT INTO certifications (name, image_url, description, valid_until) VALUES
('FSSAI Certified', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Fssai_logo.svg/1200px-Fssai_logo.svg.png', 'Food Safety and Standards Authority of India certification ensures food safety and quality standards.', '2025-12-31'),
('India Organic', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Fssai_logo.svg/1200px-Fssai_logo.svg.png', 'National Program for Organic Production certification for organic products.', '2025-06-30'),
('USDA Organic', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Fssai_logo.svg/1200px-Fssai_logo.svg.png', 'United States Department of Agriculture organic certification for export quality.', '2025-09-15'),
('ISO 22000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Fssai_logo.svg/1200px-Fssai_logo.svg.png', 'International food safety management system certification.', '2025-11-20');

-- ============================================================
-- TABLE: nutrition_facts
-- ============================================================
CREATE TABLE nutrition_facts (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    serving_size TEXT,
    calories INTEGER,
    protein TEXT,
    carbs TEXT,
    fat TEXT,
    fiber TEXT,
    sugar TEXT,
    sodium TEXT,
    ingredients TEXT,
    allergens TEXT
);

INSERT INTO nutrition_facts (product_id, serving_size, calories, protein, carbs, fat, fiber, sugar, sodium, ingredients, allergens) VALUES
(1, '30g', 120, '4g', '20g', '1g', '2g', '0g', '5mg', 'Fox nuts, Peri Peri seasoning, Salt', 'None'),
(4, '200g', 134, '1.4g', '35g', '0.6g', '2.4g', '31g', '2mg', 'Fresh Alphonso Mangoes', 'None'),
(6, '5g', 18, '0.5g', '3g', '0.2g', '1g', '0g', '1mg', '100% Organic Turmeric', 'None');

-- ============================================================
-- TABLE: traceability
-- ============================================================
CREATE TABLE traceability (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    batch_code TEXT,
    farm_name TEXT,
    farmer_id INTEGER,
    harvest_date TIMESTAMPTZ,
    processing_date TIMESTAMPTZ,
    packaging_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    qr_code TEXT
);

INSERT INTO traceability (product_id, batch_code, farm_name, harvest_date, processing_date, packaging_date, expiry_date, qr_code) VALUES
(1, 'MKH240301', 'Mithila Organics', '2024-02-15', '2024-02-20', '2024-02-25', '2025-02-25', 'GV-MKH-001'),
(4, 'MNG240301', 'Ratnagiri Farms', '2024-03-01', NULL, '2024-03-02', '2024-03-10', 'GV-MNG-001'),
(6, 'TRM240301', 'Rajasthan Organics', '2024-01-10', '2024-01-15', '2024-01-20', '2026-01-20', 'GV-TRM-001');

-- ============================================================
-- TABLE: contacts
-- ============================================================
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: profiles (for user auth)
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    address JSONB,
    referral_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: cart_items
-- ============================================================
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    session_id TEXT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: wishlists
-- ============================================================
CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    total INTEGER NOT NULL,
    status TEXT DEFAULT 'confirmed',
    shipping_address JSONB,
    payment_method TEXT,
    tracking_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL
);

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    images JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: subscriptions
-- ============================================================
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id INTEGER NOT NULL,
    frequency TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    next_delivery TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: newsletter_subscribers
-- ============================================================
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: bulk_orders
-- ============================================================
CREATE TABLE bulk_orders (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    product_type TEXT,
    quantity TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: loyalty_points
-- ============================================================
CREATE TABLE loyalty_points (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    points INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'Bronze',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: loyalty_history
-- ============================================================
CREATE TABLE loyalty_history (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    points INTEGER NOT NULL,
    type TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: referrals
-- ============================================================
CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    referrer_id UUID NOT NULL,
    referred_id UUID NOT NULL,
    code TEXT,
    reward INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_blogs_category ON blogs(category);
CREATE INDEX idx_blogs_slug ON blogs(slug);

-- ============================================================
-- END OF DATABASE DUMP
-- ============================================================
