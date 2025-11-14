import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/services/AuthContext";
import { CameraView, useCameraPermissions } from 'expo-camera';

type Props = {
    navigation: any;
};

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ScanQRScreen({ navigation }: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannerError, setScannerError] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);

    const { user, loading } = useAuth();

    useEffect(() => {
        // Verificar si el módulo de cámara está disponible
        (async () => {
            try {
                // Intentar usar la cámara para detectar si está disponible
                if (!CameraView || typeof CameraView !== 'function') {
                    setScannerError('El módulo de cámara no está disponible en esta versión. Usa un development build o instala la aplicación en un dispositivo nativo.');
                    return;
                }
            } catch (err) {
                console.error('Failed to load camera module', err);
                setScannerError(String(err));
            }
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
        if (scanned) return; // Prevenir múltiples escaneos
        
        setScanned(true);
        try {
            console.log('QR leído:', { type, data });

            if (!user) {
                Alert.alert('Error', 'No hay usuario autenticado.');
                setScanned(false);
                return;
            }

            // Parsear los datos del QR
            let puntos;
            try {
                const qrData = JSON.parse(data);
                puntos = qrData.puntos;
            } catch (parseError) {
                // Si no es JSON, intentar extraer puntos de otra forma
                puntos = parseInt(data);
                if (isNaN(puntos)) {
                    throw new Error('Formato de QR no válido');
                }
            }

            const res = await fetch(`${backendUrl}api/puntos/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idUsuario: user.id,
                    puntos: puntos,
                }),
            });

            const json = await res.json();
            if (json.success) {
                Alert.alert('🎉 Puntos añadidos', `Has ganado ${puntos} puntos.`);
                navigation.goBack();
            } else {
                Alert.alert('Error', json.message || 'No se pudieron registrar los puntos');
                setScanned(false);
            }
        } catch (e: any) {
            console.error('Error scanning QR:', e);
            Alert.alert('Error', e.message || 'QR inválido o datos corruptos');
            setScanned(false);
        }
    };

    // Estados de permisos
    if (!permission) {
        return (
            <View style={styles.container}>
                <Text>Cargando permisos...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Necesitamos permiso para usar la cámara</Text>
                <Button onPress={requestPermission} title="Conceder permiso" />
                <Button 
                    title="Volver" 
                    onPress={() => navigation.goBack()} 
                    color="#666"
                />
            </View>
        );
    }

    if (scannerError) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{scannerError}</Text>
                <Text style={styles.suggestionText}>
                    Sugerencia: crea un development build con expo-dev-client o usa EAS Build para probar funcionalidades nativas.
                </Text>
                <Button 
                    title="Volver" 
                    onPress={() => navigation.goBack()} 
                    color="#666"
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'pdf417', 'ean13', 'code128'] // Múltiples tipos soportados
                }}
                onCameraReady={() => setCameraReady(true)}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanFrame} />
                    <Text style={styles.scanText}>Enfoca un código QR</Text>
                </View>
            </CameraView>
            
            {scanned && (
                <View style={styles.buttonContainer}>
                    <Button 
                        title="Escanear otro QR" 
                        onPress={() => setScanned(false)} 
                    />
                </View>
            )}
            
            {!cameraReady && (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Inicializando cámara...</Text>
                </View>
            )}
            
            <View style={styles.bottomContainer}>
                <Button 
                    title="Volver" 
                    onPress={() => navigation.goBack()} 
                    color="#666"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'transparent',
        borderRadius: 12,
    },
    scanText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    message: {
        textAlign: 'center',
        padding: 20,
        fontSize: 16,
    },
    errorText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 16,
        color: 'red',
    },
    suggestionText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
    },
});