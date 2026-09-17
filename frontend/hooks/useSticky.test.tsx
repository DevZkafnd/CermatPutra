/**
 * Unit tests for useSticky custom hook
 * 
 * Validates: Requirements 6.1, 6.2, 6.3
 */

import { renderHook, act } from '@testing-library/react';
import { useSticky } from './useSticky';
import { useRef } from 'react';

// Mock window properties
const mockWindowProperty = (property: string, value: any) => {
  Object.defineProperty(window, property, {
    writable: true,
    configurable: true,
    value,
  });
};

describe('useSticky', () => {
  let ref: React.RefObject<HTMLDivElement>;
  let mockElement: HTMLDivElement;

  beforeEach(() => {
    // Create a mock element
    mockElement = document.createElement('div');
    ref = { current: mockElement };

    // Set up default window dimensions (desktop)
    mockWindowProperty('innerWidth', 1024);
    mockWindowProperty('pageYOffset', 0);

    // Mock getBoundingClientRect
    mockElement.getBoundingClientRect = jest.fn(() => ({
      top: 200,
      left: 0,
      right: 0,
      bottom: 400,
      width: 300,
      height: 200,
      x: 0,
      y: 200,
      toJSON: () => {},
    }));

    // Append to document for ref to work
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    // Clean up
    if (mockElement.parentNode) {
      document.body.removeChild(mockElement);
    }
  });

  it('should initialize with isSticky false', () => {
    const { result } = renderHook(() => useSticky(ref, 80));
    
    expect(result.current.isSticky).toBe(false);
    expect(result.current.stickyStyles.position).toBe('relative');
  });

  it('should become sticky when scrolled past element position minus topOffset', () => {
    const { result } = renderHook(() => useSticky(ref, 80));
    
    // Element is at 200px, topOffset is 80px
    // Should become sticky when scroll > 200 - 80 = 120px
    act(() => {
      mockWindowProperty('pageYOffset', 150);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isSticky).toBe(true);
    expect(result.current.stickyStyles.position).toBe('fixed');
    expect(result.current.stickyStyles.top).toBe('80px');
    expect(result.current.stickyStyles.zIndex).toBe(10);
  });

  it('should not be sticky when scroll is below threshold', () => {
    const { result } = renderHook(() => useSticky(ref, 80));
    
    // Scroll to 100px (below threshold of 120px)
    act(() => {
      mockWindowProperty('pageYOffset', 100);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isSticky).toBe(false);
    expect(result.current.stickyStyles.position).toBe('relative');
  });

  it('should use custom topOffset in sticky styles', () => {
    const customOffset = 120;
    const { result } = renderHook(() => useSticky(ref, customOffset));
    
    // Scroll past threshold
    act(() => {
      mockWindowProperty('pageYOffset', 200);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isSticky).toBe(true);
    expect(result.current.stickyStyles.top).toBe(`${customOffset}px`);
  });

  it('should disable sticky behavior on mobile (viewport < 768px)', () => {
    const { result } = renderHook(() => useSticky(ref, 80));
    
    // Set mobile viewport
    act(() => {
      mockWindowProperty('innerWidth', 600);
      mockWindowProperty('pageYOffset', 300);
      window.dispatchEvent(new Event('resize'));
    });

    // Even though we scrolled past threshold, should not be sticky on mobile
    expect(result.current.isSticky).toBe(false);
    expect(result.current.stickyStyles.position).toBe('relative');
  });

  it('should enable sticky behavior on tablet and desktop (viewport >= 768px)', () => {
    const { result } = renderHook(() => useSticky(ref, 80));
    
    // Set tablet viewport
    act(() => {
      mockWindowProperty('innerWidth', 768);
      mockWindowProperty('pageYOffset', 200);
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isSticky).toBe(true);
    expect(result.current.stickyStyles.position).toBe('fixed');
  });

  it('should recalculate element position on window resize', () => {
    const { result } = renderHook(() => useSticky(ref, 80));
    
    // Change element position
    mockElement.getBoundingClientRect = jest.fn(() => ({
      top: 300, // Changed from 200
      left: 0,
      right: 0,
      bottom: 500,
      width: 300,
      height: 200,
      x: 0,
      y: 300,
      toJSON: () => {},
    }));

    act(() => {
      mockWindowProperty('pageYOffset', 150);
      window.dispatchEvent(new Event('resize'));
    });

    // At 150px scroll with element at 300px, should not be sticky
    expect(result.current.isSticky).toBe(false);
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useSticky(ref, 80));
    
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
