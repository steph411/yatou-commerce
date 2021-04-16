import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { generate } from "generate-password";
const gcs = require("@google-cloud/storage")({
  keyFilename: "yatou-firebase.json",
});
const formidable = require("formidable");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const createNewUser = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "*");
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  }

  console.log({ body: req.body });
  const { name, email, password, id, role } = req.body.event.data;
  const randomPassword = generate({
    length: 12,
    numbers: true,
  });
  const createdUser = await admin.auth().createUser({
    displayName: name,
    email: email,
    emailVerified: false,
    password: password || randomPassword,
    uid: id,
  });

  const userClaims = {
    apiClaims: {
      "x-hasura-default-role": "public",
      "x-hasura-role": role,
      "x-hasura-user-id": createdUser.uid,
      "x-hasura-allowed-roles": ["admin", "public", "vendor", "shipper"],
    },
  };

  await admin.auth().setCustomUserClaims(createdUser.uid, userClaims);
});

exports.uploadFile = functions.https.onRequest(async (req, res) => {
  var form = new formidable.IncomingForm();
  try {
    await new Promise((resolve, reject) => {
      form.parse(req, function (err: any, fields: any, files: any) {
        var file = files.fileToUpload;
        if (!file) {
          reject("no file to upload, please choose a file.");
          return;
        }
        console.info("about to upload file as a json: " + file.type);
        var filePath = file.path;
        console.log("File path: " + filePath);

        var bucket = gcs.bucket("yatou-ecommerce");
        return bucket
          .upload(filePath, {
            destination: file.name,
          })
          .then((data: any) => {
            console.log({ data });
            resolve(""); // Whole thing completed successfully.
          })
          .catch((err_1: any) => {
            reject("Failed to upload: " + JSON.stringify(err_1));
          });
      });
    });
    res.status(200).send("Yay!");
    return;
  } catch (err_2) {
    console.error("Error while parsing form: " + err_2);
    res.status(500).send("Error while parsing form: " + err_2);
  }
});
