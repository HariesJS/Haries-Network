import { TouchableOpacity, TouchableNativeFeedback, Platform } from "react-native";

export const Wrapper = Platform.OS === 'ios' 
? TouchableOpacity : TouchableNativeFeedback;