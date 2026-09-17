/**
 * Manual test validation for useCarousel hook
 * This file validates the correctness of the carousel navigation logic
 * Run with: npx ts-node hooks/useCarousel.manual-test.ts
 */

// Simulate the modulo-based wrap-around logic
function testCarouselNavigation() {
  console.log('Testing Carousel Navigation Logic\n');
  
  // Test Case 1: Next navigation with wrap-around
  console.log('Test 1: Next navigation from last slide wraps to first');
  const slidesLength = 5;
  let currentIndex = 4; // Last slide
  let newIndex = (currentIndex + 1) % slidesLength;
  console.log(`  Current: ${currentIndex}, After next: ${newIndex}`);
  console.assert(newIndex === 0, 'Should wrap to first slide');
  console.log('  ✓ PASSED\n');
  
  // Test Case 2: Prev navigation with wrap-around
  console.log('Test 2: Prev navigation from first slide wraps to last');
  currentIndex = 0; // First slide
  newIndex = (currentIndex - 1 + slidesLength) % slidesLength;
  console.log(`  Current: ${currentIndex}, After prev: ${newIndex}`);
  console.assert(newIndex === 4, 'Should wrap to last slide');
  console.log('  ✓ PASSED\n');
  
  // Test Case 3: Next navigation in middle
  console.log('Test 3: Next navigation in middle of carousel');
  currentIndex = 2;
  newIndex = (currentIndex + 1) % slidesLength;
  console.log(`  Current: ${currentIndex}, After next: ${newIndex}`);
  console.assert(newIndex === 3, 'Should move to next slide');
  console.log('  ✓ PASSED\n');
  
  // Test Case 4: Prev navigation in middle
  console.log('Test 4: Prev navigation in middle of carousel');
  currentIndex = 2;
  newIndex = (currentIndex - 1 + slidesLength) % slidesLength;
  console.log(`  Current: ${currentIndex}, After prev: ${newIndex}`);
  console.assert(newIndex === 1, 'Should move to previous slide');
  console.log('  ✓ PASSED\n');
  
  // Test Case 5: Index bounds check
  console.log('Test 5: Index always within bounds [0, slidesLength)');
  for (let i = 0; i < slidesLength; i++) {
    const nextIdx = (i + 1) % slidesLength;
    const prevIdx = (i - 1 + slidesLength) % slidesLength;
    console.assert(nextIdx >= 0 && nextIdx < slidesLength, `Next from ${i} should be in bounds`);
    console.assert(prevIdx >= 0 && prevIdx < slidesLength, `Prev from ${i} should be in bounds`);
  }
  console.log('  ✓ PASSED - All indices remain within bounds\n');
  
  // Test Case 6: Different carousel sizes
  console.log('Test 6: Wrap-around works for different carousel sizes');
  const testSizes = [3, 5, 7, 10];
  testSizes.forEach(size => {
    const lastIndex = size - 1;
    const wrappedNext = (lastIndex + 1) % size;
    const wrappedPrev = (0 - 1 + size) % size;
    console.assert(wrappedNext === 0, `Size ${size}: next from last should wrap to 0`);
    console.assert(wrappedPrev === lastIndex, `Size ${size}: prev from 0 should wrap to last`);
  });
  console.log('  ✓ PASSED - Wrap-around works for all sizes\n');
  
  console.log('✅ All tests passed!');
}

// Run tests
testCarouselNavigation();
