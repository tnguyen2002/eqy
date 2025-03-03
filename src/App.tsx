import { Chessboard } from "react-chessboard";
import PlayRandomMoveEngine from "./components/engine";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <PlayRandomMoveEngine />
      </div>
    </div>
  );
}

export default App;
