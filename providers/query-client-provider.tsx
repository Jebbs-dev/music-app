import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<ProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};