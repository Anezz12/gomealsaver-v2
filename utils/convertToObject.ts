/**
 * Converts MongoDB documents to plain serializable JavaScript objects
 */
export function convertToObject(data: any): any {
  // Handle null/undefined
  if (!data) return null;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => convertToObject(item));
  }

  // Handle simple values (strings, numbers, etc.)
  if (typeof data !== 'object') {
    return data;
  }

  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString();
  }

  // Handle ObjectId
  if (data._id && typeof data._id.toString === 'function') {
    data = { ...data, _id: data._id.toString() };
  }

  // Handle nested objects including ObjectIds in owner fields etc.
  const serialized: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object') {
      if ('_bsontype' in value && value._bsontype === 'ObjectID') {
        serialized[key] = value.toString();
      } else if (value instanceof Date) {
        serialized[key] = value.toISOString();
      } else {
        serialized[key] = convertToObject(value);
      }
    } else {
      serialized[key] = value;
    }
  }

  return serialized;
}
