import React, {useState, useEffect, Component } from 'react';
import Navbar from './navbar/navbar';
import './App.css';
import {Modal} from 'antd';
import {
  Transaction,
  SystemProgram,
  Connection,
  clusterApiUrl
} from "@solana/web3.js";

const App = () =>{
  const [walletConnect, setWalletConnect] = useState(false);
  const NETWORK = clusterApiUrl("mainnet-beta");
  const connection = new Connection(NETWORK);
  const [provider, setProvider] = useState(null);
  const [transol, settransaction] = useState(false);
  const checkIfWalletIsConnected = async () =>{
    try {
      const { solana } = window;
      if (solana){
        if (solana.isPhantom){
          console.log("Phantom wallet found!");
          const response = await solana.connect({onlyIfTrusted: true});
          console.log(response);
          setWalletConnect(true);
          setProvider(solana);
        }
      }
      else{
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    }
    catch (error){
      console.error(error);
    }
  }

  const connectWallet = async () => {
    const {solana} = window;
     if(solana){
       const response = await solana.connect();
       console.log('Connected with Public Key:', response.publicKey.toString());
        setWalletConnect(true);
     }
  };

  const createTransferTransaction = async () => {
    if (!provider.publicKey) return;
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: provider.publicKey,
        lamports: 100,
      })
    );
    transaction.feePayer = provider.publicKey;
    const anyTransaction = transaction;
    anyTransaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;
    return transaction;
  };

  const sendTransaction = async () => {
    try {
      const transaction = await createTransferTransaction();
      if (!transaction) return;
      let signed = await provider.signTransaction(transaction);
      let signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);
    } catch (err) {
      console.warn(err);
      settransaction(true);
    }
  };


  const renderNotConnectedContainer = ()=>(
    <button 
      className='connect-wallet-button'
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  )
  const renderConnectedContainer = ()=>(
    <div className='stake-info-staked-body'>
      <span>0.00</span>
      <button onClick={showModal} >Stake LP</button>
    </div>
  )

  const rendermodal = ()=>(
    <div>
      <div className='stake-input-area'>
        <div className='stake-area'>
          <span className='input-head'>Stake</span>
          <input placeholder='Amount...' type="number" />
        </div>
        <div className='coin-detail'>
          <span className='input-head'>Balance:120 STRN</span>
          <span className='stake-pool-name'>STRN-SOL LP</span>
        </div>
      </div>
      <div className='action-buttons'>
        <button className='cancel-btn'> Cancel</button>
        <button onClick={sendTransaction} className="confirm-btn"> Confirm</button>
      </div>
    </div>
  )

  const approvedmodal = ()=>(
    <div className='transaction-approved'>
      <i className="fa-solid fa-circle-check"></i>
      <span>Transaction Approved</span>
    </div>
  )

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    settransaction(false);
  };
  useEffect(() =>{
    const onLoad = async ()=>{
      await checkIfWalletIsConnected();
    }
    window.addEventListener('load', onLoad);
    return ()=> window.removeEventListener('load',onLoad);
  }, []);
  return (
    <React.Fragment>
      <Navbar data={walletConnect}></Navbar>
      <div className='body-container'>
        <div className='stake-section'>
          <div className='stake-header'>
            <div className='logo'>
              <i className="fa-solid fa-coins"></i>
            </div>
            <div className='stake-head-text'>
              STRN-SOL
            </div>
          </div>
          <div className='stake-body'>
            <div className='stake-apr'>
              <span>APR:</span>
              <span className='bold-text'>129.32% <i className="fa-solid fa-calculator"></i></span>
            </div>
            <div className='stake-earn'>
              <span>Earn:</span>
              <span className='bold-text'>STRN+Fees</span>
            </div>
            <div className='stake-info'>
              <div className='stake-info-earned'>
                <div className='stake-info-earned-head'>
                  STRN LP <span>EARNED</span>
                </div>
                <div className='stake-info-earned-body'>
                  <span>12.34</span>
                  <button>Harvest</button>
                </div>
              </div>
              <div className='stake-info-staked'>
                <div className='stake-info-staked-head'>
                  STRN LP <span>STAKED</span>
                </div>
                {!walletConnect && renderNotConnectedContainer()}
                {walletConnect && renderConnectedContainer()}
                <Modal footer={null} title="STRN" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                  {transol?approvedmodal():rendermodal()}
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
