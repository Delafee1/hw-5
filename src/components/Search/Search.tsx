import React from "react";

import Input from "components/Input";
import cn from "classnames";

import styles from "./Search.module.scss";

export type SearchProps = React.FormHTMLAttributes<HTMLFormElement>;

const Search: React.FC<SearchProps> = ({
  onSubmit,
  className,
  ...props
}: SearchProps) => {
  return (
    <form onSubmit={onSubmit} className={cn(className, styles.form)} {...props}>
      <Input placeholder={"Search"} className={styles.form__input} />
      <label className={styles.form__icon}>
        <input type="submit" value="" className={styles.form__submit} />
      </label>
    </form>
  );
};

export default Search;
