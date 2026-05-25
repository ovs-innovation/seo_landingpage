# VastoraTech — Premium SEO Agency Landing Page

A high-converting, editorial-magazine-inspired SEO agency landing page built for ambitious brands. Dark theme, hot pink accents, asymmetric layouts, and premium micro-interactions.

## ✨ Design Philosophy

**Not a template. A premium design system.**

- **Dark Background**: `#0a0e27` (deep, sophisticated)
- **Primary Accent**: `#e8409a` (hot pink—commanding without screaming)
- **Typography**: Playfair Display (headlines) + Syne (body/UI)
- **Layout**: Intentionally asymmetric—cards stagger, sections break the grid
- **Animation**: Scroll-triggered micro-interactions, parallax effects, floating cards

## 🎯 Key Design Features

### 1. **Hero Section**

- Large, bold headline with hot pink accent word
- 3 stats with animated counters
- 2 CTAs (primary + secondary button styles)
- Floating stat cards + geometric shapes with parallax
- Interactive mouse-tracking on shapes

### 2. **Services Section** (6 Cards)

- Asymmetric card grid (cards offset at different heights)
- No symmetric boring layout
- Hover states lift cards with pink border
- Emoji icons for visual hierarchy
- Services: Technical SEO, Content Strategy, Link Building, Local SEO, Ecommerce SEO, Reporting

### 3. **How It Works**

- Timeline design with left-aligned numbers
- Pink vertical line connecting steps
- Pink dots at each step marker
- Clean, editorial-style layout

### 4. **Results Section**

- Large typography for impact metrics
- 4-column grid of results
- Case study teaser with pink border
- "Read more" link with hover animation

### 5. **Testimonials**

- 3-column card grid
- Large quote marks in pink
- Author info separated by border
- Hover lift effect

### 6. **Contact Form**

- Minimal, clean design
- 2-column input layout
- Full-width textarea
- Form validation with pink error states
- Success state feedback

### 7. **Footer**

- 4-column layout (Company, Services, Company links, Connect)
- Consistent with overall design
- Clean, readable

## 🚀 Features

✅ **Responsive Design** — Mobile, tablet, desktop optimized  
✅ **Smooth Scroll Animations** — Staggered fade-in effects  
✅ **Parallax Effects** — Floating cards move with scroll  
✅ **Mouse Tracking** — Geometric shapes respond to cursor  
✅ **Counter Animation** — Stats auto-count when scrolled into view  
✅ **Form Validation** — Real-time feedback  
✅ **Performance Optimized** — RequestAnimationFrame, debounced scroll  
✅ **Accessibility** — Semantic HTML, proper contrast ratios

## 📂 File Structure

```
.
├── index.html       # Main HTML structure
├── styles.css       # Complete styling system
├── script.js        # Interactivity & animations
└── README.md        # This file
```

## 🎨 Color System

| Name            | Hex       | Usage                       |
| --------------- | --------- | --------------------------- |
| Primary Pink    | `#e8409a` | CTAs, accents, highlights   |
| Dark Background | `#0a0e27` | Main background             |
| Dark Secondary  | `#1a1f3a` | Card backgrounds, gradients |
| Light Text      | `#f5f5f5` | Headlines, primary text     |
| Text Secondary  | `#b0b0b0` | Body copy, labels           |
| Accent Border   | `#2a2f45` | Card borders, dividers      |

## 🔤 Typography

- **Headlines** (h1-h4): Playfair Display, 900 weight, tight letter-spacing (-1 to -3px)
- **Body Copy**: Syne, 400-600 weight, letter-spacing 0-0.5px
- **Callouts**: Syne, 700 weight, letter-spacing 1-2px

## 🎬 Animations

### Scroll Animations

- **Fade In + Slide Up**: Cards and sections appear as they scroll into view
- **Stagger**: Sequential animations for card grids
- **On Scroll**: Services, testimonials, results all animate in

### Interactive Animations

- **Button Hover**: Lift effect + background change
- **Card Hover**: Border color change, lift effect
- **Form Focus**: Border glow + background tint
- **Counter Animation**: Numbers auto-count when hero is in view

### Parallax Effects

- **Floating Cards**: Move independently based on scroll
- **Mouse Tracking**: Geometric shapes follow cursor position

## 🔧 Customization

### Change Primary Color

Update the CSS variable in `styles.css`:

```css
:root {
  --primary-pink: #YOUR_COLOR;
}
```

### Add More Services

Copy the service card HTML in `index.html` and add to the grid:

```html
<div class="service-card sc-7">
  <div class="service-icon">🎯</div>
  <h3>New Service</h3>
  <p>Description here...</p>
</div>
```

### Modify Testimonials

Update the testimonial cards in the HTML with your actual client quotes.

### Update Stats

Modify the `.stat-number` values in the hero section—the counter will auto-animate.

## 📱 Responsive Breakpoints

- **Desktop**: 1400px max-width layouts
- **Tablet (1024px)**: 2-column grids, adjusted sizing
- **Mobile (768px)**: Single column, full-width buttons, compact nav

## 🚀 Deployment

1. **Self-hosted**: Upload `index.html`, `styles.css`, `script.js` to your server
2. **GitHub Pages**: Push to repo, enable Pages in settings
3. **Vercel/Netlify**: Connect git repo for auto-deployment
4. **Update domain**: Change `vastoratech.com` references in footer + meta tags

## 🎯 Performance Tips

- CSS is minified-ready (no build process needed)
- Uses system fonts fallback (Playfair + Syne via Google Fonts)
- Optimized animations use `requestAnimationFrame`
- Debounced scroll events prevent jank

## 📊 Conversion Optimization

✅ Two clear CTAs in hero (Audit + Call)  
✅ Social proof (stats, testimonials, numbers)  
✅ Trust signals (client results, methodology)  
✅ Easy contact form (4 fields only)  
✅ Clear value prop (growth, transformation, ROI)  
✅ Mobile-optimized (full responsive)

## 🐛 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

---

**Build something legendary. 🚀**
