import crypto from "crypto";
let md5 = require('md5');
// export function md5(str: string) {
//   return crypto.createHash("md5").update(str).digest("hex");
// }

export function md5FirstChar(str: string) {
  return md5(str).charAt(0);
}
