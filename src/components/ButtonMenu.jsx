// @flow
import React, { Component, Element } from 'react';
import { Button, FontIcon, Menu } from 'react-toolbox';

import styles from './ButtonMenu.scss';

export default class ButtonMenu extends Component {
  constructor(props: {
    children?: Array<Element>,
    onSelect?: (value: any) => void,
    title: string,
  }) {
    super(props);

    this.state = {
      isActive: false,
    };

    this.handleMenuButtonClick = this.handleMenuButtonClick.bind(this);
    this.handleMenuHide = this.handleMenuHide.bind(this);
  }

  state: {
    isActive: boolean,
  }

  handleMenuButtonClick: (event: SyntheticEvent, value: any, originalEvent: Event) => void;
  handleMenuHide: () => void;

  handleMenuButtonClick(): void {
    this.setState({ isActive: !this.state.isActive });
  }

  handleMenuHide(): void {
    this.setState({ isActive: false });
  }

  render(): Element {
    const { children, onSelect, title } = this.props;

    return (
      <div className={styles.buttonMenu}>
        <Button onClick={this.handleMenuButtonClick}>
          <FontIcon value="arrow_drop_down" /> {title}
        </Button>

        <Menu
          active={this.state.isActive}
          onHide={this.handleMenuHide}
          onSelect={onSelect}
          position="auto"
        >
          {children}
        </Menu>
      </div>
    );
  }
}
