# Whisper of Motion

**Pre-Collection Textile, Silhouettes and Cut Development**
Designer: Lina Nguen | BA Fashion & Textile, Level 4
Live: [https://whisper-of-motion.vercel.app](https://whisper-of-motion.vercel.app)

---

## Stack

- Vanilla HTML + CSS + JavaScript
- GSAP 3.12.5 (CDN) for scroll interactions
- Google Fonts: Cormorant Garamond, Cormorant SC, DM Sans, Space Mono
- Zero build tools. Zero frameworks. Zero paid libraries.

---

## Setup

### 1. Clone & Serve Locally

```bash
git clone https://github.com/YOUR_USERNAME/whisper-of-motion.git
cd whisper-of-motion
npx serve .
```

Open `http://localhost:3000`

### 2. Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) → Sign up free → Note your `cloud_name`
2. Dashboard → Media Library → Upload all images and videos
3. Copy URLs and apply transformation params:

**Images:**
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/f_auto,q_auto,w_1200/filename
```

**Video loops:**
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/f_auto,q_auto,so_0,eo_8/filename
```

**Open Graph image:**
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/f_auto,q_auto,c_fill,g_auto,w_1200,h_630/filename
```

**Portrait crops:**
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/f_auto,q_auto,c_fill,g_face,w_320,h_400/filename
```

4. Find and replace `YOUR_CLOUD_NAME` in all HTML files with your actual cloud name
5. Replace `YOUR_OG_IMAGE` with your Open Graph image filename

### 3. Replace Contact Info

In all HTML files' footer section, replace:
- `YOUR_EMAIL` → your email
- `YOUR_GENERAL_EMAIL` → general email
- `HANDLE` → your Instagram handle

### 4. Deploy to Vercel

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repository
3. Deploy (auto-detects static HTML, no build command needed)
4. Live at your Vercel URL

---

## File Structure

```
/
├── index.html          Home page (9 sections)
├── process.html        Process page (9 sections)
├── collection.html     Collection page (7 sections)
├── 404.html            Error page
├── manifest.json       PWA manifest
├── README.md           This file
├── styles/
│   ├── variables.css   Design tokens
│   ├── base.css        Reset & accessibility
│   ├── layout.css      Grid & responsive
│   ├── components.css  All UI components
│   ├── animations.css  Keyframes & entrance
│   └── utilities.css   Helpers
├── js/
│   ├── init.js         Boot sequence
│   ├── animations.js   rAF loop & observer
│   ├── transitions.js  Loading & page transitions
│   ├── cursor.js       Custom cursor & magnetic
│   ├── media-loader.js Lazy loading & video
│   ├── lightbox.js     Image lightbox
│   ├── marquee.js      Marquee strip
│   ├── tilt.js         3D tilt effect
│   ├── scroll-text.js  Scroll-illuminated text
│   ├── xray.js         X-Ray reveal
│   └── gsap-init.js    GSAP ScrollTrigger
├── assets/
│   └── svg/
│       ├── signature.svg   L·N monogram
│       ├── wave.svg        Section divider
│       └── vignette.svg    Hero edge mask
└── i18n/
    └── en.json         UI strings
```

---

## Performance Targets

- FCP < 1.5s on mobile 4G
- CLS = 0
- Lighthouse Performance > 85
- Lighthouse Accessibility > 95
- 60fps sustained animations

---

## License

© 2025 Lina Nguen. All rights reserved.
