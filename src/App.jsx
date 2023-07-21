import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} from "@solana/web3.js";

import * as buffer from "buffer";



function App() {
  window.Buffer = buffer.Buffer;

  const [privateKey, setPrivateKey] = useState(undefined);

  const [connectToPhantomClicked, setconnectToPhantomClicked] = useState(false);

  const [createWalletText, setCreateWalletText] = useState(
    "Create a new Solana account"
  );

  const [connectWalletText, setConnectWalletText] = useState(
    "Connect to Phantom Wallet"
  );

  const [walletBalanceText, setWalletBalanceText] = useState(0);

  const isPhantomAvailable = window.phantom;

  const createAccountFunction = async () => {
    try {
      const newPair = new Keypair();
      const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
      const key = newPair._keypair.secretKey;
      setPrivateKey(key);

      


      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const myWallet = await Keypair.fromSecretKey(key);
      console.log(`Airdropping some SOL to my wallet! ${publicKey}`);
      console.log(publicKey);
      console.log(key);
      var fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(myWallet.publicKey),
        2.001 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(fromAirDropSignature);

      alert(`Account Created and Airdroppd 2.001 SOL to ${publicKey}`);
      console.log(`Account Created and Airdroppd 2.001 SOL to ${publicKey}`);
      
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const connectToPhantomFunction = async () => {
    try {
      const response = await solana.connect();

      console.log(
        `Connected to Phantom Wallet ${response.publicKey.toString()}`
      );
      alert("connected to phantom");
      setConnectWalletText("Connected Wallet");
      setconnectToPhantomClicked(true);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const transferSOLFunction = async () => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      

      var from = Keypair.fromSecretKey(Uint8Array.from(privateKey));

      console.log(from.secretKey);

      let latestBlockHash = await connection.getLatestBlockhash();
      

      var transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: window.solana.publicKey,
          lamports: LAMPORTS_PER_SOL * 2,
        })
      );

      var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );

      console.log(signature)
      alert("transfered SOL");
      setWalletBalanceText(2);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };


  return (
    <>
      <h1 className="text-3xl font-bold underline mb-4">Solana Wallet Integration Demo</h1>
      {isPhantomAvailable && (
        <div>
          <div>
            <button
              id="createAccount"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4`}
              onClick={createAccountFunction}
            >
              {createWalletText}
            </button>
          </div>
          <div>
            <button
              id="connectToPhantom"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 `}
              // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
              onClick={connectToPhantomFunction}
            >
              {connectWalletText}
            </button>
          </div>
        </div>
      )}

      {!isPhantomAvailable && (
        <p className="">
          No provider found. Install{" "}
          <a
            href="https://phantom.app/"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          >
            Phantom Browser extension
          </a>
        </p>
      )}

      <div>
        <button
          id="transferSOL"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 ${
            !connectToPhantomClicked ? "opacity-50 cursor-not-allowed" : ""
          } `}
          // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={transferSOLFunction}
          disabled={!connectToPhantomClicked}
        >
          Transfer to new wallet
        </button>
      </div>

      <h2>Account Balance: {walletBalanceText} SOL</h2>
    </>
  );
}

export default App;
