# Collapsible Admin Sidebar Documentation

## Overview
The admin sidebar in FNG app is now collapsible, allowing administrators to maximize screen space for viewing admin pages and data.

## Features

### 1. **Collapsible Sidebar**
- Sidebar can be collapsed to a minimal width (64px/16 units)
- Sidebar can be expanded to full width (256px/64 units)
- Smooth transition animation (300ms)
- State persists during admin session

### 2. **Toggle Button**
- Circular button positioned on the right edge of sidebar
- Hover effect for better visibility
- Clear icons:
  - **Menu icon (☰)** when collapsed - Click to expand
  - **X icon** when expanded - Click to collapse
- Tooltip shows on hover when collapsed

### 3. **Responsive Content Area**
- Main content area automatically adjusts when sidebar is toggled
- Maximum width increases when sidebar is collapsed (from 6xl to 7xl)
- Smooth transition matches sidebar animation
- Left margin adjusts automatically:
  - 256px (ml-64) when sidebar expanded
  - 64px (ml-16) when sidebar collapsed

### 4. **Visual Feedback**
- Active page highlighted in blue
- Hover effects on all navigation items
- Icons remain visible when collapsed
- Labels hide when collapsed, show on expand

## How to Use

### Collapsing the Sidebar:
1. In Admin Mode, locate the toggle button on the right edge of the sidebar
2. Click the button with the **X icon**
3. Sidebar collapses to show only icons
4. Content area expands to use more screen space

### Expanding the Sidebar:
1. Click the toggle button with the **Menu icon (☰)**
2. Sidebar expands to show full labels
3. Content area adjusts to accommodate sidebar

### Quick Tips:
- **Hover over icons** when collapsed to see tooltips with page names
- **Toggle anytime** without affecting your current page
- **Automatically resets** to expanded when switching between modes

## Visual States

### Expanded Sidebar (Default):
```
┌─────────────────┬──────────────────────────┐
│                 │                          │
│  📊 Dashboard   │                          │
│  ✓ Loans       │    Content Area          │
│  ₦ Withdrawals │    (max-w-6xl)           │
│  👥 Customers   │                          │
│  📈 Activity    │                          │
│  💾 Data        │                          │
│  🏢 Settings    │                          │
│                 │                          │
└─────────────────┴──────────────────────────┘
    256px (w-64)         Main Content
```

### Collapsed Sidebar:
```
┌────┬────────────────────────────────────┐
│    │                                    │
│ 📊 │                                    │
│ ✓  │      Content Area                 │
│ ₦  │      (max-w-7xl)                   │
│ 👥 │                                    │
│ 📈 │                                    │
│ 💾 │                                    │
│ 🏢 │                                    │
│    │                                    │
└────┴────────────────────────────────────┘
 64px            Expanded Content
(w-16)
```

## Technical Details

### State Management:
```typescript
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
```

### Sidebar Width:
- **Expanded**: `w-64` (256px)
- **Collapsed**: `w-16` (64px)

### Content Margin:
- **Expanded**: `ml-64` (256px)
- **Collapsed**: `ml-16` (64px)

### Max Width:
- **Expanded**: `max-w-6xl` (1152px)
- **Collapsed**: `max-w-7xl` (1280px)

### Transitions:
- Duration: 300ms
- Easing: Default (ease-in-out)
- Properties: width, margin, padding

## CSS Classes

### Sidebar Container:
```css
transition-all duration-300
${sidebarCollapsed ? "w-16" : "w-64"}
```

### Navigation Items:
```css
${sidebarCollapsed ? "justify-center" : ""}
```

### Toggle Button:
```css
absolute -right-3 top-24 bg-white border rounded-full
```

### Main Content:
```css
transition-all duration-300
${sidebarCollapsed ? "ml-16 max-w-7xl" : "ml-64 max-w-6xl"}
```

## Benefits

### For Administrators:
1. **More Screen Space**: Collapse sidebar to see more data
2. **Better Visibility**: View full-width tables and charts
3. **Flexible Layout**: Toggle based on current task
4. **Quick Navigation**: Icons remain visible when collapsed

### For Data Review:
1. **Wide Tables**: View more columns without scrolling
2. **Charts**: See larger graphs and visualizations
3. **Forms**: More comfortable form editing
4. **Reports**: Better readability for wide content

### For Productivity:
1. **Faster Navigation**: Visual icons for quick recognition
2. **Less Distraction**: Minimize sidebar when not needed
3. **Consistent Position**: Navigation always accessible
4. **Smart Defaults**: Expands by default for new users

## User Experience

### Smooth Animations:
- All transitions are smooth (300ms)
- No jarring layout shifts
- Content remains readable during transition
- Icons and text fade in/out gracefully

### Intuitive Controls:
- Clear toggle button position
- Icon changes based on state
- Hover effects for discoverability
- Tooltips when collapsed

### Accessibility:
- Button includes title attribute
- Icons have semantic meaning
- Keyboard accessible (focusable)
- Clear visual feedback

## Behavior

### On Mode Switch:
- Sidebar automatically expands when switching to Admin Mode
- State resets to expanded (default)
- Prevents confusion from hidden sidebar

### On Navigation:
- Sidebar state persists when changing pages
- Active page remains highlighted
- Toggle button stays accessible
- Current page loads normally

### On Page Load:
- Sidebar starts in expanded state
- All labels visible by default
- New users see full navigation
- Familiar layout for returning users

## Keyboard Shortcuts (Future Enhancement)
Potential shortcuts to add:
- `Cmd/Ctrl + B` - Toggle sidebar
- `Cmd/Ctrl + [` - Collapse sidebar
- `Cmd/Ctrl + ]` - Expand sidebar

## Mobile Considerations
The collapsible sidebar is optimized for desktop admin view:
- Admin mode uses wider layout (not mobile-optimized)
- Sidebar provides desktop-class navigation
- User mode continues to use mobile-friendly bottom nav
- Toggle button sized for mouse/trackpad interaction

## Testing

### Test Scenario 1: Basic Toggle
1. Switch to Admin Mode
2. Click collapse button (X icon)
3. Verify sidebar collapses to 64px
4. Verify icons remain visible
5. Verify labels are hidden
6. Click expand button (Menu icon)
7. Verify sidebar expands to 256px
8. Verify labels appear

### Test Scenario 2: Content Adjustment
1. Admin Mode with expanded sidebar
2. Note content area width
3. Collapse sidebar
4. Verify content area expands
5. Verify no layout breaks
6. Expand sidebar again
7. Verify content shrinks appropriately

### Test Scenario 3: Navigation While Collapsed
1. Collapse sidebar
2. Click on each icon
3. Verify navigation works
4. Verify active state shows
5. Verify page content loads
6. Verify collapsed state persists

### Test Scenario 4: Mode Switching
1. Collapse sidebar in Admin Mode
2. Switch to User Mode
3. Switch back to Admin Mode
4. Verify sidebar is expanded (reset)
5. Collapse again
6. Navigate between admin pages
7. Verify state persists during session

### Test Scenario 5: Tooltips
1. Collapse sidebar
2. Hover over each icon
3. Verify tooltip appears
4. Verify tooltip shows correct label
5. Move mouse away
6. Verify tooltip disappears

## Known Issues
None currently

## Future Enhancements

1. **Remember Preference**
   - Save collapsed state to localStorage
   - Restore preference on return
   - Per-user settings

2. **Keyboard Shortcuts**
   - Add hotkeys for quick toggle
   - Improve keyboard navigation
   - Focus management

3. **Hover to Peek**
   - Temporarily expand on hover when collapsed
   - Show full labels without clicking
   - Auto-collapse when mouse leaves

4. **Custom Width**
   - Allow users to drag resize
   - Set custom sidebar width
   - Save custom dimensions

5. **Mini Labels**
   - Show abbreviated labels when collapsed
   - First letter or short code
   - Better context than icons alone

## Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ All modern browsers with CSS transitions

## Performance
- Smooth 60fps animations
- No layout thrashing
- Efficient CSS transitions
- Minimal JavaScript overhead

---

**Version**: 1.0  
**Last Updated**: October 16, 2025  
**Feature**: Collapsible Admin Sidebar
