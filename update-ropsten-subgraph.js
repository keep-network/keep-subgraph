const Web3 = require("web3")
const HDWalletProvider = require("@truffle/hdwallet-provider")
const nunjucks = require('nunjucks');
const fs = require('fs');

const { readFileSync } = require("fs")
const { resolve } = require("path")

const networkID = 3 // Ropsten
const keepCorePackageName = "@keep-network/keep-core"
const keepEcdsaPackageName = "@keep-network/keep-ecdsa"
const keepTbtcPackageName = "@keep-network/tbtc"

const web3 = new Web3(process.env.ETH_RPC_URL)

let ropstenVars

// This is for ropsten network only
async function readDeployedArtifacts() {

  async function getContractData(packageName, contractName) {
    let artifactRaw
    try {
      artifactRaw = readFileSync(
        resolve(`./node_modules/${packageName}/artifacts/${contractName}.json`)
      )
    } catch (err) {
      throw new Error(`failed to read artifact file: ${err.message}`)
    }

    let artifact
    try {
      artifact = JSON.parse(artifactRaw)
    } catch (err) {
      throw new Error(`failed to parse artifact file: ${err.message}`)
    }

    if (!artifact.networks[networkID]) {
      throw new Error(
        `configuration for network ${networkID} not found in ${contractName}`
      )
    }

    if (!artifact.networks[networkID].address) {
      throw new Error(
        `missing address for network ${networkID} in ${contractName}`
      )
    }

    if (!artifact.networks[networkID].transactionHash) {
      throw new Error(
        `missing transactionHash for network ${networkID} in ${contractName}`
      )
    }

    const deployTransaction = await web3.eth.getTransaction(
      artifact.networks[networkID].transactionHash
    )

    return {
      address: artifact.networks[networkID].address,
      startBlock: deployTransaction.blockNumber,
    }
  }
  
  // tbtc contracts
  const TBTCDepositToken = await getContractData(keepTbtcPackageName, "TBTCDepositToken")

  const TBTCToken = await getContractData(keepTbtcPackageName, "TBTCToken")

  const TBTCSystem = await getContractData(keepTbtcPackageName, "TBTCSystem")

  // keep-ecdsa contracts
  const KeepBonding = await getContractData(keepEcdsaPackageName, "KeepBonding")

  // keep-core contracts
  const KeepRandomBeaconOperator = await getContractData(keepCorePackageName, "KeepRandomBeaconOperator")

  const KeepRandomBeaconService = await getContractData(keepCorePackageName, "KeepRandomBeaconService")

  const ManagedGrantFactory = await getContractData(keepCorePackageName, "ManagedGrantFactory")

  const StakingPortBacker = await getContractData(keepCorePackageName, "StakingPortBacker")

  const TokenStaking = await getContractData(keepCorePackageName, "TokenStaking")

  const TokenGrant = await getContractData(keepCorePackageName, "TokenGrant")

  const TokenStakingEscrow = await getContractData(keepCorePackageName, "TokenStakingEscrow")


  ropstenVars = {
    network: 'ropsten',
    TBTCDepositToken,
    TBTCToken,
    KeepBonding,
    TBTCSystem,
    TokenStaking,
    KeepRandomBeaconOperator,
    KeepRandomBeaconService,
    TokenGrant,
    TokenStakingEscrow,
    ManagedGrantFactory,
    StakingPortBacker,
  }
}

readDeployedArtifacts()
    .then(result => {
        console.log("ropsten yaml updated successfully")

        const templateString = fs.readFileSync('subgraph.template.yaml', 'utf8').toString();
        
        console.log("Writing subgraph.ropsten.yaml")
        fs.writeFileSync('subgraph.ropsten.yaml', nunjucks.renderString(templateString, ropstenVars))

        process.exit(0)
    })
    .catch(error => {
        console.error("error: ", error)

        process.exit(1)
    })
