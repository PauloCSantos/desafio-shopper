"use client";
import React, { useState } from "react";

type InputUploadProps = {
  handleUpload: (name: string) => void;
};

const InputUpload = ({ handleUpload }: InputUploadProps) => {
  const [file, setFile] = useState("");

  const handleUploads = (event: any) => {
    const formData = new FormData();
    event.preventDefault(); // Evita o envio padrão do formulário
    formData.append("csvFile", file);
    // Resto do código

    fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            // Captura a mensagem de erro específica
            if (errorData.message) {
              throw new Error(errorData.message);
            } else {
              throw new Error("Erro desconhecido ao enviar o arquivo.");
            }
          });
        }
        //@ts-ignore
        const fileName = formData.get("csvFile").name;
        handleUpload(fileName);
        return response.json(); // Converte o corpo da resposta para JSON
      })
      .then((data) => {
        if (data.message) {
          alert(data.message); // Imprime a mensagem do corpo da resposta, se existir
        } else {
          alert("Resposta não contém uma mensagem.");
        }
      })
      .catch((error) => {
        alert("Erro ao enviar o arquivo:" + error);
      });
  };

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="w-auto mt-10 border-2 border-black">
      <form className="flex" onSubmit={handleUploads}>
        <input
          type="file"
          name="csvFile"
          accept=".csv"
          multiple={false}
          className="w-full"
          onChange={handleFileChange} // Adiciona um manipulador para alterações de arquivo
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-400 text-black text-center w-auto px-2 ml-2"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default InputUpload;
