import joi from 'joi';
import j2s from 'joi-to-swagger';

// Joi
// TO-DO Add validation
export const joiSchema = joi.object().keys({
  email: joi.string(),
  name: joi.string(),
  surname: joi.string(),
  lastname: joi.string(),
  password: joi.string(),
  role: joi.string(),
});

export const joiSchemaSignIn = joi.object().keys({
  email: joi.string(),
  password: joi.string(),
});
// end of Joi

export const schema = j2s(joiSchema).swagger;
export const schemaSignIn = j2s(joiSchemaSignIn).swagger;
