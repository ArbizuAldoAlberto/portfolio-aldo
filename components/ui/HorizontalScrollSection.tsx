'use client'
import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HorizontalScrollSectionProps {
  children: React.ReactNode
  className?: string
}

export default function HorizontalScrollSection({ children, className = '' }: HorizontalScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const handleScroll = () => {
    if (!containerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    const maxScroll = scrollWidth - clientWidth
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0
    setScrollProgress(progress)
    
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < maxScroll - 10)
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      // Initial check
      handleScroll()
      // Re-check after a brief timeout to let layouts settle
      const timer = setTimeout(handleScroll, 200)
      return () => {
        container.removeEventListener('scroll', handleScroll)
        clearTimeout(timer)
      }
    }
  }, [children])

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    const { clientWidth } = containerRef.current
    const scrollAmount = direction === 'left' ? -clientWidth * 0.6 : clientWidth * 0.6
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <div className="relative w-full group/carousel">
      {/* Left Navigation Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full glass-surface border border-white/10 text-white hover:border-[var(--color-orbital-teal)] hover:shadow-[0_0_15px_rgba(29,158,117,0.4)] transition-all duration-300 backdrop-blur-xl hidden md:flex items-center justify-center cursor-pointer"
          aria-label="Scroll Left"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Right Navigation Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full glass-surface border border-white/10 text-white hover:border-[var(--color-orbital-teal)] hover:shadow-[0_0_15px_rgba(29,158,117,0.4)] transition-all duration-300 backdrop-blur-xl hidden md:flex items-center justify-center cursor-pointer"
          aria-label="Scroll Right"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Native Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className={`w-full overflow-x-auto scrollbar-none flex gap-8 px-8 md:px-16 py-4 scroll-smooth snap-x snap-mandatory ${className}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      {/* Custom Premium Progress Bar */}
      <div className="mt-8 flex justify-center w-full">
        <div className="w-64 h-[2px] bg-[var(--color-space-border)] overflow-hidden rounded-full relative">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-orbital-teal)] to-[var(--color-electric-purple)] rounded-full transition-all duration-150 ease-out"
            style={{ 
              width: `${scrollProgress * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
