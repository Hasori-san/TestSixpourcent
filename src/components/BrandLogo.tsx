import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "w-6 h-6",
  size,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Six% Investigation Logo"
    >
      {/* Anneau supérieur gauche */}
      <path
        d="M 33 19 A 13.5 13.5 0 1 0 33 46 A 13.5 13.5 0 1 0 33 19 Z M 33 26 A 6.5 6.5 0 1 1 33 39 A 6.5 6.5 0 1 1 33 26 Z"
        fill="#3f241c"
        fillRule="evenodd"
      />

      {/* Anneau inférieur droit */}
      <path
        d="M 67 54 A 13.5 13.5 0 1 0 67 81 A 13.5 13.5 0 1 0 67 54 Z M 67 61 A 6.5 6.5 0 1 1 67 74 A 6.5 6.5 0 1 1 67 61 Z"
        fill="#3f241c"
        fillRule="evenodd"
      />

      {/* Manche du pinceau pointu vers le bas à gauche */}
      <path
        d="M 26 77 L 46.5 45 L 50.5 47.5 L 26 77 Z"
        fill="#3f241c"
      />

      {/* Virole métallique */}
      <path
        d="M 46 44.5 L 48.5 41.5 L 52.5 44 L 50 47 Z"
        fill="#2c1711"
      />
      <path
        d="M 47.8 42.5 L 49.8 40.5 L 50.8 41.2 L 48.8 43.2 Z"
        fill="#eae5da"
        opacity="0.8"
      />

      {/* Touffe / ventre du pinceau */}
      <circle
        cx="53"
        cy="40"
        r="4.6"
        fill="#3f241c"
      />

      {/* Pointe de pinceau trempée dans l'encre verte */}
      <path
        d="M 52 38.5 C 53.5 35 57 30 64 25 C 69 21.5 73.5 20.5 74 21 C 74.2 21.5 71 25.5 66 29.5 C 61 33.5 56.5 38 53.5 39.5 Z"
        fill="#839b64"
      />
    </svg>
  );
};

export default BrandLogo;
