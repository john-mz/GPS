import { View } from 'react-native';
import { ThemedText } from '@/presentation/components/shared/ThemedText';
import { usePermissionsStore } from '@/presentation/stores/usePermissionsStore';
import ThemedPressable from '@/presentation/components/shared/ThemedPressable';

const PermissionsScreen = () => {
    <View
        style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}    
    >
        <ThemedPressable onPress={requestLocationPermission}>
            Habilitar ubicación
        </ThemedPressable>

        <ThemedText>Estado actual: {locationStatus}</ThemedText>
    </View>
};