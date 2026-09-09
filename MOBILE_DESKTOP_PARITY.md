# Helpy mobile-to-desktop parity audit

This document records the September 2026 audit of the customer PWA and its desktop website. The implementation principle is functional parity with a desktop-native presentation: shared data and journeys, without reproducing mobile bottom sheets, fixed phone heights, or bottom navigation on wide screens.

## Audit result

| PWA area | Previous desktop state | Current desktop state |
| --- | --- | --- |
| Authentication | Sign-in and simplified verification | Sign-in plus accessible six-digit OTP entry |
| Home discovery | Hero, eight categories and four featured services | Existing desktop hero plus PWA deals, offers/events, popular providers and provider acquisition content |
| Categories | 11 broad desktop categories | All 19 PWA categories, searchable through the complete catalogue |
| Providers and businesses | 17 representative cards | All 17 detailed PWA providers plus the PWA-only pets and events businesses |
| Service catalogue | One featured service per provider | Every configured provider service (about 80 options), with search, category filters and sorting |
| Service detail | Single service with date/time selection | Provider-specific multi-service selection, optional extras, Scrubs equipment choice, dates, times and calculated total |
| Booking and checkout | Basic location and payment selection | Selected services/extras, saved or pinned location flow, payment methods, new-card validation, secure-processing state and booking creation |
| Booking success | Present | Preserved, including order and provider-message actions |
| My bookings | Static examples | Active/completed tabs, shared newly-created bookings, full detail/payment summary, provider messaging and reviews |
| Messages | Short static list | Search, All/Bookings/Offers/Support filters, booking-generated conversations and provider threads |
| Reviews | Small static sample | Provider-aware reviews with rating and service filters plus verified-booking labels |
| Profile | Simplified account cards | Editable profile, preferences, verified state and account shortcuts |
| Wallet | Read-only summary | Balance, top-up, withdrawal, payment choice, success feedback and transaction history |
| Favourites | Static list | Removable saved providers with direct booking actions |
| Addresses/location | Basic picker | Add/edit/delete/default saved addresses plus the booking location picker |
| Notifications | Static rows | Unread state, mark-all-read and actions into booking, chat, wallet, reviews and deals |
| Help and contact | Contact details | Live chat, phone/email, routed enquiry form and success feedback |
| Terms and privacy | Short copy | Complete six-section, navigable plain-language documents |
| Pending review prompt | Missing | Desktop-native post-booking prompt connected to the shared booking state |

## Shared sources

- `src/pages/ServiceDetailPage.tsx` remains the source of truth for the detailed provider service menus and extras.
- `src/context/NavContext.tsx` remains the source of truth for navigation and newly-created bookings.
- `src/desktop/DesktopParityViews.tsx` translates the PWA catalogue and flows into the existing desktop visual system.
- `src/desktop/DesktopAccountViews.tsx` provides the full desktop account, wallet, address, notification, support and legal experiences.

## Deliberate desktop adaptations

- Mobile sheets become contained dialogs or sticky summary panels.
- Mobile bottom navigation remains the horizontal desktop navigation.
- Long lists use responsive grids, desktop search/filter bars and two-column detail layouts.
- The existing Helpy palette, rounded card language, spacing system and top header are preserved.
- Data remains client-side demo state, matching the current PWA architecture. Backend persistence, real payment processing and live messaging require API integration and are outside visual/function parity.
