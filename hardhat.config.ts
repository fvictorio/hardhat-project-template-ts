import * as dotenv from "dotenv";

import { HardhatUserConfig, secrets, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-ledger";
import "@typechain/hardhat";
import "@truffle/dashboard-hardhat-plugin";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-verify";
import "xdeployer";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";
import * as tdly from "@tenderly/hardhat-tenderly";
import "hardhat-abi-exporter";

dotenv.config();

// Turning off the automatic Tenderly verification
tdly.setup({ automaticVerifications: false });

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  "balances",
  "Prints the list of accounts and their balances",
  async (_, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      console.log(
        account.address +
          " " +
          (await hre.ethers.provider.getBalance(account.address)),
      );
    }
  },
);

const config: HardhatUserConfig = {
  paths: {
    sources: "./contracts/src",
  },
  solidity: {
    // Only use Solidity versions `>=0.8.20` for EVM networks that support the opcode `PUSH0`
    // Otherwise, use the versions `<=0.8.19`
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
    },
  },
  zksolc: {
    version: "1.3.14",
    compilerSource: "binary",
    settings: {
      isSystem: false,
      forceEvmla: false,
      optimizer: {
        enabled: true,
        mode: "3",
      },
    },
  },
  truffle: {
    dashboardNetworkName: "truffleDashboard", // Truffle's default value is "truffleDashboard"
    dashboardNetworkConfig: {
      // Truffle's default value is 0 (i.e. no timeout), while Hardhat's default
      // value is 40000 (40 seconds)
      timeout: 0,
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
      chainId: 31337,
      hardfork: "shanghai",
      forking: {
        url: secrets.get("ETH_MAINNET_URL") ?? "",
        // The Hardhat network will by default fork from the latest mainnet block
        // To pin the block number, specify it below
        // You will need access to a node with archival data for this to work!
        // blockNumber: 14743877,
        // If you want to do some forking, set `enabled` to true
        enabled: false,
      },
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
      // zksync: true, // Enables zkSync in the Hardhat local network
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    tenderly: {
      url: `https://rpc.tenderly.co/fork/${secrets.get("TENDERLY_FORK_ID")}`,
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    devnet: {
      url: `https://rpc.vnet.tenderly.co/devnet/${secrets.get("TENDERLY_DEVNET_ID")}`,
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    goerli: {
      chainId: 5,
      url: secrets.get("ETH_GOERLI_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    sepolia: {
      chainId: 11155111,
      url: secrets.get("ETH_SEPOLIA_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    ethMain: {
      chainId: 1,
      url: secrets.get("ETH_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    bscTestnet: {
      chainId: 97,
      url: secrets.get("BSC_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    bscMain: {
      chainId: 56,
      url: secrets.get("BSC_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    optimismTestnet: {
      chainId: 420,
      url: secrets.get("OPTIMISM_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    optimismMain: {
      chainId: 10,
      url: secrets.get("OPTIMISM_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    arbitrumTestnet: {
      chainId: 421613,
      url: secrets.get("ARBITRUM_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    arbitrumSepolia: {
      chainId: 421614,
      url: secrets.get("ARBITRUM_SEPOLIA_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    arbitrumMain: {
      chainId: 42161,
      url: secrets.get("ARBITRUM_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    arbitrumNova: {
      chainId: 42170,
      url: secrets.get("ARBITRUM_NOVA_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    mumbai: {
      chainId: 80001,
      url: secrets.get("POLYGON_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    polygonZkEVMTestnet: {
      chainId: 1442,
      url: secrets.get("POLYGON_ZKEVM_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    polygon: {
      chainId: 137,
      url: secrets.get("POLYGON_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    polygonZkEVMMain: {
      chainId: 1101,
      url: secrets.get("POLYGON_ZKEVM_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    hecoTestnet: {
      chainId: 256,
      url: secrets.get("HECO_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    hecoMain: {
      chainId: 128,
      url: secrets.get("HECO_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    fantomTestnet: {
      chainId: 4002,
      url: secrets.get("FANTOM_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    fantomMain: {
      chainId: 250,
      url: secrets.get("FANTOM_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    fuji: {
      chainId: 43113,
      url: secrets.get("AVALANCHE_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    avalanche: {
      chainId: 43114,
      url: secrets.get("AVALANCHE_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    sokol: {
      chainId: 77,
      url: secrets.get("SOKOL_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    chiado: {
      chainId: 10200,
      url: secrets.get("GNOSIS_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    gnosis: {
      chainId: 100,
      url: secrets.get("GNOSIS_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    moonbaseAlpha: {
      chainId: 1287,
      url: secrets.get("MOONBEAM_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    moonriver: {
      chainId: 1285,
      url: secrets.get("MOONRIVER_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    moonbeam: {
      chainId: 1284,
      url: secrets.get("MOONBEAM_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    alfajores: {
      chainId: 44787,
      url: secrets.get("CELO_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    celo: {
      chainId: 42220,
      url: secrets.get("CELO_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    auroraTestnet: {
      chainId: 1313161555,
      url: secrets.get("AURORA_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    auroraMain: {
      chainId: 1313161554,
      url: secrets.get("AURORA_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    harmonyTestnet: {
      chainId: 1666700000,
      url: secrets.get("HARMONY_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    harmonyMain: {
      chainId: 1666600000,
      url: secrets.get("HARMONY_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    spark: {
      chainId: 123,
      url: secrets.get("FUSE_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    fuse: {
      chainId: 122,
      url: secrets.get("FUSE_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    cronosTestnet: {
      chainId: 338,
      url: secrets.get("CRONOS_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    cronosMain: {
      chainId: 25,
      url: secrets.get("CRONOS_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    evmosTestnet: {
      chainId: 9000,
      url: secrets.get("EVMOS_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    evmosMain: {
      chainId: 9001,
      url: secrets.get("EVMOS_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    bobaTestnet: {
      chainId: 2888,
      url: secrets.get("BOBA_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    bobaMain: {
      chainId: 288,
      url: secrets.get("BOBA_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    cantoTestnet: {
      chainId: 7701,
      url: secrets.get("CANTO_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    cantoMain: {
      chainId: 7700,
      url: secrets.get("CANTO_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    baseTestnet: {
      chainId: 84531,
      url: secrets.get("BASE_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    baseMain: {
      chainId: 8453,
      url: secrets.get("BASE_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    zkSyncTestnet: {
      chainId: 280,
      url: secrets.get("ZKSYNC_TESTNET_URL") || "",
      ethNetwork: secrets.get("ETH_GOERLI_TESTNET_URL") || "",
      zksync: true,
      verifyURL:
        "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    zkSyncMain: {
      chainId: 324,
      url: secrets.get("ZKSYNC_MAINNET_URL") || "",
      ethNetwork: secrets.get("ETH_MAINNET_URL") || "",
      zksync: true,
      verifyURL:
        "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    mantleTestnet: {
      chainId: 5001,
      url: secrets.get("MANTLE_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    mantleMain: {
      chainId: 5000,
      url: secrets.get("MANTLE_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    filecoinTestnet: {
      chainId: 314159,
      url: secrets.get("FILECOIN_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    scrollTestnet: {
      chainId: 534353,
      url: secrets.get("SCROLL_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    lineaTestnet: {
      chainId: 59140,
      url: secrets.get("LINEA_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    lineaMain: {
      chainId: 59144,
      url: secrets.get("LINEA_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    shimmerEVMTestnet: {
      chainId: 1071,
      url: secrets.get("SHIMMEREVM_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    zoraTestnet: {
      chainId: 999,
      url: secrets.get("ZORA_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    zoraMain: {
      chainId: 7777777,
      url: secrets.get("ZORA_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    luksoTestnet: {
      chainId: 4201,
      url: secrets.get("LUKSO_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    luksoMain: {
      chainId: 42,
      url: secrets.get("LUKSO_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    mantaTestnet: {
      chainId: 3441005,
      url: secrets.get("MANTA_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    mantaMain: {
      chainId: 169,
      url: secrets.get("MANTA_MAINNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    shardeumTestnet: {
      chainId: 8081,
      url: secrets.get("SHARDEUM_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
    artheraTestnet: {
      chainId: 10243,
      url: secrets.get("ARTHERA_TESTNET_URL") || "",
      accounts: secrets.getAsArray("PRIVATE_KEY"),
      ledgerAccounts: secrets.getAsArray("LEDGER_ACCOUNT"),
    },
  },
  xdeploy: {
    // Change this name to the name of your main contract
    // Does not necessarily have to match the contract file name
    contract: "Greeter",

    // Change to `undefined` if your constructor does not have any input arguments
    constructorArgsPath: "./deploy-args.ts",

    // The salt must be the same for each EVM chain for which you want to have a single contract address
    // Change the salt if you are doing a re-deployment with the same codebase
    salt: secrets.get("SALT"),

    // This is your wallet's private key
    signer: secrets.get("PRIVATE_KEY"),

    // Use the network names specified here: https://github.com/pcaversaccio/xdeployer#configuration
    // Use `localhost` or `hardhat` for local testing
    networks: ["hardhat"],

    // Use the matching env URL with your chosen RPC in the `.env` file
    rpcUrls: ["hardhat"],

    // Maximum limit is 15 * 10 ** 6 or 15,000,000. If the deployments are failing, try increasing this number
    // However, keep in mind that this costs money in a production environment!
    gasLimit: 1.2 * 10 ** 6,
  },
  gasReporter: {
    enabled: secrets.get("REPORT_GAS") !== undefined,
    currency: "USD",
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
    strict: true,
    only: [],
    except: [],
  },
  abiExporter: {
    path: "./abis",
    runOnCompile: true,
    clear: true,
    flat: false,
    only: [],
    spacing: 2,
    pretty: true,
  },
  etherscan: {
    apiKey: {
      // For Ethereum testnets & mainnet
      mainnet: secrets.get("ETHERSCAN_API_KEY") || "",
      goerli: secrets.get("ETHERSCAN_API_KEY") || "",
      sepolia: secrets.get("ETHERSCAN_API_KEY") || "",
      // For BSC testnet & mainnet
      bsc: secrets.get("BSC_API_KEY") || "",
      bscTestnet: secrets.get("BSC_API_KEY") || "",
      // For Heco testnet & mainnet
      heco: secrets.get("HECO_API_KEY") || "",
      hecoTestnet: secrets.get("HECO_API_KEY") || "",
      // For Fantom testnet & mainnet
      opera: secrets.get("FANTOM_API_KEY") || "",
      ftmTestnet: secrets.get("FANTOM_API_KEY") || "",
      // For Optimism testnet & mainnet
      optimisticEthereum: secrets.get("OPTIMISM_API_KEY") || "",
      optimisticGoerli: secrets.get("OPTIMISM_API_KEY") || "",
      // For Polygon testnets & mainnets
      polygon: secrets.get("POLYGON_API_KEY") || "",
      polygonZkEVM: secrets.get("POLYGON_ZKEVM_API_KEY") || "",
      polygonMumbai: secrets.get("POLYGON_API_KEY") || "",
      polygonZkEVMTestnet: secrets.get("POLYGON_ZKEVM_API_KEY") || "",
      // For Arbitrum testnets & mainnets
      arbitrumOne: secrets.get("ARBITRUM_API_KEY") || "",
      arbitrumNova: secrets.get("ARBITRUM_API_KEY") || "",
      arbitrumGoerli: secrets.get("ARBITRUM_API_KEY") || "",
      arbitrumSepolia: secrets.get("ARBITRUM_API_KEY") || "",
      // For Avalanche testnet & mainnet
      avalanche: secrets.get("AVALANCHE_API_KEY") || "",
      avalancheFujiTestnet: secrets.get("AVALANCHE_API_KEY") || "",
      // For Moonbeam testnet & mainnets
      moonbeam: secrets.get("MOONBEAM_API_KEY") || "",
      moonriver: secrets.get("MOONBEAM_API_KEY") || "",
      moonbaseAlpha: secrets.get("MOONBEAM_API_KEY") || "",
      // For Harmony testnet & mainnet
      harmony: secrets.get("HARMONY_API_KEY") || "",
      harmonyTest: secrets.get("HARMONY_API_KEY") || "",
      // For Aurora testnet & mainnet
      aurora: secrets.get("AURORA_API_KEY") || "",
      auroraTestnet: secrets.get("AURORA_API_KEY") || "",
      // For Cronos testnet & mainnet
      cronos: secrets.get("CRONOS_API_KEY") || "",
      cronosTestnet: secrets.get("CRONOS_API_KEY") || "",
      // For Gnosis/xDai testnets & mainnets
      gnosis: secrets.get("GNOSIS_API_KEY") || "",
      xdai: secrets.get("GNOSIS_API_KEY") || "",
      sokol: secrets.get("GNOSIS_API_KEY") || "",
      chiado: secrets.get("GNOSIS_API_KEY") || "",
      // For Fuse testnet & mainnet
      fuse: secrets.get("FUSE_API_KEY") || "",
      spark: secrets.get("FUSE_API_KEY") || "",
      // For Evmos testnet & mainnet
      evmos: secrets.get("EVMOS_API_KEY") || "",
      evmosTestnet: secrets.get("EVMOS_API_KEY") || "",
      // For Boba network testnet & mainnet
      boba: secrets.get("BOBA_API_KEY") || "",
      bobaTestnet: secrets.get("BOBA_API_KEY") || "",
      // For Canto testnet & mainnet
      canto: secrets.get("CANTO_API_KEY") || "",
      cantoTestnet: secrets.get("CANTO_API_KEY") || "",
      // For Base testnet & mainnet
      base: secrets.get("BASE_API_KEY") || "",
      baseTestnet: secrets.get("BASE_API_KEY") || "",
      // For Mantle testnet & mainnet
      mantle: secrets.get("MANTLE_API_KEY") || "",
      mantleTestnet: secrets.get("MANTLE_API_KEY") || "",
      // For Scroll testnet
      scrollTestnet: secrets.get("SCROLL_API_KEY") || "",
      // For Linea testnet & mainnet
      linea: secrets.get("LINEA_API_KEY") || "",
      lineaTestnet: secrets.get("LINEA_API_KEY") || "",
      // For ShimmerEVM testnet
      shimmerEVMTestnet: secrets.get("SHIMMEREVM_API_KEY") || "",
      // For Zora testnet & mainnet
      zora: secrets.get("ZORA_API_KEY") || "",
      zoraTestnet: secrets.get("ZORA_API_KEY") || "",
      // For Lukso testnet & mainnet
      lukso: secrets.get("LUKSO_API_KEY") || "",
      luksoTestnet: secrets.get("LUKSO_API_KEY") || "",
      // For Manta testnet & mainnet
      manta: secrets.get("MANTA_API_KEY") || "",
      mantaTestnet: secrets.get("MANTA_API_KEY") || "",
      // For Arthera testnet
      artheraTestnet: secrets.get("ARTHERA_API_KEY") || "",
    },
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          apiURL: "https://gnosis-chiado.blockscout.com/api",
          browserURL: "https://gnosis-chiado.blockscout.com",
        },
      },
      {
        network: "cronos",
        chainId: 25,
        urls: {
          apiURL: "https://api.cronoscan.com/api",
          browserURL: "https://cronoscan.com",
        },
      },
      {
        network: "cronosTestnet",
        chainId: 338,
        urls: {
          apiURL: "https://cronos.org/explorer/testnet3/api",
          browserURL: "https://cronos.org/explorer/testnet3",
        },
      },
      {
        network: "fuse",
        chainId: 122,
        urls: {
          apiURL: "https://explorer.fuse.io/api",
          browserURL: "https://explorer.fuse.io",
        },
      },
      {
        network: "spark",
        chainId: 123,
        urls: {
          apiURL: "https://explorer.fusespark.io/api",
          browserURL: "https://explorer.fusespark.io",
        },
      },
      {
        network: "evmos",
        chainId: 9001,
        urls: {
          apiURL: "https://escan.live/api",
          browserURL: "https://escan.live",
        },
      },
      {
        network: "evmosTestnet",
        chainId: 9000,
        urls: {
          apiURL: "https://testnet.escan.live/api",
          browserURL: "https://testnet.escan.live",
        },
      },
      {
        network: "boba",
        chainId: 288,
        urls: {
          apiURL: "https://api.bobascan.com/api",
          browserURL: "https://bobascan.com",
        },
      },
      {
        network: "bobaTestnet",
        chainId: 2888,
        urls: {
          apiURL: "https://api-testnet.bobascan.com/api",
          browserURL: "https://testnet.bobascan.com",
        },
      },
      {
        network: "arbitrumNova",
        chainId: 42170,
        urls: {
          apiURL: "https://api-nova.arbiscan.io/api",
          browserURL: "https://nova.arbiscan.io",
        },
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://sepolia-explorer.arbitrum.io/api",
          browserURL: "https://sepolia-explorer.arbitrum.io",
        },
      },
      {
        network: "canto",
        chainId: 7700,
        urls: {
          apiURL: "https://tuber.build/api",
          browserURL: "https://tuber.build",
        },
      },
      {
        network: "cantoTestnet",
        chainId: 7701,
        urls: {
          apiURL: "https://testnet.tuber.build/api",
          browserURL: "https://testnet.tuber.build",
        },
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseTestnet",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
      {
        network: "mantle",
        chainId: 5000,
        urls: {
          apiURL: "https://explorer.mantle.xyz/api",
          browserURL: "https://explorer.mantle.xyz",
        },
      },
      {
        network: "mantleTestnet",
        chainId: 5001,
        urls: {
          apiURL: "https://explorer.testnet.mantle.xyz/api",
          browserURL: "https://explorer.testnet.mantle.xyz",
        },
      },
      {
        network: "scrollTestnet",
        chainId: 534353,
        urls: {
          apiURL: "https://blockscout.scroll.io/api",
          browserURL: "https://blockscout.scroll.io",
        },
      },
      {
        network: "polygonZkEVM",
        chainId: 1101,
        urls: {
          apiURL: "https://api-zkevm.polygonscan.com/api",
          browserURL: "https://zkevm.polygonscan.com",
        },
      },
      {
        network: "polygonZkEVMTestnet",
        chainId: 1442,
        urls: {
          apiURL: "https://api-testnet-zkevm.polygonscan.com/api",
          browserURL: "https://testnet-zkevm.polygonscan.com",
        },
      },
      {
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build",
        },
      },
      {
        network: "lineaTestnet",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build",
        },
      },
      {
        network: "shimmerEVMTestnet",
        chainId: 1071,
        urls: {
          apiURL: "https://explorer.evm.testnet.shimmer.network/api",
          browserURL: "https://explorer.evm.testnet.shimmer.network",
        },
      },
      {
        network: "zora",
        chainId: 7777777,
        urls: {
          apiURL: "https://explorer.zora.energy/api",
          browserURL: "https://explorer.zora.energy",
        },
      },
      {
        network: "zoraTestnet",
        chainId: 999,
        urls: {
          apiURL: "https://testnet.explorer.zora.energy/api",
          browserURL: "https://testnet.explorer.zora.energy",
        },
      },
      {
        network: "lukso",
        chainId: 42,
        urls: {
          apiURL: "https://explorer.execution.mainnet.lukso.network/api",
          browserURL: "https://explorer.execution.mainnet.lukso.network",
        },
      },
      {
        network: "luksoTestnet",
        chainId: 4201,
        urls: {
          apiURL: "https://explorer.execution.testnet.lukso.network/api",
          browserURL: "https://explorer.execution.testnet.lukso.network",
        },
      },
      {
        network: "manta",
        chainId: 169,
        urls: {
          apiURL: "https://pacific-explorer.manta.network/api",
          browserURL: "https://pacific-explorer.manta.network",
        },
      },
      {
        network: "mantaTestnet",
        chainId: 3441005,
        urls: {
          apiURL: "https://pacific-explorer.testnet.manta.network/api",
          browserURL: "https://pacific-explorer.testnet.manta.network",
        },
      },
      {
        network: "artheraTestnet",
        chainId: 10243,
        urls: {
          apiURL: "https://explorer-test.arthera.net/api",
          browserURL: "https://explorer-test.arthera.net",
        },
      },
    ],
  },
  tenderly: {
    username: "MyAwesomeUsername",
    project: "super-awesome-project",
    forkNetwork: "",
    privateVerification: false,
    deploymentsDir: "deployments_tenderly",
  },
};

export default config;
