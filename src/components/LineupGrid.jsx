import { useMemo } from 'react'

function LineupGrid({ day, data, toggleSelection, isSelected, currentDay }) {
  const isDay1 = currentDay === 'day1'
  
  // Timeline hours: 1:00 to 9:00 (display only, timeline still spans to 10:00)
  const timelineHours = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => i + 1)
  }, [])

  // Convert time string to minutes from 1:00 (e.g., "2:30" = 90 minutes)
  function parseTimeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const totalMinutes = (hours - 1) * 60 + (minutes || 0)
    return totalMinutes
  }

  // Calculate position and height for a time slot
  function calculateSlotStyle(timeRange) {
    const [startStr, endStr] = timeRange.split('-')
    const startMinutes = parseTimeToMinutes(startStr.trim())
    const endMinutes = parseTimeToMinutes(endStr.trim())
    const duration = endMinutes - startMinutes
    
    // Total timeline spans from 1:00 (0 min) to 10:00 (540 min) = 540 minutes (9 hours)
    const totalMinutes = 540
    const topPercent = (startMinutes / totalMinutes) * 100
    const heightPercent = (duration / totalMinutes) * 100
    
    return {
      top: `${topPercent}%`,
      height: `${heightPercent}%`
    }
  }

  const dayColors = isDay1
    ? {
        bg: 'bg-teal-100',
        selected: '#4F31B1',
        border: 'border-purple-600',
        text: 'text-black',
        stageHeader: 'bg-teal-600',
        hover: 'hover:bg-yellow-200',
        timeline: '#000000',
        defaultCard: 'bg-yellow-100',
        defaultCardText: 'text-black'
      }
    : {
        bg: 'bg-blue-100',
        selected: '#EA5346',
        border: 'border-red-600',
        text: 'text-black',
        stageHeader: '#014C64',
        hover: 'hover:bg-yellow-200',
        timeline: '#000000',
        defaultCard: 'bg-yellow-100',
        defaultCardText: 'text-black'
      }

  return (
    <div className={`${dayColors.bg} rounded-xl p-3 md:p-6 shadow-lg overflow-hidden`}>
      <div className="overflow-x-auto -mx-3 md:mx-0">
        <div className="inline-block min-w-full rounded-xl overflow-hidden">
          <div className="flex">
            {/* Timeline Column */}
            <div 
              className="w-20 md:w-24 flex-shrink-0 relative rounded-l-xl overflow-hidden"
              style={{ backgroundColor: dayColors.timeline }}
            >
              <div className="sticky top-0">
                <div className="h-16 md:h-20"></div> {/* Header spacer */}
                <div className="relative h-[540px] md:h-[600px] overflow-hidden">
                  {timelineHours.map((hour) => {
                    // Position each hour marker: 1:00 at 0%, 2:00 at 11.11%, ..., 9:00 at 88.89% (10:00 would be at 100% but not displayed)
                    const positionPercent = ((hour - 1) / 9) * 100
                    return (
                      <div
                        key={hour}
                        className="absolute left-0 right-0 flex items-center justify-center"
                        style={{ top: `${positionPercent}%` }}
                      >
                        <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">
                          {hour}:00
                        </span>
                      </div>
                    )
                  })}
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-white opacity-30"></div>
                </div>
              </div>
            </div>

            {/* Stages */}
            <div className="flex-1 flex relative">
              {data.map((stage, stageIdx) => {
                const isLastStage = stageIdx === data.length - 1
                return (
                <div key={stageIdx} className={`flex-1 min-w-[150px] md:min-w-[200px] relative z-10 ${isLastStage ? 'rounded-r-xl overflow-hidden' : ''}`}>
                  {/* Stage Header */}
                  <div 
                    className={`text-white px-2 md:px-4 py-3 md:py-4 text-center font-bold text-xs md:text-base h-16 md:h-20 flex items-center justify-center ${typeof dayColors.stageHeader === 'string' && dayColors.stageHeader.startsWith('#') ? '' : dayColors.stageHeader}`}
                    style={typeof dayColors.stageHeader === 'string' && dayColors.stageHeader.startsWith('#') ? { backgroundColor: dayColors.stageHeader } : {}}
                  >
                    {stage.stage}
                  </div>
                  
                  {/* Stage Slots Container */}
                  <div className={`relative h-[540px] md:h-[600px] ${isLastStage ? '' : 'border-r border-gray-200'} overflow-hidden ${isDay1 ? 'bg-teal-100' : 'bg-blue-100'}`}>
                    {/* Hour marker lines */}
                    {timelineHours.map((hour) => {
                      const positionPercent = ((hour - 1) / 9) * 100
                      return (
                        <div
                          key={hour}
                          className="absolute left-0 right-0 border-t border-dashed pointer-events-none"
                          style={{
                            top: `${positionPercent}%`,
                            borderColor: isDay1 
                              ? 'rgba(20, 184, 166, 0.6)' 
                              : 'rgba(59, 130, 246, 0.6)',
                            borderStyle: 'dashed',
                            borderWidth: '1px',
                            zIndex: 1
                          }}
                        />
                      )
                    })}
                    {stage.slots.map((slot, slotIdx) => {
                      const selected = isSelected(day, stage.stage, slot.time, slot.artist)
                      const style = calculateSlotStyle(slot.time)
                      
                      return (
                        <button
                          key={slotIdx}
                          onClick={() => toggleSelection(day, stage.stage, slot.time, slot.artist)}
                          title={`${slot.artist} - ${slot.time}`}
                          className={`absolute left-1 right-1 rounded-lg text-left transition-all cursor-pointer overflow-hidden z-20 ${
                            selected
                              ? `text-white font-bold shadow-lg border-2 ${dayColors.border}`
                              : `${dayColors.defaultCard} ${dayColors.hover} border-2 border-gray-300`
                          }`}
                          style={{
                            top: style.top,
                            height: style.height,
                            minHeight: '40px',
                            ...(selected ? { backgroundColor: dayColors.selected } : {})
                          }}
                        >
                          <div className="p-2 md:p-3 h-full flex flex-col justify-between">
                            <div className="flex items-start gap-1.5 flex-nowrap w-full">
                              <span className={`${selected ? 'text-white' : dayColors.defaultCardText} text-[10px] md:text-xs font-semibold leading-tight flex-1 min-w-0 truncate`}>
                                {slot.artist}
                              </span>
                              <span className={`${selected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'} text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 font-medium whitespace-nowrap`}>
                                {slot.time}
                              </span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LineupGrid
