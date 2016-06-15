// @flow
import { ContentState } from 'draft-js';
import React, { Component, Element } from 'react';
import { Input, List, ListItem } from 'react-toolbox';

import Icon from './Icon';

import styles from './Autocomplete.scss';

class Autocomplete extends Component {
  static defaultProps = {
    minimumQueryLength: 3,
    maximumSuggestions: 10,
  };

  constructor(props: {
    addIcon: (iconClass: string, outputsTo?: string) => ContentState,
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

  handleBlur() {
    this.setState({ inputHasFocus: false });
  }

  handleFocus() {
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
    this.props.addIcon(event.target.innerText.trim());
  }

  populateSuggestions(searchText: string): void {
    const searchPattern = new RegExp(searchText, 'i');

    this.setState({
      suggestions: this.props.source.filter((icon) => searchPattern.test(icon)),
    });
  }

  renderSuggestions(): Array<Element> {
    let index = 0;
    const totalSuggestions = this.state.suggestions.length;
    const renderedSuggestions = [];

    for (; index < totalSuggestions && index < this.props.maximumSuggestions; index++) {
      const suggestion = this.state.suggestions[index];

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
