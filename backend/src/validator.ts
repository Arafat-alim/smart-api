import Ajv from 'ajv-draft-04';
import schema from './schemas/postman-collection-v2.1.schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

export function validatePostmanCollection(collection: any): { valid: boolean; errors: string[] } {
  const valid = validate(collection);
  if (valid) {
    return { valid: true, errors: [] };
  }
  const errors = (validate.errors || []).map((e) => `${e.instancePath || '(root)'} ${e.message}`);
  return { valid: false, errors };
}
