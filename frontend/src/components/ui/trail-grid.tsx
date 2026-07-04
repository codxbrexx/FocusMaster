import { useEffect, useRef, useState, useCallback } from "react";

export interface TrailGridProps {
  cellSize?: number;
  duration?: number;
  cellColor?: string;
}

export default function TrailGrid({
  cellSize = 40,
  duration = 150,
  cellColor = "rgba(99, 102, 241, 0.15)", // Default to the glowing indigo
}: TrailGridProps) {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const lastHoveredRef = useRef<number>(-1);

  const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0 });

  // Calculate perfect squares based on window size and cell size
  const calculateGrid = useCallback(() => {
    if (typeof window === "undefined") return;
    // Use clientWidth/clientHeight to avoid scrollbar width issues that cause horizontal scroll bugs
    const cols = Math.ceil(document.documentElement.clientWidth / cellSize);
    const rows = Math.ceil(document.documentElement.clientHeight / cellSize);
    setGridDimensions({ cols, rows });
  }, [cellSize]);

  useEffect(() => {
    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, [calculateGrid]);

  useEffect(() => {
    const { cols: columns, rows } = gridDimensions;
    if (columns === 0 || rows === 0) return;

    cellsRef.current = cellsRef.current.slice(0, columns * rows);

    // BUGFIX: React reuses DOM nodes when the array size changes. 
    // We must manually scrub the 'active' class and inline styles 
    // from reused nodes so they don't get stuck on screen randomly.
    cellsRef.current.forEach((cell) => {
      if (cell) {
        cell.classList.remove("active");
        cell.style.borderRadius = "4px";
      }
    });

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      // Only run on hover-capable pointer devices
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const col = Math.floor(e.clientX / cellSize);
        const row = Math.floor(e.clientY / cellSize);

        if (col >= 0 && col < columns && row >= 0 && row < rows) {
          const index = row * columns + col;

          if (index !== lastHoveredRef.current) {
            lastHoveredRef.current = index;
            const targetCell = cellsRef.current[index];

            if (!targetCell) return;

            targetCell.classList.add("active");
            updateCellAndNeighbors(index);

            if (timeoutsRef.current.has(index)) {
              clearTimeout(timeoutsRef.current.get(index)!);
            }

            const timeout = setTimeout(() => {
              const cell = cellsRef.current[index];
              if (cell) {
                cell.classList.remove("active");
                updateCellAndNeighbors(index);
              }
            }, duration);

            timeoutsRef.current.set(index, timeout);
          }
        }
      });
    };

    const handleMouseLeave = () => {
      lastHoveredRef.current = -1;
    };

    const updateCellAndNeighbors = (index: number) => {
      if (!cellsRef.current[index]) return;

      const row = Math.floor(index / columns);
      const col = index % columns;

      const updateRadii = (i: number, r: number, c: number) => {
        if (i < 0 || i >= columns * rows || !cellsRef.current[i]) return;
        
        const topActive = r > 0 && cellsRef.current[i - columns]?.classList.contains("active");
        const bottomActive = r < rows - 1 && cellsRef.current[i + columns]?.classList.contains("active");
        const leftActive = c > 0 && cellsRef.current[i - 1]?.classList.contains("active");
        const rightActive = c < columns - 1 && cellsRef.current[i + 1]?.classList.contains("active");

        const tl = topActive || leftActive ? "0" : "4px";
        const tr = topActive || rightActive ? "0" : "4px";
        const br = bottomActive || rightActive ? "0" : "4px";
        const bl = bottomActive || leftActive ? "0" : "4px";

        cellsRef.current[i]!.style.borderRadius = `${tl} ${tr} ${br} ${bl}`;
      };

      // Update the hovered cell and its immediate neighbors to flatten touching borders
      updateRadii(index, row, col);
      if (row > 0) updateRadii(index - columns, row - 1, col);
      if (row < rows - 1) updateRadii(index + columns, row + 1, col);
      if (col > 0) updateRadii(index - 1, row, col - 1);
      if (col < columns - 1) updateRadii(index + 1, row, col + 1);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current.clear();
      lastHoveredRef.current = -1;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [gridDimensions, duration, cellSize]);

  if (gridDimensions.cols === 0) return null;

  return (
    <div
      ref={gridContainerRef}
      className="bg-grid-wrapper"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%", // BUGFIX: 100% instead of 100vw prevents horizontal scrollbars
        height: "100%",
        zIndex: 0, // Ensure it stays absolutely behind all foreground content
        gridTemplateColumns: `repeat(${gridDimensions.cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridDimensions.rows}, ${cellSize}px)`,
        gap: 0,
        padding: 0,
        boxSizing: "border-box",
        pointerEvents: "none", // Allows clicks to pass through to the document
      }}
    >
      <style suppressHydrationWarning>{`
        .bg-grid-wrapper {
          display: none;
        }
        @media (hover: hover) and (pointer: fine) {
          .bg-grid-wrapper {
            display: grid;
          }
        }
        .cell {
          background-color: transparent;
          border-radius: 4px;
          transition: background-color 0.1s ease, border-radius 0.1s ease;
        }
        .cell.active {
          background-color: ${cellColor};
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(99, 102, 241, 0.2);
          transition: none;
        }
      `}</style>
      {Array.from({ length: gridDimensions.cols * gridDimensions.rows }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            cellsRef.current[i] = el;
          }}
          className="cell"
        />
      ))}
    </div>
  );
}
