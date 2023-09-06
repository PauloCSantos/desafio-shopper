import { CsvUploader } from "./CsvUploader";
import { CsvProcessor } from "./CsvProcessor";
import express from "express";
import multer from "multer";

const app = express();
const port = 3000;
const upload = multer({ dest: "uploads/" });

const csvProcessor = new CsvProcessor("uploads/meuarquivo.csv");
const csvUploader = new CsvUploader(csvProcessor)

app.post('/upload', upload.single('csvFile'), csvUploader.handleUpload.bind(csvUploader));

app.listen(port, () => {
    console.log("API listen on 3000")
})