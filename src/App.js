import "./App.css";
import UrlInput from "./components/UrlInput";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <UrlInput />
      </div>
    </QueryClientProvider>
  );
};

export default App;
