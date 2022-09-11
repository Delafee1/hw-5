import React from "react";

import cn from "classnames";

import styles from "./Card.module.scss";

type CardProps = {
  image: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  content?: React.ReactNode;
  onClick?: React.MouseEventHandler;
  className: string;
};

const Card: React.FC<CardProps> = ({
  image,
  title,
  subtitle,
  content,
  className,
  ...props
}: CardProps) => {
  return (
    <div className={cn(styles.card, className)} {...props}>
      <img src={image} alt={image} className={styles.card__image} />
      <h3 className={styles.card__title}>{title}</h3>
      <div className={styles.card__subtitle}>{subtitle}</div>
      <div className={styles.card__footer}>
        <div className={styles.card__footer__content}>{content}</div>
        <span className={styles.card__footer__plus} />
      </div>
    </div>
  );
};

export default Card;
