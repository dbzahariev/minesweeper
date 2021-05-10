var CryptoJS = require("crypto-js");

function ExportAndImport() {
  let data = {
    owner: "rame",
    games: [{ id: 1, time: 0 }],
  };

  const encryptionGame = () => {
    let cryptoText = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      data.owner
    ).toString();
    return cryptoText;
  };
  const decryptionGame = () => {
    let cryptoText = encryptionGame();

    // eslint-disable-next-line
    var decryptedData = JSON.parse(
      CryptoJS.AES.decrypt(cryptoText, data.owner).toString(CryptoJS.enc.Utf8)
    );
  };
  return (
    <>
      <button onClick={encryptionGame}>Export</button>
      <button onClick={decryptionGame}>Import</button>
    </>
  );
}

export default ExportAndImport;