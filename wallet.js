window.walletConnected = false;
window.hasPaid = false;

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask not detected");
    return;
  }
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  document.getElementById("wallet-address").innerText = "Connected: " + account;
  window.walletConnected = true;
}

async function payToPlay() {
  try {
    const tx = {
      to: '0x1234567890abcdef1234567890abcdef12345678', // Dummy STT receiver
      value: '0', // native ETH zero (simulate STT)
      data: '0x', // skip contract call
    };
    window.hasPaid = true;
    document.getElementById("status").innerText = "Payment received. You can now play!";
    startGame();
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Payment failed.";
  }
}
