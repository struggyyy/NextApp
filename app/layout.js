import { AuthProvider } from "./lib/AuthContext";
import Navigation from "./components/Navigation";
import "./globals.css";

export const metadata = {
  title: 'Calendar App',
  description: 'Created by Jakub Strugała - 14646',
};

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <html lang="pl" className="dark">
      <body className="flex flex-col h-screen bg-gray-900">
        <AuthProvider>
          <Navigation />
          <div className="flex flex-1">
            <main className="flex-1 bg-gray-900/50 p-6 overflow-y-auto ml-64 backdrop-blur-xl">
              {children}
            </main>
          </div>
          <footer className="bg-gray-800/50 backdrop-blur-sm text-white/70 text-center py-4">
            <p>© {currentYear} Calendar App created by Jakub Strugała - 14646</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
