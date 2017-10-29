import { BigNumber } from "bignumber.js";
import { promisify } from "bluebird";
import { Dispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Web3 from "web3";

import { AppState, EthNetwork } from "../actions/constants";
import { loadUserAccount } from "../actions/loadUserAccount";
import { setWeb3Action } from "../actions/web3";
import config from "../config";
import { IAppState } from "../reducers/index";
import { getNetworkId, getNodeType } from "./utils";

const CHECK_INJECTED_WEB3_INTERVAL = 1000;

export interface IAccountInfo {
  address: string;
  balance: BigNumber;
}

export class Web3Service {
  public static init(dispatch: Dispatch<IAppState>, getState: () => IAppState) {
    Web3Service._instance = new Web3Service(dispatch, getState);
  }

  private static _instance: Web3Service;

  public static get instance() {
    if (!Web3Service._instance) {
      throw new Error("Web3Service in not initialized!");
    }
    return Web3Service._instance;
  }

  public personalWeb3: Web3 | undefined;
  public readonly rawWeb3: Web3;
  public readonly getBlockNumber: () => PromiseLike<number>;
  public readonly getBlock: (blockNumber: string | number) => PromiseLike<{}>;
  public readonly getTransaction: (tx: string) => PromiseLike<any>;
  public readonly getBalance: (address: string) => PromiseLike<BigNumber>;
  private injectingFailed: boolean = false;
  private injectWeb3PollId: number;

  private constructor(private dispatch: Dispatch<IAppState>, private getState: () => IAppState) {
    if (config.appState !== AppState.CONTRACTS_DEPLOYED) {
      return;
    }

    this.rawWeb3 = new Web3(new Web3.providers.HttpProvider(config.contractsDeployed.rpcProvider));

    this.getBlockNumber = promisify(this.rawWeb3.eth.getBlockNumber);
    this.getBlock = promisify(this.rawWeb3.eth.getBlock);
    this.getTransaction = promisify<any, string>(this.rawWeb3.eth.getTransaction);
    this.getBalance = promisify<BigNumber, string>(this.rawWeb3.eth.getBalance);
  }

  public hasPersonalWeb3(): boolean {
    return this.personalWeb3 !== undefined;
  }

  public async accountAddress(): Promise<string> {
    if (!this.hasPersonalWeb3()) {
      return;
    }
    const getAccounts = promisify(this.personalWeb3.eth.getAccounts);
    const accounts = (await getAccounts()) as string[];
    return accounts[0];
  }

  public async injectWeb3IfAvailable() {
    await this.injectWeb3();
    this.injectWeb3PollId = window.setInterval(this.injectWeb3, CHECK_INJECTED_WEB3_INTERVAL);
  }

  private injectWeb3 = async () => {
    const newInjectedWeb3 = (window as any).web3;
    if (typeof newInjectedWeb3 === "undefined" || newInjectedWeb3 === this.personalWeb3) {
      return;
    }
    const newWeb3 = new Web3(newInjectedWeb3.currentProvider);

    const internalWeb3NetworkId = await getNetworkId(this.rawWeb3);
    const personalWeb3NetworkId = await getNetworkId(newWeb3);
    if (internalWeb3NetworkId !== personalWeb3NetworkId) {
      if (!this.injectingFailed) {
        toast.error(
          `Your injected web3 instance is connected to: ${EthNetwork[
            personalWeb3NetworkId
          ]} network!`
        );
      }
      this.injectingFailed = true;
      return;
    }
    this.injectingFailed = false;

    const injectedType = await getNodeType(newWeb3);
    this.dispatch(setWeb3Action(injectedType));

    this.personalWeb3 = newWeb3;
    window.clearInterval(this.injectWeb3PollId);
    window.setInterval(() => this.checkAccounts(), CHECK_INJECTED_WEB3_INTERVAL);
  };

  private async checkAccounts() {
    const account = await this.accountAddress();

    const currentAccount = this.getState().userState.address;

    if (account && account !== currentAccount) {
      return this.dispatch(loadUserAccount);
    }
  }
}
