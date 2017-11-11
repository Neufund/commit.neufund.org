import * as React from "react";
import { Col, Row } from "react-bootstrap";

import { CommitHeaderComponent } from "../components/commitfunds/CommitHeaderComponent";
import CommitKnownUserAftermathContainer from "../containers/CommitKnownUserAftermathContainer";
import * as layoutStyle from "./CommitLayoutStyles.scss";
import CommitUnknownUserAftermathContainer from "./CommitUnknownUserAftermathContainer";

interface IAfterMathContainerProps {
  params: { address: string };
}

export const AfterMathContainer: React.SFC<IAfterMathContainerProps> = ({ params: { address } }) =>
  <Row>
    <Col xs={12} className={layoutStyle.contentContainer}>
      <CommitHeaderComponent number="04" title="Your commitment status" />
      {address
        ? <CommitKnownUserAftermathContainer address={address} />
        : <CommitUnknownUserAftermathContainer />}
    </Col>
  </Row>;

export default AfterMathContainer;
