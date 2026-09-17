import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useFocusTrap } from './useFocusTrap';

/**
 * Unit tests for useFocusTrap hook
 * 
 * Validates: Requirements 10.2, 10.3
 */
describe('useFocusTrap', () => {
  let container: HTMLDivElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let button3: HTMLButtonElement;
  let externalButton: HTMLButtonElement;

  beforeEach(() => {
    // Create a container with focusable elements
    container = document.createElement('div');
    container.setAttribute('role', 'dialog');
    
    button1 = document.createElement('button');
    button1.textContent = 'Button 1';
    
    button2 = document.createElement('button');
    button2.textContent = 'Button 2';
    
    button3 = document.createElement('button');
    button3.textContent = 'Button 3';
    
    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    document.body.appendChild(container);

    // Create external button
    externalButton = document.createElement('button');
    externalButton.textContent = 'External Button';
    document.body.appendChild(externalButton);
    externalButton.focus();
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(externalButton);
  });

  it('should focus first element when activated', () => {
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));

    expect(document.activeElement).toBe(button1);
  });

  it('should cycle focus forward on Tab from last element', () => {
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));

    // Focus last button
    button3.focus();
    expect(document.activeElement).toBe(button3);

    // Simulate Tab key
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true
    });
    container.dispatchEvent(tabEvent);

    // Should wrap to first button
    expect(document.activeElement).toBe(button1);
  });

  it('should cycle focus backward on Shift+Tab from first element', () => {
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));

    // First button should be focused initially
    expect(document.activeElement).toBe(button1);

    // Simulate Shift+Tab key
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true
    });
    container.dispatchEvent(shiftTabEvent);

    // Should wrap to last button
    expect(document.activeElement).toBe(button3);
  });

  it('should restore focus to previously focused element on cleanup', () => {
    const ref = { current: container };
    
    // Focus external button first
    externalButton.focus();
    expect(document.activeElement).toBe(externalButton);

    // Render and unmount hook
    const { unmount } = renderHook(() => useFocusTrap(ref, true));
    
    // Focus should move to first button in container
    expect(document.activeElement).toBe(button1);

    // Unmount hook
    unmount();

    // Focus should return to external button
    expect(document.activeElement).toBe(externalButton);
  });

  it('should not trap focus when isActive is false', () => {
    const ref = { current: container };
    
    externalButton.focus();
    expect(document.activeElement).toBe(externalButton);

    renderHook(() => useFocusTrap(ref, false));

    // Focus should not move
    expect(document.activeElement).toBe(externalButton);
  });

  it('should ignore non-Tab key presses', () => {
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));

    button2.focus();
    expect(document.activeElement).toBe(button2);

    // Simulate Enter key
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true
    });
    container.dispatchEvent(enterEvent);

    // Focus should not change
    expect(document.activeElement).toBe(button2);
  });

  it('should handle container with no focusable elements', () => {
    // Create empty container
    const emptyContainer = document.createElement('div');
    document.body.appendChild(emptyContainer);

    const ref = { current: emptyContainer };
    
    // Should not throw error
    expect(() => {
      renderHook(() => useFocusTrap(ref, true));
    }).not.toThrow();

    document.body.removeChild(emptyContainer);
  });

  it('should skip disabled elements', () => {
    // Add a disabled button
    const disabledButton = document.createElement('button');
    disabledButton.textContent = 'Disabled';
    disabledButton.disabled = true;
    container.insertBefore(disabledButton, button2);

    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));

    // Focus last enabled button
    button3.focus();

    // Simulate Tab key
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true
    });
    container.dispatchEvent(tabEvent);

    // Should skip disabled button and wrap to button1
    expect(document.activeElement).toBe(button1);
  });
});
