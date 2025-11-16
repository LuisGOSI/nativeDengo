import { Alert, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from "@/services/AuthContext";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';

const backendUrl = 'https://dengo-back.onrender.com/';

export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannerError, setScannerError] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const { user } = useAuth();

    useFocusEffect(
        useCallback(() => {
            // Reset total al entrar a la pantalla
            setScanned(false);
            setIsProcessing(false);
            setScannerError(null);
            setCameraReady(false);

            // Limpia animaciones previas
            scanLineAnim.setValue(0);
            pulseAnim.setValue(1);

            return () => {
                // Opcional: detener animaciones al salir
                scanLineAnim.stopAnimation();
                pulseAnim.stopAnimation();
            };
        }, [])
    );

    // Animaciones
    const scanLineAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Verificar disponibilidad del módulo de cámara
        (async () => {
            try {
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

    useEffect(() => {
        // Animación de línea de escaneo
        if (cameraReady && !scanned) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scanLineAnim, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scanLineAnim, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [cameraReady, scanned]);

    useEffect(() => {
        // Animación de pulso para el marco
        if (cameraReady && !scanned) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [cameraReady, scanned]);

    const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
        if (scanned || isProcessing) return;

        setScanned(true);
        setIsProcessing(true);

        try {
            console.log('QR leído:', { type, data });

            if (!user) {
                Alert.alert('❌ Error', 'No hay usuario autenticado.', [
                    {
                        text: 'OK', onPress: () => {
                            setScanned(false);
                            setIsProcessing(false);
                        }
                    }
                ]);
                return;
            }

            // Parsear los datos del QR
            let puntos;
            try {
                const qrData = JSON.parse(data);
                puntos = qrData.puntos;
            } catch (parseError) {
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
                Alert.alert(
                    '🎉 ¡Puntos añadidos!',
                    `Has ganado ${puntos} puntos.`,
                    [{ text: 'Genial', onPress: () => router.back() }]
                );
            } else {
                Alert.alert('❌ Error', json.message || 'No se pudieron registrar los puntos', [
                    {
                        text: 'OK', onPress: () => {
                            setScanned(false);
                            setIsProcessing(false);
                        }
                    }
                ]);
            }
        } catch (e: any) {
            console.error('Error scanning QR:', e);
            Alert.alert('❌ Error', e.message || 'QR inválido o datos corruptos', [
                {
                    text: 'OK', onPress: () => {
                        setScanned(false);
                        setIsProcessing(false);
                    }
                }
            ]);
        }
    };

    // Estado: Cargando permisos
    if (!permission) {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando permisos...</Text>
            </View>
        );
    }

    // Estado: Sin permisos
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />
                <LinearGradient
                    colors={['#1a1a1a', '#2d2d2d']}
                    style={styles.gradientContainer}
                >
                    <View style={styles.permissionContainer}>
                        <Text style={styles.permissionIcon}>📷</Text>
                        <Text style={styles.permissionTitle}>Permiso de Cámara</Text>
                        <Text style={styles.permissionMessage}>
                            Necesitamos acceso a tu cámara para escanear códigos QR
                        </Text>

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={requestPermission}
                        >
                            <Text style={styles.primaryButtonText}>Conceder Permiso</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.secondaryButtonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    // Estado: Error de cámara
    if (scannerError) {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />
                <LinearGradient
                    colors={['#1a1a1a', '#2d2d2d']}
                    style={styles.gradientContainer}
                >
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>⚠️</Text>
                        <Text style={styles.errorTitle}>Error de Cámara</Text>
                        <Text style={styles.errorMessage}>{scannerError}</Text>
                        <Text style={styles.suggestionText}>
                            💡 Sugerencia: crea un development build con expo-dev-client o usa EAS Build para probar funcionalidades nativas.
                        </Text>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.secondaryButtonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    const scanLineTranslateY = scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-125, 125],
    });

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'pdf417', 'ean13', 'code128']
                }}
                onCameraReady={() => setCameraReady(true)}
            >
                {/* Overlay oscuro */}
                <View style={styles.overlay}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.backButtonText}>✕</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Escanear QR</Text>
                        <View style={styles.backButton} />
                    </View>

                    {/* Área de escaneo */}
                    <View style={styles.scanArea}>
                        <Animated.View
                            style={[
                                styles.scanFrame,
                                { transform: [{ scale: pulseAnim }] }
                            ]}
                        >
                            {/* Esquinas del marco */}
                            <View style={[styles.corner, styles.cornerTopLeft]} />
                            <View style={[styles.corner, styles.cornerTopRight]} />
                            <View style={[styles.corner, styles.cornerBottomLeft]} />
                            <View style={[styles.corner, styles.cornerBottomRight]} />

                            {/* Línea de escaneo animada */}
                            {cameraReady && !scanned && (
                                <Animated.View
                                    style={[
                                        styles.scanLine,
                                        {
                                            transform: [{ translateY: scanLineTranslateY }]
                                        }
                                    ]}
                                />
                            )}
                        </Animated.View>

                        <View style={styles.instructionContainer}>
                            <Text style={styles.instructionText}>
                                {isProcessing ? '⏳ Procesando...' : '🎯 Enfoca el código QR'}
                            </Text>
                            <Text style={styles.subInstructionText}>
                                El escaneo es automático
                            </Text>
                        </View>
                    </View>

                    {/* Footer con botón de escaneo manual */}
                    {scanned && !isProcessing && (
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.rescanButton}
                                onPress={() => {
                                    setScanned(false);
                                    setIsProcessing(false);
                                }}
                            >
                                <Text style={styles.rescanButtonText}>🔄 Escanear Otro</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </CameraView>

            {/* Loading overlay cuando está procesando */}
            {isProcessing && (
                <View style={styles.processingOverlay}>
                    <View style={styles.processingCard}>
                        <ActivityIndicator size="large" color="#4CAF50" />
                        <Text style={styles.processingText}>Registrando puntos...</Text>
                    </View>
                </View>
            )}

            {/* Loading inicial de cámara */}
            {!cameraReady && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Inicializando cámara...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    gradientContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    scanArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 280,
        height: 280,
        position: 'relative',
        backgroundColor: 'transparent',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#4CAF50',
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 8,
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 8,
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 8,
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 8,
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    instructionContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    instructionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        overflow: 'hidden',
    },
    subInstructionText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
    },
    footer: {
        paddingBottom: 50,
        alignItems: 'center',
    },
    rescanButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    rescanButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    processingCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    processingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 16,
        fontWeight: '500',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 16,
        fontWeight: '500',
    },
    // Estilos para pantallas de permisos y errores
    permissionContainer: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    permissionIcon: {
        fontSize: 80,
        marginBottom: 20,
    },
    permissionTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    permissionMessage: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    primaryButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    errorIcon: {
        fontSize: 80,
        marginBottom: 20,
    },
    errorTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    errorMessage: {
        color: '#FF5252',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 24,
    },
    suggestionText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
        fontStyle: 'italic',
    },
});