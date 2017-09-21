import selectn from "selectn";

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

function optionToString(fields, separator) {
  return option => {
    return fields
      .map(field => selectn(field, option))
      .filter(fieldVal => fieldVal)
      .reduce((agg, fieldVal, i) => {
        if (i === 0) {
          return fieldVal;
        } else {
          return `${agg}${separator}${fieldVal}`;
        }
      }, "");
  };
}

export function mapLabelKey(labelKey) {
  if (Array.isArray(labelKey)) {
    return optionToString(labelKey, " ");
  } else if (
    typeof labelKey === "object" &&
    labelKey.fields &&
    labelKey.separator
  ) {
    let { fields, separator } = labelKey;
    return optionToString(fields, separator);
  } else {
    return labelKey;
  }
}

export function defaultValue({ properties }) {
  let defVal = Object.keys(properties).reduce((agg, field) => {
    if (properties[field].default !== undefined) {
      agg[field] = properties[field].default;
    }
    return agg;
  }, {});
  return defVal;
}

export function mapSchema(events, schema, mapping) {
  if (!mapping) {
    return events;
  }

  let defVal = defaultValue(schema.properties ? schema : schema.items);
  let mappedEvents = events.map(event => {
    let mappedEvent = Object.keys(mapping).reduce((agg, field) => {
      let schemaField = mapping[field];
      agg[schemaField] = selectn(field, event);
      return agg;
    }, Object.assign({}, defVal));
    return mappedEvent;
  });

  return mappedEvents;
}