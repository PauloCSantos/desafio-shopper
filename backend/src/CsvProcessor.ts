import fs from "fs";
import DatabaseManager from "./DatabaseManager";

export class CsvProcessor {
  constructor(private bd: DatabaseManager) {}

  public async validateCsv(filePath: string): Promise<any[]> {
    try {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const lines = fileContents.split("\n");

      const products = await this.bd.getAllProducts();
      let firstLineSkipped = false;

      const validatedProducts: any[] = [];

      for (const line of lines) {
        if (!line.trim()) continue;

        if (!firstLineSkipped) {
          firstLineSkipped = true;
          continue;
        }

        const columns = line.split(",");

        if (columns.length < 2) {
          throw new Error("Todos os campos necessários devem existir.");
        }
        if (columns.length > 2) {
          throw new Error("Dados incorretos.");
        }
        const csvProductCode = columns[0].trim();

        const product = products.find((p) => p.code == csvProductCode);

        const validatedProduct: any = {
          code: csvProductCode,
          observation: [],
        };

        if (!product) {
          validatedProduct.observation.push(
            `Produto com product_code ${csvProductCode} não encontrado no banco de dados`
          );
        } else {
          validatedProduct.name = product.name;
          validatedProduct.sales_price = product.sales_price;

          const csvNewPrice = parseFloat(columns[1].trim());

          // Verifica se os preços estão preenchidos e são valores numéricos válidos
          if (isNaN(csvNewPrice) || csvNewPrice <= 0) {
            validatedProduct.observation.push(
              "O novo preço não é um valor numérico válido."
            );
          } else {
            validatedProduct.new_price = csvNewPrice;

            // Verifica se o novo preço respeita as regras do cenário
            const salesPrice = parseFloat(product.sales_price);
            const costPrice = parseFloat(product.cost_price);

            if (csvNewPrice < costPrice) {
              validatedProduct.observation.push(
                "O novo preço é menor que o preço de custo atual."
              );
            }

            if (csvNewPrice < 0.9 * salesPrice) {
              validatedProduct.observation.push(
                "O novo preço é menor que 10% do preço de venda atual."
              );
            }

            if (csvNewPrice > 1.10 * salesPrice) {
              validatedProduct.observation.push(
                "O novo preço é maior que 10% do preço de venda atual."
              );
            }
          }
        }

        validatedProducts.push(validatedProduct);
      }

      console.log("Validação completa");
      return validatedProducts;
    } catch (error) {
      console.error("Erro durante a validação do CSV:", error);
      throw error;
    }
  }
}
