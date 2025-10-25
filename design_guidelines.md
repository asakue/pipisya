# Design Guidelines: Professional Dark Chat Application

## Design Approach

**Reference-Based with System Principles**
Drawing inspiration from professional communication platforms (Slack, Discord, Linear) combined with Material Design's dark theme principles. The design emphasizes a strict, professional aesthetic with modern touches—prioritizing clarity, hierarchy, and functionality over decorative elements.

**Core Principles:**
- Professional minimalism with purpose-driven UI elements
- Dark theme optimized for extended use and reduced eye strain
- High contrast for excellent readability
- Subtle depth through elevation rather than heavy shadows
- Clean, geometric layouts with precise alignment

---

## Color Strategy

**Dark Foundation (DO NOT implement colors - this is for reference only):**
- Base backgrounds: Deep charcoal to near-black range
- Panel surfaces: Elevated dark grays (lighter than base)
- Interactive elements: Subtle blues for primary actions, greens for calls, reds for destructive actions
- Text hierarchy: White/near-white for primary, medium gray for secondary, dark gray for tertiary
- Borders: Subtle, low-contrast separators using dark grays
- Status indicators: Green (online/success), red (offline/error), amber (away/warning)

**Treatment:**
- Avoid pure black (#000000) - use rich dark grays
- No colorful gradients - solid colors or very subtle monochromatic transitions only
- High contrast between text and backgrounds (WCAG AAA compliance)
- Accent colors used sparingly for calls-to-action and status

---

## Typography System

**Font Selection:**
- Primary: Inter or SF Pro Display (professional, highly readable)
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto

**Hierarchy:**
```
Page Titles: 24px, weight 600
Panel Headers: 18px, weight 600
User Names: 14px, weight 500
Message Text: 14px, weight 400
Timestamps/Meta: 12px, weight 400
Button Text: 14px, weight 500
```

**Treatment:**
- Line height: 1.5 for body text, 1.2 for headings
- Letter spacing: Tight (-0.01em) for headings, normal for body
- All caps reserved for small labels only (12px with tracking)

---

## Layout System

**Spacing Scale (Tailwind units):**
Primary units: 2, 4, 6, 8, 12, 16, 20, 24

**Application:**
- Component internal padding: 4-6 units
- Section spacing: 8-12 units  
- Panel gaps: 4-5 units
- Button padding: 3-4 units vertical, 6 units horizontal
- Message spacing: 3-4 units between messages

**Grid Structure:**
- Two-column desktop layout: 280px fixed sidebar + flexible main panel
- Single column mobile: stacked panels with full width
- Max container width: 1400px centered
- Consistent 20-24px edge margins on mobile

**Viewport:**
- Full-height application (100vh)
- Login screen: centered modal approach
- Main interface: fixed header + scrollable content areas

---

## Component Library

### Navigation & Headers
**Panel Headers:**
- Fixed height (60-64px)
- Title aligned left with icon prefix
- Action items/status aligned right
- Subtle bottom border separation
- Sticky positioning for scroll contexts

**Login Screen:**
- Centered card (max-width 400px)
- Large title (24px) with substantial spacing
- Single-column form layout
- Full-width input fields and button
- Minimal decoration - focus on form

### User List Components
**User Item Cards:**
- Horizontal layout: Avatar (40px circle) + Name + Action button
- Padding: 4 units vertical, 4 units horizontal
- Hover state: subtle background change, no movement
- Avatar: Initials on colored background (deterministic color from username)
- Call button: Icon + text, right-aligned, 32px height

**Online Status:**
- Small dot indicator (8px) on avatar or next to name
- Badge count for total users (pill shape, right-aligned in header)

### Message Components
**Message Bubbles:**
- Own messages: Right-aligned, max-width 70%, primary accent background
- Other messages: Left-aligned, max-width 70%, elevated panel background
- System messages: Center-aligned, full-width, subtle border, italic text
- Padding: 4 units vertical, 5 units horizontal
- Border radius: 12px (reduced on side toward sender - 4px)

**Message Structure:**
- Header row: Sender name (left) + timestamp (right)
- Body: Message text with word-wrap
- Spacing: 3-4 units between messages
- Avatar integration: Show 32px avatar next to other users' messages

**Chat Area:**
- Scrollable messages container with custom scrollbar
- Message input: Fixed bottom, 60px height
- Input field: Flexible width + send button (40px square)
- Send button: Icon only, primary color, circular or rounded square

### Call Interface Components
**Call Controls (Active Call):**
- Floating card: Fixed bottom-right, elevated panel
- Horizontal layout: Call icon + Caller name + Timer + End button
- End button: 40px square, destructive color, phone icon
- Timer: MM:SS format, monospace font
- Compact size: 320px width, 72px height

**Incoming Call Modal:**
- Full-screen overlay with blur backdrop
- Centered card (400px max-width)
- Large caller avatar (96px)
- Caller name (24px, bold)
- "Incoming call..." subtitle
- Two-button layout: Accept (green) + Reject (red)
- Buttons: 48px height, icon + text, equal width

### Form Elements
**Input Fields:**
- Height: 48px
- Border: 2px, subtle color
- Border radius: 8-10px
- Focus state: brighter border, subtle glow (box-shadow)
- Padding: 4 units horizontal

**Buttons:**
- Primary: Solid color, 48px height, 8-10px radius, medium weight text
- Secondary: Outlined style with transparent background
- Icon buttons: 40-48px square, icon centered
- Hover: Slight brightness increase, no scale/movement
- Disabled: 40% opacity, no cursor

### Status & Feedback
**Notifications (Toasts):**
- Fixed top-right positioning
- 320px width, auto height
- Success/Error/Warning color-coded left border (4px)
- Icon + message text layout
- 3-second auto-dismiss
- Slide-in from right animation

**Connection Status:**
- Small colored dot (10px) in header
- Green: Connected, Red: Disconnected, Amber: Connecting
- No text label (icon-only for compactness)

**Empty States:**
- Centered text block with icon above
- Muted text color
- Icon: 48-64px, simple line style
- Used in: empty user list, no messages yet

### Overlays & Modals
**Overlay Treatment:**
- Semi-transparent dark backdrop (60-70% opacity)
- Optional blur effect (backdrop-filter: blur(4px))
- Modal centered: max-width 480px, padding 8-10 units
- Modal background: Elevated panel color
- Close button: Top-right, 32px icon button

---

## Micro-interactions

**Minimal Animation Strategy:**
- Message appearance: 200ms fade-in only
- Panel transitions: 300ms ease for state changes
- No hover scale effects
- No loading spinners unless >2 second wait
- Focus rings: instant appearance
- Notification slide: 300ms ease-out

**Hover States:**
- Buttons: Brightness +10%, no transform
- User items: Background +5% lightness
- Interactive elements: Cursor pointer, subtle background shift

---

## Images

**No images required for this application.** The interface is entirely UI-driven with:
- Text-based content (messages)
- Icon-based actions (call, send, status)
- Avatar placeholders (initials on colored backgrounds)

If user profile photos are added later, they should be:
- Circular crops, 32-48px depending on context
- Fallback to initial-based avatars
- Loaded lazily with placeholder shown first

---

## Responsive Behavior

**Desktop (>1024px):** Two-column layout as specified
**Tablet (768-1024px):** Two-column maintained, narrower sidebar (240px)
**Mobile (<768px):** 
- Single column stacked layout
- Bottom navigation for panel switching (Users/Chat tabs)
- Full-width panels with slide transitions
- Call controls: Full-width bottom sheet instead of floating card