import { processFiles } from "../helpers/loadFiles";

self.addEventListener("message", async (event) =>{
  const { files } = event.data;
  console.log("worker received files");
  console.log({ files });
  const results = await processFiles(files);
  self.postMessage(results);
});
