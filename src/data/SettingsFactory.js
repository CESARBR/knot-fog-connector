import config from 'config';
import Joi from 'joi';
import _ from 'lodash';

import Settings from 'data/Settings';

const cloudSchema = Joi.object().keys({
  type: Joi.string().required(),
  settings: Joi.object().required(),
});

const fogCloudSchema = Joi.object().keys({
  hostname: Joi.string().required(),
  port: Joi.number().port().required(),
  uuid: Joi.string().guid().required(),
  token: Joi.string().required(),
});

const runAsSchema = Joi.object().keys({
  enabled: Joi.boolean(),
  user: Joi.string(),
  group: Joi.string(),
});

const rabbitMQSchema = Joi.object().keys({
  hostname: Joi.string().required(),
  port: Joi.number().port().required(),
});

class SettingsFactory {
  create() {
    const fog = this.loadFogSettings();
    const cloud = this.loadCloudSettings();
    const runAs = this.loadRunAsSettings();
    const rabbitMQ = this.loadRabbitMQSettings();
    return new Settings(fog, cloud, runAs, rabbitMQ);
  }

  loadFogSettings() {
    const fog = config.get('fog');
    this.validate('fog', fog, fogCloudSchema);
    return fog;
  }

  loadCloudSettings() {
    const cloud = config.get('cloud');
    this.validate('cloud', cloud, cloudSchema);
    return cloud;
  }

  loadRunAsSettings() {
    const runAs = config.get('runAs');
    this.validate('runAs', runAs, runAsSchema);
    return runAs;
  }

  loadRabbitMQSettings() {
    const rabbitMQ = config.get('rabbitMQ');
    this.validate('rabbitMQ', rabbitMQ, rabbitMQSchema);
    return rabbitMQ;
  }

  validate(propertyName, propertyValue, schema) {
    const { error } = Joi.validate(propertyValue, schema, { abortEarly: false });
    if (error) {
      throw this.mapJoiError(propertyName, error);
    }
  }

  mapJoiError(propertyName, error) {
    const reasons = _.map(error.details, 'message');
    const formattedReasons = reasons.length > 1
      ? `\n${_.chain(reasons).map(reason => `- ${reason}`).join('\n').value()}`
      : reasons[0];
    return new Error(`Invalid "${propertyName}" property: ${formattedReasons}`);
  }
}

export default SettingsFactory;
