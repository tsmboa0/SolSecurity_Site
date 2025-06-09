# SolSecurity

SolSecurity is a Solana wallet security scanner that helps users protect their assets by detecting address poisoning and account dusting attacks.

## Features

- **Wallet Security Analysis**: Scan your Solana wallet for potential security threats.
- **Dynamic Open Graph Images**: Share your scan results on social media with a custom preview image.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SolSecurity.git
   cd SolSecurity
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   For production, set this to your actual domain.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploying to Netlify

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. In Netlify:
   - Click "New site from Git"
   - Choose your repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`

3. Add environment variables in Netlify:
   - Go to Site settings > Build & deploy > Environment variables
   - Add `NEXT_PUBLIC_APP_URL` with your Netlify domain (e.g., `https://your-app-name.netlify.app`)

4. Deploy!

## Usage

1. Enter your Solana wallet address in the scanner form.
2. Click "Analyze Wallet Security" to start the scan.
3. View your scan results, including risk level and score.
4. Share your results on X (Twitter) with a custom preview image.

## Technologies Used

- **Next.js**: React framework for building the application.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: Animation library for smooth transitions.
- **Vercel OG**: Dynamic Open Graph image generation.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License

## Acknowledgments

- Thanks to the Superteam community for their support and feedback. 