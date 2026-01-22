function NameInput({ name, setName }) {
  return (
    <div className="max-w-md mx-auto mb-4 md:mb-6">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add your name (optional)"
        className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-base md:text-lg"
      />
    </div>
  )
}

export default NameInput
