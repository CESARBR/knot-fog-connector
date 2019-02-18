import _ from 'lodash';

export default function convertToCamelCase(value) {
  if (_.isArray(value)) {
    return _.map(value, obj => _.mapKeys(obj, (v, k) => _.snakeCase(k)));
  }
  return _.mapKeys(value, (v, k) => _.snakeCase(k));
}
