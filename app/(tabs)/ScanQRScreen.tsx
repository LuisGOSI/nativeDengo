import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/services/AuthContext"


type Props = {
    navigation: any;
};

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ScanQRScreen({ navigation }: Props) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [BarCodeScannerComp, setBarCodeScannerComp] = useState<any>(null);
    const [scannerError, setScannerError] = useState<string | null>(null);

    const { user, loading } = useAuth();

    useEffect(() => {
        // Dynamically import the native module at runtime so route preloading
        // (which runs in a Node environment) doesn't try to load native code.
        (async () => {
            try {
                const mod = await import('expo-barcode-scanner');

                // Defensive checks: if native module isn't available (e.g. running in
                // Expo Go that doesn't include this native module), report friendly error
                if (!mod || !mod.BarCodeScanner || typeof mod.BarCodeScanner.requestPermissionsAsync !== 'function') {
                    console.warn('Barcode scanner native module is not available in this runtime.', mod);
                    setScannerError('El módulo nativo del escáner no está disponible en esta versión de Expo Go. Usa un development build o instala la aplicación en un dispositivo nativo.');
                    setHasPermission(false);
                    return;
                }

                setBarCodeScannerComp(() => mod.BarCodeScanner);
                const { status } = await mod.BarCodeScanner.requestPermissionsAsync();
                setHasPermission(status === 'granted');
            } catch (err) {
                console.error('Failed to load barcode scanner native module', err);
                setScannerError(String(err));
                setHasPermission(false);
            }
        })();
    }, []);

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        setScanned(true);
        try {
            const qrData = JSON.parse(data);
            console.log('QR leído:', qrData);

            if (!user) {
                Alert.alert('Error', 'No hay usuario autenticado.');
                return;
            }

            const res = await fetch(`${backendUrl}api/puntos/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idUsuario: user.id,
                    puntos: qrData.puntos,
                }),
            });

            const json = await res.json();
            if (json.success) {
                Alert.alert('🎉 Puntos añadidos', `Has ganado ${qrData.puntos} puntos.`);
                navigation.goBack();
            } else {
                Alert.alert('Error', 'No se pudieron registrar los puntos');
            }
        } catch (e: unknown) {  // 👈 added type
            console.error(e);
            Alert.alert('Error', 'QR inválido o datos corruptos');
        }
    };

    if (hasPermission === null) {
        return <Text>Solicitando permisos de cámara...</Text>;
    }
    if (hasPermission === false) {
        return <Text>No se tiene acceso a la cámara</Text>;
    }

    // BarCodeScannerComp will be null until the dynamic import finishes.
    if (scannerError) {
        return (
            <View style={styles.container}>
                <Text style={{ padding: 12, textAlign: 'center' }}>
                    {scannerError}
                </Text>
                <Text style={{ padding: 12, textAlign: 'center' }}>
                    Sugerencia: crea un development build con expo-dev-client o usa EAS Build para probar funcionalidades nativas.
                </Text>
            </View>
        );
    }

    if (!BarCodeScannerComp) {
        return <Text>Cargando escáner...</Text>;
    }

    const Scanner = BarCodeScannerComp;
    return (
        <View style={styles.container}>
            <Scanner
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            {scanned && (
                <Button title="Escanear otro QR" onPress={() => setScanned(false)} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
