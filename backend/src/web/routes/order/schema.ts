import joi from 'joi';
import j2s from 'joi-to-swagger';

// Joi
// TO-DO Add validation

export const joiSchema = joi.object().keys({
  clientId: joi.string(),
  cargo: {
    unit: joi.string(),
    count: joi.number(),
    description: joi.string(),
    price: joi.number(),
  },
  deadline: {
    noDeadline: joi.boolean(),
    beginDate: joi.number(),
    endDate: joi.number(),
  },
  waypoints: {
    point: joi.array().items(
      {
        address: joi.string(),
        latitude: joi.string(),
        longitude: joi.string(),
      },
    ),
  },
});
// end of Joi

export const schema = j2s(joiSchema).swagger;
