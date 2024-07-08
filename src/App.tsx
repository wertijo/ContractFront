import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from './assets/abis/MITokenAbi';
import { CFE_CONTRACT_ADDRESS } from './constants';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from './main';
import { useState } from 'react';
import { toast } from 'react-toastify';

function App() {
  const { address, isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);

  const { data, isLoading, refetch } = useReadContract({
    abi,
    address: CFE_CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });

  const { writeContractAsync } = useWriteContract();

  const handleMint = async () => {
    setIsMinting(true);

    try {
      const txHash = await writeContractAsync({
        abi,
        address: CFE_CONTRACT_ADDRESS,
        functionName: "mint",
        args: [address, 150],
      });

      await waitForTransactionReceipt(config, {
        confirmations: 1,
        hash: txHash,
      });

      setIsMinting(false);
      toast.success("Minted 150 MI tokens");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to mint MI tokens");
      setIsMinting(false);
    }
  };

  return (
    <main className="w-full flex justify-center items-center min-h-svh flex-col">
      <h1 className="text-4xl font-bold">🚀 Mi contrato con Front 🚀</h1>
      <div className="my-5 p-4 flex flex-col gap-5 rounded border border-gray-700 items-center">
        <ConnectButton />
        {isConnected ? (
          <div className="space-y-5 flex flex-col">
            <p>
              💰 <span>Balance:</span>{" "}
              {isLoading ? (
                <span className="opacity-50">Loading...</span>
              ) : (
                data?.toString()
              )}
            </p>

            <button
              className="px-3 py-1 font-semibold bg-slate-700 rounded-xl disabled:opacity-50"
              disabled={isMinting}
              onClick={handleMint}
            >
              {isMinting ? "Minting..." : "Mint tokens"}
            </button>
          </div>
        ) : (
          <div>Conecta tu walllet primero</div>
        )}
      </div>
      <div className="w-full flex justify-center items-center flex-col">
        <p style={{marginBottom: 20}}>Made with 💖 by Wertijo</p>
        <a href="https://github.com/wertijo">
          <img src='src\img\Github.png' style={{ width: 50, height: 50 }}></img>
        </a>
      </div>
    </main>
  );
}

export default App;
