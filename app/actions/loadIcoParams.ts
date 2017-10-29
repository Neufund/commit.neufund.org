import { ThunkAction } from "redux-thunk";
import { IAppState } from "../reducers";
import { loadIcoParamsFromContract } from "../web3/loadIcoParamsFromContract";
import { IcoPhase, LOAD_ICO_PARAMS } from "./constants";

export function loadIcoParamsAction(
  commitmentState: IcoPhase,
  startingDate: string,
  finishDate: string,
  minTicketWei: string,
  euroDecimals: number,
  ethDecimals: number
) {
  return {
    type: LOAD_ICO_PARAMS,
    payload: {
      commitmentState,
      startingDate,
      finishDate,
      minTicketWei,
      euroDecimals,
      ethDecimals,
    },
  };
}

export const loadIcoParams: ThunkAction<{}, IAppState, {}> = async dispatch => {
  const {
    commitmentState,
    startingDate,
    finishDate,
    minTicketWei,
    euroDecimals,
    ethDecimals,
  } = await loadIcoParamsFromContract();
  dispatch(
    loadIcoParamsAction(
      commitmentState,
      startingDate,
      finishDate,
      minTicketWei,
      euroDecimals.toNumber(),
      ethDecimals.toNumber()
    )
  );
};
