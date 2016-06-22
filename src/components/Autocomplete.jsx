// @flow
import { ContentState } from 'draft-js';
import React, { Component, Element } from 'react';
import { Input, List, ListItem } from 'react-toolbox';

import Icon from './Icon';

import styles from './Autocomplete.scss';

class Autocomplete extends Component {
  static defaultProps = {
    disabled: false,
    minimumQueryLength: 3,
    maximumSuggestions: 10,
  };

  constructor(props: {
    addIcon: (iconClass: string, outputsTo: string) => ContentState,
    disabled: boolean,
    minimumQueryLength: number,
    maximumSuggestions: number,
    source: Array<string>,
  }) {
    super(props);

    this.state = {
      inputHasFocus: false,
      suggestions: [],
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSuggestionSelect = this.handleSuggestionSelect.bind(this);
  }

  state: {
    inputHasFocus: boolean,
    suggestions: Array<string>,
  };

  handleBlur: () => void;
  handleFocus: () => void;
  handleChange: (value: string) => void;
  handleSuggestionSelect: (event: Event) => void;

  handleBlur(): void {
    this.setState({ inputHasFocus: false });
  }

  handleFocus(): void {
    this.setState({ inputHasFocus: true });
  }

  handleChange(value: string): void {
    if (value.length >= this.props.minimumQueryLength) {
      this.populateSuggestions(value);
    } else {
      this.setState({ suggestions: [] });
    }
  }

  handleSuggestionSelect(event: Event): void {
    if (event.target instanceof HTMLElement) {
      this.props.addIcon(event.target.innerHTML.trim());
    }
  }

  populateSuggestions(searchText: string): void {
    const searchPattern: RegExp = new RegExp(searchText, 'i');

    this.setState({
      suggestions: this.props.source.filter((icon: string): boolean => searchPattern.test(icon)),
    });
  }

  renderSuggestions(): Array<Element> {
    let index = 0;
    const totalSuggestions: number = this.state.suggestions.length;
    const renderedSuggestions: Array<string> = [];

    for (; index < totalSuggestions && index < this.props.maximumSuggestions; index++) {
      const suggestion: string = this.state.suggestions[index];

      renderedSuggestions.push(
        <ListItem
          caption={suggestion}
          key={index}
          leftIcon={<Icon iconClass={suggestion} />}
          onClick={this.handleSuggestionSelect}
        />
      );
    }

    return renderedSuggestions.length > 0 ? (
      <List
        ripple
        selectable
        className={styles.suggestionsList}
      >
        {renderedSuggestions}
      </List>
    ) : [];
  }

  render(): Element {
    return (
      <div className={styles.iconSearch}>
        <Input
          disabled={this.props.disabled}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          placeholder="Search for icon"
          theme={{ input: styles.searchInput }}
        />

        <div className={styles.suggestionsContainer}>
          {this.renderSuggestions()}
        </div>
      </div>
    );
  }
}

export default Autocomplete;
