# Lollapalooza India - Festival Lineup Planner

A client-side React application to help you plan which artists to attend at the Lollapalooza India festival across multiple stages and overlapping time slots.

## Features

- **Day Selection**: Switch between Day 1 (Jan 24) and Day 2 (Jan 25) lineups
- **Artist Selection**: Click on any artist to select/deselect them for your personal plan
- **Visual Highlights**: Selected artists are highlighted with bold borders and checkmarks
- **Personalization**: Add your name (optional) to personalize your plan
- **Export**: Download your selected plan as a PNG image to share with friends
- **Color Themes**: 
  - Day 1: Purple/Pink/Green theme
  - Day 2: Red/Pink/Yellow theme

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed as a static site.

## Usage

1. **Select a Day**: Click on "Day 1" or "Day 2" tab to view the lineup for that day
2. **Add Your Name** (optional): Enter your name in the input field at the top
3. **Select Artists**: Click on any artist card to add them to your plan. Click again to deselect.
4. **Download Your Plan**: Click the "Download Day X Plan" button to save your selected lineup as an image

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **html-to-image** - Image export functionality

## Project Structure

```
src/
  ├── components/
  │   ├── DayTabs.jsx       # Day selection tabs
  │   ├── NameInput.jsx     # Name input field
  │   ├── LineupGrid.jsx    # Main lineup grid with artist selection
  │   └── DownloadButton.jsx # Download functionality
  ├── data/
  │   ├── lineup.json       # Festival lineup data
  │   └── lineup.js         # Data export
  ├── App.jsx               # Main app component
  ├── main.jsx              # React entry point
  └── index.css             # Global styles
```

## Data Model

The lineup data is stored in `src/data/lineup.json` with the following structure:

```json
{
  "day1": [
    {
      "stage": "BUDX",
      "slots": [
        { "time": "2:00-2:30", "artist": "ARTIST NAME" }
      ]
    }
  ],
  "day2": [...]
}
```

## Notes

- All data is stored client-side only (no backend required)
- Selections are preserved when switching between days
- The app works fully offline after initial load
- Can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, etc.)
