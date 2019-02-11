import _ from 'lodash';

export default function convertToCamelCase(schema) {
  return _.map(schema, obj => _.mapKeys(obj, (v, k) => _.camelCase(k)));
}
