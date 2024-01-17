import React, { Component } from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { StyleSheet } from "react-native";

class NoRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View styles={styles.container}>
        <Text>No Record to display!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NoRecord;
