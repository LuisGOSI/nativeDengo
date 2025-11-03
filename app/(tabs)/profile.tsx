import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { supabase } from '@/config/initSupabase';
import Colors from '@/constants/Colors';
import { useAuth } from '@/services/AuthContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Divider, TextInput, Menu, Provider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TabProfileScreen() {
    const { session, user, loading: authLoading, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [genero, setGenero] = useState('');
    const [telefono, setTelefono] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [originalData, setOriginalData] = useState({
        nombre: '',
        apellidos: '',
        fechaNacimiento: null as Date | null,
        genero: '',
        telefono: ''
    });
    const [generoMenuVisible, setGeneroMenuVisible] = useState(false);

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Opciones de género
    const generoOptions = [
        { label: 'Masculino', value: 'masculino' },
        { label: 'Femenino', value: 'femenino' },
        { label: 'Otro', value: 'otro' },
    ];

    //? Cargar perfil al montar el componente o cuando la sesión cambie
    useEffect(() => {
        if (session) getProfile();
    }, [session]);

    //? Detectar cambios en los campos
    useEffect(() => {
        const hasChanges =
            nombre !== originalData.nombre ||
            apellidos !== originalData.apellidos ||
            telefono !== originalData.telefono ||
            genero !== originalData.genero ||
            (fechaNacimiento?.getTime() !== originalData.fechaNacimiento?.getTime());

        setHasChanges(hasChanges);
    }, [nombre, apellidos, telefono, genero, fechaNacimiento, originalData]);

    //? Función para obtener el perfil del usuario
    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No existe usuario en la sesión!');

            const { data, error, status } = await supabase
                .from('usuarios')
                .select('nombre, apellidos, telefono, genero, fecha_nacimiento')
                .eq('id', session.user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setNombre(data.nombre || '');
                setApellidos(data.apellidos || '');
                setTelefono(data.telefono || '');
                setGenero(data.genero || '');

                // Parsear fecha de nacimiento
                if (data.fecha_nacimiento) {
                    const fecha = new Date(data.fecha_nacimiento);
                    setFechaNacimiento(fecha);
                }

                setOriginalData({
                    nombre: data.nombre || '',
                    apellidos: data.apellidos || '',
                    telefono: data.telefono || '',
                    genero: data.genero || '',
                    fechaNacimiento: data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : null
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    //? Función para manejar el cierre de sesión
    async function handleLogOut() {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                            router.replace('/(tabs)');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo cerrar la sesión');
                        }
                    }
                }
            ]
        );
    }

    //? Función para actualizar el perfil del usuario
    async function updateProfile() {
        try {
            setSaving(true);
            if (!session?.user) throw new Error('No hay usuario en la sesión!');

            if (!nombre.trim()) {
                Alert.alert('Error', 'El nombre no puede estar vacío');
                return;
            }

            // Formatear fecha para Supabase
            const fechaNacimientoFormatted = fechaNacimiento
                ? fechaNacimiento.toISOString().split('T')[0]
                : null;

            const updates = {
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                fecha_nacimiento: fechaNacimientoFormatted,
                genero: genero,
                telefono: telefono
            };

            const { error } = await supabase
                .from('usuarios')
                .update(updates)
                .eq('id', session.user.id);

            if (error) {
                Alert.alert('Error', error.message);
                return;
            }

            // Actualizar estado local
            setOriginalData({
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                telefono: telefono,
                genero: genero,
                fechaNacimiento: fechaNacimiento
            });

            Alert.alert('Éxito', 'Perfil actualizado correctamente');

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            }
        } finally {
            setSaving(false);
        }
    }

    //? Función para cancelar los cambios realizados
    function cancelChanges() {
        setNombre(originalData.nombre);
        setApellidos(originalData.apellidos);
        setTelefono(originalData.telefono);
        setGenero(originalData.genero);
        setFechaNacimiento(originalData.fechaNacimiento);
    }

    //? Manejar selección de fecha
    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFechaNacimiento(selectedDate);
        }
    };

    //? Obtener texto display para género
    const getGeneroDisplayText = () => {
        const option = generoOptions.find(opt => opt.value === genero);
        return option ? option.label : 'Seleccionar género';
    };

    //? Obtener texto display para fecha
    const getFechaDisplayText = () => {
        return fechaNacimiento
            ? fechaNacimiento.toLocaleDateString('es-MX')
            : 'Seleccionar fecha';
    };

    //? Renderizado si no hay sesión activa
    if (!session || !user) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.loadingText}> No hay sesión activa. </Text>
                <Button
                    mode="contained"
                    onPress={() => router.replace('/login')}
                    style={{ marginTop: 16, backgroundColor: colors.tint }}
                    textColor={colorScheme === 'dark' ? colors.text : '#000'}
                >
                    Iniciar sesión
                </Button>
            </View>
        );
    }

    //? Renderizado condicional mientras se cargan los datos
    if (loading || authLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.tint} />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    //? Obtener iniciales para el avatar
    const initials = nombre ? nombre.substring(0, 2).toUpperCase() : user?.email?.substring(0, 2).toUpperCase() || '??';

    return (
        <Provider>
            <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]}>
                <View style={[styles.container, { backgroundColor: colors.background }]}>

                    {/* Header con Avatar */}
                    <View style={styles.headerSection}>
                        <Avatar.Text
                            size={100}
                            label={initials}
                            style={[styles.avatar, { backgroundColor: colors.tint }]}
                            color={colorScheme === 'dark' ? colors.text : '#000'}
                        />
                        <Text style={[styles.emailText, { color: colors.text }]}>{user?.email}</Text>
                        <Text style={[styles.memberSince, { color: colors.text, opacity: 0.6 }]}>
                            Miembro desde {new Date(user?.created_at || '').toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long'
                            })}
                        </Text>
                    </View>

                    <Divider style={[styles.divider, { backgroundColor: colors.tabIconDefault }]} />

                    {/* Información del Perfil */}
                    <Card style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#5A3E2A' : '#F8E1D1' }]}>
                        <Card.Content>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Información del perfil
                            </Text>

                            <TextInput
                                label="Correo electrónico"
                                value={user?.email || ''}
                                disabled
                                mode="outlined"
                                style={styles.input}
                                left={<TextInput.Icon icon="email" />}
                                theme={{
                                    colors: {
                                        primary: colors.tint,
                                        background: colorScheme === 'dark' ? '#6F4E37' : '#F0D4C0',
                                    }
                                }}
                            />

                            <TextInput
                                label="Nombre"
                                value={nombre}
                                onChangeText={setNombre}
                                mode="outlined"
                                disabled={saving}
                                style={styles.input}
                                left={<TextInput.Icon icon="account" />}
                                placeholder="Ingresa tu nombre"
                                theme={{
                                    colors: {
                                        primary: colors.tint,
                                        background: colorScheme === 'dark' ? '#6F4E37' : '#F0D4C0',
                                    }
                                }}
                            />

                            <TextInput
                                label="Apellidos"
                                value={apellidos}
                                onChangeText={setApellidos}
                                mode="outlined"
                                disabled={saving}
                                style={styles.input}
                                left={<TextInput.Icon icon="account-outline" />}
                                placeholder="Ingresa tus apellidos"
                                theme={{
                                    colors: {
                                        primary: colors.tint,
                                        background: colorScheme === 'dark' ? '#6F4E37' : '#F0D4C0',
                                    }
                                }}
                            />

                            <TextInput
                                label="Teléfono"
                                value={telefono}
                                onChangeText={setTelefono}
                                mode="outlined"
                                disabled={saving}
                                style={styles.input}
                                left={<TextInput.Icon icon="phone" />}
                                placeholder="Ingresa tu teléfono"
                                keyboardType="phone-pad"
                                theme={{
                                    colors: {
                                        primary: colors.tint,
                                        background: colorScheme === 'dark' ? '#6F4E37' : '#F0D4C0',
                                    }
                                }}
                            />

                            {/* Selector de Género */}
                            <Menu
                                visible={generoMenuVisible}
                                onDismiss={() => setGeneroMenuVisible(false)}
                                anchor={
                                    <Button
                                        mode="outlined"
                                        onPress={() => setGeneroMenuVisible(true)}
                                        style={styles.selectButton}
                                        icon="gender-male-female"
                                        theme={{
                                            colors: {
                                                primary: colors.tint,
                                            }
                                        }}
                                    >
                                        {getGeneroDisplayText()}
                                    </Button>
                                }
                            >
                                {generoOptions.map((option) => (
                                    <Menu.Item
                                        key={option.value}
                                        onPress={() => {
                                            setGenero(option.value);
                                            setGeneroMenuVisible(false);
                                        }}
                                        title={option.label}
                                    />
                                ))}
                            </Menu>

                            {/* Selector de Fecha de Nacimiento */}
                            <Button
                                mode="outlined"
                                onPress={() => setShowDatePicker(true)}
                                style={styles.selectButton}
                                icon="calendar"
                                theme={{
                                    colors: {
                                        primary: colors.tint,
                                    }
                                }}
                            >
                                {getFechaDisplayText()}
                            </Button>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={fechaNacimiento || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                    maximumDate={new Date()}
                                />
                            )}

                            {hasChanges && (
                                <View style={[styles.changesBanner,
                                {
                                    backgroundColor: colorScheme === 'dark' ? '#453A23' : '#fff3cd',
                                    borderLeftColor: colors.tint
                                }]}>
                                    <Text style={[styles.changesText,
                                    { color: colorScheme === 'dark' ? colors.text : '#856404' }]}>
                                        Tienes cambios sin guardar
                                    </Text>
                                </View>
                            )}

                            <View>
                                <Button
                                    mode="contained"
                                    onPress={updateProfile}
                                    loading={saving}
                                    disabled={!hasChanges || saving}
                                    style={[styles.saveButton, { backgroundColor: colors.tint }]}
                                    textColor={colorScheme === 'dark' ? colors.text : '#000'}
                                    icon="content-save"
                                >
                                    Guardar cambios
                                </Button>

                                {hasChanges && (
                                    <Button
                                        mode="outlined"
                                        onPress={cancelChanges}
                                        disabled={saving}
                                        style={styles.cancelButton}
                                        icon="close"
                                        theme={{
                                            colors: {
                                                primary: colors.tint,
                                            }
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                )}
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Sección de Cuenta */}
                    <Card style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#5A3E2A' : '#F8E1D1' }]}>
                        <Card.Content>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cuenta</Text>

                            <Button
                                mode="outlined"
                                onPress={handleLogOut}
                                disabled={saving}
                                style={[styles.logoutButton, { borderColor: '#d32f2f' }]}
                                icon="logout"
                                textColor="#d32f2f"
                            >
                                Cerrar sesión
                            </Button>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </Provider>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        opacity: 0.7,
    },
    headerSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatar: {
        marginBottom: 16,
    },
    emailText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 14,
    },
    divider: {
        marginVertical: 16,
        height: 1,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        marginBottom: 12,
    },
    selectButton: {
        marginBottom: 12,
        justifyContent: 'flex-start',
    },
    changesBanner: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
    },
    changesText: {
        fontSize: 14,
        fontWeight: '500',
    },
    saveButton: {
        marginTop: 8,
    },
    cancelButton: {
        marginTop: 4,
    },
    logoutButton: {
        marginTop: 8,
    },
});