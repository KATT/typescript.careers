// supported images aka mimetypes
import jimp from 'jimp';

// from https://github.com/zouhir/lqip/blob/master/util.js
const toBase64 = (extMimeType: string, data: Buffer) => {
  return `data:${extMimeType};base64,${data.toString('base64')}`;
};

// https://github.com/zouhir/lqip/blob/master/index.js
export const lqipFromBlob = async (blob: Blob) => {
  const content = await blob.text();
  console.log({ content });
  const text = `data:${blob.type};base64,${content.replace(
    /^data:image\/\w+;base64,/,
    '',
  )}`;

  const image = await jimp.read(text);
  const original = {
    width: image.bitmap.width,
    height: image.bitmap.height,
  };
  const mimetype = image.getMIME();

  const lqip = await image.resize(10, jimp.AUTO);
  const lqipBuffer = await lqip.getBufferAsync(mimetype);

  return {
    ...original,
    lqip: toBase64(mimetype, lqipBuffer),
  };
};
