import * as cn from "classnames";
import * as moment from "moment";
import * as React from "react";
import * as zeroFill from "zero-fill";
import * as styles from "./Countdown.scss";

const numberFormatter = zeroFill(2);

const SECOND = 1000;

interface ICountdownClassNamesProps {
  root?: string;
  label?: string;
  value?: string;
}

interface ICountdownComponentProps {
  duration: moment.Duration;
  classNames?: ICountdownClassNamesProps;
}

// @todo this component should be more style agnostic (no <strong> )
export const CountdownComponent = ({ duration, classNames = {} }: ICountdownComponentProps) => {
  const labelClassNames = cn(styles.label, classNames.label);
  const valueClassNames = cn(styles.value, classNames.value);

  return (
    <span className={cn(styles.countdown, classNames.root)}>
      <strong className={valueClassNames} data-test-id="countdown-days">
        {numberFormatter(Math.floor(duration.asDays()))}
      </strong>
      <span className={labelClassNames}>d</span>

      <strong className={valueClassNames} data-test-id="countdown-hours">
        {numberFormatter(duration.hours())}
      </strong>
      <span className={labelClassNames}>h</span>

      <strong className={valueClassNames} data-test-id="countdown-minutes">
        {numberFormatter(duration.minutes())}
      </strong>
      <span className={labelClassNames}>m</span>

      <strong className={valueClassNames} data-test-id="countdown-seconds">
        {numberFormatter(duration.seconds())}
      </strong>
      <span className={labelClassNames}>s</span>
    </span>
  );
};

interface ICountdownProps {
  finishDate: moment.Moment;
  onFinish?: () => void;
  classNames?: ICountdownClassNamesProps;
}

interface ICountdownState {
  duration: moment.Duration;
  callbackCalled: boolean;
  timerID: number;
}

export class Countdown extends React.Component<ICountdownProps, ICountdownState> {
  constructor(props: ICountdownProps) {
    super(props);

    const duration = this.calculateDuration();
    this.state = {
      duration,
      timerID: null,
      callbackCalled: this.callCallbackWhenNeeded(duration),
    };
  }

  public componentDidMount() {
    const timerID = window.setInterval(() => {
      const duration = this.calculateDuration();
      this.setState({
        ...this.state,
        duration,
        callbackCalled: this.state.callbackCalled || this.callCallbackWhenNeeded(duration),
      });
    }, SECOND);

    this.setState({
      ...this.state,
      timerID,
    });
  }

  public componentWillUnmount() {
    clearInterval(this.state.timerID);
  }

  public render() {
    const { duration } = this.state;
    const { classNames } = this.props;

    return <CountdownComponent duration={duration} classNames={classNames} />;
  }

  private calculateDuration() {
    const finishDate = this.props.finishDate;
    const now = moment();
    const duration = moment.duration(finishDate.diff(now));

    // do not display negative dates
    if (duration.asSeconds() < 0) {
      return moment.duration(0);
    }

    return duration;
  }

  private callCallbackWhenNeeded(duration: moment.Duration): boolean {
    if (duration.asSeconds() === 0) {
      if (this.props.onFinish) {
        this.props.onFinish();
      }

      return true;
    }
    return false;
  }
}
