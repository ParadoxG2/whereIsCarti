const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/compare-images', upload.fields([{ name: 'image1' }, { name: 'image2' }]), async (req, res) => {
  try {
    const image1Path = req.files['image1'][0].path;
    const image2Path = req.files['image2'][0].path;
    

    console.log(image1Path);
    console.log(image2Path);

    const image1 = await Jimp.read(image1Path);
    const image2 = await Jimp.read(image2Path);

    if (image1.bitmap.width !== image2.bitmap.width || image1.bitmap.height !== image2.bitmap.height) {
      return res.status(400).send('Images must have the same dimensions');
    }

    const diff = Jimp.diff(image1, image2);
    const { percent } = diff;

    res.json({ difference: percent });

    // Optionally delete the uploaded files after processing
    fs.unlinkSync(image1Path);
    fs.unlinkSync(image2Path);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});