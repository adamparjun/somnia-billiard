window.walletConnected = false;
window.hasPaid = false;

let provider, signer;

const projectId = "c634ba8af60346e2cf78bfe465b603f1";

const web3Modal = new window.Web3Modal.default({
  projectId,
  themeMode: "dark",
  walletConnectVersion: 2,
  chains: [
    {
      id: 50312,
      name: "Somnia Testnet",
      rpcUrls: ["https://rpc.ankr.com/somnia_testnet/"],
    }
  ]
});

async function connectWallet() {
  try {
    const instance = await web3Modal.connect();
    provider = new ethers.BrowserProvider(instance);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("wallet-address").innerText = "Connected: " + address;
    window.walletConnected = true;
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed.");
  }
}

async function payToPlay() {
  try {
    const tx = await signer.sendTransaction({
      to: '0x1234567890abcdef1234567890abcdef12345678',
      value: ethers.parseEther("0.001")
    });
    await tx.wait();
    window.hasPaid = true;
    document.getElementById("status").innerText = "Payment received. You can now play!";
    startGame();
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Payment failed.";
  }
}
