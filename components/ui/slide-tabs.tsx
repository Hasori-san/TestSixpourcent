import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

export interface TabItem {
  label: string;
  badge?: number | string;
  icon?: React.ReactNode;
}

export type TabEntry = string | TabItem;

export interface SlideTabsProps {
  tabs?: TabEntry[];
  selectedTab?: number;
  defaultTab?: number;
  onTabChange?: (index: number, tabLabel: string) => void;
  className?: string;
  theme?: "inverted" | "standard";
}

export const SlideTabs: React.FC<SlideTabsProps> = ({
  tabs = ["Home", "Pricing", "Features", "Docs", "Blog"],
  selectedTab: controlledSelected,
  defaultTab = 0,
  onTabChange,
  className = "",
}) => {
  const [internalSelected, setInternalSelected] = useState(defaultTab);
  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : internalSelected;

  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);
  const containerRef = useRef<HTMLUListElement | null>(null);

  // Position recalculation helper function
  const updatePositionToSelected = useCallback(() => {
    const selectedTab = tabsRef.current[selected];
    if (selectedTab && containerRef.current) {
      setPosition({
        left: selectedTab.offsetLeft,
        width: selectedTab.offsetWidth,
        opacity: 1,
      });
    }
  }, [selected]);

  // Sync position whenever selected tab changes or component mounts
  useEffect(() => {
    updatePositionToSelected();
    const timer = setTimeout(updatePositionToSelected, 60);
    window.addEventListener("resize", updatePositionToSelected);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePositionToSelected);
    };
  }, [selected, tabs, updatePositionToSelected]);

  const handleSelect = (i: number) => {
    if (!isControlled) {
      setInternalSelected(i);
    }
    const currentTab = tabs[i];
    if (!currentTab) return;
    const label = typeof currentTab === "string" ? currentTab : (currentTab as TabItem).label;
    onTabChange?.(i, label);
  };

  const handleMouseEnterTab = (el: HTMLLIElement) => {
    setPosition({
      left: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
    });
  };

  return (
    <ul
      ref={containerRef}
      onMouseLeave={updatePositionToSelected}
      className={`relative mx-auto flex w-fit items-center rounded-full border-2 border-[#839b64]/50 bg-[#3f241c] p-1.5 shadow-xl ${className}`}
    >
      {tabs.map((tab: TabEntry, i: number) => {
        const isString = typeof tab === "string";
        const label = isString ? tab : tab.label;
        const badge = isString ? undefined : tab.badge;
        const icon = isString ? undefined : tab.icon;
        const isCurrent = selected === i;

        return (
          <Tab
            key={`${label}-${i}`}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            onHover={handleMouseEnterTab}
            onClick={() => handleSelect(i)}
            isSelected={isCurrent}
            badge={badge}
            icon={icon}
          >
            {label}
          </Tab>
        );
      })}

      <Cursor position={position} />
    </ul>
  );
};

// The Tab component is wrapped in forwardRef to accept a ref from its parent.
interface TabProps {
  children: React.ReactNode;
  onHover: (el: HTMLLIElement) => void;
  onClick: () => void;
  isSelected?: boolean;
  badge?: number | string;
  icon?: React.ReactNode;
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(
  ({ children, onHover, onClick, isSelected, badge, icon }, ref) => {
    return (
      <li
        ref={ref}
        onClick={onClick}
        onMouseEnter={(e) => {
          onHover(e.currentTarget);
        }}
        className={`relative z-10 flex cursor-pointer items-center gap-1.5 px-3.5 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-black tracking-tight transition-all duration-200 select-none whitespace-nowrap rounded-full ${
          isSelected
            ? "text-[#3f241c] font-black bg-[#839b64] shadow-[0_2px_12px_rgba(131,155,100,0.5)] border border-[#eae5da]/50 scale-[1.02]"
            : "text-[#eae5da]/80 hover:text-[#eae5da] hover:bg-white/5 border border-transparent"
        }`}
      >
        {icon && (
          <span className={`shrink-0 transition-colors ${isSelected ? "text-[#3f241c]" : "text-[#839b64]"}`}>
            {icon}
          </span>
        )}
        <span>{children}</span>
        {badge !== undefined && badge !== null && (
          <span
            className={`ml-1 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-black font-mono leading-none shadow-sm ${
              isSelected
                ? "bg-[#3f241c] text-[#839b64]"
                : "bg-[#839b64] text-[#3f241c]"
            }`}
          >
            {badge}
          </span>
        )}
      </li>
    );
  }
);
Tab.displayName = "Tab";

interface CursorProps {
  position: {
    left: number;
    width: number;
    opacity: number;
  };
}

const Cursor: React.FC<CursorProps> = ({ position }) => {
  return (
    <motion.li
      animate={{
        left: position.left,
        width: position.width,
        opacity: position.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 32,
      }}
      className="absolute z-0 h-[calc(100%-12px)] rounded-full bg-[#839b64] shadow-[0_2px_10px_rgba(131,155,100,0.5)] border border-[#eae5da]/40 pointer-events-none"
    />
  );
};

export default SlideTabs;
