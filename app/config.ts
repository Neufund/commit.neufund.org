import * as invariant from "invariant";
import * as moment from "moment";
import { AppState } from "./actions/constants";

interface IConfig {
  appState: AppState;
  announcedCfg?: IAnnouncedCfg;
  contractsDeployed?: IContractsDeployedIcoCfg;
}

interface IAnnouncedCfg {
  startingDate: moment.Moment;
}

export enum CommitmentType {
  WHITELISTED = "WHITELISTED",
  PUBLIC = "PUBLIC",
}

interface IContractsDeployedIcoCfg {
  commitmentContractAddress: string;
  rpcProvider: string;
  commitmentType: CommitmentType;
  gasLimit: string;
  gasPrice: string;
  ipfsNode: string;
  pdfRenderer: string;
  numberOfConfirmations: number;
  maxNumberBlocksToWait: number;
  defaultDerivationPath: string;
}

export function getRequiredValue(obj: any, key: string): string {
  if (obj[key] === undefined) {
    throw new Error(`'${key}' doesn't exist in .env file`);
  }
  return obj[key];
}

function loadConfig(environment: object): IConfig {
  // do not evaluate config during tests
  if (process.env.NODE_ENV === "test") {
    return {} as any;
  }
  const appState = getRequiredValue(environment, "APP_STATE") as AppState;

  switch (appState) {
    case AppState.BEFORE_ANNOUNCEMENT:
      return {
        appState,
      };
    case AppState.ANNOUNCED:
      const startingDate = moment(
        getRequiredValue(environment, "ANNOUNCED_ICO_START_DATE"),
        moment.ISO_8601
      );

      invariant(
        startingDate.isValid(),
        "ANNOUNCED_ICO_START_DATE is not correctly formatted ISO string"
      );

      return {
        appState,
        announcedCfg: {
          startingDate,
        },
      };
    case AppState.CONTRACTS_DEPLOYED: {
      return {
        appState,
        contractsDeployed: {
          commitmentContractAddress: getRequiredValue(environment, "COMMITMENT_CONTRACT_ADDRESS"),
          rpcProvider: getRequiredValue(environment, "RPC_PROVIDER"),
          commitmentType: getRequiredValue(environment, "COMMITMENT_TYPE") as CommitmentType,
          gasPrice: getRequiredValue(environment, "GAS_PRICE"),
          gasLimit: getRequiredValue(environment, "GAS_LIMIT"),
          ipfsNode: "https://ipfs.io/",
          pdfRenderer: getRequiredValue(environment, "PDF_RENDERER"),
          numberOfConfirmations: 3, // TODO: this should react on type of network for dev value should be 1
          maxNumberBlocksToWait: 5,
          defaultDerivationPath: getRequiredValue(environment, "DEFAULT_DERIVATION_PATH"),
        },
      };
    }
    default:
      throw new Error("Unrecognized ico state!");
  }
}

export default loadConfig(process.env);
