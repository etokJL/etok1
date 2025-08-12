# Responsive Card Detail System

## Anforderungen

### Grid Layout (Responsive)
- **Desktop (> 1280px)**: 5-10 Karten pro Reihe
- **Tablet (768px - 1279px)**: 3-4 Karten pro Reihe  
- **Mobile (< 768px)**: 2 Karten pro Reihe

### Detail-Ansicht
- Animierte Overlay-Karte über der Listenansicht
- Karte erscheint mit sanfter Animation von der Position der ursprünglichen Karte
- Hintergrund wird gedimmt (backdrop blur)
- Detailkarte zeigt erweiterte Informationen

### Interaktion
- **Öffnen**: Klick auf Karte öffnet Detailansicht
- **Schließen**: 
  - Klick außerhalb der Detailkarte
  - ESC-Taste
  - Schließen-Button
- **URL-Routing**: Browser-URL ändert sich für Detailansicht (`/card/:id`)

### Animation
- Smooth entrance/exit animations mit Framer Motion
- Layout-Animationen beim Wechsel zwischen Grid-Modi
- Karte animiert von ursprünglicher Position zur Detailansicht
- Backdrop fade in/out

## Technische Umsetzung

### Komponenten
- `ResponsiveGrid`: Hauptgrid-Komponente mit responsiven Breakpoints
- `CardDetailOverlay`: Overlay-Komponente für Detailansicht
- `AnimatedCard`: Basis-Kartenkomponente mit Layout-Animation

### Next.js Integration
- App Router für URL-Management
- Dynamic routing für Karten-IDs
- Shallow routing für bessere UX

### Framer Motion Features
- `layoutId` für shared element transitions
- `AnimatePresence` für Ein-/Ausblendungen
- Portal-rendering für Overlay

## Status
✅ Anforderungen definiert
✅ Responsive Grid Layout implementiert
✅ Animierte Detailansicht erstellt
✅ URL-Routing integriert
✅ Außerhalb-Klick-Schließung implementiert
✅ ESC-Taste Schließung hinzugefügt
✅ Body Scroll Lock bei Detailansicht
✅ Framer Motion Animations
✅ Shared Element Transitions (layoutId)

## Implementierte Features

### ResponsiveGridWithDetail Komponente
- **Pfad**: `frontend/src/components/collection/responsive-grid-with-detail.tsx`
- **Features**:
  - Responsive Grid: 2 (Mobile) → 10+ (4K) Karten pro Reihe
  - Animierte Overlay-Detailansicht
  - URL-basiertes Routing mit Shallow Navigation
  - ESC-Taste und Außerhalb-Klick Schließung
  - Scroll Lock während Detailansicht
  - Shared Element Transitions zwischen Karte und Detail

### Grid Breakpoints
- **Mobile** (`< 640px`): 2 Karten pro Reihe
- **Small** (`640px - 767px`): 2 Karten pro Reihe  
- **Medium** (`768px - 1023px`): 3 Karten pro Reihe
- **Large** (`1024px - 1279px`): 4 Karten pro Reihe
- **XL** (`1280px - 1535px`): 5 Karten pro Reihe
- **2XL** (`1536px - 1599px`): 6 Karten pro Reihe
- **3XL** (`1600px - 1919px`): 8 Karten pro Reihe
- **4XL** (`> 1920px`): 10 Karten pro Reihe

### URL Integration
- Format: `?card={tokenId}` für Detailansicht
- Shallow Routing für bessere Performance
- Browser Back/Forward Navigation unterstützt

### Animationen
- **Entrance**: `scale(0.8) → scale(1)` mit `easeOutQuart`
- **Exit**: `scale(1) → scale(0.8)` mit `easeInQuart`  
- **Backdrop**: Fade in/out mit Blur-Effekt
- **Layout**: Shared Element Transitions via `layoutId`

## Integration
Die neue Komponente wurde in `frontend/src/app/page.tsx` integriert und ersetzt die `BasicGrid` Komponente. Alle anderen Grid-Komponenten wurden ebenfalls auf die neuen responsive Breakpoints aktualisiert.
