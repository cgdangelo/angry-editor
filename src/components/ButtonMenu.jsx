// @flow
import classnames from 'classnames';
import React, { Component, Element } from 'react';
import { Button, FontIcon, Menu } from 'react-toolbox';

import styles from './ButtonMenu.scss';

class ButtonMenu extends Component {
  constructor(props: {
    children?: Array<Element>,
    className?: string,
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

  handleMenuButtonClick: (
    event: SyntheticEvent,
    value: any,
    originalEvent: Event,
  ) => void;

  handleMenuHide: () => void;

  handleMenuButtonClick(): void {
    this.setState({ isActive: !this.state.isActive });
  }

  handleMenuHide(): void {
    this.setState({ isActive: false });
  }

  render(): Element {
    const { children, className, onSelect, title } = this.props;

    return (
      <div className={classnames(styles.buttonMenu, className)}>
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

export default ButtonMenu;
