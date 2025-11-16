import { ScrollView, StyleSheet, Linking, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from 'react-native-paper';
import { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

interface Branch {
    id: number;
    nombre: string;
    direccion: string;
    latitud: number;
    longitud: number;
    telefono: string;
    horario_apertura: string;
    activa: boolean;
}

export default function BranchesScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationPermission, setLocationPermission] = useState(false);
    const [userLocation, setUserLocation] = useState({
        latitude: 21.1161,
        longitude: -101.6862,
    });

    useEffect(() => {
        const initializeLocation = async () => {
            try {
                // Solicitar permisos de ubicación
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    Alert.alert(
                        'Permiso denegado',
                        'Se necesita acceso a tu ubicación para mostrarte las sucursales más cercanas',
                        [{ text: 'OK' }]
                    );
                    setLocationPermission(false);
                    return;
                }

                setLocationPermission(true);

                // Obtener ubicación actual
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            } catch (error) {
                console.error('Error al obtener ubicación:', error);
                Alert.alert('Error', 'No se pudo obtener tu ubicación actual');
            }
        };

        initializeLocation();
    }, []);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await fetch(`${backendUrl}api/sucursales`);
                const result = await response.json();

                if (result.success) {
                    // Filtrar solo sucursales activas
                    const activeBranches = result.data.filter((branch: Branch) => branch.activa);
                    setBranches(activeBranches);
                } else {
                    console.error('Error:', result.error);
                    Alert.alert('Error', 'No se pudieron cargar las sucursales');
                }
            } catch (error) {
                console.error('Error al obtener sucursales:', error);
                Alert.alert('Error', 'No se pudo conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

    // Calcular distancia entre dos puntos (fórmula de Haversine)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance.toFixed(1);
    };

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleGetDirections = (latitude: number, longitude: number, name: string) => {
        const lat = Number(latitude);
        const lng = Number(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            Alert.alert('Error', 'Coordenadas inválidas');
            console.error('Coordenadas inválidas:', { latitude, longitude });
            return;
        }

        const latStr = lat.toFixed(7);
        const lngStr = lng.toFixed(7);

        const url = `https://www.google.com/maps/dir/?api=1&destination=${latStr},${lngStr}&travelmode=driving`;

        console.log('Abriendo Google Maps:', url);
        Linking.openURL(url).catch(err => {
            console.error('Error al abrir Google Maps:', err);
            Alert.alert('Error', 'No se pudo abrir Google Maps');
        });
    };

    const handleRequestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
            try {
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                setLocationPermission(true);
                Alert.alert('¡Éxito!', 'Ubicación actualizada correctamente');
            } catch (error) {
                Alert.alert('Error', 'No se pudo obtener tu ubicación');
            }
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00704A" />
                    <Text style={[styles.loadingText, { color: colors.text }]}>
                        Cargando sucursales...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Sucursales Cercanas
                </Text>
                <Text style={[styles.subtitle, { color: colors.text, opacity: 0.7 }]}>
                    Encuentra tu cafetería Dengo más cercana
                </Text>
            </View>

            {/* Alerta de ubicación si no se tiene permiso */}
            {!locationPermission && (
                <View style={styles.locationAlert}>
                    <Ionicons name="location-outline" size={24} color="#F59E0B" />
                    <View style={styles.locationAlertText}>
                        <Text style={styles.locationAlertTitle}>Activa tu ubicación</Text>
                        <Text style={styles.locationAlertSubtitle}>
                            Para mostrarte las sucursales más cercanas
                        </Text>
                    </View>
                    <Button
                        mode="contained"
                        onPress={handleRequestLocation}
                        style={styles.locationButton}
                        labelStyle={styles.locationButtonLabel}
                    >
                        Permitir
                    </Button>
                </View>
            )}

            {/* Google Map */}
            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    showsUserLocation={locationPermission}
                    showsMyLocationButton={locationPermission}
                    customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
                >
                    {!locationPermission && (
                        <Marker
                            coordinate={userLocation}
                            title="Ubicación predeterminada"
                            description="León, Guanajuato"
                            pinColor="blue"
                        />
                    )}

                    {branches.map(branch => (
                        <Marker
                            key={branch.id}
                            coordinate={{
                                latitude: Number(branch.latitud),
                                longitude: Number(branch.longitud),
                            }}
                            title={branch.nombre}
                            description={branch.direccion}
                            pinColor="#00704A"
                        />
                    ))}
                </MapView>
            </View>

            {/* Lista de sucursales */}
            <View style={styles.branchesSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Todas las sucursales ({branches.length})
                </Text>

                {branches.map(branch => {
                    const distance = calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        Number(branch.latitud),
                        Number(branch.longitud)
                    );

                    return (
                        <Card
                            key={branch.id}
                            style={[styles.branchCard, { backgroundColor: colors.background }]}
                        >
                            <Card.Content>
                                <View style={styles.branchHeader}>
                                    <View style={styles.branchIcon}>
                                        <Ionicons name="location" size={24} color="#78350F" />
                                    </View>
                                    <View style={styles.branchInfo}>
                                        <View style={styles.branchTitleRow}>
                                            <Text style={[styles.branchName, { color: colors.text }]}>
                                                {branch.nombre}
                                            </Text>
                                            <View style={styles.statusBadge}>
                                                <Text style={styles.statusText}>Abierto</Text>
                                            </View>
                                        </View>

                                        <View style={styles.branchDetails}>
                                            <Ionicons
                                                name="location-outline"
                                                size={14}
                                                color={colorScheme === 'dark' ? '#F59E0B' : '#78350F'}
                                            />
                                            <Text
                                                style={[
                                                    styles.addressText,
                                                    { color: colors.text, opacity: 0.7 },
                                                ]}
                                            >
                                                {branch.direccion}
                                            </Text>
                                        </View>

                                        <View style={styles.branchMeta}>
                                            <View style={styles.metaItem}>
                                                <Ionicons
                                                    name="navigate"
                                                    size={14}
                                                    color={colorScheme === 'dark' ? '#F59E0B' : '#78350F'}
                                                />
                                                <Text
                                                    style={[
                                                        styles.metaText,
                                                        { color: colors.text, opacity: 0.7 },
                                                    ]}
                                                >
                                                    {distance} km
                                                </Text>
                                            </View>
                                            <View style={styles.metaItem}>
                                                <Ionicons
                                                    name="time-outline"
                                                    size={14}
                                                    color={colorScheme === 'dark' ? '#F59E0B' : '#78350F'}
                                                />
                                                <Text
                                                    style={[
                                                        styles.metaText,
                                                        { color: colors.text, opacity: 0.7 },
                                                    ]}
                                                >
                                                    {branch.horario_apertura}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.branchMeta}>
                                            <View style={styles.metaItem}>
                                                <Ionicons
                                                    name="call-outline"
                                                    size={14}
                                                    color={colorScheme === 'dark' ? '#F59E0B' : '#78350F'}
                                                />
                                                <Text
                                                    style={[
                                                        styles.metaText,
                                                        { color: colors.text, opacity: 0.7 },
                                                    ]}
                                                >
                                                    {branch.telefono}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.branchActions}>
                                    <Button
                                        mode="outlined"
                                        onPress={() => handleCall(branch.telefono)}
                                        icon="phone"
                                        style={[
                                            styles.actionButton,
                                            {
                                                borderColor:
                                                    colorScheme === 'dark' ? '#F59E0B' : '#00704A',
                                            },
                                        ]}
                                        labelStyle={[
                                            styles.actionButtonLabel,
                                            {
                                                color:
                                                    colorScheme === 'dark' ? '#F59E0B' : '#00704A',
                                            },
                                        ]}
                                    >
                                        Llamar
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={() =>
                                            handleGetDirections(
                                                branch.latitud,
                                                branch.longitud,
                                                branch.nombre
                                            )
                                        }
                                        icon="navigation"
                                        style={[styles.actionButton, { backgroundColor: '#00704A' }]}
                                        labelStyle={styles.actionButtonLabel}
                                    >
                                        Cómo llegar
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    );
                })}
            </View>
        </ScrollView>
    );
}


// Estilo de mapa oscuro para modo dark
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        opacity: 0.6,
    },
    headerSection: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
    locationAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        gap: 12,
    },
    locationAlertText: {
        flex: 1,
    },
    locationAlertTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#78350F',
        marginBottom: 2,
    },
    locationAlertSubtitle: {
        fontSize: 12,
        color: '#92400E',
    },
    locationButton: {
        backgroundColor: '#F59E0B',
    },
    locationButtonLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    mapContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
        height: 250,
    },
    map: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    branchesSection: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        letterSpacing: 0.3,
    },
    branchCard: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    branchHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    branchIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    branchInfo: {
        flex: 1,
    },
    branchTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    branchName: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#D1FAE5',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#065F46',
    },
    branchDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressText: {
        fontSize: 14,
        marginLeft: 6,
        flex: 1,
    },
    branchMeta: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        marginLeft: 4,
    },
    branchActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        borderRadius: 12,
    },
    actionButtonLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
});