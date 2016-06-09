import React, { Component } from 'react';

import styles from './EditorPane.css';

export default class EditorPane extends Component {
  constructor() {
    super();

    this.handleInput = ::this.handleInput;
  }

  state = {
    input: '',
    output: '',
  };

  handleInput({ target: { value } }) {
    this.setState({
      input: value,
      output: value.length,
    });
  }

  render() {
    return (
      <div>
        <textarea
          className={styles.textarea}
          onChange={this.handleInput}
          value={this.state.input}
        />

        <textarea
          disabled
          className={styles.textarea}
          value={this.state.output}
        />
      </div>
    );
  }
}
