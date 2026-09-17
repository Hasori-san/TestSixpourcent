import React from 'react';
import { useAdminMedia } from '../../context/AdminMediaContext';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface EditableImageBadgeProps {
  slotId: string;
  label: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  className?: string;
}

export const EditableImageBadge: React.FC<EditableImageBadgeProps> = ({
  slotId,
  label,
  position = 'top-left',
  className = '',
}) => {
  const { isAdmin, isEditMode, openMediaSelectorForSlot } = useAdminMedia();

  if (!isAdmin || !isEditMode) return null;

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }[position];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        openMediaSelectorForSlot(slotId, label);
      }}
      className={`absolute ${positionClasses} z-30 px-2.5 py-1.5 rounded-lg bg-[#1e1e1e]/90 hover:bg-[#839b64] text-[#eae5da] text-[11px] font-sans font-bold shadow-lg border border-[#839b64]/50 backdrop-blur-xs flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none group ${className}`}
      title={`Modifier cette image (${label}) dans la médiathèque`}
    >
      <Camera className="w-3.5 h-3.5 text-[#839b64] group-hover:text-[#eae5da] transition-colors" />
      <span className="tracking-wide">Changer l'image</span>
    </button>
  );
};
