///Si Metamask est déjà installé
if (window.ethereum !== undefined) {
  console.log('MetaMask is installed!');
}

  
const walletBTN = document.querySelector('#walletBTN');
const showAccount = document.querySelector('#showAccount');




walletBTN.addEventListener("click", () => {
  getAccount();
});

async function getAccount() {

  ///Si Metamask n'est pas installé
  if (window.ethereum == undefined) {
    window.location.href="https://metamask.io/download/";
    console.log('MetaMask is not installed!');
  }

  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  showAccount.innerHTML = account;
  console.log("Client is connected")
  console.log("Metamask is connected")

const str = document.querySelector("#showAccount").textContent; /// 42

const strFIN = str.slice(38, 42);
// expected output: "E32A

const strFinal = '0x...' + strFIN
console.log(strFinal)

///On récupère l'emplacement
var addressCONNECTED = document.querySelector('#walletBTN')
///On lui affecte sa nouvelle value
addressCONNECTED.innerHTML = strFinal.toLowerCase()

} 

///--------------------------------------------------------------------Le reste------------------------------------------

