# BlueLogistic - Internationalization (i18n) Implementation Guide

## Overview

Add multi-language support to BlueLogistic frontend with English (default) and German.

**CRITICAL RULES:**
- Do NOT delete or modify any existing functionality
- Do NOT break any existing features
- Only ADD internationalization layer
- Default language: English (en)
- Additional language: German (de)
- User's language preference should persist (localStorage)

---

## Technical Approach

### Library
Use `next-intl` for Next.js internationalization.

### File Structure
```
src/
├── i18n.ts                 # i18n configuration
├── messages/
│   ├── en.json             # English translations
│   └── de.json             # German translations
├── components/
│   └── LanguageSwitcher.tsx  # Language toggle component
```

---

## Translation Scope

### Everything That Needs Translation

**Navigation & Layout:**
- Sidebar menu items (Dashboard, Packages, Sellers, etc.)
- Header titles
- User menu items (Profile, Logout)

**Authentication:**
- Login page title, subtitle
- Form labels (Email, Password)
- Button text (Sign In, Logging in...)
- Error messages

**Packages Module:**
- Page titles (My Packages, All Packages, New Package)
- Empty state messages
- Form labels and placeholders (Customer Name, Address, Weight, etc.)
- Status badges (Created, In Storage, Dispatched)
- Action buttons (Create, Save, Delete, Cancel)
- Success/error toast messages
- Confirmation dialogs
- Table headers

**Sellers Module (Admin):**
- Page titles
- Form labels
- Status labels (Active, Inactive)
- Action buttons
- Toast messages

**Pricing Display:**
- Labels (Cost Price, Seller Price, Calculation)
- Destination label

**Country Names:**
- All 29 supported countries need German translations
- Example: Austria → Österreich, Germany → Deutschland

**Common Elements:**
- Loading states
- Error messages
- Validation messages
- Date labels
- Confirmation dialogs

---

## German Translations Reference

### Navigation
| English | German |
|---------|--------|
| Dashboard | Dashboard |
| Packages | Pakete |
| My Packages | Meine Pakete |
| All Packages | Alle Pakete |
| New Package | Neues Paket |
| Sellers | Verkäufer |
| All Sellers | Alle Verkäufer |
| New Seller | Neuer Verkäufer |
| Settings | Einstellungen |
| Profile | Profil |
| Logout | Abmelden |

### Authentication
| English | German |
|---------|--------|
| Sign in to your account | Melden Sie sich an |
| Email | E-Mail |
| Password | Passwort |
| Sign In | Anmelden |
| Signing in... | Anmeldung läuft... |
| Invalid email or password | Ungültige E-Mail oder Passwort |
| Change Password | Passwort ändern |
| Current Password | Aktuelles Passwort |
| New Password | Neues Passwort |

### Package Management
| English | German |
|---------|--------|
| Create Package | Paket erstellen |
| Package Details | Paketdetails |
| Customer Name | Kundenname |
| Address | Adresse |
| Postal Code | Postleitzahl |
| City | Stadt |
| Phone | Telefon |
| Email | E-Mail |
| Weight (kg) | Gewicht (kg) |
| Destination Country | Zielland |
| Select country | Land auswählen |
| No packages yet | Noch keine Pakete |
| Create your first package | Erstellen Sie Ihr erstes Paket |

### Status
| English | German |
|---------|--------|
| Status | Status |
| Created | Erstellt |
| In Storage | Im Lager |
| Dispatched | Versendet |
| Update Status | Status aktualisieren |

### Tracking
| English | German |
|---------|--------|
| Tracking Number | Sendungsnummer |
| Add Tracking | Sendungsnummer hinzufügen |
| No tracking number | Keine Sendungsnummer |

### Pricing
| English | German |
|---------|--------|
| Pricing Details | Preisdetails |
| Cost Price | Einkaufspreis |
| Seller Price | Verkaufspreis |
| Price | Preis |
| Calculation | Berechnung |
| Destination | Ziel |

### Sellers
| English | German |
|---------|--------|
| Create Seller | Verkäufer erstellen |
| Seller Details | Verkäuferdetails |
| Company Name | Firmenname |
| Active | Aktiv |
| Inactive | Inaktiv |
| Activate | Aktivieren |
| Deactivate | Deaktivieren |
| Package Count | Paketanzahl |
| No sellers yet | Noch keine Verkäufer |

### Table Headers
| English | German |
|---------|--------|
| Name | Name |
| Email | E-Mail |
| Status | Status |
| Date | Datum |
| Created At | Erstellt am |
| Updated At | Aktualisiert am |
| Actions | Aktionen |
| Customer | Kunde |
| Seller | Verkäufer |
| Weight | Gewicht |
| Country | Land |
| Cost | Kosten |
| Tracking | Sendungsverfolgung |

### Buttons & Actions
| English | German |
|---------|--------|
| Save | Speichern |
| Cancel | Abbrechen |
| Delete | Löschen |
| Edit | Bearbeiten |
| Create | Erstellen |
| Back | Zurück |
| Search | Suchen |
| Filter | Filtern |
| View | Ansehen |
| Close | Schließen |
| Confirm | Bestätigen |
| Yes | Ja |
| No | Nein |
| Submit | Absenden |
| Loading... | Laden... |
| Creating... | Erstellen... |
| Saving... | Speichern... |
| Updating... | Aktualisieren... |

### Messages
| English | German |
|---------|--------|
| Package created successfully | Paket erfolgreich erstellt |
| Package deleted successfully | Paket erfolgreich gelöscht |
| Status updated successfully | Status erfolgreich aktualisiert |
| Tracking number added | Sendungsnummer hinzugefügt |
| Seller created successfully | Verkäufer erfolgreich erstellt |
| Are you sure? | Sind Sie sicher? |
| This action cannot be undone | Diese Aktion kann nicht rückgängig gemacht werden |
| Something went wrong | Etwas ist schief gelaufen |
| No results found | Keine Ergebnisse gefunden |

### Validation
| English | German |
|---------|--------|
| This field is required | Dieses Feld ist erforderlich |
| Invalid email address | Ungültige E-Mail-Adresse |
| Must be a positive number | Muss eine positive Zahl sein |
| Invalid phone number | Ungültige Telefonnummer |

### Country Names
| Code | English | German |
|------|---------|--------|
| AT | Austria | Österreich |
| BA | Bosnia and Herzegovina | Bosnien und Herzegowina |
| BE | Belgium | Belgien |
| BG | Bulgaria | Bulgarien |
| CH | Switzerland | Schweiz |
| CZ | Czechia | Tschechien |
| DE | Germany | Deutschland |
| DK | Denmark | Dänemark |
| EE | Estonia | Estland |
| ES | Spain | Spanien |
| FI | Finland | Finnland |
| FR | France | Frankreich |
| GR | Greece | Griechenland |
| HR | Croatia | Kroatien |
| HU | Hungary | Ungarn |
| IE | Ireland | Irland |
| IS | Iceland | Island |
| IT | Italy | Italien |
| LT | Lithuania | Litauen |
| LU | Luxembourg | Luxemburg |
| LV | Latvia | Lettland |
| NL | Netherlands | Niederlande |
| PL | Poland | Polen |
| PT | Portugal | Portugal |
| RO | Romania | Rumänien |
| RS | Serbia | Serbien |
| SE | Sweden | Schweden |
| SI | Slovenia | Slowenien |
| SK | Slovakia | Slowakei |

### Language Switcher
| English | German |
|---------|--------|
| Language | Sprache |
| English | Englisch |
| German | Deutsch |

---

## Implementation Requirements

### 1. Install & Configure next-intl
- Install the package
- Create configuration file
- Set up middleware for locale detection
- Wrap app with NextIntlClientProvider

### 2. Create Translation JSON Files
- `src/messages/en.json` - All English strings (use tables above)
- `src/messages/de.json` - All German strings (use tables above)
- Organize by feature/section (auth, packages, sellers, common, etc.)

### 3. Create Language Switcher Component
- Dropdown or toggle button
- Shows current language
- Allows switching between EN and DE
- Store preference in localStorage
- Place in Header component (top right area)

### 4. Update All Components
Go through EVERY component and replace hardcoded strings with translation function calls.

**Files to update (at minimum):**
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/PageHeader.tsx`
- `src/components/forms/LoginForm.tsx`
- `src/components/forms/PackageForm.tsx`
- `src/components/forms/SellerForm.tsx`
- `src/components/forms/StatusUpdateForm.tsx`
- `src/components/forms/TrackingForm.tsx`
- `src/components/packages/PackageCard.tsx`
- `src/components/packages/StatusBadge.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(dashboard)/seller/packages/page.tsx`
- `src/app/(dashboard)/seller/packages/new/page.tsx`
- `src/app/(dashboard)/seller/packages/[id]/page.tsx`
- `src/app/(dashboard)/admin/packages/page.tsx`
- `src/app/(dashboard)/admin/packages/[id]/page.tsx`
- `src/app/(dashboard)/admin/sellers/page.tsx`
- `src/app/(dashboard)/admin/sellers/new/page.tsx`
- `src/app/(dashboard)/admin/sellers/[id]/page.tsx`
- `src/lib/utils.ts` (country names function)
- Toast/notification calls in hooks

### 5. Update Country Names Utility
The `getCountryName()` and `getCountryOptions()` functions in utils.ts must be locale-aware.

### 6. Update Validation Messages
Validation schemas in `src/lib/validations.ts` should use translated messages.

---

## Language Switcher Placement

Place in the Header component, top-right area near user menu:

```
[Logo]                    [Language: EN ▼] [User Menu ▼]
```

Simple dropdown with two options:
- 🇬🇧 English
- 🇩🇪 Deutsch

---

## Persistence

- Store selected language in localStorage key: `bluelogistic-locale`
- On app load, check localStorage first
- Fall back to browser language detection
- Default to English if no preference and browser is not German

---

## Verification Checklist

After implementation, verify:

1. **Language Switcher Works**
   - Toggle appears in header
   - Clicking switches language immediately
   - Preference persists after page refresh

2. **Login Page**
   - All text in selected language
   - Error messages translated

3. **Sidebar Navigation**
   - All menu items translated
   - Updates when language changes

4. **Package List (Seller)**
   - Page title, empty state, buttons translated
   - Table headers translated
   - Status badges translated

5. **Package Form**
   - All labels and placeholders translated
   - Country dropdown shows localized country names
   - Validation errors translated
   - Success toast translated

6. **Package Detail**
   - All labels translated
   - Pricing section translated
   - Status and tracking sections translated

7. **Admin Package List**
   - All columns translated
   - Action buttons translated

8. **Admin Package Detail**
   - All sections translated
   - Price breakdown label translated

9. **Seller List (Admin)**
   - All translated

10. **Seller Form (Admin)**
    - All translated

11. **No Broken UI**
    - No missing translations (no keys showing)
    - No layout breaks due to longer German text
    - All functionality still works

---

## Notes

- German text is often ~30% longer than English - ensure UI accommodates
- Keep translation keys organized and consistent
- Use nested structure in JSON for organization
- Backend stays in English - only frontend gets translated
- All toast messages must be translated
- All confirmation dialogs must be translated
