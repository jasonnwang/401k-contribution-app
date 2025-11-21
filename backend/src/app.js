import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import cors from 'cors';
import * as contributionHandlers from './routes/contribution.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const apiSpec = path.join(__dirname, '../api/openapi.yaml');
const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000' // your frontend origin
}));

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: false,
  })
);

// Register routes directly on app
app.get('/api/users/:userId/contribution/settings', contributionHandlers.getSettingsHandler);
app.put('/api/users/:userId/contribution/settings', contributionHandlers.updateSettingsHandler);
app.get('/api/users/:userId/contribution/ytd', contributionHandlers.getYTDHandler);

// Error handler for OpenAPI validation errors
app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        errors: err.errors
      }
    });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});

export default app;