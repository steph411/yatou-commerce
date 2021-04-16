/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/no-var-requires */

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import admin from "firebase-admin";

const key = require("./yatou-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(key),
});

export async function updateClaims(email) {
  const user = await admin.auth().getUserByEmail(email);
  console.log({ user });
  admin.auth().setCustomUserClaims(user.uid, {
    apiClaims: {
      "X-Hasura-Default-Role": "public",
      "X-Hasura-Role": "shipper",
      "X-Hasura-User-Id": user.uid,
      "X-Hasura-Allowed-Roles": ["admin", "public", "vendor", "shipper"],
    },
  });
  console.log({ claimsupdated: true });
}

updateClaims("shipper@gmail.com");
