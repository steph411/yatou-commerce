import firebase from "../../firebase";

export const customUpload = async ({ onError, onSuccess, file }: any) => {
  const storage = firebase.storage();
  const metadata = {
    contentType: "image/jpeg",
  };
  const storageRef = await storage.ref();
  const imageName = `${new Date().toUTCString()}${file.name}`; //a unique name for the image
  const imgFile = storageRef.child(`product_images/${imageName}.png`);
  try {
    const imageUploadTask = await imgFile.put(file, metadata);
    const imageUrl = await imageUploadTask.ref.getDownloadURL();
    onSuccess(null, imageUrl);
  } catch (e) {
    onError(e);
  }
};
