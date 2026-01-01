import { useState } from "react";
import { getRecommendations } from "./api";
import "./App.css";
function App() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    try {
      const response = await getRecommendations(input);
      setMovies(response?.recommendations ?? []);
    } catch (error) {
      console.error(error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🎬 Movie Recommendation App</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Action movies with strong female lead"
          style={{ width: "400px", padding: "10px" }}
        />
        <br />
        <br />
        <button type="submit">Get Recommendations</button>
      </form>

      {loading && <p>Loading...</p>}

      <ul>
        {movies.map((movie, index) => (
          <li key={index}>{movie}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
