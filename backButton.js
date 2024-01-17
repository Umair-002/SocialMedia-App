import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

class BackButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.props.handleGoBack()}>
        <Ionicons
          style={this.props.styling || styles.backIcon}
          name="arrow-back"
          size={34}
          color="black"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  backIcon: {
    position: "relative",
    right: "11px",
    top: "9px",
  },
});

export default BackButton;
