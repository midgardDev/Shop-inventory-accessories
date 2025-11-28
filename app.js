import { useEffect } from "react";
import { Text, View } from 'react-native';
import { initDatabase } from './src/database/db';

export default function App() {
    useEffect(() => {
        console.log("Testing database creation...");
        initDatabase();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Testing Database Creation...</Text>
        </View>
    );
}