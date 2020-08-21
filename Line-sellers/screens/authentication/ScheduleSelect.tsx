import React, { useState, useCallback, FunctionComponent } from "react";

import DateTimePicker from "@react-native-community/datetimepicker";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import PrimaryText from "../../assets/styling/PrimaryText";
import { colors } from "../../assets/styling/ConstantStyles";

import DaySelector from "../../components/DaySelector";

import { DayInterface } from "../../typescript/Interfaces";
import { ScheduleSelectProps } from "../../typescript/Types";

const ScheduleSelect: FunctionComponent<ScheduleSelectProps> = ({
  navigation,
  route,
}) => {
  const [showTimePicker1, setShowTimePicker1] = useState(false);
  const [showTimePicker2, setShowTimePicker2] = useState(false);

  const [time1, setTime1] = useState<Date | null>(null);
  const [time2, setTime2] = useState<Date | null>(null);

  const [dayList, setDayList] = useState<string[]>([]);

  const show1 = () => {
    setShowTimePicker1(true);
  };

  const show2 = () => {
    setShowTimePicker2(true);
  };

  const handleTimePick1 = (_event, selectedTime: Date) => {
    setShowTimePicker1(false);
    if (selectedTime !== undefined) {
      setTime1(selectedTime);
    }
  };

  const handleTimePick2 = (_event, selectedTime: Date) => {
    setShowTimePicker2(false);
    if (selectedTime !== undefined) {
      setTime2(selectedTime);
    }
  };

  const convertDate = (date: Date): Date => {
    let timeZoneAwareDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes()
      )
    );
    return timeZoneAwareDate;
  };
  const simplifyDays = (days: DayInterface[]): string[] => {
    let simplifiedArray = [];
    days.map((day: DayInterface) => {
      simplifiedArray.push(day.day);
    });
    return simplifiedArray;
  };

  return (
    <View>
      <View style={styles.container}>
        <PrimaryText style={styles.title} variant={"bold"}>
          You'll recieve customers in these hours:
        </PrimaryText>
        <View style={styles.cardHolder}>
          <View style={styles.card}>
            <View style={styles.timeHelper}>
              <PrimaryText style={styles.centeredText} variant={"bold"}>
                From
              </PrimaryText>
            </View>
            {time1 && (
              <TouchableOpacity onPress={show1}>
                <View style={styles.timeSelected}>
                  <PrimaryText style={styles.timeSelectedIndicator}>
                    {`${time1?.getHours()}:${
                      time1.getMinutes() < 10
                        ? "0" + time1.getMinutes()
                        : time1.getMinutes()
                    }`}
                  </PrimaryText>
                </View>
              </TouchableOpacity>
            )}
            {!time1 && (
              <TouchableOpacity style={styles.clockEdit} onPress={show1}>
                <PrimaryText style={styles.timePlaceholder}>--:--</PrimaryText>
              </TouchableOpacity>
            )}
            {showTimePicker1 && (
              <DateTimePicker
                value={new Date()}
                testID="dateTimePicker"
                mode={"time"}
                is24Hour={true}
                display="default"
                onChange={handleTimePick1}
              />
            )}
          </View>
          <PrimaryText style={styles.hyphen}>-</PrimaryText>
          <View style={styles.card}>
            <View style={styles.timeHelper}>
              <PrimaryText style={styles.centeredText} variant={"bold"}>
                To
              </PrimaryText>
            </View>
            {time2 && (
              <TouchableOpacity onPress={show2}>
                <View style={styles.timeSelected}>
                  <PrimaryText style={{ ...styles.centeredText, fontSize: 36 }}>
                    {`${time2?.getHours()}:${
                      time2.getMinutes() < 10
                        ? "0" + time2.getMinutes()
                        : time2.getMinutes()
                    }`}
                  </PrimaryText>
                </View>
              </TouchableOpacity>
            )}
            {!time2 && (
              <TouchableOpacity style={styles.clockEdit} onPress={show2}>
                <PrimaryText style={styles.timePlaceholder}>--:--</PrimaryText>
              </TouchableOpacity>
            )}
            {showTimePicker2 && (
              <DateTimePicker
                value={new Date()}
                testID="dateTimePicker"
                mode={"time"}
                is24Hour={true}
                display="default"
                onChange={handleTimePick2}
              />
            )}
          </View>
        </View>
        {time2?.getTime() < time1?.getTime() && (
          <PrimaryText style={styles.invalidMsg}>
            Please select a valid time spectrum
          </PrimaryText>
        )}
        <PrimaryText style={{ margin: 5 }} variant={"bold"}>
          {" "}
          Days:{" "}
        </PrimaryText>
        <View style={styles.card}>
          <DaySelector
            onChange={useCallback((days) => {
              setDayList(simplifyDays(days));
            }, [])}
          />
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        {!(time2?.getTime() < time1?.getTime()) &&
        time1 &&
        time2 &&
        dayList.length > 0 ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("AuthRegisterStore", {
                username: route.params?.username,
                password: route.params?.password,
                latitude: route.params?.latitude,
                longitude: route.params?.longitude,
                days: dayList,
                openingTime: convertDate(time1),
                closingTime: convertDate(time2),
              });
            }}
          >
            <PrimaryText style={styles.registerBtnText} variant={"bold"}>
              REGISTER
            </PrimaryText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.disabledButton} disabled={true}>
            <PrimaryText style={styles.registerBtnText} variant={"bold"}>
              REGISTER
            </PrimaryText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "88%",
    justifyContent: "center",
    paddingTop: 15,
    alignItems: "center",
  },
  clockEdit: {
    padding: 7,
  },
  title: {
    fontSize: 20,
    margin: 22,
    textAlign: "center",
  },
  hyphen: {
    fontSize: 36,
    margin: 7,
  },
  centeredText: {
    textAlign: "center",
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: colors.lightBlue,
    padding: 7,
    margin: 15,
    borderRadius: 15,
  },
  disabledButton: {
    alignSelf: "flex-end",
    backgroundColor: colors.lightGray,
    padding: 7,
    margin: 15,
    borderRadius: 15,
  },
  buttonWrapper: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: 15,
  },
  card: {
    flexDirection: "row",
    justifyContent: "center",
    minWidth: "35%",
    backgroundColor: colors.iceWhite,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHolder: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeHelper: {
    justifyContent: "center",
    position: "absolute",
    marginTop: 5,
  },
  timeSelected: {
    alignItems: "center",
    justifyContent: "center",
  },
  timeSelectedIndicator: {
    textAlign: "center",
    fontSize: 36,
  },
  timePlaceholder: {
    fontSize: 36,
    letterSpacing: 2,
    textAlign: "center",
  },
  editIcon: {
    right: 3,
    top: 3,
    position: "absolute",
  },
  invalidMsg: {
    color: colors.warning,
  },
  registerBtnText: {
    color: colors.iceWhite,
    padding: 3,
  },
});

export default ScheduleSelect;
