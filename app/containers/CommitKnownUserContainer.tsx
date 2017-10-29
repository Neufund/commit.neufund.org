import { BigNumber } from "bignumber.js";
import { debounce } from "lodash";
import * as React from "react";
import { Col, Grid, Row } from "react-bootstrap";
import { connect, Dispatch } from "react-redux";
import { Web3Type } from "../actions/constants";
import { calculateEstimatedReward, submitFunds } from "../actions/submitFunds";
import { CommitHeaderComponent } from "../components/commitfunds/CommitHeaderComponent";
import { CommitKnownUser } from "../components/commitfunds/CommitKnownUser";
import { ICommitKnownUserFormValues } from "../components/commitfunds/CommitKnownUserForm";
import { CommitNavbar } from "../components/commitfunds/CommitNavbar";
import { TransactionConfirmationModal } from "../components/commitfunds/TransactionConfirmationModal";
import LegalModal from "../components/LegalModal";
import config from "../config";
import CommitKnownUserAftermathContainer from "../containers/CommitKnownUserAftermathContainer";
import {
  selectEstimatedReward,
  selectEstimatedRewardLoadingState,
  selectMinTicketWei,
} from "../reducers/commitmentState";
import { IAppState } from "../reducers/index";
import { selectBalance } from "../reducers/userState";
import { publicCommitment } from "../web3//contracts/ContractsRepository";
import * as layoutStyle from "./CommitLayoutStyles.scss";

interface ICommitKnownUserContainer {
  userAddress: string;
  contractAddress: string;
  transactionPayload: string;
  minTicketWei: BigNumber;
  calculateEstimatedRewardAction?: () => {};
  estimatedReward: BigNumber;
  loadingEstimatedReward: boolean;
  submitFundsAction: (values: ICommitKnownUserFormValues) => {};
  txStarted: boolean;
  txHash: string;
  blockOfConfirmation: number;
  currentBlock: number;
  error: string;
  balance: BigNumber;
  web3Provider: Web3Type;
}

export const CommitKnownUserContainer: React.SFC<ICommitKnownUserContainer> = ({
  userAddress,
  contractAddress,
  transactionPayload,
  submitFundsAction,
  minTicketWei,
  calculateEstimatedRewardAction,
  loadingEstimatedReward,
  estimatedReward,
  txStarted,
  txHash,
  blockOfConfirmation,
  currentBlock,
  error,
  balance,
  web3Provider,
}) => {
  return (
    <div>
      <LegalModal />
      <TransactionConfirmationModal
        txStarted={txStarted}
        txHash={txHash}
        blockOfConfirmation={blockOfConfirmation}
        currentBlock={currentBlock}
        error={error}
      />
      <CommitNavbar>Commit funds in Neufund Commitment Opportunity</CommitNavbar>
      <Grid>
        <Row>
          <Col xs={12} className={layoutStyle.contentContainer}>
            <CommitHeaderComponent number="01" title="Commit funds" />
            <CommitKnownUser
              userAddress={userAddress}
              contractAddress={contractAddress}
              transactionPayload={transactionPayload}
              calculateEstimatedReward={calculateEstimatedRewardAction}
              submitFunds={submitFundsAction}
              minTicketWei={minTicketWei}
              estimatedReward={estimatedReward}
              loadingEstimatedReward={loadingEstimatedReward}
              balance={balance}
              web3Provider={web3Provider}
            />
            <Row>
              <Col xs={12}>
                <hr className={layoutStyle.separator} />
              </Col>
            </Row>
            <CommitHeaderComponent number="02" title="After math" />
            <CommitKnownUserAftermathContainer userAddress={userAddress} />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  userAddress: state.userState.address,
  contractAddress: config.contractsDeployed.commitmentContractAddress,
  transactionPayload: publicCommitment.rawWeb3Contract.commit.getData(),
  minTicketWei: selectMinTicketWei(state.commitmentState),
  estimatedReward: selectEstimatedReward(state.commitmentState),
  loadingEstimatedReward: selectEstimatedRewardLoadingState(state.commitmentState),
  txStarted: state.transactionState.txStarted,
  txHash: state.transactionState.txHash,
  blockOfConfirmation: state.transactionState.blockOfConfirmation,
  currentBlock: state.transactionState.currentBlock,
  error: state.transactionState.error,
  balance: selectBalance(state.userState),
  web3Provider: state.web3State.web3Type,
});

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    submitFundsAction: (values: ICommitKnownUserFormValues) =>
      dispatch(submitFunds(values.ethAmount)),
    calculateEstimatedRewardAction: debounce(
      () => dispatch(calculateEstimatedReward) as () => {},
      300
    ) as () => {},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommitKnownUserContainer);
