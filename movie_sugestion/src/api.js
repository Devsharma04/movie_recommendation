export const getRecommendations = async (userInput) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_input: userInput }),
  });

  return res.json();
};
