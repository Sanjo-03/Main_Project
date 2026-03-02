const express = require("express");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const form = new FormData();
    form.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      "http://localhost:8000/predict",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    const heatmapBase64 = response.data.heatmap_all;  
    // You can change to heatmap_important if you want

    const imageBuffer = Buffer.from(heatmapBase64, "base64");

    res.set("Content-Type", "image/png");
    res.send(imageBuffer);

  } catch (error) {
    console.error("ML Error:", error.message);
    res.status(500).json({ message: "ML server error" });
  }
});

module.exports = router;