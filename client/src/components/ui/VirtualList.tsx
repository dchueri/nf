import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className = '',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcular quais itens devem ser renderizados
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(height / itemHeight);
    const end = start + visibleCount + overscan;

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, end),
    };
  }, [scrollTop, height, itemHeight, overscan, items.length]);

  // Calcular altura total da lista
  const totalHeight = items.length * itemHeight;

  // Calcular offset para posicionar os itens visíveis
  const offsetY = visibleRange.start * itemHeight;

  // Itens visíveis
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange.start, visibleRange.end]);

  // Handler para scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Scroll para um item específico
  const scrollToItem = useCallback((index: number) => {
    if (containerRef.current) {
      const scrollTop = index * itemHeight;
      containerRef.current.scrollTop = scrollTop;
    }
  }, [itemHeight]);

  // Scroll para o topo
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Scroll para o final
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = totalHeight - height;
      containerRef.current.scrollTop = scrollTop;
    }
  }, [totalHeight, height]);

  return (
    <div className={`relative ${className}`}>
      {/* Container com scroll */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height }}
        onScroll={handleScroll}
      >
        {/* Spacer para altura total */}
        <div style={{ height: totalHeight }}>
          {/* Container dos itens visíveis */}
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
            }}
          >
            {visibleItems.map((item, index) => (
              <motion.div
                key={visibleRange.start + index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                style={{ height: itemHeight }}
              >
                {renderItem(item, visibleRange.start + index)}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicadores de scroll (opcional) */}
      {items.length > 0 && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            onClick={scrollToTop}
            className="p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Ir para o topo"
          >
            ↑
          </button>
          <button
            onClick={scrollToBottom}
            className="p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Ir para o final"
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
}

// Hook para usar a lista virtualizada
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const overscan = 5;

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, start + visibleCount + overscan),
    };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange.start, visibleRange.end]);

  const offsetY = visibleRange.start * itemHeight;

  return {
    scrollTop,
    setScrollTop,
    visibleRange,
    visibleItems,
    offsetY,
    totalHeight: items.length * itemHeight,
  };
}
