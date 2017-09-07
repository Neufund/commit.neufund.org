import * as React from "react";
import { iconStyle, textStyle } from "./TextCopyable.scss";

interface ITextCopyableProps {
  text: string;
  maxTextLength?: number;
}

const clickHandler = (text: string) => {
  return () => {
    window.alert(`imagine your text ${text} has been copied to clipboard`);
  };
};

// TODO: rename variables
const shortenText = (text: string, length: number) => {
  const breakPoint = Math.floor(length / 2);
  const beginOfText = text.substring(0, breakPoint);
  const endOfText = text.substring(text.length - (length - breakPoint));
  return beginOfText + "\u2026" + endOfText;
};

export const TextCopyable: React.SFC<ITextCopyableProps> = ({ text, maxTextLength }) => {
  let display_text = text;
  if (maxTextLength !== undefined && display_text.length > maxTextLength) {
    display_text = shortenText(display_text, maxTextLength);
  }

  return (
    <span className={textStyle}>
      <i className={`material-icons ${iconStyle}`} onClick={clickHandler(text)}>
        content_copy
      </i>
      {display_text}
    </span>
  );
};
