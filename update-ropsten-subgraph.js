const Web3 = require("web3")
const HDWalletProvider = require("@truffle/hdwallet-provider")
const nunjucks = require('nunjucks');
const fs = require('fs');

const { readFileSync } = require("fs")
const { resolve } = require("path")

const contractOwnerProvider = new HDWalletProvider(
  process.env.CONTRACT_OWNER_ETH_ACCOUNT_PRIVATE_KEY,
  process.env.ETH_RPC_URL
)

const networkID = 3 // Ropsten
const keepCorePackageName = "@keep-network/keep-core"
const keepEcdsaPackageName = "@keep-network/keep-ecdsa"
const keepTbtcPackageName = "@keep-network/tbtc"

const web3 = new Web3(contractOwnerProvider)

let ropstenVars

// This is for ropsten network only
async function readDeployedArtifacts() {

  const getDeploymentBlockNumber = async function (artifact, contractName) {
    if (!artifact.networks[networkID].address) {
      throw new Error(
        `missing block number for network ${networkID} in ${contractName}`
      )
    }
    const transaction = await web3.eth.getTransaction(artifact.networks[networkID].transactionHash)
  
    return transaction.blockNumber
  }

  const getDeploymentContractAddress = async function (artifact, contractName) {
    if (!artifact.networks[networkID].address) {
      throw new Error(
        `missing address for network ${networkID} in ${contractName}`
      )
    }
  
    return artifact.networks[networkID].address
  }

  async function getExternalContractArtifact(
    packageName,
    contractName,
  ) {
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
  
    return artifact
  }

  // tbtc contracts
  const TBTCDepositTokenContractName = "TBTCDepositToken"
  const TBTCDepositTokenArtifact = await getExternalContractArtifact(keepTbtcPackageName, TBTCDepositTokenContractName)
  const TBTCDepositToken = {
    'address': await getDeploymentContractAddress(TBTCDepositTokenArtifact, TBTCDepositTokenContractName),
    'startBlock': await getDeploymentBlockNumber(TBTCDepositTokenArtifact, TBTCDepositTokenContractName)
  }

  const TBTCTokenContractName = "TBTCToken"
  const TBTCTokenArtifact = await getExternalContractArtifact(keepTbtcPackageName, TBTCTokenContractName)
  const TBTCToken = {
    'address': await getDeploymentContractAddress(TBTCTokenArtifact, TBTCTokenContractName),
    'startBlock': await getDeploymentBlockNumber(TBTCTokenArtifact, TBTCTokenContractName)
  }

  const TBTCSystemContractName = "TBTCSystem"
  const TBTCSystemArtifact = await getExternalContractArtifact(keepTbtcPackageName, TBTCSystemContractName)
  const TBTCSystem = {
    'address': await getDeploymentContractAddress(TBTCSystemArtifact, TBTCSystemContractName),
    'startBlock': await getDeploymentBlockNumber(TBTCSystemArtifact, TBTCSystemContractName)
  }

  // keep-ecdsa contracts
  const KeepBondingContractName = "KeepBonding"
  const KeepBondingArtifact = await getExternalContractArtifact(keepEcdsaPackageName, KeepBondingContractName)
  const KeepBonding = {
    'address': await getDeploymentContractAddress(KeepBondingArtifact, KeepBondingContractName),
    'startBlock': await getDeploymentBlockNumber(KeepBondingArtifact, KeepBondingContractName)
  }

  // keep-core contracts
  const KeepRandomBeaconOperatorContractName = "KeepRandomBeaconOperator"
  const KeepRandomBeaconOperatorArtifact = await getExternalContractArtifact(keepCorePackageName, KeepRandomBeaconOperatorContractName)
  const KeepRandomBeaconOperator = {
    'address': await getDeploymentContractAddress(KeepRandomBeaconOperatorArtifact, KeepRandomBeaconOperatorContractName),
    'startBlock': await getDeploymentBlockNumber(KeepRandomBeaconOperatorArtifact, KeepRandomBeaconOperatorContractName)
  }

  const KeepRandomBeaconServiceContractName = "KeepRandomBeaconService"
  const KeepRandomBeaconServiceArtifact = await getExternalContractArtifact(keepCorePackageName, KeepRandomBeaconServiceContractName)
  const KeepRandomBeaconService = {
    'address': await getDeploymentContractAddress(KeepRandomBeaconServiceArtifact, KeepRandomBeaconServiceContractName),
    'startBlock': await getDeploymentBlockNumber(KeepRandomBeaconServiceArtifact, KeepRandomBeaconServiceContractName)
  }

  const ManagedGrantFactoryContractName = "ManagedGrantFactory"
  const ManagedGrantFactoryArtifact = await getExternalContractArtifact(keepCorePackageName, ManagedGrantFactoryContractName)
  const ManagedGrantFactory = {
    'address': await getDeploymentContractAddress(ManagedGrantFactoryArtifact, ManagedGrantFactoryContractName),
    'startBlock': await getDeploymentBlockNumber(ManagedGrantFactoryArtifact, ManagedGrantFactoryContractName)
  }

  const StakingPortBackerContractName = "StakingPortBacker"
  const StakingPortBackerArtifact = await getExternalContractArtifact(keepCorePackageName, StakingPortBackerContractName)
  const StakingPortBacker = {
    'address': await getDeploymentContractAddress(StakingPortBackerArtifact, StakingPortBackerContractName),
    'startBlock': await getDeploymentBlockNumber(StakingPortBackerArtifact, StakingPortBackerContractName)
  }

  const TokenStakingContractName = "TokenStaking"
  const TokenStakingArtifact = await getExternalContractArtifact(keepCorePackageName, TokenStakingContractName)
  const TokenStaking = {
    'address': await getDeploymentContractAddress(TokenStakingArtifact, TokenStakingContractName),
    'startBlock': await getDeploymentBlockNumber(TokenStakingArtifact, TokenStakingContractName)
  }

  const TokenGrantContractName = "TokenGrant"
  const TokenGrantArtifact = await getExternalContractArtifact(keepCorePackageName, TokenGrantContractName)
  const TokenGrant = {
    'address': await getDeploymentContractAddress(TokenGrantArtifact, TokenGrantContractName),
    'startBlock': await getDeploymentBlockNumber(TokenGrantArtifact, TokenGrantContractName)
  }

  const TokenStakingEscrowContractName = "TokenStakingEscrow"
  const TokenStakingEscrowArtifact = await getExternalContractArtifact(keepCorePackageName, TokenStakingEscrowContractName)
  const TokenStakingEscrow = {
    'address': await getDeploymentContractAddress(TokenStakingEscrowArtifact, TokenStakingEscrowContractName),
    'startBlock': await getDeploymentBlockNumber(TokenStakingEscrowArtifact, TokenStakingEscrowContractName)
  }


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
