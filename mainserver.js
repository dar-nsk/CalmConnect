const app = require("./app");


// Define the port (ensure it's available in .env)

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
