---
name: Technical Precision
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#434653'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737784'
  outline-variant: '#c3c6d5'
  surface-tint: '#2559bd'
  primary: '#00327d'
  on-primary: '#ffffff'
  primary-container: '#0047ab'
  on-primary-container: '#a5bdff'
  inverse-primary: '#b1c5ff'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#651f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#8b2e01'
  on-tertiary-container: '#ffaa8a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001946'
  on-primary-fixed-variant: '#00419e'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802900'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  max-width: 1200px
---

## Brand & Style

The design system is engineered for a professional developer portfolio that balances high-end engineering expertise with approachable modern aesthetics. The brand personality is authoritative, precise, and transparent, aimed at technical recruiters and engineering managers.

The design style is **Corporate / Modern** with a focus on high-contrast readability. It utilizes a structured layout, purposeful whitespace, and subtle depth to guide the user through complex technical projects. The visual language emphasizes clarity over decoration, ensuring that the code and the developer’s contributions remain the focal point.

## Colors

The palette is anchored by a commanding **Deep Blue**, used specifically for primary actions, branding, and emphasis. This is contrasted against a stark **Black/Dark Gray** for high-readability text and structural headers. 

- **Primary (#0047AB):** Used for CTA buttons, active states, and links.
- **Secondary (#121212):** Used for headlines and body text to ensure maximum WCAG contrast.
- **Neutral Background (#F8F9FA):** A subtle off-white to reduce eye strain compared to pure white.
- **Surface (#FFFFFF):** Pure white used for elevated cards and input fields to create a distinct layer against the neutral background.

## Typography

The typography system relies on **Inter** for its systematic, utilitarian nature and excellent legibility at all sizes. For technical details, code snippets, and metadata labels, **JetBrains Mono** is used to reinforce the developer-centric identity of the portfolio.

- **Headlines:** Should use tighter letter-spacing and bold weights to establish a strong hierarchy.
- **Body:** Maintains a generous line height for long-form reading, such as case studies or blog posts.
- **Labels:** Monospaced labels should be used for tags (e.g., "React", "TypeScript") and status indicators.

## Layout & Spacing

This design system uses a **Fixed Grid** model for desktop, centered within a maximum width of 1200px to prevent excessive line lengths. 

- **Desktop (1024px+):** 12-column grid, 24px gutters, auto margins.
- **Tablet (768px - 1023px):** 8-column grid, 24px gutters, 32px side margins.
- **Mobile (Up to 767px):** 4-column grid, 16px gutters, 16px side margins.

Vertical spacing follows a strict 8px baseline rhythm. Use `lg` (48px) for section padding and `xl` (80px) to separate major content blocks like "Projects" from "Experience."

## Elevation & Depth

To maintain a professional and clean aesthetic, depth is achieved through **Tonal Layers** and **Ambient Shadows**. 

1. **Level 0 (Background):** Neutral Gray (#F8F9FA).
2. **Level 1 (Cards/Containers):** White (#FFFFFF) with a subtle 1px border (#E5E7EB) or an ultra-diffused shadow.
3. **Level 2 (Hover/Active):** A slightly more pronounced shadow (Offset: 0, 4px; Blur: 20px; Opacity: 4% Black) to indicate interactivity.

Shadows should be "soft-tapped"—extremely low opacity and high blur—to avoid a dated or heavy look.

## Shapes

The shape language uses **Rounded** (Level 2) corners. This medium-radius approach softens the high-contrast professional look, making the UI feel modern and approachable rather than strictly institutional.

- **Standard Elements:** 0.5rem (8px) for buttons, input fields, and small cards.
- **Large Containers:** 1rem (16px) for project hero cards and main content blocks.

## Components

### Buttons
- **Primary:** Deep Blue background, White text. High-contrast, 0.5rem roundedness.
- **Secondary:** Transparent background, 1px Deep Blue border, Deep Blue text.
- **Ghost:** Transparent background, Dark Gray text, subtle gray background on hover.

### Cards
- Used for project showcases. Features a pure white background, 1px light gray border, and 1rem rounded corners. On hover, the border color shifts to Deep Blue or the shadow deepens slightly.

### Chips (Skill Tags)
- Small, pill-shaped elements using the `label-mono` type style. Light gray background (#F1F3F5) with Dark Gray text to keep them secondary to the main content.

### Inputs
- Background: White; Border: 1px Gray (#D1D5DB). On focus, the border thickens to 2px and changes to Deep Blue with a soft blue outer glow.

### Lists
- For experience and bullet points, use a custom Deep Blue square marker (4px x 4px) instead of standard circles to reinforce the "structured/grid" theme.