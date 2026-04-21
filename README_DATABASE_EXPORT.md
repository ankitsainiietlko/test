# Givashu Agrotech - Database Export Package

## Overview
This package contains the complete database export for the Givashu Agrotech E-Commerce Platform.

## Files Included

### 1. SQL Dump (givashu_agrotech_database_dump.sql)
- Complete PostgreSQL schema with all 21 tables
- All seed data (categories, products, testimonials, farmers, blogs, etc.)
- Indexes for performance optimization
- Ready to import into any PostgreSQL database

### 2. JSON Export (givashu_agrotech_data_export.json)
- Structured JSON format for all data
- Easy to parse programmatically
- Suitable for NoSQL databases (MongoDB, Firebase, etc.)

### 3. CSV Files
- **products.csv** - All 12 products with pricing and inventory
- **categories.csv** - 6 product categories
- **farmers.csv** - 5 farmer partner profiles

## Database Schema (21 Tables)

### Core Tables
1. **categories** - Product categories
2. **products** - Product catalog (12 products)
3. **testimonials** - Customer reviews (6 testimonials)
4. **contacts** - Contact form submissions

### Content Tables
5. **blogs** - Blog posts and recipes (5 posts)
6. **farmers** - Farmer partner profiles (5 farmers)
7. **certifications** - Quality certifications (4 certs)
8. **nutrition_facts** - Product nutrition information (3 entries)
9. **traceability** - Product traceability/QR codes (3 entries)

### E-Commerce Tables
10. **profiles** - User profiles (auth integration)
11. **cart_items** - Shopping cart items
12. **wishlists** - User wishlists
13. **orders** - Customer orders
14. **order_items** - Order line items
15. **reviews** - Product reviews

### Subscription & Loyalty Tables
16. **subscriptions** - Product subscriptions
17. **newsletter_subscribers** - Email subscribers
18. **bulk_orders** - B2B bulk order inquiries
19. **loyalty_points** - Customer loyalty points
20. **loyalty_history** - Points transaction history
21. **referrals** - Referral program tracking

## How to Import

### PostgreSQL Import
```bash
psql -U your_username -d your_database < givashu_agrotech_database_dump.sql
```

### Supabase Import
1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste the contents of `givashu_agrotech_database_dump.sql`
3. Run the query

### MongoDB Import (from JSON)
```bash
mongoimport --db givashu_agrotech --collection products --file products.json
```

## Data Statistics

| Table | Records |
|-------|---------|
| Categories | 6 |
| Products | 12 |
| Testimonials | 6 |
| Blogs | 5 |
| Farmers | 5 |
| Certifications | 4 |
| Nutrition Facts | 3 |
| Traceability | 3 |
| **Total** | **44+** |

## Product Categories
1. Makhana (Fox Nuts)
2. Mangoes
3. Spices
4. Grains
5. Dry Fruits
6. Vegetables

## Contact Information
- **Company**: Givashu Agrotech Pvt. Ltd.
- **Website**: www.givashuagrotech.com
- **Email**: contact@givashuagrotech.com
- **Phone**: +91 99997 69192
- **Address**: 128-B Upper Ground Floor, Saket, New Delhi, 110092

## License
This database export is for Givashu Agrotech internal use only.
