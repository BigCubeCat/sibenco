import joi from 'joi';
import j2s from 'joi-to-swagger';

// Joi
// TO-DO Add validation
export const joiSchema = joi.object().keys({
  route: {
    orders: joi.array().items(joi.string()),
    boxes: joi.array().items(joi.string()),
    distance: joi.string(),
  },
  car: {
    tsNumber: joi.string(),
    specialMarks: joi.string(),
    driver: joi.string(),
  },
  date: joi.string()
})
// end of Joi

export const schema = j2s(joiSchema).swagger;
