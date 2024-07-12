import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ThemeProvider>
        <div className="playwrite-cu dark:bg-gray-700">
          <Header />
          {children}
          <Footer />
        </div>
      </ThemeProvider>
    </AppProvider>
  );
}

export default Providers;
