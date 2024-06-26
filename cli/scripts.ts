import { Program, web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import fs from 'fs';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { GLOBAL_AUTHORITY_SEED, PROGRAM_ID, USER_POOL_SEED, ELMNT_DECIMAL } from '../lib/constant';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { IDL } from "../target/types/sol_token_staking";
import {
    createInitUserTx,
    createInitializeTx,
    createLockTokenTx,
    createLockSolTx,
    createUnLockTokenTx,
    createClaimTx,
    createUnLockSolTx,
    createPopTx,
    createDeployTx
} from '../lib/scripts';
import { GlobalPool, UserPool } from '../lib/types';

let solConnection: Connection = null;
let program: Program = null;
let provider: anchor.Provider = null;
let payer: NodeWallet = null;
let admin: NodeWallet = null;

// Address of the deployed program.
let programId = new anchor.web3.PublicKey(PROGRAM_ID);

/**
 * Set cluster, provider, program
 * If rpc != null use rpc, otherwise use cluster param
 * @param cluster - cluster ex. mainnet-beta, devnet ...
 * @param keypair - wallet keypair
 * @param rpc - rpc
 */
export const setClusterConfig = async (
    cluster: web3.Cluster,
    keypair: string, rpc?: string
) => {

    if (!rpc) {
        solConnection = new web3.Connection(web3.clusterApiUrl(cluster));
    } else {
        solConnection = new web3.Connection(rpc);
    }

    const walletKeypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(keypair, 'utf-8'))),
        { skipValidation: true });
    const wallet = new NodeWallet(walletKeypair);
    // Configure the client to use the local cluster.
    anchor.setProvider(new anchor.AnchorProvider(
        solConnection,
        wallet,
        { skipPreflight: true, commitment: 'confirmed' }));
    payer = wallet;

    provider = anchor.getProvider();
    console.log('Wallet Address: ', wallet.publicKey.toBase58());

    // Generate the program client from IDL.
    program = new anchor.Program(IDL as anchor.Idl, programId);
    console.log('ProgramId: ', program.programId.toBase58());
}

/**
 * Initialize global pool, vault
 */
export const initProject = async () => {
    try {
        const tx = await createInitializeTx(payer.publicKey, program);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Initialize user pool
 */
export const initializeUserPool = async () => {
    try {
        const tx = await createInitUserTx(payer.publicKey, program);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}

export const lockToken = async (
) => {
    try {
        const tx = await createLockTokenTx(payer.publicKey, program, solConnection, 4 * ELMNT_DECIMAL, new PublicKey("4EKbguCsFW3TfpWs8xDnUKFLZheB3rnoRViApjxCicoq"));
        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
        const simulationResult = await solConnection.simulateTransaction(tx);
        console.log("tx history!", simulationResult);
        
    } catch (e) {
        console.log(e);
    }
       
}

export const lockSol = async (
    level: number
) => {
    try {
        const tx = await createLockSolTx(payer.publicKey, program, level);
        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
        const simulationResult = await solConnection.simulateTransaction(tx);
        console.log(simulationResult);
    } catch (e) {
        console.log(e); 
    }
       
}

export const unlockToken = async (
) => {
    try {
        const tx = await createUnLockTokenTx(payer.publicKey, program, new PublicKey("5CY4inXAWEKDENqJ5ZLNaTYX8gzjHZNXimuj7VmFmVi6"));

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
        const simulationResult = await solConnection.simulateTransaction(tx);
        console.log(simulationResult);
        
    } catch (e) {
        console.log(e);
    }
}

export const unlockSol = async (
) => {
    try {
        const tx = await createUnLockSolTx(payer.publicKey, program);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
        
    } catch (e) {
        console.log(e);
    }
}

export const claim = async (
    claim: number
) => {
    try {
        const tx = await createClaimTx(payer.publicKey, program, claim);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}

export const pop = async (
    option: number,
    amount: number
) => {
    try {
        const tx = await createPopTx(payer.publicKey, program, option, amount);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}

export const deploy = async (
    option: number,
    amount: number
) => {
    try {
        const tx = await createDeployTx(payer.publicKey, program, option, amount);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}

export const getGlobalState = async (program: anchor.Program): Promise<GlobalPool | null> => {

    const [globalPool, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId);
    console.log("globalPool: ", globalPool.toBase58());

    try {
        let globalState = await program.account.globalPool.fetch(globalPool, "confirmed");
        return globalState as unknown as GlobalPool;
    }
    catch
    {
        return null;
    }
}

export const getGlobalInfo = async () => {

    const globalPool: GlobalPool = await getGlobalState(program);

    return {
        admin: globalPool.admin.toBase58(),
        totalStaked: globalPool.totalStaked
    };
}

export const getUserPoolState = async (
    userAddress: PublicKey
): Promise<UserPool | null> => {

    if (!userAddress) return null;

    const [userPoolKey, bump] = PublicKey.findProgramAddressSync(
        [userAddress.toBuffer(), Buffer.from(USER_POOL_SEED)],
        program.programId);

    console.log('User Pool: ', userPoolKey.toBase58());

    try {
        let poolState = await program.account.userPool.fetch(userPoolKey, "confirmed") as unknown as UserPool;

        return poolState;
    }
    catch
    {
        return null;
    }
}

export const getUserInfo = async (
    userAddress: PublicKey
) => {
    const userPool = await getUserPoolState(userAddress);

    return {
        user: userPool.user.toBase58(),
        stakeData: userPool.stakeData.map((data) => {
            return `mint:${data.mint.toBase58()} time: ${new Date(data.time.toNumber() * 1000).toLocaleString()}`;
        })
    };
}
