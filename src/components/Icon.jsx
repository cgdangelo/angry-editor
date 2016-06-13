// @flow
import classnames from 'classnames';
import { Entity } from 'draft-js';
import React, { Component, Element } from 'react';

import styles from './Icon.scss';

const Icon = ({
  children,
  className,
  iconClass,
}: {
  children?: Array<Component>,
  className?: string,
  iconClass: string,
}): Element => (
  <span
    className={classnames(styles.icon, className)}
    style={{ backgroundImage: `url(/static/icons/${iconClass}.png)` }}
  >
    {children}
  </span>
);

Icon.fromEntity = ({
  entityKey,
  ...otherProps,
}: {
  entityKey: string,
  otherProps: any,
}): Element => {
  const { iconClass } = Entity.get(entityKey).getData();

  return <Icon {...otherProps} iconClass={iconClass} />;
};

export default Icon;
