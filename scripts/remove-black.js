const Jimp = require('jimp');
const path = require('path');

(async () => {
  try {
    const root = path.resolve(__dirname, '..', 'public', 'assets');
    const input = path.join(root, 'sheljy3.png');
    const output = path.join(root, 'sheljy3-cutout.png');
    const thresholdArg = process.argv[2];
    const THRESHOLD = thresholdArg ? parseInt(thresholdArg, 10) : 60; // 0-255

    const img = await Jimp.read(input);
    img.rgba(true);
    const { data, width, height } = img.bitmap;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        const brightness = (r + g + b) / 3;
        // factor 0 when fully black, 1 when >= THRESHOLD
        const factor = Math.min(1, Math.max(0, brightness / THRESHOLD));
        const newA = Math.round(a * factor);

        data[idx + 3] = newA;
      }
    }

    await img.writeAsync(output);
    console.log('WROTE', output);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
