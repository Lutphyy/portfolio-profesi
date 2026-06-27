# 🌟 Luthfi Hesya Pratama - Portfolio Website

Modern, interactive, and fully responsive portfolio website built with React Router v7, Supabase, and Tailwind CSS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lutphyy/portfolio-profesi)

## ✨ Features

### 🎨 Public Website
- **Modern UI Design**: Glassmorphism effects, smooth gradients, and professional styling
- **Interactive Animations**: 
  - Rainbow splash cursor effect in hero section
  - Infinite scrolling tech stack with pause on hover
  - Smooth scroll-triggered fade-in animations
- **Optimized Performance**: 
  - Route prefetching for instant navigation
  - Client-side caching
  - Lazy loading images
- **Fully Responsive**: Mobile-first design that works on all devices
- **SEO Ready**: Meta tags, semantic HTML, and accessibility compliant

### 🔐 Admin Panel
- **Secure Authentication**: Powered by Supabase Auth
- **Dashboard**: Overview of projects and messages
- **Project Management**: Full CRUD with multiple image upload
- **Profile Customization**: Edit hero section, about page, and experiences
- **Message Inbox**: View messages from visitors (if enabled)
- **Mobile Responsive**: Hamburger menu sidebar for mobile devices

## 🚀 Tech Stack

### Frontend
- **React Router v7** - Modern routing and data loading
- **Tailwind CSS v4** - Utility-first styling
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Motion** - Animation library

### Backend & Services
- **Supabase** - Authentication, Database, Storage
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Secure data access

### Deployment
- **Vercel** - Serverless deployment
- **Node.js** - Server runtime

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Setup

1. **Clone repository**
```bash
git clone https://github.com/Lutphyy/portfolio-profesi.git
cd portfolio-profesi
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy .env.example to .env
copy .env.example .env

# Edit .env with your Supabase credentials
```

4. **Setup Supabase**

Run SQL scripts in Supabase SQL Editor:
- `supabase-storage-setup.sql` - Storage buckets & RLS policies
- `supabase-migration-multiple-images.sql` - Database migrations

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Social Links
GITHUB_URL=https://github.com/yourusername
LINKEDIN_URL=https://linkedin.com/in/yourusername
EMAIL=your.email@example.com
```

### Supabase Setup

#### Tables Required:
- `site_config` - Site configuration (hero, about, profile)
- `projects` - Portfolio projects
- `messages` - Contact form messages (optional)

#### Storage Buckets:
- `profiles` - Profile images (public)
- `projects` - Project images (public)

#### Auth:
- Email/Password authentication enabled
- Create admin user via Supabase dashboard

## 📱 Pages

- `/` - Home (Hero + Skills + Featured Projects)
- `/projects` - All projects gallery
- `/projects/:slug` - Project detail with image gallery
- `/about` - About me + Experience timeline
- `/login` - Admin login
- `/admin` - Admin dashboard (protected)
- `/admin/projects` - Manage projects
- `/admin/messages` - View messages
- `/admin/profile` - Edit profile & site config

## 🎯 Performance

### Lighthouse Scores (Expected)

**Desktop:**
- Performance: 95-100 ⚡
- Accessibility: 100 ♿
- Best Practices: 100 ✅
- SEO: 100 🔍

**Mobile:**
- Performance: 85-95 📱
- Accessibility: 100 ♿
- Best Practices: 100 ✅
- SEO: 100 🔍

### Optimizations
- ✅ Route prefetching (`prefetch="intent"`)
- ✅ Client-side data caching
- ✅ Image lazy loading
- ✅ Code splitting
- ✅ Minified production builds

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide.

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
vercel
```

## 🛠️ Development

### Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run typecheck
```

### Project Structure

```
portfolio-profesi/
├── app/
│   ├── components/      # Reusable UI components
│   │   ├── animations/  # Animation components
│   │   ├── sections/    # Page sections (Navbar, Footer, etc)
│   │   └── ui/          # Base UI components (Button, Card, etc)
│   ├── data/            # Static data (tech stack icons)
│   ├── lib/             # Utilities (auth, supabase, storage)
│   ├── models/          # TypeScript types
│   ├── routes/          # Page routes
│   │   ├── admin/       # Admin panel pages
│   │   └── ...          # Public pages
│   ├── services/        # API services
│   └── utils/           # Helper functions
├── public/              # Static assets
└── vercel.json          # Vercel configuration
```

## 🎨 Customization

### Colors
Edit Tailwind config in `app/app.css` or component files.

### Content
All content is managed via admin panel:
- Hero section text
- About page bio
- Experience timeline
- Projects

### Tech Stack Icons
Edit `app/data/techStack.tsx` to add/remove technologies.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Luthfi Hesya Pratama**
- GitHub: [@Lutphyy](https://github.com/Lutphyy)
- LinkedIn: [Luthfi Hesya Pratama](https://www.linkedin.com/in/luthfi-hesya-pratama-bb6449248/)
- Email: luthfihesyapratama@gmail.com

## 🙏 Acknowledgments

- React Router team for amazing framework
- Supabase for backend services
- Tailwind CSS for styling system
- Vercel for deployment platform

---

**Made with ❤️ by Luthfi Hesya Pratama**

⭐ Star this repo if you found it helpful!
