# React Music Player

````
  __  __           _        _____  _                       
 |  \/  |         (_)      |  __ \| |                      
 | \  / |_   _ ___ _  ___  | |__) | | __ _ _   _  ___ _ __  
 | |\/| | | | / __| |/ __| |  ___/| |/ _` | | | |/ _ \ '__|  
 | |  | | |_| \__ \ | (__  | |    | | (_| | |_| |  __/ |   
 |_|  |_|\__,_|___/_|\___| |_|    |_|\__,_|\__, |\___|_|   
                                            __/ |          
                                           |___/           
````

A modern, responsive music player built with React featuring a retro-styled interface, mood-based playlists, and seamless audio playback.

## 🎵 Features

- **Mood-Based Playlists** - Curated music collections for different vibes
- **Seamless Audio Playback** - Powered by Howler.js for optimal performance
- **Jamendo API Integration** - Stream high-quality music with proper artist credits
- **Retro UI Design** - Custom vintage-inspired interface with smooth animations
- **Responsive Design** - Works beautifully across desktop and mobile devices
- **Progressive Web App** - Installable with offline capabilities
- **Audio Visualization** - Interactive player controls with visual feedback

## 🚀 Tech Stack

- **Frontend**: React 18.3, Modern Hooks & Context API
- **Build Tool**: Vite (Lightning-fast development and builds)
- **Audio Engine**: Howler.js (Cross-browser audio management)
- **Animations**: Framer Motion (Smooth, performant animations)
- **Testing**: Vitest with React Testing Library
- **Styling**: Custom CSS with responsive design patterns

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheRegge/react-music-player.git
   cd react-music-player
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run test suite with Vitest |

## 🎨 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── player/         # Main player interface
│   ├── Sound.js        # Audio management
│   └── ...
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── data/               # Static data and configurations
└── services/           # External API integrations
```

## 🏗️ Architecture Highlights

- **Component-Driven Development**: Modular, reusable components
- **Context API**: Centralized state management for player and window contexts
- **Custom Hooks**: Abstracted logic for audio analysis and interference effects
- **Service Layer**: Clean separation for external API integrations
- **CSS Architecture**: Organized stylesheets with consistent naming conventions

## 🔧 Key Implementation Details

- **Audio Management**: Leverages Howler.js for cross-browser compatibility and advanced audio features
- **State Management**: React Context API with custom hooks for optimal performance
- **Animation System**: Framer Motion integration for smooth, hardware-accelerated animations
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **PWA Features**: Service worker integration and web app manifest

## 🌐 Deployment

**Live Demo**: [https://react-music-player-coral.vercel.app](https://react-music-player-coral.vercel.app)

The project is production-ready with:
- Optimized Vite build configuration
- Apache `.htaccess` for client-side routing
- Progressive Web App manifest
- Compressed assets and source maps

Deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## 👨‍💻 About the Developer

This project showcases modern React development practices, clean architecture, and attention to user experience. Built as a demonstration of full-stack development capabilities for freelance opportunities.

**Connect with me:**
- Portfolio: [zaleman.co](https://zaleman.co)
- GitHub: [TheRegge](https://github.com/TheRegge)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ and lots of ☕ by a passionate developer who loves great music and clean code.*