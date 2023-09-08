"use client";
import React, { useState } from "react";
import Dropdown from "./Dropdown";

type fileoptionsProps = {
  nome: string;
};

interface DataListType {
  message: string;
  rowCount: [
    {
      code: string;
      name: string;
      sales_price: string;
      new_price: number;
      observation: string[];
    }
  ];
}

const FileOptions = ({ nome }: fileoptionsProps) => {
  const [validado, setValidado] = useState(false);
  const [dataList, setDataList] = useState<DataListType | null>(null);

  const handleValidar = () => {
    fetch(`http://localhost:3000/process?fileName=${nome}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            if (errorData.message) {
              throw new Error(errorData.message);
            } else {
              throw new Error("Erro desconhecido ao enviar o arquivo.");
            }
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log(data); // Imprime a mensagem do corpo da resposta, se existir
          setDataList(data);
        } else {
          alert("Resposta não contém uma mensagem.");
        }
      })
      .catch((error) => {
        alert("Erro ao enviar o arquivo:" + error);
      });
    setValidado(true);
  };

  const handleAtualizar = () => {
    // Fazer algo com o nome
  };

  return (
    <div>
      <h1>{nome}</h1>
      {validado ? (
        <button disabled>Atualizar</button>
      ) : (
        <button onClick={handleValidar}>Validar</button>
      )}
      <div>
        {dataList && (
          <div>
            <table className="table-auto">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Preço de Venda</th>
                  <th>Novo Preço</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                {dataList.rowCount.map((info) => (
                  <tr key={info.code}>
                    <td>{info.code}</td>
                    <td>{info.name}</td>
                    <td>{info.sales_price}</td>
                    <td>{info.new_price}</td>
                    <td>
                      {info.observation.length > 0 && (
                        <Dropdown observations={info.observation}></Dropdown>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileOptions;
