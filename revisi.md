FRONTEND UI/UX REVISION — MOBILE CATEGORY NAVIGATION
ROLE
Act as a Senior Frontend Developer responsible for implementing the requested category-navigation UI/UX improvements across the frontend application.

STRICT SCOPE
Modify frontend code only.
Changes are limited to UI components, responsive styling, client-side interaction, frontend state, and navigation.
Do not modify, create, delete, or refactor any backend code.
Do not touch controllers, models, migrations, database schemas, authentication logic, API endpoints, server-side business logic, or backend validation.
Reuse the existing frontend category data, components, routing, and state management whenever possible.
Do not change unrelated functionality or page sections.
PRIMARY OBJECTIVE
Redesign the category navigation specifically for mobile screens so its appearance and interaction closely follow the attached photo reference.

The mobile category section must use:

One main category card/container.
Small category cards inside the main container.
Black borders around each category card.
Horizontal scrolling.
A "Lihat Semua Kategori" item at the far right.
A scroll-position indicator at the bottom of the main card.
IMPORTANT RESPONSIVE RULE
This redesign is MOBILE ONLY.

Apply the new category-carousel design only to mobile breakpoints.

For tablet, laptop, and desktop/PC:

Do not use the mobile horizontal category carousel.
Do not use the compact mobile category cards.
Do not display the mobile scroll-position indicator.
Do not force the category section into a horizontal mobile layout.
Do not replace the existing desktop/tablet category layout unless specifically required elsewhere.
Preserve the existing tablet/desktop category structure, sizing, spacing, and behavior.
Use responsive Tailwind breakpoints or the project's existing responsive conventions to clearly separate mobile and larger-screen implementations.

1. MOBILE — MAIN CATEGORY CARD
On mobile screens, wrap the entire category-navigation section inside one main card/container.

Requirements:

Use a clean white background.
Apply rounded corners consistent with the application's existing design.
Use a subtle border and/or shadow.
Keep the card compact and avoid excessive vertical whitespace.
The category navigation and its scroll indicator must remain visually contained within this single main card.
The main container must not create unnecessary empty space.
The existing larger-screen category container should remain unchanged outside the mobile breakpoint.

2. MOBILE — CATEGORY ITEM CARDS
Inside the main mobile category card, display each category as a small individual card.

Requirements:

Arrange category items in a single horizontal row.
Each category must have its own compact card.
Each card must have a clearly visible black border.
Place the category icon prominently inside the card.
Display the category name in a compact and readable manner.
Keep all category cards consistent in width, height, spacing, and alignment.
Do not use the previous large category-grid presentation on mobile.
Keep the cards visually similar to the structure shown in the attached reference.
The existing category-item appearance on tablet/desktop must remain unchanged.

3. MOBILE — HORIZONTAL SCROLL
The mobile category list must function as a horizontal carousel/scroll container.

Requirements:

Categories remain in one horizontal row.
Users can swipe horizontally on touch devices.
Desktop mouse/trackpad horizontal scrolling should also work where supported.
Additional categories must remain accessible without wrapping into another row.
Prevent unnecessary empty space inside the scroll area.
The content should end naturally at the final category/action item.
Scrolling must feel smooth and natural.
Do not introduce vertical scrolling within the category carousel.
Handle overflow using the existing frontend styling conventions, preferably with Tailwind CSS.

4. MOBILE — "LIHAT SEMUA KATEGORI"
Add "Lihat Semua Kategori" as the final item on the far right of the mobile category list.

Requirements:

It must appear after all normal category items.
It must visually communicate that the user can open the complete category navigation.
Include a suitable icon such as a grid, menu, chevron, or another existing category/navigation icon.
Keep its design consistent with the other compact category items while making the action distinguishable.
Clicking it must trigger the application's existing full category navigation, not a new backend feature or duplicated category system.
Reuse the existing ExpandedCategoryNavigation / category navigation mechanism where appropriate.
This item is mobile-only unless an existing larger-screen implementation already contains an equivalent feature.

5. MOBILE — SCROLL POSITION INDICATOR
Add a horizontal scroll-position indicator at the bottom of the main category card, matching the behavior shown in the reference video.

Requirements:

Position the indicator below the category items but still inside the main category card.
Use a compact horizontal track/pill-style indicator.
Clearly indicate the current horizontal scroll position.
The indicator must react to the actual horizontal scroll position.
At the beginning of the list, show the indicator in the starting position.
As the user scrolls, update the indicator accordingly.
At the end of the category list, the indicator must reach the ending position.
If the category content does not overflow horizontally, hide the indicator.
The indicator must not affect the category card's scrolling behavior.
The scroll-position indicator is strictly mobile-only.

6. MOBILE — SCROLL BEHAVIOR
The mobile carousel must behave naturally at both boundaries:

At the beginning, users should not encounter an artificial blank area.
At the end, users should reach the final category/"Lihat Semua Kategori" item cleanly.
Do not add fake spacing that makes it appear as though more content exists when there is none.
After reaching the end, users should be able to scroll back toward the beginning without encountering broken or inconsistent positioning.
The final "Lihat Semua Kategori" item must remain fully reachable and visible when scrolled to the end.

7. RESPONSIVE BREAKPOINT RULES
Implement the design with a strict responsive separation.

Mobile
Apply the new category carousel system:

Single main category card.
Small category cards.
Black card borders.
Horizontal scrolling.
"Lihat Semua Kategori" at the far right.
Scroll-position indicator at the bottom.
Tablet
Keep the existing category layout and behavior.

Do not introduce the mobile carousel unless the project's existing breakpoint definition explicitly classifies that viewport as mobile.

Laptop / Desktop / PC
Keep the existing category layout and behavior.

Do not display:

Mobile horizontal carousel.
Mobile scroll indicator.
Mobile compact category-card layout.
Mobile-specific category spacing.
The desktop/tablet experience must remain visually stable and should not regress because of the mobile implementation.

8. APPLY TO ALL CATEGORY-RELATED FRONTEND FILES
This change must be applied consistently to every frontend file/component/page that contains the category-navigation feature.

First identify all relevant frontend implementations, reusable components, and pages that render category navigation.

Then ensure they follow the same mobile behavior.

Examples may include:

Home page category section.
Product/category navigation.
Reusable category components.
Mobile category navigation.
Any other page containing the same category-navigation pattern.
Do not create multiple inconsistent versions of the mobile category UI.

Prefer reusing or centralizing existing frontend category components so the same behavior and visual structure are maintained across the application.

9. ExpandedCategoryNavigation.tsx
Use the provided ExpandedCategoryNavigation.tsx as the existing functional reference.

Preserve:

Category data source.
Category search.
Category filtering.
Active category state.
Subcategory display.
Product navigation.
Existing routing behavior.
Open/close behavior.
Escape-key behavior.
Existing frontend functionality.
Only adjust its UI where necessary to support consistency with the new mobile category-navigation experience.

Do not remove existing functionality simply to implement the redesign.

Do not introduce backend changes.

10. SCROLL STATE IMPLEMENTATION
The mobile scroll indicator should be based on the actual scroll container state.

Use the existing React/Next.js frontend architecture.

A suitable implementation may calculate the scroll position using:

scrollLeft
scrollWidth
clientWidth
Requirements:

Update the indicator whenever the user scrolls.
Correctly calculate the percentage/position even when viewport width changes.
Recalculate when category content changes.
Handle cases where there is no horizontal overflow.
Properly clean up event listeners.
Avoid unnecessary re-renders.
Ensure client-side behavior does not introduce hydration issues.
11. VISUAL DESIGN
The mobile category UI should visually follow the attached video reference while remaining consistent with the existing application's branding.

The target structure is:

MAIN CARD
→ compact category cards
→ compact category cards
→ compact category cards
→ ...
→ LIHAT SEMUA KATEGORI

and below them:

SCROLL POSITION INDICATOR

Visual principles:

Clean and compact.
Small category cards.
Black borders around category cards.
Consistent spacing.
No unnecessary empty space.
Clear touch targets.
Smooth horizontal interaction.
Modern e-commerce appearance.
Preserve existing typography and branding where possible.
Do not copy unrelated visual elements from the video.

12. ACCESSIBILITY & UX
Ensure the new mobile navigation remains usable and accessible:

Category items must remain keyboard-accessible where applicable.
Buttons/links must have meaningful labels.
Touch targets must remain usable on small screens.
Focus states should remain visible.
Avoid interaction conflicts between horizontal scrolling and clicking.
"Lihat Semua Kategori" must clearly communicate its purpose.
13. REGRESSION PREVENTION
After implementing the mobile UI:

Verify that the existing tablet layout is not affected.
Verify that the existing laptop/desktop layout is not affected.
Verify category navigation still works.
Verify category selection still works.
Verify subcategory navigation still works.
Verify "Lihat Semua Kategori" opens the correct existing navigation.
Verify horizontal scrolling behaves correctly at both ends.
Verify the scroll indicator accurately reflects the scroll position.
Verify there is no layout overflow, clipping, or unwanted whitespace.
FINAL REQUIREMENT
The desired result is a mobile-only category carousel inspired by the attached video:

One main card → compact category cards with black borders → horizontal scrolling → "Lihat Semua Kategori" at the far right → scroll-position indicator at the bottom.

For tablet, laptop, and desktop/PC, preserve the existing category UI and do not apply the mobile carousel design.

FINAL CONSTRAINT
FRONTEND ONLY.

DO NOT TOUCH THE BACKEND UNDER ANY CIRCUMSTANCES.# FRONTEND UI/UX REVISION — MOBILE CATEGORY NAVIGATION

ROLE
Act as a Senior Frontend Developer responsible for implementing the requested category-navigation UI/UX improvements across the frontend application.

STRICT SCOPE
Modify frontend code only.
Changes are limited to UI components, responsive styling, client-side interaction, frontend state, and navigation.
Do not modify, create, delete, or refactor any backend code.
Do not touch controllers, models, migrations, database schemas, authentication logic, API endpoints, server-side business logic, or backend validation.
Reuse the existing frontend category data, components, routing, and state management whenever possible.
Do not change unrelated functionality or page sections.
PRIMARY OBJECTIVE
Redesign the category navigation specifically for mobile screens so its appearance and interaction closely follow the attached photo reference.

The mobile category section must use:

One main category card/container.
Small category cards inside the main container.
Black borders around each category card.
Horizontal scrolling.
A "Lihat Semua Kategori" item at the far right.
A scroll-position indicator at the bottom of the main card.
IMPORTANT RESPONSIVE RULE
This redesign is MOBILE ONLY.

Apply the new category-carousel design only to mobile breakpoints.

For tablet, laptop, and desktop/PC:

Do not use the mobile horizontal category carousel.
Do not use the compact mobile category cards.
Do not display the mobile scroll-position indicator.
Do not force the category section into a horizontal mobile layout.
Do not replace the existing desktop/tablet category layout unless specifically required elsewhere.
Preserve the existing tablet/desktop category structure, sizing, spacing, and behavior.
Use responsive Tailwind breakpoints or the project's existing responsive conventions to clearly separate mobile and larger-screen implementations.

1. MOBILE — MAIN CATEGORY CARD
On mobile screens, wrap the entire category-navigation section inside one main card/container.

Requirements:

Use a clean white background.
Apply rounded corners consistent with the application's existing design.
Use a subtle border and/or shadow.
Keep the card compact and avoid excessive vertical whitespace.
The category navigation and its scroll indicator must remain visually contained within this single main card.
The main container must not create unnecessary empty space.
The existing larger-screen category container should remain unchanged outside the mobile breakpoint.

2. MOBILE — CATEGORY ITEM CARDS
Inside the main mobile category card, display each category as a small individual card.

Requirements:

Arrange category items in a single horizontal row.
Each category must have its own compact card.
Each card must have a clearly visible black border.
Place the category icon prominently inside the card.
Display the category name in a compact and readable manner.
Keep all category cards consistent in width, height, spacing, and alignment.
Do not use the previous large category-grid presentation on mobile.
Keep the cards visually similar to the structure shown in the attached reference.
The existing category-item appearance on tablet/desktop must remain unchanged.

3. MOBILE — HORIZONTAL SCROLL
The mobile category list must function as a horizontal carousel/scroll container.

Requirements:

Categories remain in one horizontal row.
Users can swipe horizontally on touch devices.
Desktop mouse/trackpad horizontal scrolling should also work where supported.
Additional categories must remain accessible without wrapping into another row.
Prevent unnecessary empty space inside the scroll area.
The content should end naturally at the final category/action item.
Scrolling must feel smooth and natural.
Do not introduce vertical scrolling within the category carousel.
Handle overflow using the existing frontend styling conventions, preferably with Tailwind CSS.

4. MOBILE — "LIHAT SEMUA KATEGORI"
Add "Lihat Semua Kategori" as the final item on the far right of the mobile category list.

Requirements:

It must appear after all normal category items.
It must visually communicate that the user can open the complete category navigation.
Include a suitable icon such as a grid, menu, chevron, or another existing category/navigation icon.
Keep its design consistent with the other compact category items while making the action distinguishable.
Clicking it must trigger the application's existing full category navigation, not a new backend feature or duplicated category system.
Reuse the existing ExpandedCategoryNavigation / category navigation mechanism where appropriate.
This item is mobile-only unless an existing larger-screen implementation already contains an equivalent feature.

5. MOBILE — SCROLL POSITION INDICATOR
Add a horizontal scroll-position indicator at the bottom of the main category card, matching the behavior shown in the reference video.

Requirements:

Position the indicator below the category items but still inside the main category card.
Use a compact horizontal track/pill-style indicator.
Clearly indicate the current horizontal scroll position.
The indicator must react to the actual horizontal scroll position.
At the beginning of the list, show the indicator in the starting position.
As the user scrolls, update the indicator accordingly.
At the end of the category list, the indicator must reach the ending position.
If the category content does not overflow horizontally, hide the indicator.
The indicator must not affect the category card's scrolling behavior.
The scroll-position indicator is strictly mobile-only.

6. MOBILE — SCROLL BEHAVIOR
The mobile carousel must behave naturally at both boundaries:

At the beginning, users should not encounter an artificial blank area.
At the end, users should reach the final category/"Lihat Semua Kategori" item cleanly.
Do not add fake spacing that makes it appear as though more content exists when there is none.
After reaching the end, users should be able to scroll back toward the beginning without encountering broken or inconsistent positioning.
The final "Lihat Semua Kategori" item must remain fully reachable and visible when scrolled to the end.

7. RESPONSIVE BREAKPOINT RULES
Implement the design with a strict responsive separation.

Mobile
Apply the new category carousel system:

Single main category card.
Small category cards.
Black card borders.
Horizontal scrolling.
"Lihat Semua Kategori" at the far right.
Scroll-position indicator at the bottom.
Tablet
Keep the existing category layout and behavior.

Do not introduce the mobile carousel unless the project's existing breakpoint definition explicitly classifies that viewport as mobile.

Laptop / Desktop / PC
Keep the existing category layout and behavior.

Do not display:

Mobile horizontal carousel.
Mobile scroll indicator.
Mobile compact category-card layout.
Mobile-specific category spacing.
The desktop/tablet experience must remain visually stable and should not regress because of the mobile implementation.

8. APPLY TO ALL CATEGORY-RELATED FRONTEND FILES
This change must be applied consistently to every frontend file/component/page that contains the category-navigation feature.

First identify all relevant frontend implementations, reusable components, and pages that render category navigation.

Then ensure they follow the same mobile behavior.

Examples may include:

Home page category section.
Product/category navigation.
Reusable category components.
Mobile category navigation.
Any other page containing the same category-navigation pattern.
Do not create multiple inconsistent versions of the mobile category UI.

Prefer reusing or centralizing existing frontend category components so the same behavior and visual structure are maintained across the application.

9. ExpandedCategoryNavigation.tsx
Use the provided ExpandedCategoryNavigation.tsx as the existing functional reference.

Preserve:

Category data source.
Category search.
Category filtering.
Active category state.
Subcategory display.
Product navigation.
Existing routing behavior.
Open/close behavior.
Escape-key behavior.
Existing frontend functionality.
Only adjust its UI where necessary to support consistency with the new mobile category-navigation experience.

Do not remove existing functionality simply to implement the redesign.

Do not introduce backend changes.

10. SCROLL STATE IMPLEMENTATION
The mobile scroll indicator should be based on the actual scroll container state.

Use the existing React/Next.js frontend architecture.

A suitable implementation may calculate the scroll position using:

scrollLeft
scrollWidth
clientWidth
Requirements:

Update the indicator whenever the user scrolls.
Correctly calculate the percentage/position even when viewport width changes.
Recalculate when category content changes.
Handle cases where there is no horizontal overflow.
Properly clean up event listeners.
Avoid unnecessary re-renders.
Ensure client-side behavior does not introduce hydration issues.

11. VISUAL DESIGN
The mobile category UI should visually follow the attached video reference while remaining consistent with the existing application's branding.

The target structure is:

MAIN CARD
→ compact category cards
→ compact category cards
→ compact category cards
→ ...
→ LIHAT SEMUA KATEGORI

and below them:

SCROLL POSITION INDICATOR

Visual principles:

Clean and compact.
Small category cards.
Black borders around category cards.
Consistent spacing.
No unnecessary empty space.
Clear touch targets.
Smooth horizontal interaction.
Modern e-commerce appearance.
Preserve existing typography and branding where possible.
Do not copy unrelated visual elements from the video.

12. ACCESSIBILITY & UX
Ensure the new mobile navigation remains usable and accessible:

Category items must remain keyboard-accessible where applicable.
Buttons/links must have meaningful labels.
Touch targets must remain usable on small screens.
Focus states should remain visible.
Avoid interaction conflicts between horizontal scrolling and clicking.
"Lihat Semua Kategori" must clearly communicate its purpose.

13. REGRESSION PREVENTION
After implementing the mobile UI:

Verify that the existing tablet layout is not affected.
Verify that the existing laptop/desktop layout is not affected.
Verify category navigation still works.
Verify category selection still works.
Verify subcategory navigation still works.
Verify "Lihat Semua Kategori" opens the correct existing navigation.
Verify horizontal scrolling behaves correctly at both ends.
Verify the scroll indicator accurately reflects the scroll position.
Verify there is no layout overflow, clipping, or unwanted whitespace.
FINAL REQUIREMENT
The desired result is a mobile-only category carousel inspired by the attached video:

One main card → compact category cards with black borders → horizontal scrolling → "Lihat Semua Kategori" at the far right → scroll-position indicator at the bottom.

For tablet, laptop, and desktop/PC, preserve the existing category UI and do not apply the mobile carousel design.

FINAL CONSTRAINT
FRONTEND ONLY.

DO NOT TOUCH THE BACKEND UNDER ANY CIRCUMSTANCES.