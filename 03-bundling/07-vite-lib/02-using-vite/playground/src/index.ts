import { mapCollection } from "@lemoncode/common-library";

const collection = [1, 2, 3];
const result = mapCollection(collection, (x) => x * 2);
console.log(result);
