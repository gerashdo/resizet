
import { getErrorMessage } from '../helpers/utils';
import { readImageFile } from '../helpers/loadFiles';

self.addEventListener('message', async (event) => {
  console.log('event', event)
  const { file } = event.data;
  console.log('Hello addEventListener worker')
  try {
    const image = await readImageFile(file)
    self.postMessage(image);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    self.postMessage({ error: errorMessage });
  }
})
