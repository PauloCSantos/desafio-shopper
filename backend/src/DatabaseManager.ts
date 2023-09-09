import mysql, {
  Connection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

class DatabaseManager {
  private connection?: Connection;

  constructor() {
   
  }

  private async ensureConnection(): Promise<void> {
    if (!this.connection || !this.connection.threadId) {
      try {
        this.connection = await mysql.createConnection(
          DatabaseManager.dbConfig
        );
        console.log("Conexão ao MySQL bem-sucedida.");
      } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        throw new Error("Erro ao conectar ao banco de dados");
      }
    }
  }

  private async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.end();
        console.log("Conexão ao MySQL encerrada.");
      }
    } catch (error) {
      console.error("Erro ao encerrar a conexão ao banco de dados:", error);
      throw new Error("Erro ao encerrar a conexão ao banco de dados");
    }
  }

  async getAllProducts(): Promise<RowDataPacket[]> {
    try {
      await this.ensureConnection();
      const [rows] = await this.connection!.query<RowDataPacket[]>(
        "SELECT * FROM products"
      );
      return rows;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw new Error("Erro ao buscar produtos");
    }
  }

  async getAllPacks(): Promise<RowDataPacket[]> {
    try {
      await this.ensureConnection();
      const [rows] = await this.connection!.query<RowDataPacket[]>(
        "SELECT * FROM packs"
      );
      return rows;
    } catch (error) {
      console.error("Erro ao buscar packs:", error);
      throw Error("Erro ao buscar packs");
    }
  }

  async updateProduct(
    updates: { productId: number; newValues: any }[]
  ): Promise<void> {
    try {
      await this.ensureConnection();
      for (const update of updates) {
        const { productId, newValues } = update;
        await this.connection!.query<ResultSetHeader>(
          "UPDATE products SET sales_price = ? WHERE code = ?",
          [newValues, productId]
        );
      }
      console.log("Produtos atualizados com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar produtos:", error);
      throw new Error("Erro ao atualizar produtos");
    }
  }

  async updatePack(
    updates: { packId: number; newValues: any }[]
  ): Promise<void> {
    try {
      await this.ensureConnection();
      for (const update of updates) {
        const { packId, newValues } = update;
        await this.connection!.query<ResultSetHeader>(
          "UPDATE packs SET ? WHERE code = ?",
          [newValues, packId]
        );
      }
      console.log("Packs atualizados com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar packs:", error);
      throw new Error("Erro ao atualizar packs");
    }
  }

  private static dbConfig: any = {
    host: "mysql",
    user: "root",
    password: "shopper123",
    database: "shopperdatabase",
  };

  async disconnectManually(): Promise<void> {
    await this.disconnect();
  }
}

export default DatabaseManager;
