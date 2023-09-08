import express, { Request, Response } from "express";
import cors from "cors";
import { CsvUploader } from "./CsvUploader";
import { CsvProcessor } from "./CsvProcessor";
import fs from "fs";
import path from "path";
import DatabaseManager from "./DatabaseManager";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: false,
  })
);
const port = 3000;

const csvUploader = new CsvUploader();
const bd = new DatabaseManager();
const csvProcessor = new CsvProcessor(bd);

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
    const rowCount = await csvProcessor.validateCsv(filePath);
    res.status(200).json({ message: "Processamento concluído.", rowCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    //res.status(500).json({ error });
  }
});

app.get("/update", async (req: Request, res: Response) => {
  const { fileName } = req.query;

  if (!fileName || typeof fileName !== "string") {
    return res.status(400).json({ message: "Nome do arquivo inválido." });
  }

  const filePath = path.join(__dirname, "uploads", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Arquivo não encontrado." });
  }

  try {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const headLines = fileContents.split("\r");
    const lines = headLines.slice(1); // Remover a primeira linha (cabeçalho)

    const products = lines
      .map((line) => line.trim()) // Remover espaços em branco no início e no fim
      .filter((line) => line.length > 0) // Filtrar linhas em branco
      .map((line) => {
        const [productCode, newPrice] = line.split(","); // Separar os valores por vírgula
        return {
          productId: parseInt(productCode),
          newValues: parseFloat(newPrice),
        };
      });

    await bd.updateProduct(products);
    res.status(200).json({ message: "Arquivo processado com sucesso." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Falha ao persistir dados" });
  }
});

app.get("/bdvalues", async (req: Request, res: Response) => {
  try {
    const products = await bd.getAllProducts();
    const packs = await bd.getAllPacks();
    const data = {
      products,
      packs,
    };
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Falha ao persistir dados" });
  }
});

app.listen(port, () => {
  console.log(`API está ouvindo na porta ${port}`);
});

process.on("SIGINT", async () => {
  console.log("Recebeu um sinal de interrupção (Ctrl+C).");
  await bd.disconnectManually();
  process.exit(0);
});
