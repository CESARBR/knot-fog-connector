import config from 'config';
import Joi from 'joi';
import _ from 'lodash';

import Settings from 'data/Settings';

const cloudTypeSchema = Joi.string().required();

const fogCloudSchema = Joi.object().keys({
  hostname: Joi.string().required(),
  port: Joi.number().port().required(),
  uuid: Joi.string().guid().required(),
  token: Joi.string().required(),
});

const runAsSchema = Joi.object().keys({
  user: Joi.string(),
  group: Joi.string(),
});

class SettingsFactory {
  create() {
    const fog = this.loadFogSettings();
    const cloudType = this.loadCloudTypeSettings();
    const cloud = this.loadCloudSettings();
    const runAs = this.loadRunAsSettings();
    return new Settings(fog, cloudType, cloud, runAs);
  }

  loadCloudTypeSettings() {
    const cloudType = config.get('cloudType');
    this.validate('cloudType', cloudType, cloudTypeSchema);
    return cloudType;
  }

  loadCloudSettings() {
    const cloud = config.get('cloud');
    this.validate('cloud', cloud, fogCloudSchema);
    return cloud;
  }

  loadFogSettings() {
    const fog = config.get('fog');
    this.validate('fog', fog, fogCloudSchema);
    return fog;
  }

  loadRunAsSettings() {
    const runAs = config.get('runAs');
    this.validate('runAs', runAs, runAsSchema);
    return runAs;
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
