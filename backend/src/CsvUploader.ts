import multer, { StorageEngine } from "multer";
import path from "path";
import { mkdirp } from "mkdirp";

export class CsvUploader {
  private storage: StorageEngine;

  constructor() {
    mkdirp.sync("./uploads");
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        // Define o diretório de destino como 'src/uploads'
        cb(null, path.join(__dirname, "uploads"));
      },
      filename: (req, file, cb) => {
        // Define o nome do arquivo (mantendo o nome original)
        cb(null, file.originalname);
      },
    });
  }

  public uploadCsvFile() {
    return multer({
      storage: this.storage,
      fileFilter(req, file, cb) {
        if (!file.originalname.endsWith(".csv")) {
          return cb(new Error("O arquivo não é um CSV válido."));
        }
        cb(null, true);
      },
    }).single("csvFile");
  }
}
