import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';

const DROPDOWN_DELAY_MS = 150;
const DROPDOWN_WIDTH_PX = 192;

/**
 * Custom hook for managing dropdown menu state and behavior
 * @param {boolean} initialState - Initial open/closed state
 * @returns {Object} Dropdown state and handlers
 */
const useDropdown = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const timeoutRef = useRef(null);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const rightEdge = rect.left + DROPDOWN_WIDTH_PX;
      const viewportWidth = window.innerWidth;

      const leftPosition = rightEdge > viewportWidth
        ? rect.right - DROPDOWN_WIDTH_PX
        : rect.left;

      setPosition({
        top: rect.bottom,
        left: leftPosition,
      });
    }

    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, DROPDOWN_DELAY_MS);
  }, []);

  const handleDropdownMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  }, []);

  const handleDropdownMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, DROPDOWN_DELAY_MS);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return useMemo(() => ({
    isOpen,
    setIsOpen,
    buttonRef,
    position,
    handleMouseEnter,
    handleMouseLeave,
    handleDropdownMouseEnter,
    handleDropdownMouseLeave,
    closeDropdown,
  }), [
    isOpen,
    position.top,
    position.left,
    handleMouseEnter,
    handleMouseLeave,
    handleDropdownMouseEnter,
    handleDropdownMouseLeave,
    closeDropdown,
  ]);
};

export default useDropdown;
