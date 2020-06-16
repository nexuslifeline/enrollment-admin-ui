
import Vue from 'vue';

export const copyValue = (source, schema, only) => {
  const itemKeys = only || Object.keys(schema) || [];
  itemKeys.forEach((v) => {
    if (source.hasOwnProperty(v)) {
      schema[v] = source[v];
    }
  });
}