import { toPng } from 'html-to-image'

function DownloadButton({ day, name, containerId }) {
  const handleDownload = async () => {
    const container = document.getElementById(containerId)
    if (!container) return

    try {
      const dataUrl = await toPng(container, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })

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
        className="px-6 md:px-8 py-3 md:py-4 text-white font-bold text-base md:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        style={{ backgroundColor: day === 'day1' ? '#4F31B1' : '#EA5346' }}
      >
        Download Day {day === 'day1' ? '1' : '2'} Plan
      </button>
    </div>
  )
}

export default DownloadButton
