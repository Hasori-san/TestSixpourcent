import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Bookmark, ArrowRight } from 'lucide-react';
import { useAdminMedia } from '../context/AdminMediaContext';
import { EditableImageBadge } from './admin/EditableImageBadge';

interface Carousel3DProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (articleId: string) => void;
}

export const Carousel3D: React.FC<Carousel3DProps> = ({
  articles,
  onSelectArticle,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const { getImageFor } = useAdminMedia();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [isRightDragging, setIsRightDragging] = useState(false);
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rightDragStartXRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const dragDeltaXRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const total = articles.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  // Window mouseup & mousemove listeners for seamless right-click dragging
  useEffect(() => {
    if (!isRightDragging) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - rightDragStartXRef.current;
      dragDeltaXRef.current = diff;
      if (Math.abs(diff) > 5) {
        hasDraggedRef.current = true;
      }
      setDragDeltaX(diff);
    };

    const handleWindowMouseUp = (e: MouseEvent) => {
      if (e.button === 2 || isRightDragging) {
        const diff = dragDeltaXRef.current;
        const threshold = 45;
        if (diff > threshold) {
          prevSlide();
        } else if (diff < -threshold) {
          nextSlide();
        }
        setIsRightDragging(false);
        setDragDeltaX(0);
        dragDeltaXRef.current = 0;
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 80);
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isRightDragging, total]);

  // Right-click mousedown
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 2) {
      e.preventDefault();
      rightDragStartXRef.current = e.clientX;
      dragDeltaXRef.current = 0;
      hasDraggedRef.current = false;
      setIsRightDragging(true);
      setDragDeltaX(0);
    }
  };

  // Prevent default context menu on right click in carousel stage
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Mobile touch gestures
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      dragDeltaXRef.current = 0;
      hasDraggedRef.current = false;
      setIsTouchDragging(true);
      setDragDeltaX(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouchDragging || e.touches.length !== 1) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - touchStartYRef.current;

    // Track horizontal swipe if movement is primarily horizontal
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 8) {
        hasDraggedRef.current = true;
      }
      dragDeltaXRef.current = diffX;
      setDragDeltaX(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (isTouchDragging) {
      const diff = dragDeltaXRef.current;
      const threshold = 40;
      if (diff > threshold) {
        prevSlide();
      } else if (diff < -threshold) {
        nextSlide();
      }
      setIsTouchDragging(false);
      setDragDeltaX(0);
      dragDeltaXRef.current = 0;
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 80);
    }
  };

  // Handle mouse move for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section 
      id="carousel-3d-section"
      className="relative w-full py-10 overflow-hidden"
      aria-label="Carrousel 3D des enquêtes les plus populaires"
    >
      {/* Header of the Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#839b64]/15 text-[#3f241c] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#839b64]/30">
            <span className="w-2 h-2 rounded-full bg-[#839b64] animate-pulse"></span>
            Les Dossiers Brûlants • Six% Focus
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3f241c] tracking-tight">
            Les articles du moment
          </h2>
          <p className="text-sm sm:text-base text-[#3f241c]/80 mt-1 max-w-2xl">
            Toute l'info en un seul clic
          </p>
        </div>

        {/* Carousel Navigation Buttons & Gestures hint */}
        <div className="flex flex-col sm:items-end gap-1.5">
          <div className="flex items-center gap-3">
            <button
              id="carousel-prev-btn"
              onClick={prevSlide}
              aria-label="Enquête précédente"
              className="p-3 rounded-full border-2 border-[#3f241c]/20 bg-[#eae5da] hover:bg-[#839b64] hover:text-[#eae5da] text-[#3f241c] transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-mono text-[#3f241c]/70 font-semibold px-2">
              0{activeIndex + 1} / 0{total}
            </span>
            <button
              id="carousel-next-btn"
              onClick={nextSlide}
              aria-label="Enquête suivante"
              className="p-3 rounded-full border-2 border-[#3f241c]/20 bg-[#eae5da] hover:bg-[#839b64] hover:text-[#eae5da] text-[#3f241c] transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <span className="text-[11px] font-mono text-[#3f241c]/60 hidden sm:inline-block">
            Glissez au clic droit ou au doigt (mobile)
          </span>
        </div>
      </div>

      {/* 3D Stage Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isRightDragging ? 'grabbing' : 'default',
          touchAction: 'pan-y',
        }}
        className="relative w-full h-[470px] sm:h-[560px] md:h-[600px] flex items-center justify-center perspective-1000 select-none px-6 sm:px-4"
      >
        {articles.map((article, index) => {
          // Circular offset relative to activeIndex
          let offset = index - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isActive = offset === 0;
          const isPrev = offset === -1;
          const isNext = offset === 1;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          const isFourthCard = Math.abs(offset) > 1;
          const isCurrentlyDragging = isRightDragging || isTouchDragging;

          // Parallax and interactive drag calculation
          const dragShift = dragDeltaX;
          const dragTilt = dragShift * 0.05;

          const baseOffset = isMobile ? 220 : 340;
          const tiltX = isActive ? -mousePos.y * 7 : 0;
          const tiltY = (isActive ? mousePos.x * 9 + offset * (isMobile ? 24 : 32) : offset * (isMobile ? 28 : 36)) - dragTilt;
          const translateX = offset * baseOffset + dragShift + (isActive ? mousePos.x * 15 : 0);
          const translateZ = isActive ? (isMobile ? 70 : 110) : (isMobile ? -100 : -140) * Math.abs(offset);
          const rotateZ = offset * -2 + (dragShift * -0.015);
          const scale = isActive ? 1 : (isMobile ? 0.82 : 0.85);
          // Systematically hide the fourth card (opacity 0) so only the balanced 3-card stage is visible
          const opacity = isActive ? 1 : Math.abs(offset) === 1 ? 0.7 : 0;
          const zIndex = isFourthCard ? -10 : 30 - Math.abs(offset) * 10;
          const isBookmarked = bookmarkedIds.includes(article.id);

          const transitionStyle = isCurrentlyDragging
            ? 'transform 0.04s linear, opacity 0.2s'
            : (isHovered && isActive 
                ? 'transform 0.12s ease-out, opacity 0.35s' 
                : 'transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s');

          return (
            <div
              key={article.id}
              id={`carousel-slide-${article.id}`}
              onClick={() => {
                if (hasDraggedRef.current) return;
                if (!isActive && !isFourthCard) {
                  setActiveIndex(index);
                }
              }}
              aria-hidden={isFourthCard}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${tiltY}deg) rotateX(${tiltX}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                opacity,
                zIndex,
                pointerEvents: isFourthCard ? 'none' : 'auto',
                transition: transitionStyle,
                cursor: isRightDragging ? 'grabbing' : (isActive ? 'default' : 'pointer'),
              }}
              className={`absolute w-[80vw] max-w-[285px] sm:max-w-[440px] md:max-w-[560px] rounded-2xl overflow-hidden bg-[#f4f0e8] border-2 ${
                isActive ? 'border-[#839b64] shadow-2xl shadow-[#3f241c]/25 ring-2 ring-[#839b64]/30' : 'border-[#3f241c]/15 shadow-lg cursor-pointer'
              } ${isFourthCard ? 'pointer-events-none select-none' : ''} preserve-3d`}
            >
              {/* Image with Parallax Shift */}
              <div className="relative h-44 sm:h-64 md:h-72 overflow-hidden bg-[#3f241c]">
                {isActive && (
                  <EditableImageBadge
                    slotId={`article-${article.id}-hero`}
                    label={`Couverture • ${article.title}`}
                    position="top-left"
                  />
                )}
                <img
                  src={getImageFor(`article-${article.id}-hero`, article.heroImage)}
                  alt={article.title}
                  style={{
                    transform: isActive 
                      ? `scale(1.1) translate(${mousePos.x * -12}px, ${mousePos.y * -8}px)` 
                      : 'scale(1)',
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="w-full h-full object-cover brightness-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3f241c] via-[#3f241c]/40 to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                  <span className="px-3 py-1 rounded-md bg-[#839b64] text-[#eae5da] text-xs font-bold uppercase tracking-wider shadow">
                    {article.category}
                  </span>

                  <button
                    id={`carousel-bookmark-${article.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(article.id);
                    }}
                    title={isBookmarked ? 'Retirer des favoris' : 'Enregistrer dans les favoris'}
                    className={`p-2 rounded-full backdrop-blur-md transition-colors duration-200 ${
                      isBookmarked 
                        ? 'bg-[#839b64] text-[#eae5da]' 
                        : 'bg-[#3f241c]/60 text-[#eae5da] hover:bg-[#839b64]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-6 bg-[#f4f0e8] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#3f241c]/70 mb-1.5 sm:mb-2 font-mono">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#839b64]" />
                      {article.readTimeMinutes} min
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#3f241c] line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#3f241c]/80 mt-1 sm:mt-2 line-clamp-2 leading-relaxed">
                    {article.subtitle}
                  </p>
                </div>

                {/* Interactive 1-Click Read Button */}
                <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-[#3f241c]/10 flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-[#839b64] shrink-0"
                    />
                    <span className="text-xs font-semibold text-[#3f241c] truncate">
                      {article.author.name}
                    </span>
                  </div>

                  <button
                    id={`btn-read-now-${article.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArticle(article);
                    }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
                    <span>Lire en 1 clic</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {articles.map((art, idx) => (
          <button
            key={art.id}
            id={`carousel-dot-${idx}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Aller à l'enquête ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === activeIndex 
                ? 'w-8 h-2.5 bg-[#839b64]' 
                : 'w-2.5 h-2.5 bg-[#3f241c]/30 hover:bg-[#3f241c]/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
