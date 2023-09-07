import joi from 'joi';
import j2s from 'joi-to-swagger';

// Joi
// TO-DO Add validation
export const joiSchema = joi.object().keys({
  date: {
    createdAt: joi.string(), // Создается автоматически
    executionAt: joi.string()
  },
  route: {
    loadingAddress: {
      address: joi.string(),
      latitude: joi.string(),
      longitude: joi.string(),
      word: joi.string()
    },
    unloadingAddress: {
      address: joi.string(),
      latitude: joi.string(),
      longitude: joi.string(),
      word: joi.string()
    },
    distance: joi.string(), // Считаем на бэке
  },
  order: {
    typeOfTransportation: joi.string(),
    cargoName: joi.string(),
    specialMarks: joi.string(),
    client: joi.string()
  }
});
// end of Joi

export const schema = j2s(joiSchema).swagger;
