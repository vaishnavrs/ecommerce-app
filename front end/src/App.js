import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Home />
      </BrowserRouter>
    </div>
  );
}

export default App;
