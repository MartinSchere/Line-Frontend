import React, { Component, FunctionComponent } from "react";

import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import colors from "../assets/styling/Colors";
import PrimaryText from "../assets/styling/PrimaryText";

import { DayInterface } from "../typescript/Interfaces";
import {
  DayProps,
  DaySelectorProps,
  DaySelectorState,
} from "../typescript/Types";

const Day: FunctionComponent<DayProps> = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={props.selected ? styles.buttonActive : styles.button}
    >
      <PrimaryText>{props.day}</PrimaryText>
    </TouchableOpacity>
  );
};

export default class DaySelector extends Component<
  DaySelectorProps,
  DaySelectorState
> {
  constructor(props: DaySelectorProps) {
    super(props);
    this.state = {
      selectedItems: [],
      items: [
        {
          selected: false,
          day: "MO",
        },
        {
          selected: false,
          day: "TU",
        },
        {
          selected: false,
          day: "WE",
        },
        {
          selected: false,
          day: "TH",
        },
        {
          selected: false,
          day: "FR",
        },
        {
          selected: false,
          day: "SA",
        },
        {
          selected: false,
          day: "SU",
        },
      ],
    };
  }

  onPress = (index: number): void => {
    let items = [...this.state.items];
    let item = { ...items[index] };
    item.selected = !item.selected;
    items[index] = item;
    this.setState({ items });
    this.setState(
      (prevState) => ({
        selectedItems: prevState.items.filter((i) => i.selected),
      }),
      () => this.props.onChange(this.state.selectedItems)
    );
  };

  render() {
    return (
      <View>
        <View style={styles.container}>
          {this.state.items.map((item, index) => {
            return (
              <Day
                key={index}
                selected={item.selected}
                day={item.day}
                onPress={this.onPress.bind(this, index)}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  button: {
    margin: 5,
    borderColor: colors.lightGray,
    borderWidth: 2,
    borderRadius: 40,
    padding: 7,
  },
  buttonActive: {
    margin: 5,
    borderColor: colors.lightBlue,
    borderWidth: 2,
    backgroundColor: colors.lightBlue,
    borderRadius: 50,
    padding: 7,
  },
});
