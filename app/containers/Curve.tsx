import * as React from "react";
import { Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setEstimatedRewardAction } from "../actions/submitFunds";
import CurveChart, { getPrice } from "../components/CurveChart";
import PriceCalculator from "../components/PriceCalculator";
import { IAppState } from "../reducers/index";

export const Curve = (props: any) => {
  const currencyRate: number = 0.0038119801;
  const initialReward: number = 6.5;
  const capNEU: number = 1500000000;

  const min: number = 0;
  const max: number = 1000000;
  const dotsNumber: number = 50;
  const currentRasiedEther: number = 0;

  return (
    <Row>
      <Col md={12}>
        <h2>Rules</h2>
      </Col>
      <Col md={5}>
        <PriceCalculator
          estimatedReward={parseFloat(props.commitmentState.estimatedReward)}
          calculateEstimatedReward={() => {
            // tslint:disable-next-line
            if (
              typeof props.form.commitFunds.values === "undefined" ||
              typeof props.form.commitFunds.values.ethAmount === "undefined"
            ) {
              return;
            }
            if (isNaN(props.form.commitFunds.values.ethAmount)) {
              return;
            }

            const price = getPrice(
              currencyRate,
              initialReward,
              capNEU,
              props.form.commitFunds.values.ethAmount
            );
            props.setEstimatedRewardAction(price);
            return price;
          }}
          loadingEstimatedReward={props.commitmentState.loadingEstimatedReward}
        />
      </Col>

      <Col mdOffset={1} md={5}>
        <CurveChart
          currencyRate={currencyRate}
          initialReward={initialReward}
          capNEU={capNEU}
          min={min}
          max={max}
          dotsNumber={dotsNumber}
          currentRasiedEther={currentRasiedEther}
        />
      </Col>
    </Row>
  );
};

function mapStateToProps(state: IAppState) {
  return {
    form: state.form,
    commitmentState: state.commitmentState,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    setEstimatedRewardAction: (price: number) =>
      dispatch(setEstimatedRewardAction(price.toFixed(2))),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Curve as any);
