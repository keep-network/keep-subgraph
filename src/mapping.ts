import {
  Created,
  StartedLiquidation,
  CourtesyCalled,
  Liquidated,
  RedemptionRequested,
  GotRedemptionSignature,
  Redeemed,
  Funded,
  RegisteredPubkey,
  SetupFailed,
} from "../generated/TBTCSystem/TBTCSystem";
import { log, BigInt, Address, ethereum } from "@graphprotocol/graph-ts";
import { Transfer as TDTTransfer } from "../generated/TBTCDepositToken/TBTCDepositToken";
import { DepositContract as DepositSmartContract } from "../generated/templates/DepositContract/DepositContract";
import { BondedECDSAKeep as KeepSmartContract } from "../generated/templates/BondedECDSAKeep/BondedECDSAKeep";
import { BondedECDSAKeep as BondedECDSAKeepTemplate } from "../generated/templates";
import {
  Deposit,
  BondedECDSAKeep,
  KeepMember,
  DepositLiquidation,
  DepositRedemption,
  TBTCDepositToken,
  LogEntry,
} from "../generated/schema";


// Wild-card re-export compiles but then does not find the functions at runtime.
export {handleLotSizesUpdateStarted} from './mappingGovernance';
export {handleLotSizesUpdated} from './mappingGovernance';
export {handleKeepFactoriesUpdateStarted} from './mappingGovernance';
export {handleKeepFactoriesUpdated} from './mappingGovernance';


const DPL = 'dpl-';
const DPR = 'dpr-';
const DP = 'dp-';


/**
 * As the id of the deposit we use the address of the generated deposit contract. Keep itself uses the
 * token id encoded for that address. We can therefore determine the ID of a deposit through either the
 * token id, or through the contract address.
 */
function getDepositIdFromAddress(address: Address): string {
  return DP+address.toHexString();
}
function getDepositIdFromTokenID(tokenID: BigInt): string {
  return DP + getDepositTokenIdFromTokenID(tokenID);
}


function getDepositTokenIdFromTokenID(tokenID: BigInt): string {
  // A simple toHexString() does not work, as a leading 0 would often be not included, which would make
  // the id returned not match the deposit contract address used by Keep.
  // See also: https://github.com/graphprotocol/graph-ts/issues/16
  return ("0x" + tokenID.toHexString().slice(2).padStart(40, '0'))
}
function getDepositTokenIdFromDepositAddress(address: Address): string {
  return address.toHexString();
}


function getOrCreateDeposit(depositID: string): Deposit {
  let deposit = Deposit.load(depositID);
  if (deposit == null) {
    deposit = new Deposit(depositID);
  }
  return <Deposit>deposit;
}

export function handleCreatedEvent(event: Created): void {
  let contractAddress = event.params._depositContractAddress;
  let keepAddress = event.params._keepAddress;
  
  let deposit = getOrCreateDeposit(getDepositIdFromAddress(contractAddress));
  deposit.tbtcSystem = event.address;
  deposit.contractAddress = contractAddress;
  deposit.currentState = "AWAITING_SIGNER_SETUP";
  deposit.keepAddress = event.params._keepAddress;
  deposit.createdAt = event.block.timestamp;
  deposit.tdtToken = getDepositTokenIdFromDepositAddress(contractAddress)

  // this indexes the newly created contract address for events
  BondedECDSAKeepTemplate.create(keepAddress);

  updateDepositDetails(deposit, contractAddress, event.block);

  let bondedECDSAKeep = newBondedECDSAKeep(deposit, keepAddress);
  deposit.bondedECDSAKeep = bondedECDSAKeep.id;
  deposit.save();

  createLogEntry(event, deposit.id, "deposit was created")
}

function setDepositState(contractAddress: Address, newState: string): void {
  let deposit = Deposit.load(getDepositIdFromAddress(contractAddress));
  deposit!.currentState = newState;
  deposit!.save();
}

function updateDepositDetails(
  deposit: Deposit,
  contractAddress: Address,
  block: ethereum.Block
): Deposit {
  // we backfill the deposit contract's data by querying the ethereum smart contract
  let depositSmartContract = DepositSmartContract.bind(contractAddress);

  deposit.lotSizeSatoshis = depositSmartContract.lotSizeSatoshis();
  deposit.initialCollateralizedPercent = depositSmartContract.initialCollateralizedPercent();
  deposit.undercollateralizedThresholdPercent = depositSmartContract.undercollateralizedThresholdPercent();
  deposit.severelyUndercollateralizedThresholdPercent = depositSmartContract.severelyUndercollateralizedThresholdPercent();
  deposit.signerFee = depositSmartContract.signerFeeTbtc();

  let utxoValue = depositSmartContract.try_utxoValue();
  deposit.utxoSize = utxoValue.reverted ? new BigInt(0) : utxoValue.value;
  deposit.endOfTerm = depositSmartContract.remainingTerm().plus(block.timestamp);
  let auctionValue = depositSmartContract.try_auctionValue();
  deposit.auctionValue = auctionValue.reverted ? new BigInt(0) : auctionValue.value; 
  deposit.collateralizationPercent = depositSmartContract
    .collateralizationPercentage()
    .toI32();

  return deposit;
}

function getOrCreateKeepMember(keeperAddress: Address): KeepMember {
  let member = KeepMember.load(keeperAddress.toHexString());
  if (member == null) {
    member = new KeepMember(keeperAddress.toHexString());
    member.address = keeperAddress;
    member.save();
  }
  return <KeepMember>member;
}

function newBondedECDSAKeep(
  deposit: Deposit,
  keepAddress: Address
): BondedECDSAKeep {
  let contract = KeepSmartContract.bind(keepAddress);

  let bondedECDSAKeep = new BondedECDSAKeep(keepAddress.toHexString());
  bondedECDSAKeep.deposit = deposit.id;
  bondedECDSAKeep.keepAddress = keepAddress;
  bondedECDSAKeep.publicKey = contract.getPublicKey();
  bondedECDSAKeep.totalBondAmount = contract.checkBondAmount();
  bondedECDSAKeep.status = "ACTIVE";
  bondedECDSAKeep.honestThreshold = contract.honestThreshold().toI32();

  let members: string[] = [];
  let memberAddresses = contract.getMembers();
  for (let i = 0; i < memberAddresses.length; i++) {
    let memberAddress = memberAddresses[i];
    let keepMember = getOrCreateKeepMember(memberAddress);
    members.push(keepMember.id);
  }
  bondedECDSAKeep.members = members;
  bondedECDSAKeep.save();

  return bondedECDSAKeep;
}


export function handleStartedLiquidationEvent(event: StartedLiquidation): void {
  let contractAddress = event.params._depositContractAddress;
  let depositLiquidation = new DepositLiquidation(DPL+contractAddress.toHexString());
  let deposit = Deposit.load(getDepositIdFromAddress(contractAddress))!;

  depositLiquidation.deposit = deposit.id;
  depositLiquidation.isLiquidated = false;
  depositLiquidation.wasFraud = event.params._wasFraud;
  depositLiquidation.liquidationInitiated = event.block.timestamp;
  depositLiquidation.initiateTxhash = event.transaction.hash;
  depositLiquidation.liquidationInitiator = event.transaction.from;
  depositLiquidation.save();

  deposit.depositLiquidation = depositLiquidation.id;
  deposit.save();

  if (event.params._wasFraud) {
    setDepositState(contractAddress, "FRAUD_LIQUIDATION_IN_PROGRESS");
  } else {
    setDepositState(contractAddress, "LIQUIDATION_IN_PROGRESS");
  }

  createLogEntry(event, getDepositIdFromAddress(event.params._depositContractAddress), "liquidation is now in progress")
}

export function handleCourtesyCalledEvent(event: CourtesyCalled): void {
  let contractAddress = event.params._depositContractAddress;
  let depositLiquidation = DepositLiquidation.load(DPL+contractAddress.toHexString())!;
  depositLiquidation.courtesyCallInitiated = event.block.timestamp;
  depositLiquidation.save();

  setDepositState(contractAddress, "COURTESY_CALL");
  createLogEntry(event, getDepositIdFromAddress(event.params._depositContractAddress), "Deposit courtesy called")
}

export function handleLiquidatedEvent(event: Liquidated): void {
  let contractAddress = event.params._depositContractAddress;
  let depositLiquidation = DepositLiquidation.load(DPL+contractAddress.toHexString())!;
  depositLiquidation.liquidatedAt = event.block.timestamp;
  depositLiquidation.isLiquidated = true;
  depositLiquidation.save();

  setDepositState(contractAddress, "LIQUIDATED");
  createLogEntry(event, getDepositIdFromAddress(event.params._depositContractAddress), "Deposit liquidated")
}

export function handleRedemptionRequestedEvent(
  event: RedemptionRequested
): void {
  let contractAddress = event.params._depositContractAddress;
  let depositRedemption = new DepositRedemption(DPR+contractAddress.toHexString());
  let deposit = Deposit.load(getDepositIdFromAddress(contractAddress))!;

  depositRedemption.deposit = deposit.id;
  depositRedemption.redeemerOutputScript = event.params._redeemerOutputScript;
  depositRedemption.requestedFee = event.params._requestedFee;
  depositRedemption.withdrawalRequestAt = event.block.timestamp;
  depositRedemption.lastRequestedDigest = event.params._digest;
  depositRedemption.outpoint = event.params._outpoint;
  depositRedemption.utxoSize = event.params._utxoValue;
  depositRedemption.save();

  setDepositState(contractAddress, "AWAITING_WITHDRAWAL_SIGNATURE");
  createLogEntry(event, getDepositIdFromAddress(event.params._depositContractAddress), "Deposit redemption was requested")
}

export function handleGotRedemptionSignatureEvent(
  event: GotRedemptionSignature
): void {
  setDepositState(event.params._depositContractAddress, "AWAITING_WITHDRAWAL_SIGNATURE");
  createLogEntry(event, getDepositIdFromAddress(event.params._depositContractAddress), "Deposit redemption signature received")
}

export function handleRedeemedEvent(event: Redeemed): void {
  let contractAddress = event.params._depositContractAddress;
  let deposit = Deposit.load(getDepositIdFromAddress(contractAddress))!;
  setDepositState(contractAddress, "REDEEMED");

  let depositRedemption = DepositRedemption.load(DPR+contractAddress.toHexString())!;
  depositRedemption.txid = event.params._txid;
  depositRedemption.redeemedAt = event.block.timestamp;
  depositRedemption.save();

  let keep = BondedECDSAKeep.load(deposit.keepAddress!.toHexString())!;
  keep.status = "CLOSED";
  keep.save();

  createLogEntry(event, getDepositIdFromAddress(event.params._depositContractAddress), "Deposit was redeemed.")
}

function createLogEntry(event: ethereum.Event, depositId: string, message: string): void {
  let entry = new LogEntry(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entry.deposit = depositId;
  entry.message = message;
  entry.transactionHash = event.transaction.hash.toHexString()
  entry.timestamp = event.block.timestamp;

  entry.save()
}

export function handleFundedEvent(event: Funded): void {
  setDepositState(event.params._depositContractAddress, "ACTIVE");
  createLogEntry(event, getDepositIdFromAddress(event.params._depositContractAddress), "Deposit was funded.")
}

export function handleRegisteredPubkey(event: RegisteredPubkey): void {
  setDepositState(event.params._depositContractAddress, "AWAITING_BTC_FUNDING_PROOF");
  createLogEntry(event, getDepositIdFromAddress(event.params._depositContractAddress), "Signers submitted a bitcoin address (and presumably bonded their stake)")
}


export function handleSetupFailedEvent(event: SetupFailed): void {
  setDepositState(event.params._depositContractAddress, "FAILED_SETUP");
  createLogEntry(event, getDepositIdFromAddress(event.params._depositContractAddress), "Setup failed (why?)")
}


const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * TDT token.
 */
export function handleMintTBTCDepositToken(event: TDTTransfer): void {
  let tokenId = getDepositTokenIdFromTokenID(event.params.tokenId);

  // A mint
  if (event.params.from.toHexString() == ZERO_ADDRESS) {
    let depositToken = new TBTCDepositToken(tokenId);
    depositToken.deposit = getDepositIdFromTokenID(event.params.tokenId);
    depositToken.tokenID = event.params.tokenId;
    depositToken.owner = event.params.to;
    depositToken.minter = event.params.to;
    depositToken.mintedAt = event.block.timestamp;
    depositToken.save();
  } else {
    let depositToken = new TBTCDepositToken(tokenId);
    depositToken.owner = event.params.to;
    depositToken.save()
  }
}