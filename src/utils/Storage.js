import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
        return true
    } catch (error) {
        return false
        // Error saving data
    }
}

export const retrieveData = async (key) => {
    try {
        const res = await AsyncStorage.getItem(key);
        return res
    } catch (error) {
        return false
        // Error retrieving data
    }
}

export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
        return true;
    }
    catch (exception) {
        return false;
    }
}