import { Chessboard } from "react-chessboard";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <Chessboard boardWidth={600} id="defaultBoard" />
      </div>
    </div>
  );
}

export default App;
