import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import Head from 'next/head';
import Contract from '../artifacts/contracts/DefiLottery.sol/DefiLottery.json';







/// L'address du contrat
const address = "0x4da268C28C3d4675Db77ac815417824791204d63";

export default function Mintz() {


    const [data, setData] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [ammount, setAmmount] = useState(1);
    const [loader, setLoader] = useState(true);
    const [balance, setBalance] = useState();




    useEffect(() => {
        getAccounts();
        setLoader(false); 
        fetchData()
      }, [accounts[0]])

      

    async function fetchData() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(address, Contract.abi, provider);
            try {
                
                const priceSale = await contract.priceSale();
                const totalSupply = await contract.totalSupply();
                const MAX_SUPPLY = await contract.MAX_SUPPLY();
                const object = {"priceSale": String(priceSale), "totalSupply": String(totalSupply), "MAX_SUPPLY": String(MAX_SUPPLY) }
                setData(object);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    async function mint() {
        if (typeof window.ethereum !== 'undefined') {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(address, Contract.abi, signer);
            try {
                let overrides = {
                    from: accounts[0],
                    value: (data.priceSale * ammount).toString()
                }
                const transaction = await contract.saleMint(accounts[0], ammount, overrides);
                await transaction.wait();
                
            }
            catch (err) {
                console.log(err);
            }
        }
    }


    const incrementAmmount = () => {
        ammount + 1 <= 5 && setAmmount(ammount + 1);
    }
    const decrementAmmount = () => {
        ammount - 1 >= 1 && setAmmount(ammount - 1)
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
        <div >
            <Head>
        <title>lottery</title>
        <meta property="og:image:url" content="/favicon.jpg"></meta>
        <meta name="description" content="The red paws club project, A true passive income NFT, The easy way of earning money" />
        <link rel="icon" href="/favicon.ico" />
            </Head>
            <>
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
          <div hidden className="profile" >
            <li className="reglage">
              <a title="Réglages du site">
                <i className="fa-solid fa-gear" />
              </a>
            </li>
          </div>
          <div className="menu">
            <ul>
              <div className="action2">
                <div hidden className="profile2" >
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
              <div hidden className="actionclose" >
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
        <button id="walletBTN" onClick={getAccounts}>CONNECT WALLET</button>
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
          <img
            className="marketplace-photo-nft-border-1"
            src="image/discordpdp.png"
            alt="bob"
          />
        </div>
      </div>
      <div className="btn-marketplace">
        <ul className="btn-marketplace-ul">
          <div className="btn-marketplace-ul-text-mint">
            <h2>Mint Ticket</h2>
            <p className="btn-marketplace-ul-presentationtext-h1-supply">
            {data.MAX_SUPPLY - data.totalSupply} tickets NFT's restants
            </p>
          </div>
          <div className="btn-marketplace-ul-text-balance">
            <div className="btn-marketplace-ul-text-container">
              <h3>Solde</h3>
              <div className="btn-marketplace-ul-text-void" />
              <p>0.013 ETH</p>
            </div>
            <div className="btn-marketplace-ul-text-line" />
          </div>
          <div className="btn-marketplace-ul-text-amount">
            <div className="btn-marketplace-ul-text-container">
              <div className="btn-marketplace-ul-text-container-box">
                <h3>Montant</h3>
                <p>(max 5)</p>
              </div>
              <div id="btn-markeplace-ul-quantity-container">
                <div className="btn-markeplace-ul-quantity">
                <button className="btn-markeplace-ul-quantity-l" onClick={decrementAmmount}>-</button>
                </div>
                <div className="btn-marketplace-ul-quantity-li-datalist">
                  <form action="/action_page.php">
                    <input
                      list="number-ticket"
                      className="btn-marketplace-ul-li-input"
                      placeholder={ammount}
                      
                    />
                  </form>
                </div>
                <div className="btn-markeplace-ul-quantity">
                <button className="btn-markeplace-ul-quantity-r" onClick={incrementAmmount}>+</button>
                </div>
              </div>
            </div>
            <div className="btn-marketplace-ul-text-line" />
          </div>
          <div className="btn-marketplace-ul-text-total">
            <div className="btn-marketplace-ul-text-container">
              <h3>Total</h3>
              <div className="btn-marketplace-ul-text-void" />
              <p>{data.priceSale/10**18 * ammount} ETH</p>
            </div>
            <div className="btn-marketplace-ul-text-line" />
          </div>
          <div className="btn-marketplace-mint">
            <button className="btn-mint">Acheter</button>
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
            sécurisée grâce à l'utilisation d'un contrat intelligent
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
</>

        </div >
    )
}
