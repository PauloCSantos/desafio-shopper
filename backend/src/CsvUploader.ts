import { CsvProcessor } from "./CsvProcessor";
import { Request, Response } from "express";
import fs from "fs";

export interface IUploader {
  handleUpload(req: Request, res: Response): Promise<void>;
}

export class CsvUploader implements IUploader {
  constructor(private processor: CsvProcessor) {}
  public async handleUpload(req: Request, res: Response): Promise<void> {
    const { file } = req;
    if (!file) {
      res.status(400).json({ message: "Nenhum arquivo foi enviado." });
      return;
    }

    try {
      const rowCount = await this.processor.processCsv();

      const auxData = {
        csvFileName: file.originalname,
        totalRows: rowCount,
      };

      fs.writeFileSync("aux.json", JSON.stringify(auxData));
      fs.unlinkSync(file.path);
      res.status(200).json({ message: "Arquivo CSV carregado com sucesso." });
    } catch (error) {
      res.status(500).json({ message: "Erro ao processar o arquivo CSV" });
    }
  }
}
