
import Link from 'next/link';
import Image from 'next/image';
import { ethers } from 'ethers';
import Head from 'next/head';
import Contract from '../artifacts/contracts/DefiLottery.sol/DefiLottery.json';
import WalletConnectProvider from "@walletconnect/web3-provider"
import { providers } from "ethers"
import { useCallback, useState, useEffect, useReducer } from "react"
import WalletLink from "walletlink"
import Web3Modal from "web3modal"
import { ellipseAddress, getChainData } from "../lib/utilities"

const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad"

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID // required
    }
  },
  "custom-walletlink": {
    display: {
      logo:
        "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
      name: "Coinbase",
      description: "Connect to Coinbase Wallet (not Coinbase App)"
    },
    options: {
      appName: "Coinbase", // Your app name
      networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      chainId: 1
    },
    package: WalletLink,
    connector: async (_, options) => {
      const { appName, networkUrl, chainId } = options
      const walletLink = new WalletLink({
        appName
      })
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
      await provider.enable()
      return provider
    }
  }
}

let web3Modal
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: false,
    providerOptions // required
  })
}

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId
      }
    case "SET_ADDRESS":
      return {
        ...state,
        address: action.address
      }
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId
      }
    case "RESET_WEB3_PROVIDER":
      return initialState
    default:
      throw new Error()
  }
}


/// L'address du contrat


export default function Mintz() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { provider, web3Provider, address, chainId } = state
  const [data, setData] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [ammount, setAmmount] = useState(1);
  const [loader, setLoader] = useState(true);
  const [balance, setBalance] = useState();
  const addressDL = "0x5E14933f6265a6098f11bf1916300561B84376D1";

  const connect = useCallback(async function() {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal.connect()

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new providers.Web3Provider(provider)

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()
    console.log("SET ADDRESS FROM CONNECT", address)
    const network = await web3Provider.getNetwork()

    dispatch({
      type: "SET_WEB3_PROVIDER",
      provider,
      web3Provider,
      address,
      chainId: network.chainId
    })
  }, [])

  const disconnect = useCallback(
    async function() {
      await web3Modal.clearCachedProvider()
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect()
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER"
      })
    },
    [provider]
  )

  // Auto connect to the cached provider
  useEffect(() => {
    console.log("web3Modal.cachedProvider", web3Modal.cachedProvider)
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = accounts => {
        // eslint-disable-next-line no-console
        console.log("accountsChanged from event", accounts)
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0]
        })
      }

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = _hexChainId => {
        window.location.reload()
      }

      const handleDisconnect = error => {
        // eslint-disable-next-line no-console
        console.log("disconnect", error)
        disconnect()
      }

      provider.on("accountsChanged", handleAccountsChanged)
      provider.on("chainChanged", handleChainChanged)
      provider.on("disconnect", handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged)
          provider.removeListener("chainChanged", handleChainChanged)
          provider.removeListener("disconnect", handleDisconnect)
        }
      }
    }
  }, [provider, disconnect])

  const chainData = getChainData(chainId)

    




    useEffect(() => {
        getAccounts();
        setLoader(false); 
        fetchData()
      }, [accounts[0]])

      

    async function fetchData() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(addressDL, Contract.abi, provider);
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
            const contract = new ethers.Contract(addressDL, Contract.abi, signer);
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
        {address && (
          <div className="grid">
            <div>
              <p className="mb-1">Network:</p>
              <p>{chainData?.name}</p>
            </div>
            <div>
              <p className="mb-1">Address:</p>
              <p>{ellipseAddress(address)}</p>
            </div>
          </div>
        )}
        {web3Provider ? (
        <button id="walletBTN" onClick={disconnect}>
        Disconnect</button>
        ) : (
          <button id="walletBTN" onClick={connect}>
          Connect
        </button>
      )}
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
            <h2>Mint Ticket</h2>
            <p className="btn-marketplace-ul-presentationtext-h1-supply">
            {data.MAX_SUPPLY - data.totalSupply} tickets NFT&apos;s restants
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
            <button className="btn-mint" onClick={mint} >Acheter</button>
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
