import { AppProvider } from "@/context/AppContext";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="playwrite-cu">{children}</div>
    </AppProvider>
  );
}

export default Providers;
