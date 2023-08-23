import joi from 'joi';
import j2s from 'joi-to-swagger';

// Joi
// TO-DO Add validation
export const joiSchema = joi.object().keys({
  orders: joi.array().items(joi.string()), // TODO
  summary_distance: joi.string(),
  ts_number: joi.string(),
  special_marks: joi.string(),
  driver_name: joi.string(),
  date: joi.string(),
});
// end of Joi

export const schema = j2s(joiSchema).swagger;
