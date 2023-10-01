import joi from 'joi';
import j2s from 'joi-to-swagger';
import { joiSchema as joiOrder }  from '../order/schema';

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
    loadCapacity: joi.number(),
  },
  date: joi.string(),
  status: joi.string(),
  isPrivate: joi.boolean(),
  isSingle: joi.boolean(),
  cargoInRoute: joi.number(),
  passengersInRoute: joi.number(),
  comment: joi.string(),
});

export const joiSchemaComplex = joi.object().keys({
  route: joiSchema,
  orders: joi.array().items(joiOrder)
});
// end of Joi

export const schema = j2s(joiSchema).swagger;

export const schemaComplex = j2s(joiSchemaComplex).swagger;
