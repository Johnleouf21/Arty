import styles from '../styles/Home.module.css'


function InfosAccount(props) {
    return (
        <div className={styles.nav}>
            {!props.loader &&
                props.accounts.length > 0 ?
                <div>
                <p>You are connected with this account : {props.accounts[0]}</p>
                {props.balance && <p>You have {props.balance} ETH on your account.</p>}
                </div>
                :
                <p>You are not connected with Metamask on this website.</p>
            }
        </div>
    )
}

export default InfosAccount;