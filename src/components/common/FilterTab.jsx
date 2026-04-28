import { useEffect, useRef } from 'react';

/**
 * @param {Object} props
 * @param {Array<{label: string, value: string}>} props.tabs
 * @param {string} props.selected
 * @param {function} props.onChange
 */
export default function FilterTab({ tabs, selected, onChange }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const active = activeRef.current;
      const scrollLeft = active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [selected]);

  return (
    <div
      ref={containerRef}
      className="flex gap-[0.5rem] overflow-x-auto"
      style={{ scrollbarWidth: 'none' }}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.value === selected;
        return (
          <button
            key={tab.value}
            ref={isActive ? activeRef : null}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`shrink-0 w-[3.75rem] h-[2rem] text-[0.875rem] font-semibold transition-colors ${
              isActive
                ? 'bg-[#7D2A25] text-[#FFDDDB] border border-[#C43A31]'
                : 'bg-[#353535] text-[#A0A0A0] border border-[#595959]'
            }`}
            style={{ letterSpacing: '-0.025em' }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
