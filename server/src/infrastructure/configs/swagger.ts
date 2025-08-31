import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Observatório da Educação - PB',
      version: '1.0.0',
      description:
        'Documentação da API RESTful para a plataforma de gestão escolar.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
  },
  apis: [ 
          './dist/infrastructure/http/controller/**/*.js', 
          './src/infrastructure/http/controller/**/*.ts'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
