# Swasth AI - Health Management Platform

AI-powered health management platform for tracking vitals, analyzing medical reports, verifying medicines, and getting personalized AI-powered health insights.

## Features

- **Health Dashboard**: Visualize blood pressure, blood sugar, weight with trend charts and smart alerts
- **Report Analysis**: Upload medical reports (blood tests, imaging). AI extracts key values and provides analysis
- **Medicine Scanner**: Verify medicine authenticity by scanning packaging or batch numbers
- **AI Assistant**: Ask anything about your health. Get evidence-based, personalized answers
- **Future Predictions**: AI predicts health risks from your trends for proactive health management
- **Secure & Private**: End-to-end encrypted. Your data stays yours, never shared or sold

## Project Structure

```
swasth-ai-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Badge.jsx
│   │   ├── StatCard.jsx
│   │   ├── MiniChart.jsx
│   │   ├── RiskGauge.jsx
│   │   └── index.js
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── DashboardHome.jsx
│   │   ├── HealthDataPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── MedicinePage.jsx
│   │   ├── AIPage.jsx
│   │   ├── PredictionsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── index.js
│   ├── utils/               # Utility functions
│   │   └── Icon.jsx
│   ├── constants/           # Constants and mock data
│   │   ├── colors.js
│   │   ├── mockData.js
│   │   └── index.js
│   ├── hooks/               # Custom React hooks (ready for expansion)
│   ├── App.jsx              # Main app component
│   ├── index.jsx            # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── DEPLOYMENT.md           # Deployment guide
└── LICENSE                 # MIT License
```

## Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **CSS-in-JS** - Inline styles for component-level styling
- **JavaScript ES6+** - Modern JavaScript

## Getting Started

### Prerequisites

- Node.js 16+ and npm 8+

### Installation

1. Clone or download the repository
```bash
cd swasth-ai-app
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env.local
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Build

Create a production build:
```bash
npm build
```

The optimized build will be in the `dist/` folder.

### Preview

Preview the production build locally:
```bash
npm run preview
```

## Project Features

### 1. Home Page
- Landing page with feature overview
- Call-to-action buttons for getting started
- How it works section
- Trust indicators (users, accuracy, etc.)

### 2. Authentication
- Login/Signup functionality
- Form validation
- Demo credentials: any email + 6+ character password

### 3. Dashboard
- Health summary with key metrics
- Quick action buttons
- Recent reports and alerts
- 6-month health trends

### 4. Health Data Management
- Add new health records (BP, sugar, weight)
- View historical data in table format
- Visual trend charts
- Data validation

### 5. Medical Reports
- Upload medical reports (PDF, JPG, PNG)
- AI-powered report analysis
- Report status tracking (Normal, Attention)
- Download analysis summaries

### 6. Medicine Scanner
- Scan medicine images or QR codes
- Verify authenticity by batch number
- Medicine cabinet management
- Verify/Unknown status indicators

### 7. AI Assistant
- Chat-based health assistant
- Contextual responses
- Quick suggestion buttons
- Real-time message streaming

### 8. Health Predictions
- 12-month risk assessment
- AI-powered predictions
- Personalized action plans
- Risk gauge visualization

### 9. Settings
- Profile management
- Security settings
- Notification preferences
- Privacy and data management

## Styling

The project uses inline CSS styling throughout. No CSS frameworks or pre-processors are used, making the project self-contained and easy to modify.

### Color System
- Primary: Navy (#0a2540)
- Accent: Teal (#00897b)
- Semantic: Green, Amber, Red, Blue
- Neutral: Gray/Muted (#64748b)

### Typography
- Display: Red Hat Display (headings)
- Text: Red Hat Text (body)
- Google Fonts for optimal performance

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## API Integration

The application is currently using mock data. To integrate with a real backend:

1. Create API service files in `src/services/`
2. Update the constants to use API calls instead of mock data
3. Add error handling and loading states
4. Configuration via `.env` variables

## Performance

- Optimized for fast initial load
- Minimal dependencies (only React and React DOM)
- Vite provides fast HMR during development
- Production build is minified and optimized

## Security Considerations

- All health data should be encrypted in transit (HTTPS)
- Implement authentication tokens for API calls
- Validate all user inputs
- Use secure headers (CSP, X-Frame-Options, etc.)
- Regular security audits recommended

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit with clear messages
5. Push to the branch
6. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feature requests, please create a GitHub issue.

## Future Enhancements

- [ ] Backend API integration
- [ ] Real authentication system
- [ ] Database integration
- [ ] Real medicine verification system
- [ ] Advanced AI features (ML predictions)
- [ ] Mobile app (React Native)
- [ ] Wearable device integration
- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] Accessibility improvements

---

Built with ❤️ for better health management
