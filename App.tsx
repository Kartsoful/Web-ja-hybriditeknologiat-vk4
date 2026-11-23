import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Task } from "./types/task";
import { useEffect, useState } from "react";
import Row from "./components/Row";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const initList = async () => {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTaskList(JSON.parse(storedTasks));
      }
    };
    initList();
  }, []);

  const addTodo = async () => {
    if (!input.trim() || !taskList) return;

    const newTask: Task = {
      id: taskList.length > 0 ? taskList[taskList.length - 1].id + 1 : 1,
      text: input.trim(),
      completed: 0,
    };

    const updatedTaskList = [...taskList, newTask];
    setTaskList(updatedTaskList);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTaskList));

    setInput("");
    // console.log("Adding");
  };

  const handlePress = async (item: Task) => {
    if (!taskList) return;
    const newCompleted = item.completed === 0 ? 1 : 0;
    const updatedTaskList = taskList.map((task) => {
      if (task.id === item.id) {
        return { ...task, completed: newCompleted };
      }
      return task;
    });
    setTaskList(updatedTaskList);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTaskList));

    // console.log("´newCompleted", newCompleted);
    // console.log("Updating", item);
  };

  const removeTodo = async (item: Task) => {
    if (!taskList) return;
    const updatedTaskList = taskList.filter((task) => task.id !== item.id);
    setTaskList(updatedTaskList);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTaskList));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Todo List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            placeholder="Add new task"
            onChangeText={setInput}
            onSubmitEditing={addTodo}
          />
          <Pressable style={styles.button} onPress={addTodo}>
            <Text>Add</Text>
          </Pressable>
        </View>
      </View>
      <FlatList<Task>
        data={taskList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Row item={item} onPress={handlePress} remove={removeTodo} />}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  list: {
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderColor: "#c1c0c0",
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    padding: 8,
  },
  button: {
    backgroundColor: "#c1c0c0",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
});
