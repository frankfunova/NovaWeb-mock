
import { useState, useEffect, useCallback } from 'react';

interface UseDeepLinkProps {
  paramName: string; // e.g., 'taskId', 'intentId'
  onOpen?: (id: string) => void;
}

export function useDeepLink<T>({ paramName, onOpen }: UseDeepLinkProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 1. Read URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get(paramName);
    
    if (idFromUrl) {
      setSelectedId(idFromUrl);
      setIsOpen(true);
      if (onOpen) onOpen(idFromUrl);
    }
  }, [paramName]); // Run once on mount (mostly)

  // 2. Function to open item and update URL
  const open = useCallback((id: string) => {
    setSelectedId(id);
    setIsOpen(true);
    
    // Update URL without reloading
    const url = new URL(window.location.href);
    url.searchParams.set(paramName, id);
    window.history.pushState({}, '', url.toString());
  }, [paramName]);

  // 3. Function to close item and clean URL
  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedId(null);

    // Remove param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete(paramName);
    window.history.pushState({}, '', url.toString());
  }, [paramName]);

  // 4. Generate current Share URL
  const getShareUrl = useCallback(() => {
    return window.location.href;
  }, [selectedId, isOpen]);

  return {
    selectedId,
    isOpen,
    open,
    close,
    getShareUrl
  };
}
