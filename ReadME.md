# Facebook Ads Reporting System (ARS)
A full-stack marketing analytics dashboard designed to synchronize and visualize performance data from the Meta (Facebook) Ads API. Built with a modern decoupled architecture using Laravel 12 and Next.js 15.

# 🚀 Features
- Real-time Sync: Fetches Spend, Impressions, Clicks, and Conversions directly from Meta Graph API (v22.0+).

- Intelligent Fallback: Automatically generates realistic mock data if the Facebook Account has no active spend, ensuring the UI is always testable.

- Automated Migrations: Clean database schema with unique constraints on ad account and date to prevent duplicate records.

- Responsive UI: A sleek, dark-themed dashboard built with Tailwind CSS and Lucide icons.

# 🛠️ Tech Stack
## Backend
- Framework: Laravel 12

- Language: PHP 8.4

- Database: MySQL (via XAMPP/MariaDB)

- Tools: Laravel Sanctum, Guzzle/Http Client

## Frontend
- Framework: Next.js 15 (App Router)

- Language: TypeScript

- Styling: Tailwind CSS

- Icons: Lucide React

## 📦 Installation & Setup
## Backend Setup (Laravel)
```
# Navigate to server directory
cd server

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate
```
## Frontend Setup (Next.js)

```
# Navigate to client directory
cd client

# Install dependencies
npm install

# Run development server
npm run dev
```
