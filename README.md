# React Native Timer App

A customizable timer application built with React Native that allows users to create, manage, and track multiple timers. The app features category grouping, progress visualization, and a history log.

## Features

- **Timer Creation**: Create timers with custom names, durations, and categories
- **Category Grouping**: Organize timers by categories with expandable/collapsible sections
- **Timer Controls**: Start, pause, and reset individual timers
- **Bulk Actions**: Start, pause, or reset all timers in a category at once
- **Visual Progress**: Track timer progress with progress bars
- **History Tracking**: View completed timers with timestamp information
- **Data Export**: Export timer history as JSON
- **Theme Support**: Toggle between light and dark mode
- **Persistent Storage**: All data is saved locally using AsyncStorage

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/JadhaAM/time-Managament.git
   cd time-Managament
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the application:
   ```
   # For iOS
   npx run-ios
   
   # For Android
   npm run-android
   ```

## Project Structure

- `components/`: Reusable UI components
- `screens/`: App screens (Home, AddTimer, History)
- `context/`: React Context providers for state management


## Dependencies

- React Native
- React Navigation
- AsyncStorage

## Assumptions

- The app is designed to work offline and doesn't require a backend or cloud synchronization.
- Timer durations are input in minutes but stored and processed in seconds for precision.
- The app uses a simple context-based state management solution without external libraries like Redux.
- The UI is designed to be clean and intuitive, prioritizing usability over complex visual effects.
- Progress visualization is handled with simple progress bars rather than more complex animations to maintain performance.
- The app assumes all devices have sufficient memory to handle a reasonable number of timers.

## Future Enhancements

- Sound notifications when timers complete
- Custom timer sounds
- Timer templates/presets
- Recurring timers
- Cloud sync

## License

MIT
