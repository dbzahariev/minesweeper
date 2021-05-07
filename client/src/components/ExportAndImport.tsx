import React from "react";

var CryptoJS = require("crypto-js");

const ExportAndImport: React.FC = () => {
  let data = {
    owner: "rame",
    games: [{ id: 1, time: 0 }],
  };

  const encryptionGame = () => {
    let cryptoText = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      data.owner
    ).toString();
    console.log("enc", cryptoText);
    return cryptoText;
  };
  const decryptionGame = () => {
    let cryptoText = encryptionGame();

    var decryptedData = JSON.parse(
      CryptoJS.AES.decrypt(cryptoText, data.owner).toString(CryptoJS.enc.Utf8)
    );
    console.log(decryptedData);
  };
  return (
    <>
      <button onClick={encryptionGame}>Export</button>
      <button onClick={decryptionGame}>Import</button>
    </>
  );
};

export default ExportAndImport;
