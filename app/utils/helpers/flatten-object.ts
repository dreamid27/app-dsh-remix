type AnyObject = {
  [key: string]: any;
};

export default function flattenObject(
  obj: AnyObject,
  parentKey: string = "",
  res: AnyObject = {}
): AnyObject {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const propName = parentKey ? `${parentKey}.${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
  }
  return res;
}
