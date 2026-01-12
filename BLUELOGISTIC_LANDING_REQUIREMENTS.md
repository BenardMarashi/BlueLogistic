# BlueLogistic Landing Page - Complete Requirements Specification

## Executive Summary

Build a professional SaaS landing page for **BlueLogistic** - a B2B package management platform for European shipping. This landing page will serve as the marketing website that drives sellers to sign up for the platform.

**Target Audience:** E-commerce businesses, online sellers, and companies that need to ship packages across Europe.

**Primary Goal:** Convert visitors into registered users of the BlueLogistic platform.

**Secondary Goal:** Educate visitors about pricing, coverage, and how the platform works.

---

## Project Context

### Existing System
There is an existing BlueLogistic application:
- **Backend:** Spring Boot API at `~/BlueLogistic/blue-logistic/`
- **Dashboard:** Next.js app at `~/BlueLogistic/blue-logistic-frontend/`
- **This landing page** should be created at `~/BlueLogistic/bluelogistic-landing/`

### Technology Stack (MUST match existing dashboard)
- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- next-intl for internationalization
- Framer Motion for animations
- Embla Carousel for carousels
- Lucide React for icons

---

## Brand Identity

### Company Name
**BlueLogistic** (one word, capital B and L)

### Tagline
"European shipping made simple"

### Brand Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Blue | #0D2556 | Headers, navigation, footer, primary text |
| Accent Orange | #D8420E | CTA buttons, highlights, important actions |
| Light Background | #F8FAFC | Page backgrounds, sections |
| White | #FFFFFF | Cards, content areas |
| Text Gray | #64748B | Body text, descriptions |
| Success Green | #22C55E | Checkmarks, success indicators |
| Border Light | #E2E8F0 | Borders, dividers |

### Typography
- **Font Family:** Inter (same as dashboard)
- **Headings:** Bold/Extra-bold, Primary Blue color
- **Body:** Regular weight, Text Gray color
- **Accents:** Orange color for emphasis

### Logo Concept
- Package/box icon inside a rounded square (blue background, white icon)
- "BlueLogistic" text next to it
- Similar style to the dashboard sidebar logo

---

## Language & Localization

### Supported Languages
1. **English (en)** - DEFAULT language
2. **German (de)** - Secondary language

### URL Structure
- English: `/en/`, `/en/pricing`, `/en/faq`
- German: `/de/`, `/de/pricing`, `/de/faq`
- Root `/` redirects to `/en/`

### Language Switcher
- Located in header (desktop) and footer
- Simple toggle: "EN | DE"
- Persists selection in localStorage

---

## Site Map & Pages

### Primary Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/[locale]/` | Main landing page with all sections |
| Pricing | `/[locale]/pricing` | Detailed pricing tables by destination |
| FAQ | `/[locale]/faq` | Comprehensive FAQ with categories |
| Contact | `/[locale]/contact` | Contact form and information |

### Legal Pages

| Page | Route | Purpose |
|------|-------|---------|
| Terms of Service | `/[locale]/terms` | Legal terms |
| Privacy Policy | `/[locale]/privacy` | Privacy/GDPR information |
| Imprint | `/[locale]/imprint` | Legal imprint (Impressum) |

---

## Home Page Sections (In Order)

### 1. Header/Navigation

**Behavior:**
- Fixed/sticky at top
- White background
- Subtle shadow appears on scroll
- Mobile: Hamburger menu with slide-out drawer

**Contents - Desktop:**
- LEFT: Logo
- CENTER: Navigation links
- RIGHT: Language switcher, "Log In" text link, "Get Started Free" orange button

**Navigation Links:**
- How It Works (scrolls to section)
- Pricing (scrolls to section or links to /pricing)
- FAQ (scrolls to section or links to /faq)
- Book Demo (opens Calendly or contact form)

**Mobile:**
- Logo left, hamburger right
- Drawer contains all nav links + CTAs

---

### 2. Hero Section

**Layout:** Two columns - text left, illustration right

**Background:** Light blue gradient fading to white

**Left Column Content:**

*Headline (H1):*
- English: "Ship Smarter, Save More"
- German: "Smarter versenden, mehr sparen"
- "Save More" / "mehr sparen" should be in orange accent color

*Subheadline:*
- English: "Affordable European shipping for businesses. Create labels in under 60 seconds with transparent pricing to 29+ countries."
- German: "Günstiger Europaversand für Unternehmen. Erstellen Sie Labels in unter 60 Sekunden mit transparenter Preisgestaltung in 29+ Länder."

*Feature Bullets (3 items with checkmarks):*
1. "Transparent pricing with no hidden fees" / "Transparente Preise ohne versteckte Gebühren"
2. "Free to start – no subscription required" / "Kostenloser Einstieg – kein Abo nötig"
3. "Labels ready in under 60 seconds" / "Labels in unter 60 Sekunden erstellen"

*CTA Buttons:*
- Primary (orange): "Get Started Free" / "Kostenlos starten" → Links to dashboard registration
- Secondary (outline blue): "Book Demo" / "Demo buchen" → Opens contact/calendly

*Trust Badge:*
- "Trusted by 450+ businesses across Europe" / "Vertraut von 450+ Unternehmen in Europa"

**Right Column:**
- Illustration showing European map with shipping routes
- Austria as origin point
- Animated lines going to various European destinations
- Price callout: "Ship to Germany from €4.99"

---

### 3. Partners/Trust Section

**Heading:** "Trusted by Growing Businesses" / "Vertraut von wachsenden Unternehmen"

**Content:**
- Horizontal auto-scrolling carousel of partner logos
- Use placeholder/abstract company logos (6-10 logos)
- Grayscale by default, color on hover
- Infinite loop animation

---

### 4. Value Proposition Section

**Heading:** "Why BlueLogistic?" / "Warum BlueLogistic?"

**Layout:** Three cards in a row (stack on mobile)

**Card 1: Save Time**
- Icon: Clock
- Title: "Save Time" / "Zeit sparen"
- Description: "No more manual data entry. Sellers input packages directly into the system." / "Keine manuelle Dateneingabe mehr. Verkäufer geben Pakete direkt ins System ein."

**Card 2: Save Money**
- Icon: Piggy Bank or Euro symbol
- Title: "Save Money" / "Geld sparen"
- Description: "Competitive rates starting from €2.90 to Austria and €4.99 to Germany." / "Günstige Tarife ab €2,90 nach Österreich und €4,99 nach Deutschland."

**Card 3: Stay Organized**
- Icon: Clipboard with checkmark
- Title: "Stay Organized" / "Organisiert bleiben"
- Description: "Track every package from creation to delivery. Always know where your shipments are." / "Verfolgen Sie jedes Paket von der Erstellung bis zur Zustellung. Wissen Sie immer, wo Ihre Sendungen sind."

---

### 5. How It Works Section

**Heading:** "How It Works" / "So funktioniert's"

**Layout:** Tabbed interface with 3 tabs

**Tab 1: Create Account**
- Tab Label: "1. Create Account" / "1. Konto erstellen"
- Image: Dashboard registration/login screen mockup
- Title: "Get started in minutes" / "In Minuten loslegen"
- Subtitle: "Quick. Simple. Free." / "Schnell. Einfach. Kostenlos."
- Description: "Create your free account and access the seller dashboard immediately. No credit card required." / "Erstellen Sie Ihr kostenloses Konto und greifen Sie sofort auf das Verkäufer-Dashboard zu. Keine Kreditkarte erforderlich."

**Tab 2: Add Packages**
- Tab Label: "2. Add Packages" / "2. Pakete hinzufügen"
- Image: Package creation form mockup
- Title: "Enter package details" / "Paketdetails eingeben"
- Subtitle: "All customer info in one place" / "Alle Kundeninfos an einem Ort"
- Description: "Add customer name, address, phone, weight, and destination. Our smart pricing calculates costs instantly." / "Fügen Sie Kundenname, Adresse, Telefon, Gewicht und Ziel hinzu. Unsere smarte Preisberechnung kalkuliert die Kosten sofort."

**Tab 3: Ship & Track**
- Tab Label: "3. Ship & Track" / "3. Versenden & Verfolgen"
- Image: Package list showing different status badges
- Title: "Print labels & track deliveries" / "Labels drucken & Lieferungen verfolgen"
- Subtitle: "Real-time visibility" / "Echtzeit-Übersicht"
- Description: "Generate shipping labels with one click. Track every package through Created → In Storage → Dispatched." / "Generieren Sie Versandlabels mit einem Klick. Verfolgen Sie jedes Paket durch Erstellt → Im Lager → Versendet."

**Animation:** Smooth tab transitions, image slides in from side

---

### 6. Pricing Preview Section

**Heading:** "Simple, Transparent Pricing" / "Einfache, transparente Preise"

**Subheading:** "No hidden fees. Pay only for what you ship." / "Keine versteckten Gebühren. Zahlen Sie nur für das, was Sie versenden."

**Layout:** Price cards showing destination tiers

**Pricing Display (show base 3kg prices):**

| Destination | Flag | Price |
|-------------|------|-------|
| Austria (domestic) | 🇦🇹 | from €2.90 |
| Germany | 🇩🇪 | from €5.05 |
| Central Europe | 🇨🇿🇭🇺🇸🇮🇸🇰 | from €6.00 |
| Western Europe | 🇧🇪🇫🇷🇮🇹🇳🇱 | from €8.00 |
| Spain | 🇪🇸 | from €9.00 |
| Extended EU | 🇧🇬🇫🇮🇬🇷🇸🇪 | from €10.00 |

**Note below prices:** "Prices shown are cost prices for 3kg packages. Seller dashboard shows your selling price (2x markup included)."

**CTA:** "View Full Pricing" / "Alle Preise ansehen" → Links to /pricing page

**Special Feature Callout:**
- "Smart weight splitting: Packages over 31.5kg are automatically split for optimal pricing"

---

### 7. Coverage Map Section

**Heading:** "Ship to 29 European Countries" / "Versand in 29 europäische Länder"

**Layout:** Map visualization or country grid with flags

**Countries Grouped by Region:**

*Domestic:* Austria (AT)

*Central Europe:* Germany (DE), Czechia (CZ), Hungary (HU), Slovenia (SI), Slovakia (SK)

*Western Europe:* Belgium (BE), Denmark (DK), France (FR), Croatia (HR), Italy (IT), Luxembourg (LU), Netherlands (NL), Poland (PL), Switzerland (CH)

*Southern Europe:* Spain (ES)

*Northern/Eastern EU:* Bulgaria (BG), Estonia (EE), Finland (FI), Greece (GR), Ireland (IE), Lithuania (LT), Latvia (LV), Portugal (PT), Romania (RO), Sweden (SE)

*Balkans:* Bosnia and Herzegovina (BA), Serbia (RS)

*Nordic:* Iceland (IS)

---

### 8. Testimonials Section

**Heading:** "What Our Customers Say" / "Was unsere Kunden sagen"

**Layout:** Carousel with 3 testimonial cards visible (1 on mobile)

**Testimonial Card Contents:**
- Avatar (colored circle with initials)
- Name
- Company name
- 5-star rating
- Quote text

**Sample Testimonials:**

*Testimonial 1:*
- Name: "Thomas M."
- Company: "TechShop Vienna"
- Quote EN: "BlueLogistic saved us hours every week. We used to manage shipments via WhatsApp and Excel - now everything is in one organized dashboard."
- Quote DE: "BlueLogistic spart uns jede Woche Stunden. Wir haben Sendungen früher per WhatsApp und Excel verwaltet - jetzt ist alles in einem organisierten Dashboard."

*Testimonial 2:*
- Name: "Sarah K."
- Company: "Handmade Austria"
- Quote EN: "The pricing transparency is amazing. We finally know exactly what we're paying before we ship. No surprises."
- Quote DE: "Die Preistransparenz ist fantastisch. Wir wissen endlich genau, was wir zahlen, bevor wir versenden. Keine Überraschungen."

*Testimonial 3:*
- Name: "Michael B."
- Company: "SportGear Online"
- Quote EN: "Setup took 10 minutes. We were creating labels and tracking packages the same day. Incredibly easy."
- Quote DE: "Die Einrichtung dauerte 10 Minuten. Wir haben am selben Tag Labels erstellt und Pakete verfolgt. Unglaublich einfach."

---

### 9. Integrations Section

**Background:** Light blue tinted

**Heading:** "Works With Your Tools" / "Funktioniert mit Ihren Tools"

**Subheading:** "Connect BlueLogistic to your existing workflow. More integrations coming soon." / "Verbinden Sie BlueLogistic mit Ihrem bestehenden Workflow. Weitere Integrationen folgen."

**Integration Display (hub-and-spoke or grid):**
- Center: BlueLogistic logo
- Around it:
  - API Access (available now)
  - CSV Import (available now)
  - Shopify (coming soon)
  - WooCommerce (coming soon)

**CTA:** "Request an Integration" / "Integration anfragen" → Opens contact form

---

### 10. FAQ Section (Preview)

**Heading:** "Frequently Asked Questions" / "Häufig gestellte Fragen"

**Layout:** Accordion with 6 questions

**Questions & Answers:**

**Q1:** "How does pricing work?" / "Wie funktioniert die Preisgestaltung?"
**A1:** "We offer transparent per-package pricing based on weight and destination. There are no monthly fees or subscriptions - you only pay for what you ship. Prices start from €2.90 for domestic Austrian shipments." / "Wir bieten transparente Preise pro Paket basierend auf Gewicht und Ziel. Es gibt keine monatlichen Gebühren oder Abos - Sie zahlen nur für das, was Sie versenden. Die Preise beginnen bei €2,90 für österreichische Inlandssendungen."

**Q2:** "What countries can I ship to?" / "In welche Länder kann ich versenden?"
**A2:** "We currently support 29 European countries including Germany, Austria, France, Italy, Spain, Netherlands, and more. See our full coverage map for details." / "Wir unterstützen derzeit 29 europäische Länder, darunter Deutschland, Österreich, Frankreich, Italien, Spanien, Niederlande und mehr. Sehen Sie unsere vollständige Abdeckungskarte für Details."

**Q3:** "How do I get tracking numbers?" / "Wie erhalte ich Sendungsnummern?"
**A3:** "Tracking numbers are added by our logistics team when your package is dispatched. They appear automatically in your dashboard and you'll be notified immediately." / "Sendungsnummern werden von unserem Logistikteam hinzugefügt, wenn Ihr Paket versendet wird. Sie erscheinen automatisch in Ihrem Dashboard und Sie werden sofort benachrichtigt."

**Q4:** "Is there a minimum shipment volume?" / "Gibt es ein Mindestversandvolumen?"
**A4:** "No minimums required. Ship one package or thousands - you get the same competitive rates. BlueLogistic is designed to scale with your business." / "Keine Mindestmengen erforderlich. Versenden Sie ein Paket oder tausende - Sie erhalten die gleichen günstigen Tarife. BlueLogistic ist darauf ausgelegt, mit Ihrem Unternehmen zu wachsen."

**Q5:** "How long does setup take?" / "Wie lange dauert die Einrichtung?"
**A5:** "Most businesses are creating their first shipping labels within 10 minutes of signing up. Just create an account, enter your company details, and you're ready to go." / "Die meisten Unternehmen erstellen ihre ersten Versandlabels innerhalb von 10 Minuten nach der Anmeldung. Erstellen Sie einfach ein Konto, geben Sie Ihre Firmendaten ein, und Sie können loslegen."

**Q6:** "Can I integrate with my e-commerce platform?" / "Kann ich es mit meiner E-Commerce-Plattform integrieren?"
**A6:** "Yes! API access is available for custom integrations. We're also working on native Shopify and WooCommerce plugins. Contact us to discuss your integration needs." / "Ja! API-Zugang ist für individuelle Integrationen verfügbar. Wir arbeiten auch an nativen Shopify- und WooCommerce-Plugins. Kontaktieren Sie uns, um Ihre Integrationsbedürfnisse zu besprechen."

**CTA:** "View All FAQs" / "Alle FAQs ansehen" → Links to /faq page

---

### 11. Final CTA Section

**Background:** Full-width gradient using brand blue

**Heading:** "Ready to Ship Smarter?" / "Bereit, smarter zu versenden?"

**Subheading:** "Join 450+ businesses saving time and money with BlueLogistic" / "Schließen Sie sich 450+ Unternehmen an, die mit BlueLogistic Zeit und Geld sparen"

**Buttons:**
- Primary (white background, blue text): "Get Started Free" / "Kostenlos starten"
- Secondary (white outline): "Book Demo" / "Demo buchen"

---

### 12. Footer

**Background:** Dark blue (#0D2556)

**Layout:** Multi-column grid

**Column 1 - Brand:**
- Logo (white version)
- Tagline: "European shipping made simple" / "Europaversand einfach gemacht"
- CTA Button: "Get Started Free" / "Kostenlos starten"

**Column 2 - Product:**
- How It Works / So funktioniert's
- Pricing / Preise
- Coverage / Abdeckung
- FAQ

**Column 3 - Resources:**
- Documentation / Dokumentation
- API Reference / API-Referenz
- Support

**Column 4 - Company:**
- About Us / Über uns
- Contact / Kontakt
- Book Demo / Demo buchen

**Column 5 - Legal:**
- Terms of Service / AGB
- Privacy Policy / Datenschutz
- Imprint / Impressum

**Bottom Bar:**
- Language switcher: EN | DE
- Copyright: "© 2025 BlueLogistic. All rights reserved." / "© 2025 BlueLogistic. Alle Rechte vorbehalten."

---

## Detailed Pricing Page Requirements

### Page: `/[locale]/pricing`

**Hero:**
- Heading: "Transparent Pricing for Every Shipment" / "Transparente Preise für jede Sendung"
- Subheading: "Calculate your shipping costs instantly. No hidden fees, no surprises." / "Berechnen Sie Ihre Versandkosten sofort. Keine versteckten Gebühren, keine Überraschungen."

**Weight Selector:**
- Dropdown or button group
- Options: 3kg, 5kg, 10kg, 15kg, 20kg, 25kg, 31.5kg

**Destination Tabs:**
- Austria (Domestic)
- Germany
- Central Europe (CZ, HU, SI, SK)
- Western Europe (BE, DK, FR, HR, IT, LU, NL, PL, CH)
- Spain
- Extended EU (BG, EE, FI, GR, IE, LT, LV, PT, RO, SE)
- Balkans (BA, RS)
- Iceland

**Price Table Per Tab:**

| Weight Bracket | Cost Price | Your Selling Price |
|---------------|------------|-------------------|
| Up to 3kg | €X.XX | €X.XX (2x) |
| Up to 5kg | €X.XX | €X.XX (2x) |
| Up to 10kg | €X.XX | €X.XX (2x) |
| Up to 15kg | €X.XX | €X.XX (2x) |
| Up to 20kg | €X.XX | €X.XX (2x) |
| Up to 25kg | €X.XX | €X.XX (2x) |
| Up to 31.5kg | €X.XX | €X.XX (2x) |

**Actual Pricing Data to Use:**

*Austria (AT):* 2.90, 3.15, 3.55, 3.75, 4.20, 4.55, 4.95
*Germany (DE):* 5.05, 7.00, 7.00, 7.00, 7.00, 7.00, 7.00
*Central Europe:* 6.00, 8.00, 8.00, 8.00, 8.00, 8.00, 8.00
*Western Europe:* 8.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00
*Spain:* 9.00, 12.00, 12.00, 15.00, 15.00, 20.00, 20.00
*Extended EU:* 10.00, 20.00, 20.00, 20.00, 20.00, 20.00, 20.00
*Iceland:* 45.53, 46.46, 48.03, 49.02, 49.93, 51.17, 52.40

**Special Section: Weight Splitting**
- Heading: "Smart Weight Splitting"
- Explanation: "Packages over 31.5kg are automatically split into multiple shipments to find the optimal price combination. Our system calculates the cheapest way to ship heavy packages."
- Example: "A 40kg package to Austria might be split as 25kg + 15kg = €4.55 + €3.75 = €8.30 total"

**CTA:** "Get Started Free" button

---

## Full FAQ Page Requirements

### Page: `/[locale]/faq`

**Hero:**
- Heading: "Frequently Asked Questions" / "Häufig gestellte Fragen"
- Search box (optional): Filter questions

**Category Cards (clickable, jump to section):**
1. General / Allgemein
2. Pricing / Preise
3. Shipping / Versand
4. Tracking / Sendungsverfolgung
5. Account / Konto
6. Integrations / Integrationen

**FAQ Sections with Accordions:**

Include all questions from Section 10 plus additional:

*General:*
- What is BlueLogistic?
- Who is BlueLogistic for?
- Where is BlueLogistic available?

*Pricing:*
- How does pricing work?
- Are there any hidden fees?
- How is the selling price calculated?
- What about packages over 31.5kg?

*Shipping:*
- What countries can I ship to?
- How do I create a shipping label?
- What carriers do you use?
- How long does delivery take?

*Tracking:*
- How do I get tracking numbers?
- Can my customers track their packages?
- What do the status badges mean?

*Account:*
- How do I create an account?
- Is there a free plan?
- How do I add team members?

*Integrations:*
- Can I integrate with Shopify/WooCommerce?
- Is there an API?
- How do I import orders via CSV?

---

## Contact Page Requirements

### Page: `/[locale]/contact`

**Heading:** "Get in Touch" / "Kontaktieren Sie uns"

**Layout:** Two columns - form left, info right

**Contact Form Fields:**
- Name (required)
- Email (required)
- Company (optional)
- Subject dropdown: General Inquiry, Demo Request, Support, Partnership, Other
- Message (required, textarea)
- Submit button: "Send Message" / "Nachricht senden"

**Contact Information (right column):**
- Email: support@bluelogistic.com
- Response time: "We typically respond within 24 hours"
- Office hours: "Monday - Friday, 9:00 - 17:00 CET"

**Additional CTA:**
- "Book a Demo" button → Calendly or separate form

---

## Legal Pages Requirements

### Terms of Service (`/[locale]/terms`)
- Standard SaaS terms
- Service description
- User responsibilities
- Payment terms
- Liability limitations
- Termination clauses

### Privacy Policy (`/[locale]/privacy`)
- GDPR compliant
- Data collection practices
- Cookie usage
- User rights
- Data retention
- Contact for privacy inquiries

### Imprint (`/[locale]/imprint`)
- Company legal name
- Address
- Registration number
- VAT number
- Managing director
- Contact information

*Note: Use placeholder content for legal pages - they need legal review anyway*

---

## Design & UX Requirements

### Animations
- Page load: Subtle fade-in-up for sections as they enter viewport
- Buttons: Scale up slightly on hover, smooth color transitions
- Cards: Subtle lift (translateY) and shadow increase on hover
- Tabs: Smooth content transitions with slide effect
- Carousel: Smooth auto-scroll, pause on hover

### Responsive Behavior
- Desktop: Full layouts as described
- Tablet: Adjusted grid (2 columns instead of 3 where appropriate)
- Mobile: Single column, stacked layouts, hamburger menu

### Accessibility
- All images need alt text
- Proper heading hierarchy (h1 → h2 → h3)
- Keyboard navigation for interactive elements
- Sufficient color contrast (already good with brand colors)
- Focus states on all interactive elements

### Performance
- Optimize images (WebP format, lazy loading)
- Minimize JavaScript bundle
- Above-the-fold content loads first
- Target: 90+ Lighthouse score

---

## External Links

### Dashboard Links
- "Log In" → `https://app.bluelogistic.com/login` (or dashboard URL)
- "Get Started Free" → `https://app.bluelogistic.com/register` (or dashboard URL)

*Note: For development, these can link to the local dashboard at localhost:3000*

### Demo Booking
- "Book Demo" → Calendly link OR `/contact` page with demo request form

---

## Success Criteria

The landing page is complete when:

1. ✅ All 12 home page sections are implemented and functional
2. ✅ English and German translations work correctly
3. ✅ Language switcher persists preference
4. ✅ All navigation links work
5. ✅ Pricing page displays correct data for all destinations and weights
6. ✅ FAQ page has all questions with working accordions
7. ✅ Contact form submits (can be client-side only for MVP)
8. ✅ Legal pages exist with placeholder content
9. ✅ Mobile responsive on all pages
10. ✅ Animations are smooth and not jarring
11. ✅ Page loads fast (no layout shift, images optimized)
12. ✅ Brand colors are consistent throughout
13. ✅ Links to dashboard work correctly

---

## File Organization Expectation

```
bluelogistic-landing/
├── src/
│   ├── app/
│   │   └── [locale]/          # All pages with locale
│   ├── components/
│   │   ├── layout/            # Header, Footer, Navigation
│   │   ├── sections/          # All homepage sections
│   │   └── ui/                # shadcn components
│   ├── messages/
│   │   ├── en.json            # English translations
│   │   └── de.json            # German translations
│   └── lib/                   # Utilities, constants
├── public/
│   └── images/                # All images and illustrations
└── [config files]
```

---

## Development Notes

- Start development server on port 3001 to avoid conflict with dashboard (3000)
- Use the same Tailwind configuration approach as the dashboard
- Reference the dashboard's color scheme implementation for consistency
- Test both languages thoroughly before considering complete

---

## Questions to Avoid Asking the User

These decisions are already made:
- Stack: Next.js, TypeScript, Tailwind, shadcn (same as dashboard)
- Colors: #0D2556 blue, #D8420E orange
- Languages: English default, German secondary
- Pricing: Use the data provided in this document
- Content: Use the copy provided in this document

Just build it according to these specifications.
