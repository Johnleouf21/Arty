import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ethers } from 'ethers';
import Head from 'next/head';
import Contract from '../artifacts/contracts/DefiLottery.sol/DefiLottery.json';






/// L'address du contrat
const address = "0xfd36beb8C04e00d5FA10635Dba784e3dEa385345";

export default function Resultz() {


    const [data, setData] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [ammount, setAmmount] = useState(1);
    const [loader, setLoader] = useState(true);
    const [balance, setBalance] = useState();



    useEffect(() => {
        getAccounts();
        setLoader(false); 
        getResult()
      }, [accounts[0]])

     

      async function Withdraw() {
        if(typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(address, Contract.abi, signer);
          try {
            const transaction = await contract.withdrawToWinner();
            await transaction.wait();
            
            }
            
            
          
          catch(err) {
            console.log(err);
          }
        }
      }
    
      async function getResult() {
        if(typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(address, Contract.abi, provider);
          try {
            const gain = await contract.getBalanceForTheWinner();
            const winnerAddress = await contract.getWinnerAddress();
            const object2 = {"gain": String(gain), "winnerAddress": String(winnerAddress)}
            setData(object2);
            }
          catch(err) {
            console.log(err);
          }
        }
      }
    


    ///-------------------------------------------------------------Button connect-----------------------------------------------------------------------
///Si Metamask est déjà installé
async function getAccounts() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccounts(accounts);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const balanceInEth = ethers.utils.formatEther(balance);
      setBalance(balanceInEth);
    }
  }

    ///<━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━App━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━>


    return (
        <div>
            <Head>
        <title>lottery</title>
        <meta property="og:image:url" content="/favicon.jpg"></meta>
        <meta name="description" content="The red paws club project, A true passive income NFT, The easy way of earning money" />
        <link rel="icon" href="/favicon.ico" />
            </Head>
            
              <header>
                <nav>
                  <ul>
                    <li id="logo">
                      <Link href="/">
                      <a>
                        <i className="fa-solid fa-ticket" /> DeFi Lottery
                      </a>
                      </Link>
                    </li>
                    <div className="action">
                      <div className="profile" >
                        <li className="reglage">
                          <a title="Réglages du site">
                            <i className="fa-solid fa-gear" />
                          </a>
                        </li>
                      </div>
                      <div className="menu">
                        <ul>
                          <div className="action2">
                            <div className="profile2" >
                              <li>
                                <i className="fa-solid fa-globe" /> Langue{" "}
                                <i className="fa-solid fa-caret-right" />
                              </li>
                              <div className="menulang">
                                <ul>
                                  <li>
                                    <a className="langa" href="#">
                                      Francais
                                      <i className="fa-solid fa-circle-check" />
                                    </a>
                                  </li>
                                  <li>
                                    <a className="langa" href="ENmarketplace.html">
                                      Anglais
                                    </a>
                                  </li>
                                  <li>
                                    <a className="langa" href="BRmarketplace.html">
                                      Bresilian
                                    </a>
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-arrow-left" /> Retour
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="btntoggle">
                            <li>
                              <i className="fa-solid fa-sun" /> Theme
                            </li>
                          </div>
                          <div className="actionclose" >
                            <ul>
                              <li>
                                <i className="fa-solid fa-xmark" /> Fermer
                              </li>
                            </ul>
                          </div>
                        </ul>
                      </div>
                    </div>
                    <div className="iconsnavbartwitter">
                      <a
                        className="logotwitter"
                        href="https://twitter.com/?lang=fr"
                        title="Accédez à notre twitter"
                      >
                        <i className="fa-brands fa-twitter" />
                      </a>
                    </div>
                    <div className="iconsnavbardiscord">
                      <a
                        className="logodiscord"
                        href="https://discord.gg/mXb4Aq5Bz2"
                        title="Accédez à notre discord communautaire officiel"
                      >
                        <i className="fa-brands fa-discord" />
                      </a>
                    </div>
                    <li id="whitepaper">
                      <a href="#" title="Accédez au White Paper">
                        White Paper
                      </a>
                    </li>
                    <li id="apropos">
                      <a
                        href="FRindex.html#about"
                        title="Pour mieux comprendre notre projet"
                      >
                        A propos
                      </a>
                    </li>
                    <button id="walletBTN" onClick={getAccounts} >CONNECT WALLET</button>
                    <h10>
                      <span id="showAccount" />
                    </h10>
                  </ul>
                </nav>
              </header>
              <section className="fontImg1">
                <div className="banner-information"></div>
                <div className="marketplace">
                  <div className="marketplace-photo-nft">
                    <div className="marketplace-photo-nft-border">
                      <Image
                        className="marketplace-photo-nft-border-1"
                        src="/image/discordpdp.png"
                        alt="bob"
                        width={700}
                        height={700}
                      />
                    </div>
                  </div>
                  <div className="btn-marketplace">
                    <ul className="btn-marketplace-ul">
                      <div className="btn-marketplace-ul-text-mint">
                        <h2>Resultats</h2>
                        <p className="btn-marketplace-ul-presentationtext-h1-supply">
                          Etes vous l&apos;heureux gagnant ?
                        </p>
                      </div>
                      <div className="btn-marketplace-ul-text-balance">
                        <div className="btn-marketplace-ul-text-container">
                          <h3>Winner Address:</h3>
                          <div className="btn-marketplace-ul-text-void" />
                          <p>{data.winnerAddress}</p>
                        </div>
                        <div className="btn-marketplace-ul-text-line" />
                      </div>
                      <div className="btn-marketplace-ul-text-amount">
                        <div className="btn-marketplace-ul-text-container">
                          <div className="btn-marketplace-ul-text-container-box">
                            <h3>Cashprize: </h3><p>💲💲999💲💲</p>
                            
                          </div>
                          
                        </div><div className="btn-marketplace-ul-text-line" />
                        <div className="btn-marketplace-ul-text-total">
                          <div className="btn-marketplace-ul-text-container">
                            <h3>Total</h3>
                            <div className="btn-marketplace-ul-text-void" />
                            <p>{data.gain/10**18} ETH</p>
                          </div>
                          <div className="btn-marketplace-ul-text-line" />
                        </div>
                        <div className="btn-marketplace-mint">
                          <button id="btn-mint" className="btn-mint" onClick={Withdraw}>
                            🥳🥳🥳
                          </button>
                        </div>
                      </div>
                    </ul>
                  </div>
                </div>
              </section>
              <footer>
                <div id="deuxiemeTrait" />
                <div className="footer-container">
                  <div className="footer-presentation-defi">
                    <div className="footer-presentation-defi-description">
                      <h3 className="footer-presentation-defi-h3">
                        <i className="fa-solid fa-ticket" /> DeFi Lottery
                      </h3>
                      <h4 className="footer-presentation-defi-h4">
                        DeFi Lottery, lotterie basée sur la technologie blockchain et
                        sécurisée grâce à l&apos;utilisation d&apos;un contrat intelligent
                      </h4>
                    </div>
                  </div>
                  <div className="footer-credits">
                    <h4>
                      <a href="#">Credits</a>
                    </h4>
                    <h4>
                      <a href="FRindex.html/about" hrefLang="#about">
                        A propos
                      </a>
                    </h4>
                    <h4>
                      <a href="#">Nous contacter</a>
                    </h4>
                    <h4>
                      <a href="#">Whitepaper</a>
                    </h4>
                    <h4>
                      <a href="credits.html">Credits</a>
                    </h4>
                    {/* <form action="data.php" method="POST" class="footer-form">
                          <input style="cursor:text" type="email" name="email" class="footer-form-input" placeholder="E-mail">
                          <textarea style="cursor:text" type="textarea" class="footer-form-textarea" placeholder="Votre message"></textarea>
                          <button class="footer-form-btn"><a>Envoyer</a></button>
                      </form> */}
                  </div>
                </div>
                <div id="deuxiemeTrait" />
                <div id="copyrightEtIcons">
                  <div id="copyright">
                    <span title="Jeunes Entrepreneurs">© 2022, All Rights Reserved</span>
                  </div>
                  <div id="icons">
                    <a href="https://twitter.com/?lang=fr" title="Accédez à notre twitter">
                      <i className="fa-brands fa-twitter" />
                    </a>
                    <a
                      href="https://www.youtube.com/?hl=FR"
                      title="Accédez à notre chaine youtube"
                    >
                      <i className="fa-brands fa-youtube" />
                    </a>
                    <a
                      href="https://discord.gg/mXb4Aq5Bz2"
                      title="Accédez à notre discord communautaire officiel"
                    >
                      <i className="fa-brands fa-discord" />
                    </a>
                  </div>
                </div>
              </footer>


        </div >
    )
}
