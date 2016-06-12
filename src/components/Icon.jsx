// @flow
import { Entity } from 'draft-js';
import React, { Component, Element } from 'react';

export default function Icon(
  { children, entityKey }: { children: Array<Component>, entityKey: string }
): Element {
  const { iconClass } = Entity.get(entityKey).getData();

  return (
    <span
      className={iconClass}
      style={{
        background: `url(/static/icons/${iconClass}.png) no-repeat top left`,
        backgroundSize: 'contain',
        display: 'inline-block',
        color: 'transparent',
        height: '18px',
        width: '18px',
      }}
    >
      {children}
    </span>
  );
}
