import mysql, { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

class DatabaseManager {
  private connection: Connection;

  constructor(private config: any) {
    this.connection = mysql.createPool(config);
  }

  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection(this.config);
      console.log('Conexão ao MySQL bem-sucedida.');
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.connection.end();
    console.log('Conexão ao MySQL encerrada.');
  }

  async getAllProducts(): Promise<RowDataPacket[]> {
    try {
      const [rows] = await this.connection.query<RowDataPacket[]>('SELECT * FROM products');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  async getAllPacks(): Promise<RowDataPacket[]> {
    try {
      const [rows] = await this.connection.query<RowDataPacket[]>('SELECT * FROM packs');
      return rows;
    } catch (error) {
      console.error('Erro ao buscar packs:', error);
      throw error;
    }
  }

  async updateProduct(productId: number, newValues: any): Promise<ResultSetHeader> {
    try {
      const [result] = await this.connection.query<ResultSetHeader>('UPDATE products SET ? WHERE id = ?', [newValues, productId]);
      console.log('Produto atualizado com sucesso.');
      return result;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  async updatePack(packId: number, newValues: any): Promise<ResultSetHeader> {
    try {
      const [result] = await this.connection.query<ResultSetHeader>('UPDATE packs SET ? WHERE id = ?', [newValues, packId]);
      console.log('Pack atualizado com sucesso.');
      return result;
    } catch (error) {
      console.error('Erro ao atualizar pack:', error);
      throw error;
    }
  }
}

export default DatabaseManager;
