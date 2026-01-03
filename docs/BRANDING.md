# Branding Guide

How to customize the COA AI Template for your application.

## Color Palette

### Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Brand Blue | `#44499C` | Primary buttons, links, accents |
| Brand Green | `#009F4D` | Success states, secondary accent |
| Dark Blue | `#22254E` | Dark mode background, headings |
| Faded White | `#f7f6f5` | Light mode background |

### Extended Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Red | `#F83125` | Errors, destructive actions |
| Orange | `#FF8F00` | Warnings |
| Yellow | `#FFC600` | Highlights |
| Cyan | `#009CDE` | Information |
| Purple | `#9F3CC9` | Special indicators |

### Using Colors in Code

```tsx
// Tailwind classes
<div className="bg-brand-blue text-white">Primary</div>
<div className="bg-brand-green">Success</div>
<div className="bg-extended-red">Error</div>

// Dark mode
<div className="bg-brand-faded-white dark:bg-brand-dark-blue">
  Adaptive background
</div>
```

## Typography

The template uses **Geist** font, loaded from Google Fonts.

```css
/* Already configured in index.css */
html {
  font-family: 'Geist', system-ui, sans-serif;
}
```

## Logo Replacement

Replace these files in `frontend/public/`:

| File | Size | Purpose |
|------|------|---------|
| `logo-horizontal.png` | 200×60px | Header logo |
| `logo-icon.png` | 64×64px | Favicon, app icon |

Original COA logos are available in `branding/`.

## Component Classes

### Cards

```tsx
// Hover effect with left border
<div className="card-hover">
  Hoverable card content
</div>
```

### Header

```tsx
// Glass morphism effect
<header className="glass-header">
  Navigation content
</header>
```

### Buttons

```tsx
// Primary button
<button className="btn-primary">Primary Action</button>

// Secondary button
<button className="btn-secondary">Secondary Action</button>

// Or use LoadingButton component
<LoadingButton variant="primary" loading={isLoading}>
  Submit
</LoadingButton>
```

## Dark Mode

Dark mode is automatically supported via CSS variables and Tailwind's `dark:` prefix.

Toggle is built into the Header component and persists to localStorage.

```tsx
// Adaptive styling
<div className="bg-white dark:bg-gray-800">
  <p className="text-gray-900 dark:text-white">
    Text adapts to theme
  </p>
</div>
```

## Customizing the Theme

### Tailwind Config

Edit `frontend/tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          // Customize brand colors
          blue: '#YOUR_COLOR',
          green: '#YOUR_COLOR',
        },
      },
    },
  },
}
```

### CSS Variables

Edit `frontend/src/index.css`:

```css
:root {
  --brand-blue: #YOUR_COLOR;
  --brand-green: #YOUR_COLOR;
}
```

## Application Name

Update in these locations:

1. `frontend/index.html` - Page title
2. `frontend/src/components/Header.tsx` - Header text
3. `frontend/src/pages/Login.tsx` - Login page
4. `frontend/src/pages/Dashboard.tsx` - Welcome message
