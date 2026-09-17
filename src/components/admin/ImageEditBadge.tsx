import React from 'react';
import { Camera } from 'lucide-react';

interface ImageEditBadgeProps {
  onClick: (e: React.MouseEvent) => void;
  tooltip?: string;
  className?: string;
  size?: 'sm' | 'md';
  label?: string;
}

export const ImageEditBadge: React.FC<ImageEditBadgeProps> = ({
  onClick,
  tooltip = 'Changer cette image via la médiathèque',
  className = 'top-3 left-3',
  size = 'md',
  label = 'Modifier la photo',
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick(e);
      }}
      title={tooltip}
      className={`absolute ${className} z-40 group/badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3f241c]/95 hover:bg-[#839b64] text-[#eae5da] text-xs font-mono font-bold shadow-xl border border-white/40 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto select-none`}
    >
      <Camera className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-[#839b64] group-hover/badge:text-[#eae5da] transition-colors`} />
      <span className="text-[11px] font-bold tracking-tight">
        {label}
      </span>
      <span className="w-2 h-2 rounded-full bg-[#839b64] group-hover/badge:bg-white animate-pulse" />
    </button>
  );
};
