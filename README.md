# 🌭 SausageWraps

A mobile-first web app for capturing and rating cycling outfits among friends. Take photos of cyclists, give them names, and vote on the best "sausage wraps" (cycling outfits)!

## 🚀 Features

### 📱 Mobile-First Design
- Responsive, modern UI optimized for mobile devices
- Clean, minimalist glassmorphism design
- Touch-friendly interface

### 📸 AddCyclist
- **Code-gated access**: Enter code `135` to access camera
- **Camera integration**: Take photos using device camera
- **Name assignment**: Give each cyclist photo a custom name
- **Local storage**: Photos saved in browser storage

### 🏆 SausageWraps Leaderboard
- **Photo gallery**: View all cyclist photos in a responsive grid
- **Voting system**: Upvote your favorite cycling outfits
- **IP-based limits**: Each user gets 2 total votes, 1 per image
- **Real-time ranking**: Photos automatically sorted by vote count
- **Vote tracking**: See remaining votes and voting status

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Navigate to the project directory:
   ```bash
   cd sausage-wraps
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

### For Mobile Testing
- Use your browser's device emulation tools
- Or access the local server from your mobile device on the same network

## 📱 Usage

### Getting Started
1. **Home Page**: Choose between "AddCyclist" or "SausageWraps"

### Adding a Cyclist
1. Click "📸 AddCyclist"
2. Enter the access code: `135`
3. Allow camera permissions when prompted
4. Take a photo of the cyclist
5. Enter a name for the cyclist
6. Save the photo

### Viewing & Voting
1. Click "🏆 SausageWraps" to view the leaderboard
2. Browse cyclist photos sorted by votes
3. Click "👍 Upvote" to vote for your favorites
4. Each user gets 2 total votes, 1 per image
5. Vote counts update in real-time

## 🔧 Technical Details

### Built With
- **React 19.1.0**: Modern React with hooks
- **CSS3**: Custom styling with glassmorphism effects
- **HTML5 Camera API**: For photo capture
- **LocalStorage**: For data persistence

### Key Features
- **Mobile-optimized**: Responsive design with mobile-first approach
- **Camera integration**: Uses `getUserMedia` API for photo capture
- **Vote limiting**: IP-based voting restrictions (simulated with localStorage)
- **Real-time updates**: Instant UI updates for votes and rankings
- **Glassmorphism UI**: Modern, translucent design elements

### Browser Compatibility
- Chrome (recommended for camera features)
- Safari (iOS/macOS)
- Firefox
- Edge

**Note**: Camera functionality requires HTTPS in production or localhost for development.

## 🎯 App Flow

```
Home Page
├── AddCyclist
│   ├── Code Entry (135)
│   ├── Camera Access
│   ├── Photo Capture
│   └── Name Input
└── SausageWraps
    ├── Vote Status Display
    ├── Photo Grid (sorted by votes)
    ├── Upvote Buttons
    └── Vote Tracking
```

## 🔒 Security Features

- **Code-gated camera access**: Prevents unauthorized photo taking
- **Vote limitations**: Prevents spam voting
- **Local data storage**: No server-side data collection

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy
The app can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

**Important**: For camera functionality in production, ensure HTTPS is enabled.

## 🎨 Customization

### Changing the Access Code
Edit the code check in `src/components/AddCyclist.js`:
```javascript
if (code === '135') { // Change '135' to your desired code
```

### Modifying Vote Limits
Edit the vote limit in `src/App.js`:
```javascript
if (userVotes.count >= 2) { // Change 2 to your desired limit
```

## 🤝 Contributing

This is a fun project for friends! Feel free to fork and customize for your own cycling group.

## 📄 License

This project is open source and available under the MIT License.

---

**Have fun rating those sausage wraps! 🚴‍♂️🌭**
