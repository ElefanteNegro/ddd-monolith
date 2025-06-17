import swaggerJsdoc from 'swagger-jsdoc';
import packageJson from '../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Taxi24 API',
      version: packageJson.version,
      description: 'RESTful API for the Taxi24 ride-hailing platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/Modules/*/infrastructure/controllers/*.ts',
    './src/Modules/*/infrastructure/swagger/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

export const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Taxi24 API Documentation',
};
