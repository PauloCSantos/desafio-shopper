"use client"

import React, { useState, useEffect } from "react";
import InputUpload from "./InputUpload";
import FileOptions from "./FileOptions";

const ManagerFiles = () => {
  const [nome, setNome] = useState("");

  const handleUpload = (file: string) => {
    setNome(file);
  };

  useEffect(() => {
    // Quando o componente renderizar, instancie o componente FileOptions
    setNome("");
  }, []);

  return (
    <div>
      <InputUpload handleUpload={handleUpload} />
      {nome && <FileOptions nome={nome} />}
    </div>
  );
};

export default ManagerFiles;