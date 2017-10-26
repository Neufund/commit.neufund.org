export const LOAD_ICO_PARAMS = "LOAD_ICO_PARAMS";

export const NEW_PHASE_ACTION = "NEW_PHASE";

export enum AppState {
  BEFORE_ANNOUNCEMENT = "BEFORE_ANNOUNCEMENT", // concrete date of ICO is not known, no contracts are deployed
  ANNOUNCED = "ANNOUNCED", // concrete date of ICO is known, but still no contracts on blockchain. Starting date is provided in env
  CONTRACTS_DEPLOYED = "CONTRACTS_DEPLOYED", // contracts are deployed. Get all data from blockchain and set exact phase based on the
}

// NOTE: this doesn't comply with enums expected by smartcontracts
export enum IcoPhase {
  BEFORE = "BEFORE",
  DURING = "DURING",
  AFTER = "AFTER",
}

export enum Web3Type {
  INJECTED = "INJECTED",
  LEDGER = "LEDGER",
}

export enum EthNetwork {
  DEV = 0,
  MAINNET = 1,
  MORDEN = 2,
  ROPSTEN = 3,
  RIKENBY = 4,
  KOVAN = 42,
}

export const LOAD_ICO_STATS = "LOAD_ICO_STATS";
export const LOAD_BEFORE_ICO_DETAILS = "LOAD_BEFORE_ICO_DETAILS";
export const LOADING_DURING_ICO_DETAILS = "LOAD_DURING_ICO_DETAILS";
export const SET_DURING_ICO_DETAILS = "SET_DURING_ICO_DETAILS";

export const SET_USER_ACCOUNT = "SET_USER_ACCOUNT";
export const SET_LOADING_USER_ACCOUNT = "SET_LOADING_USER_ACCOUNT";

export const COMMITTING_STARTED = "COMITTING_STARTED";
export const COMMITTING_TRANSACTION_SUBMITTED = "COMMITTING_TRANSACTION_SUBMITTED";
export const COMMITTING_TRANSACTION_MINED = "COMMITTING_TRANSACTION_MINED";
export const COMMITTING_DONE = "COMMITTING_DONE";
export const COMMITTING_ERROR = "COMMITTING_ERROR";
export const COMMITTING_NEW_BLOCK = "COMMITTING_NEW_BLOCK";

export const LOAD_ESTIMATED_REWARD = "LOAD_ESTIMATED_REWARD";
export const SET_ESTIMATED_REWARD = "SET_ESTIMATED_REWARD";

export const LOAD_AFTERMATH = "LOAD_AFTERMATH";
export const SET_AFTERMATH = "SET_AFTERMATH";

export const SET_LEGAL_AGREEMENTS_ACCEPTED = "SET_LEGAL_AGREEMENTS_ACCEPTED";
export const SET_LEGAL_AGREEMENTS = "SET_LEGAL_AGREEMENTS";

export const SET_WEB3_TYPE = "SET_WEB3_TYPE";
export const SET_DERIVATION_PATH = "SET_DERIVATION_PATH";

export const SET_ETH_NETWORK = "SET_ETH_NETWORK";
