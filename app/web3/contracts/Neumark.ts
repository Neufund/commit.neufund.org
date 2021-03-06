import { BigNumber } from "bignumber.js";

import { MissingContractError } from "../../errors";
import { promisify } from "../utils";
import * as NeumarkAbiJson from "./Neumark.abi.json";

class Contract {
  public static async createAndValidate(web3: any, address: string): Promise<Contract> {
    const contract = new Contract(web3, address);
    if (process.env.NODE_ENV === "production") {
      return contract;
    }
    const code = await promisify(web3.eth.getCode, [address]);
    if (code === "0x0") {
      throw new MissingContractError("Neumark", address);
    }
    return contract;
  }

  public readonly rawWeb3Contract: any;

  public constructor(web3: any, public readonly address: string) {
    this.rawWeb3Contract = web3.eth.contract(NeumarkAbiJson).at(address);
  }

  public get totalSupply(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.totalSupply, []);
  }

  public get totalEuroUlps(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.totalEuroUlps, []);
  }

  public get decimals(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.decimals, []);
  }

  public currentAgreement(): Promise<[BigNumber, BigNumber, string, BigNumber]> {
    return promisify(this.rawWeb3Contract.currentAgreement, []);
  }

  public balanceOf(address: string): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.balanceOf, [address]);
  }
}

export default Contract;
