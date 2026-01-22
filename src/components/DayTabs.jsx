function DayTabs({ selectedDay, setSelectedDay, currentDay }) {
  return (
    <div className="flex justify-center gap-3 md:gap-4 mb-4 md:mb-6">
      <button
        onClick={() => setSelectedDay('day1')}
        className={`px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold text-base md:text-lg transition-all ${
          selectedDay === 'day1'
            ? 'text-white shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        style={selectedDay === 'day1' ? { backgroundColor: '#4F31B1' } : {}}
      >
        Day 1
      </button>
      <button
        onClick={() => setSelectedDay('day2')}
        className={`px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold text-base md:text-lg transition-all ${
          selectedDay === 'day2'
            ? 'text-white shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        style={selectedDay === 'day2' ? { backgroundColor: '#EA5346' } : {}}
      >
        Day 2
      </button>
    </div>
  )
}

export default DayTabs
