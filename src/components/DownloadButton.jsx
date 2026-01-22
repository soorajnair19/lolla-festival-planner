import { toPng, toCanvas } from 'html-to-image'

function DownloadButton({ day, name, containerId }) {
  const handleDownload = async () => {
    const container = document.getElementById(containerId)
    if (!container) return

    try {
      // Wait for background image to load
      await new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = resolve
        img.onerror = resolve
        img.src = window.location.origin + '/homeBackground.webp'
        setTimeout(resolve, 500)
      })

      // Store original scroll position
      const originalScrollY = window.scrollY
      const originalScrollX = window.scrollX
      
      // Scroll to top
      window.scrollTo(0, 0)
      
      // Find all elements with overflow restrictions and store their original styles
      const elementsToModify = []
      const findAllElements = (el) => {
        if (!el) return
        const computed = window.getComputedStyle(el)
        if (computed.overflow === 'hidden' || computed.overflow === 'auto' || computed.overflow === 'scroll' || 
            computed.maxHeight !== 'none' || computed.height !== 'auto') {
          elementsToModify.push({
            element: el,
            overflow: el.style.overflow,
            maxHeight: el.style.maxHeight,
            height: el.style.height,
            width: el.style.width
          })
        }
        Array.from(el.children || []).forEach(findAllElements)
      }
      findAllElements(container)
      
      // Temporarily remove all restrictions
      elementsToModify.forEach(({ element }) => {
        element.style.overflow = 'visible'
        element.style.maxHeight = 'none'
        if (element === container) {
          element.style.height = 'auto'
          element.style.width = 'auto'
        }
      })
      
      // Force reflow
      void container.offsetHeight
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Get actual dimensions after expansion - ensure we get full scrollable width/height
      const fullWidth = Math.max(
        container.scrollWidth,
        container.offsetWidth,
        container.getBoundingClientRect().width
      )
      const fullHeight = Math.max(
        container.scrollHeight,
        container.offsetHeight,
        container.getBoundingClientRect().height
      )
      
      // Ensure container itself is fully expanded
      container.style.width = fullWidth + 'px'
      container.style.minWidth = fullWidth + 'px'
      
      // Wait for layout
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Recalculate after setting width
      const finalWidth = Math.max(container.scrollWidth, fullWidth)
      const finalHeight = Math.max(container.scrollHeight, fullHeight)
      
      // Create wrapper off-screen but visible to html-to-image
      const wrapper = document.createElement('div')
      wrapper.style.position = 'absolute'
      wrapper.style.left = '0'
      wrapper.style.top = '0'
      wrapper.style.width = finalWidth + 'px'
      wrapper.style.height = finalHeight + 'px'
      wrapper.style.backgroundImage = `url(${window.location.origin}/homeBackground.webp)`
      wrapper.style.backgroundSize = 'cover'
      wrapper.style.backgroundPosition = 'center'
      wrapper.style.backgroundRepeat = 'no-repeat'
      wrapper.style.backgroundColor = '#ffffff'
      wrapper.style.zIndex = '99999'
      wrapper.style.overflow = 'visible'
      
      // Add overlay
      const overlay = document.createElement('div')
      overlay.style.position = 'absolute'
      overlay.style.inset = '0'
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
      overlay.style.pointerEvents = 'none'
      overlay.style.zIndex = '1'
      
      // Clone the expanded container
      const clonedContainer = container.cloneNode(true)
      clonedContainer.style.position = 'relative'
      clonedContainer.style.width = finalWidth + 'px'
      clonedContainer.style.height = 'auto'
      clonedContainer.style.margin = '0'
      clonedContainer.style.padding = '0'
      clonedContainer.style.background = 'transparent'
      clonedContainer.style.overflow = 'visible'
      
      // Ensure cloned children also have no overflow, but preserve text truncation
      const removeOverflow = (el) => {
        if (el.style) {
          // Check if element has truncate class - preserve its overflow for truncation
          const hasTruncate = el.className && (el.className.includes('truncate') || el.className.includes('text-ellipsis'))
          if (!hasTruncate) {
            el.style.overflow = 'visible'
            el.style.maxHeight = 'none'
          } else {
            // Ensure truncate styles are explicitly set
            el.style.overflow = 'hidden'
            el.style.textOverflow = 'ellipsis'
            el.style.whiteSpace = 'nowrap'
          }
        }
        Array.from(el.children || []).forEach(removeOverflow)
      }
      removeOverflow(clonedContainer)
      
      // Also ensure all artist name spans and their parent containers have proper truncation
      const artistNameSpans = clonedContainer.querySelectorAll('span')
      artistNameSpans.forEach(span => {
        const hasTruncate = span.className && span.className.includes('truncate')
        
        // Apply truncation to all spans with truncate class
        if (hasTruncate && span.style) {
          span.style.overflow = 'hidden'
          span.style.textOverflow = 'ellipsis'
          span.style.whiteSpace = 'nowrap'
          span.style.maxWidth = '100%'
          
          // Ensure parent flex container has width constraint
          const parent = span.parentElement
          if (parent && parent.style) {
            if (!parent.style.width && !parent.style.maxWidth) {
              const computedStyle = window.getComputedStyle(parent)
              if (computedStyle.display === 'flex' || computedStyle.display === 'inline-flex') {
                parent.style.width = '100%'
                parent.style.minWidth = '0'
              }
            }
          }
        }
      })
      
      // Ensure all button cards have proper width constraints
      const artistCards = clonedContainer.querySelectorAll('button[class*="absolute"]')
      artistCards.forEach(card => {
        if (card.style) {
          // Ensure cards don't expand beyond their container
          card.style.maxWidth = '100%'
          card.style.boxSizing = 'border-box'
        }
      })
      
      wrapper.appendChild(overlay)
      wrapper.appendChild(clonedContainer)
      document.body.appendChild(wrapper)

      await new Promise(resolve => setTimeout(resolve, 500))

      // Capture using toPng - let it calculate dimensions naturally
      const dataUrl = await toPng(wrapper, {
        quality: 1.0,
        pixelRatio: 2,
        useCORS: true,
        cacheBust: true,
      })

      // Restore original styles
      container.style.width = ''
      container.style.minWidth = ''
      elementsToModify.forEach(({ element, overflow, maxHeight, height, width }) => {
        element.style.overflow = overflow || ''
        element.style.maxHeight = maxHeight || ''
        element.style.height = height || ''
        element.style.width = width || ''
      })
      
      // Restore scroll position
      window.scrollTo(originalScrollX, originalScrollY)
      
      // Remove wrapper
      document.body.removeChild(wrapper)

      const link = document.createElement('a')
      link.download = `${name ? `${name}'s ` : ''}Festival Plan - Day ${day === 'day1' ? '1' : '2'}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Failed to generate image. Please try again.')
    }
  }

  return (
    <div className="flex justify-center mt-6 md:mt-8 mb-6 md:mb-8">
      <button
        onClick={handleDownload}
        className="px-6 md:px-8 py-3 md:py-4 text-white font-bold text-base md:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
        style={{ backgroundColor: day === 'day1' ? '#4F31B1' : '#EA5346' }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" 
          />
        </svg>
        Download Day {day === 'day1' ? '1' : '2'} Plan
      </button>
    </div>
  )
}

export default DownloadButton
