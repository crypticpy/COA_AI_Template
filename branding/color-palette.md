# City of Austin Color Palette

Official brand colors for COA applications.

## Primary Colors

### Brand Blue
- **Hex**: `#44499C`
- **RGB**: 68, 73, 156
- **Usage**: Primary buttons, links, headers, accents
- **Tailwind**: `brand-blue`

### Brand Green
- **Hex**: `#009F4D`
- **RGB**: 0, 159, 77
- **Usage**: Success states, secondary accent, positive indicators
- **Tailwind**: `brand-green`

## Supporting Colors

### Dark Blue
- **Hex**: `#22254E`
- **RGB**: 34, 37, 78
- **Usage**: Dark mode background, headings, dark text
- **Tailwind**: `brand-dark-blue`

### Faded White
- **Hex**: `#f7f6f5`
- **RGB**: 247, 246, 245
- **Usage**: Light mode background
- **Tailwind**: `brand-faded-white`

### Light Blue
- **Hex**: `#dcf2fd`
- **RGB**: 220, 242, 253
- **Usage**: Light accent backgrounds, highlights
- **Tailwind**: `brand-light-blue`

### Light Green
- **Hex**: `#dff0e3`
- **RGB**: 223, 240, 227
- **Usage**: Success backgrounds
- **Tailwind**: `brand-light-green`

### Dark Green
- **Hex**: `#005027`
- **RGB**: 0, 80, 39
- **Usage**: Dark success text
- **Tailwind**: `brand-dark-green`

### Compliant Green
- **Hex**: `#008743`
- **RGB**: 0, 135, 67
- **Usage**: Accessibility compliant green
- **Tailwind**: `brand-compliant-green`

## Extended Palette (Data Visualization)

| Color | Hex | Tailwind |
|-------|-----|----------|
| Red | `#F83125` | `extended-red` |
| Orange | `#FF8F00` | `extended-orange` |
| Yellow | `#FFC600` | `extended-yellow` |
| Cyan | `#009CDE` | `extended-cyan` |
| Purple | `#9F3CC9` | `extended-purple` |
| Brown | `#8F5201` | `extended-brown` |

## Semantic Colors

| Purpose | Light Mode | Dark Mode |
|---------|------------|-----------|
| Primary | `#44499C` | `#6E7CD8` |
| Secondary | `#009F4D` | `#34C577` |
| Destructive | `#F83125` | `#F83125` |
| Background | `#f7f6f5` | `#22254E` |
| Foreground | `#22254E` | `#f7f6f5` |

## Usage Examples

```tsx
// Primary action
<button className="bg-brand-blue text-white">Submit</button>

// Success message
<div className="bg-brand-light-green text-brand-dark-green">
  Success!
</div>

// Error message
<div className="bg-extended-red/10 text-extended-red">
  Error occurred
</div>

// Dark mode adaptive
<div className="bg-brand-faded-white dark:bg-brand-dark-blue">
  Content
</div>
```
