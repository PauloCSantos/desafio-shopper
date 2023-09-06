import csvParser from "csv-parser";
import * as fs from "fs";

export class CsvProcessor {
  private rowCount: number = 0;

  constructor(private csvFilePath: string) {}

  public processCsv(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      fs.createReadStream(this.csvFilePath)
        .pipe(csvParser())
        .on("data", () => {
          this.rowCount++;
        })
        .on("end", () => {
          resolve(this.rowCount);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  public getTotalRowCount(): number {
    return this.rowCount;
  }
}
