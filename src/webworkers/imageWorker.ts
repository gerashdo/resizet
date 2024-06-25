import { resizeImage } from '../helpers/resizeFiles';
import { getErrorMessage } from '../helpers/utils';

self.addEventListener('message', async (event) => {
  const { file, imageQuality, imageSize, port } = event.data;

  try {
    const resizedImage = await resizeImage(file, imageQuality, imageSize);
    port.postMessage(resizedImage);
  } catch (error) {
    const message = getErrorMessage(error);
    port.postMessage({ error: message });
  }
});
