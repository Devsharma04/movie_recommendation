export const getRecommendations = async (userInput) => {
  const res = await fetch("http://localhost:3000/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_input: userInput }),
  });

  return res.json();
};
