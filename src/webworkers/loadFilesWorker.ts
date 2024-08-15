import { readFiles } from "../helpers/loadFiles";

self.addEventListener("message", async (event) =>{
  const { files } = event.data;
  console.log("worker received files");
  console.log({ files });
  const results = await readFiles(files);
  self.postMessage(results);
});
