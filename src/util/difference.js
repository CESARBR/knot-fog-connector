import _ from 'lodash';

export default function difference(object, base) {
  // https://gist.github.com/Yimiprod/7ee176597fef230d1451
  function changes(_object, _base) {
    return _.transform(_object, (result, value, key) => {
      if (!_.isEqual(value, _base[key])) {
        // eslint-disable-next-line no-param-reassign
        result[key] =
          _.isObject(value) && _.isObject(_base[key])
            ? changes(value, _base[key])
            : value; // eslint-disable-line no-param-reassign, max-len
      }
    });
  }
  return changes(object, base);
}
