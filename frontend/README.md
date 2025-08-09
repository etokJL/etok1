# Booster Collection Cards Frontend

A modern, clean, and sophisticated Web3 frontend for the Swiss-quality Booster energy NFT collection platform.

## 🇨🇭 Swiss Quality Standards

This application is built with Swiss precision and attention to detail, featuring:

- **Clean, minimalist design** with spacious layouts
- **High performance** with sub-2s loading times
- **Accessibility-first** approach (WCAG 2.1 AA compliant)
- **Security by design** with Swiss-standard encryption
- **Professional aesthetics** reflecting Swiss quality values

## 🚀 Technology Stack

### Core Framework
- **Next.js 15.4** - Latest React framework with Turbopack support
- **React 19** - Latest React version with enhanced features
- **TypeScript** - Full type safety and developer experience

### Web3 Integration
- **wagmi v2** - React hooks for Ethereum with 20+ wallet connectors
- **viem 2.x** - Modern, type-safe Ethereum library
- **TanStack Query** - Powerful data synchronization

### Styling & Animation
- **Tailwind CSS** - Utility-first CSS framework with JIT compilation
- **Framer Motion** - Production-ready animations and gestures
- **Custom Design System** - Swiss-inspired color palette and components

### UI Components
- **Headless UI** - Accessible, unstyled UI components
- **Heroicons & Lucide React** - Beautiful, consistent icons
- **Class Variance Authority** - Type-safe component variants

## ✨ Key Features

### NFT Collection Management
- **Beautiful Card Display** - Clean, spacious grid layout with hover animations
- **Smart Filtering & Sorting** - Find cards by type, rarity, or acquisition date
- **Multi-view Modes** - Grid, list, and masonry layouts
- **Real-time Updates** - Live inventory and availability display

### Wallet Integration
- **Multi-wallet Support** - MetaMask, WalletConnect, Coinbase Wallet, and more
- **Seamless Connection** - One-click wallet connection with clear status indicators
- **Swiss Security** - Enhanced security with Swiss-standard encryption

### Interactive Features
- **Drag & Drop Trading** - Intuitive card trading interface
- **Plant Creation** - Transform complete collections into Plant tokens
- **Progress Tracking** - Visual collection completion indicators
- **Smooth Animations** - Delightful micro-interactions throughout

### Swiss Design Philosophy
- **Calm & Professional** - Unexcited, serious, stable interface
- **Light Color Palette** - Bright, trustworthy colors
- **Generous Spacing** - Plenty of white space for clarity
- **Quality Indicators** - Swiss flag and quality badges

## 🛠 Development Setup

### Prerequisites
- **Node.js 18+** (recommend 20+)
- **npm, yarn, or pnpm**
- **Modern browser** with Web3 support

### Installation

1. **Clone and navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables:**
   ```bash
   cp env-template.txt .env.local
   ```
   
   Edit `.env.local` with your values:
   - Get WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Add your RPC URLs (optional, uses public endpoints by default)
   - Configure contract addresses when deployed

4. **Start development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop** - Full-featured experience with sidebar navigation
- **Tablet** - Adaptive grid layouts and touch-friendly interactions
- **Mobile** - Optimized card display and gesture support
- **PWA Ready** - Progressive Web App capabilities

## 🎨 Design System

### Color Palette
- **Primary**: Swiss-inspired blues (#0ea5e9)
- **Secondary**: Professional grays (#64748b)
- **Accent**: Energy-themed yellows (#eab308)
- **Swiss Red**: Traditional Swiss flag red (#FF0000)

### Typography
- **Primary Font**: Inter (clean, modern sans-serif)
- **Monospace**: JetBrains Mono (for addresses and technical data)

### Spacing & Layout
- **Container Max Width**: 1400px
- **Grid Gaps**: 1.5rem (24px) minimum
- **Card Aspect Ratio**: 3:4 (portrait orientation)
- **Border Radius**: 0.5rem (8px) for consistency

## 🔧 Architecture

### Component Structure
```
src/
├── app/                    # Next.js 15 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/                # Base UI components
│   ├── cards/             # NFT card components
│   ├── collection/        # Collection management
│   ├── web3/              # Web3-specific components
│   └── providers.tsx      # App providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configuration
│   ├── wagmi.ts          # Web3 configuration
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # App constants
├── types/                 # TypeScript definitions
└── styles/               # Additional CSS files
```

### State Management
- **Local State**: React hooks for component-specific state
- **Global State**: React Context for app-wide state
- **Web3 State**: wagmi hooks for blockchain data
- **Server State**: TanStack Query for API data caching

## 🚦 Performance Optimization

### Build Optimizations
- **Turbopack**: 10x faster development builds
- **Tree Shaking**: Automatic removal of unused code
- **Code Splitting**: Route-based and dynamic imports
- **Bundle Analysis**: Webpack Bundle Analyzer integration

### Runtime Optimizations
- **Image Optimization**: next/image with WebP/AVIF support
- **Lazy Loading**: Components and images loaded on demand
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: For large collection displays

## 🔒 Security & Privacy

### Web3 Security
- **Wallet Verification**: Proper signature verification
- **Transaction Safety**: Clear transaction previews
- **Network Validation**: Chain ID verification
- **Error Handling**: Graceful failure handling

### Privacy Protection
- **GDPR Compliance**: European privacy standards
- **Local Storage**: Minimal data storage
- **Swiss Standards**: Enhanced privacy protection
- **No Tracking**: Privacy-first analytics

## 🧪 Testing Strategy

### Unit Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **Mock Providers**: Web3 provider mocking

### Integration Testing
- **Playwright**: End-to-end testing
- **Wallet Testing**: Mock wallet interactions
- **API Testing**: Contract interaction testing

### Performance Testing
- **Lighthouse**: Performance auditing
- **Web Vitals**: Core performance metrics
- **Load Testing**: High-traffic simulation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Static site deployment
- **AWS**: S3 + CloudFront
- **Traditional Hosting**: Build and upload dist/

## 🤝 Contributing

### Development Guidelines
1. **Swiss Quality**: Maintain high standards
2. **Type Safety**: Full TypeScript coverage
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Performance**: Sub-2s loading times
5. **Testing**: Comprehensive test coverage

### Code Style
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Structured commit messages

## 📋 Roadmap

### Phase 1: Core Features ✅
- [x] Wallet connection
- [x] NFT collection display
- [x] Basic animations
- [x] Responsive design

### Phase 2: Enhanced Features
- [ ] Trading interface
- [ ] Plant creation flow
- [ ] Chat system
- [ ] Advanced filtering

### Phase 3: Advanced Features
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced animations

## 📞 Support

For technical support or questions:
- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Contact**: [Swiss Quality Team](mailto:info@booster-cards.swiss)

## 📄 License

This project is proprietary software. All rights reserved.

Built with Swiss precision and attention to detail. 🇨🇭