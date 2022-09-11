import React from "react";

import styles from "./ErrorMessage.module.scss";

type ErrorMessageProps = {
  errorText: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  errorText,
}: ErrorMessageProps) => {
  return (
    <div className={styles.errormessage}>
      <span className={styles.errormessage__cross}/>
      <div className={styles.errormessage__text}>{errorText}</div>
    </div>
  );
};

export default ErrorMessage;
