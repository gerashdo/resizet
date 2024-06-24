import { resizeImage } from '../helpers/resizeFiles';

self.addEventListener('message', async (event) => {
  const { file, imageQuality, imageSize, port } = event.data;

  try {
    const resizedImage = await resizeImage(file, imageQuality, imageSize);
    port.postMessage(resizedImage);
  } catch (error) {
    port.postMessage({ error: error.message });
  }
});
