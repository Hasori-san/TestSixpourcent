"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, Bookmark, ArrowLeft, ChevronRight } from "lucide-react"
import { BrandLogo } from "../../src/components/BrandLogo"

export interface NavItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: number | string
}

export interface Navbar1Props {
  items?: NavItem[]
  activeItemId?: string
  onItemClick?: (id: string) => void
  onActionClick?: () => void
  actionLabel?: string
  actionBadge?: number | string
  logoText?: string
  onLogoClick?: () => void
  isInArticleReader?: boolean
  className?: string
  hideNearFooter?: boolean
  isMobileMenuOpen?: boolean
  onMobileMenuOpenChange?: (open: boolean) => void
}

const DEFAULT_ITEMS: NavItem[] = [
  { id: "populaires", label: "Dossiers populaires" },
  { id: "recherche", label: "Recherche" },
  { id: "favoris", label: "Favoris" },
]

const Navbar1: React.FC<Navbar1Props> = ({
  items = DEFAULT_ITEMS,
  activeItemId = "populaires",
  onItemClick,
  onActionClick,
  actionLabel = "Mes Favoris",
  actionBadge,
  logoText = "Six%",
  onLogoClick,
  isInArticleReader = false,
  className = "",
  hideNearFooter = true,
  isMobileMenuOpen,
  onMobileMenuOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = isMobileMenuOpen !== undefined ? isMobileMenuOpen : internalIsOpen
  const [isNearFooter, setIsNearFooter] = useState(false)
  const [isScrolledInReader, setIsScrolledInReader] = useState(false)

  const handleMenuChange = (open: boolean) => {
    setInternalIsOpen(open)
    onMobileMenuOpenChange?.(open)
  }

  const toggleMenu = () => handleMenuChange(!isOpen)

  // When in article reader mode, hide Navbar1 as soon as scrolling begins
  // so it does not remain trapped behind the sticky article header toolbar
  useEffect(() => {
    if (!isInArticleReader) {
      setIsScrolledInReader(false)
      return
    }

    const checkReaderScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolledInReader(true)
      } else {
        setIsScrolledInReader(false)
      }
    }

    checkReaderScroll()
    window.addEventListener("scroll", checkReaderScroll, { passive: true })
    return () => window.removeEventListener("scroll", checkReaderScroll)
  }, [isInArticleReader])

  // Detect when approaching footer or bottom of the page
  useEffect(() => {
    if (!hideNearFooter) {
      setIsNearFooter(false)
      return
    }

    const checkFooterOverlap = () => {
      const footerEl = document.getElementById("global-footer")
      if (footerEl) {
        const rect = footerEl.getBoundingClientRect()
        // If the top of the footer is within 150px of the viewport top, or visible enough to compete with sticky header
        if (rect.top <= 140) {
          setIsNearFooter(true)
          return
        }
      }

      // Fallback: check if we are within 250px of the absolute bottom of document
      const scrollBottom =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
      if (scrollBottom <= 200) {
        setIsNearFooter(true)
      } else {
        setIsNearFooter(false)
      }
    }

    checkFooterOverlap()
    window.addEventListener("scroll", checkFooterOverlap, { passive: true })
    window.addEventListener("resize", checkFooterOverlap, { passive: true })

    return () => {
      window.removeEventListener("scroll", checkFooterOverlap)
      window.removeEventListener("resize", checkFooterOverlap)
    }
  }, [hideNearFooter])

  const handleItemSelect = (id: string) => {
    onItemClick?.(id)
    if (isOpen) {
      handleMenuChange(false)
    }
  }

  const handleActionClick = () => {
    onActionClick?.()
    if (isOpen) {
      handleMenuChange(false)
    }
  }

  const shouldHide = (isNearFooter || (isInArticleReader && isScrolledInReader)) && !isOpen

  return (
    <header
      className={`sticky top-0 z-40 flex justify-center w-full py-4 px-4 backdrop-blur-md bg-[#eae5da]/80 transition-all duration-300 ${
        shouldHide
          ? "opacity-0 -translate-y-8 pointer-events-none invisible"
          : "opacity-100 translate-y-0 pointer-events-auto visible"
      } ${className}`}
    >
      <div className="flex items-center justify-between px-5 sm:px-6 py-2.5 sm:py-3 bg-[#3f241c] text-[#eae5da] rounded-full shadow-xl border border-[#839b64]/30 w-full max-w-4xl relative z-10">
        
        {/* Brand Logo / Home trigger */}
        <div className="flex items-center">
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            aria-label="Retour à l'accueil"
          >
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eae5da] shadow-md border border-[#839b64]/30 p-1"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <BrandLogo className="w-full h-full" />
            </motion.div>

            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-black tracking-tight leading-none text-[#eae5da] group-hover:text-[#839b64] transition-colors">
                {logoText}
              </span>
              <span className="text-[9px] uppercase tracking-widest font-mono text-[#839b64] font-bold">
                Investigation
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {items.map((item) => {
            const isActive = activeItemId === item.id

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
              >
                <button
                  onClick={() => handleItemSelect(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold transition-all cursor-pointer select-none ${
                    isActive
                      ? "bg-[#839b64] text-[#3f241c] shadow-[0_2px_10px_rgba(131,155,100,0.4)]"
                      : "text-[#eae5da]/80 hover:text-[#eae5da] hover:bg-white/10"
                  }`}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 text-[10px] font-mono font-black rounded-full ${
                        isActive
                          ? "bg-[#3f241c] text-[#839b64]"
                          : "bg-[#839b64] text-[#3f241c]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </motion.div>
            )
          })}
        </nav>

        {/* Desktop CTA / Favorites Button */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          {isInArticleReader ? (
            <button
              onClick={onLogoClick}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-[#eae5da] bg-[#839b64]/30 hover:bg-[#839b64] hover:text-[#3f241c] border border-[#839b64]/50 rounded-full transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sommaire</span>
            </button>
          ) : (
            <button
              onClick={handleActionClick}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-[#3f241c] bg-[#839b64] hover:bg-[#94ac74] rounded-full transition-all cursor-pointer shadow-sm"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{actionLabel}</span>
              {actionBadge !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-black bg-[#3f241c] text-[#839b64] rounded-full">
                  {actionBadge}
                </span>
              )}
            </button>
          )}
        </motion.div>

        {/* Mobile Menu Controls */}
        <div className="md:hidden flex items-center gap-2">
          {actionBadge !== undefined && Number(actionBadge) > 0 && (
            <button
              onClick={handleActionClick}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#839b64] text-[#3f241c] text-xs font-bold font-mono shadow-sm cursor-pointer"
              title="Mes Favoris"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{actionBadge}</span>
            </button>
          )}

          <motion.button
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 active:bg-[#839b64] active:text-[#3f241c] text-[#eae5da] border border-[#839b64]/30 transition-colors cursor-pointer focus:outline-none"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>

      {/* Modern Ergonomic Mobile Menu Drawer / Card Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleMenuChange(false)}
            />

            {/* Floating rounded card anchored from top */}
            <motion.div
              className="fixed top-3 inset-x-3 max-w-lg mx-auto z-50 md:hidden bg-[#3f241c] text-[#eae5da] rounded-3xl border border-[#839b64]/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#eae5da]/15 bg-black/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#eae5da] text-[#3f241c] p-0.5 shadow border border-[#839b64]/30">
                    <BrandLogo className="w-full h-full" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-black tracking-tight text-[#eae5da]">
                      Six% Investigation
                    </span>
                    <span className="text-[9px] uppercase tracking-widest font-mono text-[#839b64] font-bold">
                      Menu de navigation
                    </span>
                  </div>
                </div>

                <motion.button
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#eae5da] flex items-center justify-center cursor-pointer transition-colors"
                  onClick={toggleMenu}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Fermer le menu"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Scrollable body */}
              <div className="p-3.5 sm:p-4 space-y-2 overflow-y-auto">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#839b64] font-bold px-2 py-0.5">
                  Rubriques
                </div>

                {items.map((item) => {
                  const isActive = activeItemId === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemSelect(item.id)}
                      className={`flex items-center justify-between w-full px-3.5 py-3 rounded-2xl text-left text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#839b64] text-[#3f241c] shadow-sm"
                          : "text-[#eae5da] hover:bg-white/10 active:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-1.5 rounded-lg flex items-center justify-center ${
                          isActive ? "bg-[#3f241c]/15 text-[#3f241c]" : "bg-white/10 text-[#839b64]"
                        }`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge !== undefined && (
                          <span
                            className={`px-2 py-0.5 text-xs font-mono font-black rounded-full ${
                              isActive
                                ? "bg-[#3f241c] text-[#839b64]"
                                : "bg-[#839b64] text-[#3f241c]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 opacity-50 ${isActive ? "text-[#3f241c]" : "text-[#eae5da]"}`} />
                      </div>
                    </button>
                  )
                })}

                {/* Quick Action Button (Favoris) */}
                <div className="pt-2">
                  <button
                    onClick={handleActionClick}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-[#839b64] hover:bg-[#94ac74] active:bg-[#728956] text-[#3f241c] font-bold transition-all shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1.5 rounded-lg bg-[#3f241c]/15 text-[#3f241c]">
                        <Bookmark className="w-4 h-4 fill-current" />
                      </span>
                      <span className="text-sm">{actionLabel}</span>
                    </div>
                    {actionBadge !== undefined && (
                      <span className="px-2 py-0.5 text-xs font-mono font-black bg-[#3f241c] text-[#839b64] rounded-full">
                        {actionBadge}
                      </span>
                    )}
                  </button>
                </div>

                {isInArticleReader && (
                  <button
                    onClick={() => {
                      onLogoClick?.()
                      handleMenuChange(false)
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/20 text-[#eae5da] text-xs font-bold transition-colors cursor-pointer mt-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour au menu principal</span>
                  </button>
                )}
              </div>

              {/* Footer inside card */}
              <div className="px-4 py-2.5 bg-black/20 border-t border-[#eae5da]/10 text-center text-[10px] font-mono text-[#eae5da]/60">
                Édition #48 • Média 100% indépendant & sans publicité
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

export { Navbar1 }
export default Navbar1
