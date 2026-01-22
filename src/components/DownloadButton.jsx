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
        img.onerror = resolve // Continue even if image fails
        img.src = window.location.origin + '/homeBackground.webp'
        setTimeout(resolve, 500) // Fallback timeout
      })

      // Get the parent element that has the background
      const parentWithBackground = container.closest('[style*="backgroundImage"]') || 
                                   document.querySelector('[style*="homeBackground"]')
      
      // Create a wrapper with background
      const wrapper = document.createElement('div')
      wrapper.style.position = 'absolute'
      wrapper.style.left = '-9999px'
      wrapper.style.top = '0'
      wrapper.style.width = container.scrollWidth + 'px'
      wrapper.style.height = container.scrollHeight + 'px'
      wrapper.style.backgroundImage = `url(${window.location.origin}/homeBackground.webp)`
      wrapper.style.backgroundSize = 'cover'
      wrapper.style.backgroundPosition = 'center'
      wrapper.style.backgroundRepeat = 'no-repeat'
      wrapper.style.backgroundColor = '#ffffff'
      
      // Add overlay
      const overlay = document.createElement('div')
      overlay.style.position = 'absolute'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.width = '100%'
      overlay.style.height = '100%'
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
      overlay.style.pointerEvents = 'none'
      overlay.style.zIndex = '1'
      
      // Clone container
      const clonedContainer = container.cloneNode(true)
      clonedContainer.style.position = 'relative'
      clonedContainer.style.width = '100%'
      clonedContainer.style.height = '100%'
      clonedContainer.style.margin = '0'
      clonedContainer.style.padding = '0'
      clonedContainer.style.background = 'transparent'
      
      wrapper.appendChild(overlay)
      wrapper.appendChild(clonedContainer)
      document.body.appendChild(wrapper)

      // Wait for rendering and background to load
      await new Promise(resolve => setTimeout(resolve, 300))

      // First capture the content
      const contentCanvas = await toCanvas(clonedContainer, {
        quality: 1.0,
        pixelRatio: 2,
        useCORS: true,
        cacheBust: true,
      })

      // Create final canvas with background
      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = wrapper.offsetWidth * 2
      finalCanvas.height = wrapper.offsetHeight * 2
      const ctx = finalCanvas.getContext('2d')

      // Draw background image
      const bgImg = new Image()
      bgImg.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, finalCanvas.width, finalCanvas.height)
          // Draw overlay
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
          ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)
          // Draw content on top
          ctx.drawImage(contentCanvas, 0, 0, finalCanvas.width, finalCanvas.height)
          resolve()
        }
        bgImg.onerror = reject
        bgImg.src = window.location.origin + '/homeBackground.webp'
        setTimeout(() => {
          // Fallback: draw without background if image fails
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)
          ctx.drawImage(contentCanvas, 0, 0, finalCanvas.width, finalCanvas.height)
          resolve()
        }, 1000)
      })

      const dataUrl = finalCanvas.toDataURL('image/png', 1.0)
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
