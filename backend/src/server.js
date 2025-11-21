import app from './app.js';

const PORT = process.env.PORT || 3010;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
console.log(`API Documentation (Swagger UI) available at: http://localhost:${PORT}/api/docs`);
});