import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  GITHUB_APP_ID: Joi.string().required().description('Github App ID from your Github App settings'),
  GITHUB_PRIVATE_KEY: Joi.string().required().description('Github app private key (PEM format)'),
  GITHUB_INSTALLATION_ID: Joi.string().required().description('Github app installation ID'),
  GITHUB_ORG: Joi.string().required().description('Github organization name'),
});
