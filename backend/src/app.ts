import express, { Request, Response } from "express";
import { CsvUploader } from "./CsvUploader";
import { CsvProcessor } from "./CsvProcessor";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;

const csvUploader = new CsvUploader();
const csvProcessor = new CsvProcessor();

app.post(
  "/upload",
  csvUploader.uploadCsvFile(),
  (req: Request, res: Response) => {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "Nenhum arquivo foi enviado." });
    }

    try {
      // O arquivo já foi salvo na pasta 'uploads' pelo CsvUploader
      // Responda com sucesso
      res
        .status(200)
        .json({ message: "Arquivo CSV carregado e salvo com sucesso." });
    } catch (error) {
      res.status(500).json({ message: "Erro ao processar o arquivo CSV" });
    }
  }
);

// Endpoint para processar o arquivo CSV
app.get("/process", async (req: Request, res: Response) => {
  const { fileName } = req.query;

  if (!fileName || typeof fileName !== "string") {
    return res.status(400).json({ message: "Nome do arquivo inválido." });
  }

  const filePath = path.join(__dirname, "uploads", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Arquivo não encontrado." });
  }

  try {
    const rowCount = await csvProcessor.processCsv(filePath); // Use a função processCsv da classe CsvProcessor

    res.status(200).json({ message: "Processamento concluído.", rowCount });
  } catch (error) {
    res.status(500).json({ message: "Erro ao processar o arquivo CSV." });
  }
});

app.listen(port, () => {
  console.log(`API está ouvindo na porta ${port}`);
});
