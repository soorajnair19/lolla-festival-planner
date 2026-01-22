import { useState } from 'react'
import { lineupData } from './data/lineup'
import DayTabs from './components/DayTabs'
import NameInput from './components/NameInput'
import LineupGrid from './components/LineupGrid'
import DownloadButton from './components/DownloadButton'

function App() {
  const [selectedDay, setSelectedDay] = useState('day1')
  const [name, setName] = useState('')
  const [selections, setSelections] = useState({
    day1: new Set(),
    day2: new Set()
  })

  const toggleSelection = (day, stage, time, artist) => {
    const key = `${stage}-${time}-${artist}`
    setSelections(prev => {
      const newSelections = { ...prev }
      const daySelections = new Set(newSelections[day])
      
      if (daySelections.has(key)) {
        daySelections.delete(key)
      } else {
        daySelections.add(key)
      }
      
      newSelections[day] = daySelections
      return newSelections
    })
  }

  const isSelected = (day, stage, time, artist) => {
    const key = `${stage}-${time}-${artist}`
    return selections[day].has(key)
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/homeBackground.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Header */}
      <header className="relative z-20 bg-red-600 border-b-2 border-yellow-400">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/lollalogo.png" 
                alt="Lollapalooza India" 
                className="h-10 md:h-12 w-auto"
              />
              <div className="h-8 w-px bg-white opacity-50"></div>
              <div className="text-white">
                <div className="text-sm md:text-base font-semibold">Mumbai ❤️ 24-25 Jan 2026</div>
              </div>
            </div>
            <div className="text-white font-bold text-sm md:text-base uppercase tracking-wide">
              FESTIVAL LINE UP PLANNER
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl relative z-10">
        
        <NameInput name={name} setName={setName} />
        
        <DayTabs 
          selectedDay={selectedDay} 
          setSelectedDay={setSelectedDay}
          currentDay={selectedDay}
        />
        
        <div id="lineup-container" className="mt-4 md:mt-8">
          <div className="bg-white/90 rounded-xl p-4 md:p-6">
            {(name || selectedDay) && (
              <div className="text-center mb-4 px-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {name ? `${name}'s Festival Plan` : 'Festival Plan'} — Day {selectedDay === 'day1' ? '1' : '2'}
                </h2>
                <p className="text-gray-700 mt-1 text-sm md:text-base">
                  {selectedDay === 'day1' ? '24 JAN 2026' : '25 JAN 2026'} • MAHALAXMI RACE COURSE • MUMBAI
                </p>
              </div>
            )}
            <LineupGrid
              day={selectedDay}
              data={lineupData[selectedDay]}
              toggleSelection={toggleSelection}
              isSelected={isSelected}
              currentDay={selectedDay}
            />
          </div>
        </div>
        
        <DownloadButton
          day={selectedDay}
          name={name}
          containerId="lineup-container"
        />
      </div>
    </div>
  )
}

export default App
