function toOverride(obj = {}, contentOverride = {}) {
  return Object.entries(obj).reduce((resolved, item) => {
    let [key, value] = item; // eslint-disable-line

    if (key in contentOverride) {
      if (value && typeof value === 'object') {
        value = toOverride(value, contentOverride[key]);
      } else {
        value = contentOverride[key];
      }
    }

    resolved[key] = value; // eslint-disable-line
    return resolved;
  }, {});
}

export default function serialize(response, contentOverride = []) {
  function toResponse(data) {
    if (typeof data !== 'object') return data;

    return Object.entries(data).reduce((resolved, item) => {
      let [key, value] = item; // eslint-disable-line

      if (Array.isArray(value)) value = value.map(toResponse);

      if (value && typeof value === 'object') {
        const override = contentOverride.find(
          individualOverride => Number(individualOverride.id) === Number(value.id),
        );

        if (override) value = toOverride(value, override);

        value = toResponse(value);
      }

      resolved[key] = value; // eslint-disable-line
      return resolved;
    }, Array.isArray(data) ? [] : {});
  }

  return toResponse(response);
}
