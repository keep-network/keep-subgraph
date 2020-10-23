// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class LogMedianPrice extends ethereum.Event {
  get params(): LogMedianPrice__Params {
    return new LogMedianPrice__Params(this);
  }
}

export class LogMedianPrice__Params {
  _event: LogMedianPrice;

  constructor(event: LogMedianPrice) {
    this._event = event;
  }

  get val(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get age(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class LogNote extends ethereum.Event {
  get params(): LogNote__Params {
    return new LogNote__Params(this);
  }
}

export class LogNote__Params {
  _event: LogNote;

  constructor(event: LogNote) {
    this._event = event;
  }

  get sig(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get usr(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get arg1(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }

  get arg2(): Bytes {
    return this._event.parameters[3].value.toBytes();
  }

  get data(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }
}

export class MedianETHBTC__peekResult {
  value0: BigInt;
  value1: boolean;

  constructor(value0: BigInt, value1: boolean) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromBoolean(this.value1));
    return map;
  }
}

export class MedianETHBTC extends ethereum.SmartContract {
  static bind(address: Address): MedianETHBTC {
    return new MedianETHBTC("MedianETHBTC", address);
  }

  age(): BigInt {
    let result = super.call("age", "age():(uint32)", []);

    return result[0].toBigInt();
  }

  try_age(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("age", "age():(uint32)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  bar(): BigInt {
    let result = super.call("bar", "bar():(uint256)", []);

    return result[0].toBigInt();
  }

  try_bar(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("bar", "bar():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  bud(param0: Address): BigInt {
    let result = super.call("bud", "bud(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_bud(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("bud", "bud(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  orcl(param0: Address): BigInt {
    let result = super.call("orcl", "orcl(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_orcl(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("orcl", "orcl(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  peek(): MedianETHBTC__peekResult {
    let result = super.call("peek", "peek():(uint256,bool)", []);

    return new MedianETHBTC__peekResult(
      result[0].toBigInt(),
      result[1].toBoolean()
    );
  }

  try_peek(): ethereum.CallResult<MedianETHBTC__peekResult> {
    let result = super.tryCall("peek", "peek():(uint256,bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MedianETHBTC__peekResult(value[0].toBigInt(), value[1].toBoolean())
    );
  }

  read(): BigInt {
    let result = super.call("read", "read():(uint256)", []);

    return result[0].toBigInt();
  }

  try_read(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("read", "read():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  slot(param0: i32): Address {
    let result = super.call("slot", "slot(uint8):(address)", [
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0))
    ]);

    return result[0].toAddress();
  }

  try_slot(param0: i32): ethereum.CallResult<Address> {
    let result = super.tryCall("slot", "slot(uint8):(address)", [
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0))
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  wards(param0: Address): BigInt {
    let result = super.call("wards", "wards(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_wards(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("wards", "wards(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  wat(): Bytes {
    let result = super.call("wat", "wat():(bytes32)", []);

    return result[0].toBytes();
  }

  try_wat(): ethereum.CallResult<Bytes> {
    let result = super.tryCall("wat", "wat():(bytes32)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }
}

export class DenyCall extends ethereum.Call {
  get inputs(): DenyCall__Inputs {
    return new DenyCall__Inputs(this);
  }

  get outputs(): DenyCall__Outputs {
    return new DenyCall__Outputs(this);
  }
}

export class DenyCall__Inputs {
  _call: DenyCall;

  constructor(call: DenyCall) {
    this._call = call;
  }

  get usr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class DenyCall__Outputs {
  _call: DenyCall;

  constructor(call: DenyCall) {
    this._call = call;
  }
}

export class DissCall extends ethereum.Call {
  get inputs(): DissCall__Inputs {
    return new DissCall__Inputs(this);
  }

  get outputs(): DissCall__Outputs {
    return new DissCall__Outputs(this);
  }
}

export class DissCall__Inputs {
  _call: DissCall;

  constructor(call: DissCall) {
    this._call = call;
  }

  get a(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class DissCall__Outputs {
  _call: DissCall;

  constructor(call: DissCall) {
    this._call = call;
  }
}

export class Diss1Call extends ethereum.Call {
  get inputs(): Diss1Call__Inputs {
    return new Diss1Call__Inputs(this);
  }

  get outputs(): Diss1Call__Outputs {
    return new Diss1Call__Outputs(this);
  }
}

export class Diss1Call__Inputs {
  _call: Diss1Call;

  constructor(call: Diss1Call) {
    this._call = call;
  }

  get a(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class Diss1Call__Outputs {
  _call: Diss1Call;

  constructor(call: Diss1Call) {
    this._call = call;
  }
}

export class DropCall extends ethereum.Call {
  get inputs(): DropCall__Inputs {
    return new DropCall__Inputs(this);
  }

  get outputs(): DropCall__Outputs {
    return new DropCall__Outputs(this);
  }
}

export class DropCall__Inputs {
  _call: DropCall;

  constructor(call: DropCall) {
    this._call = call;
  }

  get a(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class DropCall__Outputs {
  _call: DropCall;

  constructor(call: DropCall) {
    this._call = call;
  }
}

export class KissCall extends ethereum.Call {
  get inputs(): KissCall__Inputs {
    return new KissCall__Inputs(this);
  }

  get outputs(): KissCall__Outputs {
    return new KissCall__Outputs(this);
  }
}

export class KissCall__Inputs {
  _call: KissCall;

  constructor(call: KissCall) {
    this._call = call;
  }

  get a(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class KissCall__Outputs {
  _call: KissCall;

  constructor(call: KissCall) {
    this._call = call;
  }
}

export class Kiss1Call extends ethereum.Call {
  get inputs(): Kiss1Call__Inputs {
    return new Kiss1Call__Inputs(this);
  }

  get outputs(): Kiss1Call__Outputs {
    return new Kiss1Call__Outputs(this);
  }
}

export class Kiss1Call__Inputs {
  _call: Kiss1Call;

  constructor(call: Kiss1Call) {
    this._call = call;
  }

  get a(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class Kiss1Call__Outputs {
  _call: Kiss1Call;

  constructor(call: Kiss1Call) {
    this._call = call;
  }
}

export class LiftCall extends ethereum.Call {
  get inputs(): LiftCall__Inputs {
    return new LiftCall__Inputs(this);
  }

  get outputs(): LiftCall__Outputs {
    return new LiftCall__Outputs(this);
  }
}

export class LiftCall__Inputs {
  _call: LiftCall;

  constructor(call: LiftCall) {
    this._call = call;
  }

  get a(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class LiftCall__Outputs {
  _call: LiftCall;

  constructor(call: LiftCall) {
    this._call = call;
  }
}

export class PokeCall extends ethereum.Call {
  get inputs(): PokeCall__Inputs {
    return new PokeCall__Inputs(this);
  }

  get outputs(): PokeCall__Outputs {
    return new PokeCall__Outputs(this);
  }
}

export class PokeCall__Inputs {
  _call: PokeCall;

  constructor(call: PokeCall) {
    this._call = call;
  }

  get val_(): Array<BigInt> {
    return this._call.inputValues[0].value.toBigIntArray();
  }

  get age_(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get v(): Array<i32> {
    return this._call.inputValues[2].value.toI32Array();
  }

  get r(): Array<Bytes> {
    return this._call.inputValues[3].value.toBytesArray();
  }

  get s(): Array<Bytes> {
    return this._call.inputValues[4].value.toBytesArray();
  }
}

export class PokeCall__Outputs {
  _call: PokeCall;

  constructor(call: PokeCall) {
    this._call = call;
  }
}

export class RelyCall extends ethereum.Call {
  get inputs(): RelyCall__Inputs {
    return new RelyCall__Inputs(this);
  }

  get outputs(): RelyCall__Outputs {
    return new RelyCall__Outputs(this);
  }
}

export class RelyCall__Inputs {
  _call: RelyCall;

  constructor(call: RelyCall) {
    this._call = call;
  }

  get usr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RelyCall__Outputs {
  _call: RelyCall;

  constructor(call: RelyCall) {
    this._call = call;
  }
}

export class SetBarCall extends ethereum.Call {
  get inputs(): SetBarCall__Inputs {
    return new SetBarCall__Inputs(this);
  }

  get outputs(): SetBarCall__Outputs {
    return new SetBarCall__Outputs(this);
  }
}

export class SetBarCall__Inputs {
  _call: SetBarCall;

  constructor(call: SetBarCall) {
    this._call = call;
  }

  get bar_(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetBarCall__Outputs {
  _call: SetBarCall;

  constructor(call: SetBarCall) {
    this._call = call;
  }
}
