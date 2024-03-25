export const copyToClipboard = (roomId, setCopySuccess) => {
  navigator.clipboard.writeText(roomId);
  setCopySuccess("Copied!");

  setTimeout(() => {
    setCopySuccess("");
  }, 1000);
};
