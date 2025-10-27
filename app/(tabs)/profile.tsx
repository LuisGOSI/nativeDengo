import { useState, useEffect } from 'react';
import { supabase } from '@/config/initSupabase';
import { StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { View, Text } from '@/components/Themed';
import { Button, TextInput, Avatar, Card, Divider } from 'react-native-paper';
import { useAuth } from '@/services/AuthContext';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function TabProfileScreen() {
    const { session, user, loading: authLoading, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [originalUsername, setOriginalUsername] = useState('');
    const colorScheme = useColorScheme();

    //? Cargar perfil al montar el componente o cuando la sesión cambie
    useEffect(() => {
        if (session) getProfile();
    }, [session]);

    //? Detectar cambios en el nombre de usuario
    useEffect(() => {
        setHasChanges(username !== originalUsername);
    }, [username, originalUsername]);

    //? Función para obtener el perfil del usuario
    async function getProfile() {
        //* Obtener datos del perfil desde Supabase
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No existe usuario en la sesión!');
            //* Consulta a la tabla 'profiles'
            const { data, error, status } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', session.user.id)
                .single();
            //* Manejo de errores
            if (error && status !== 406) {
                throw error;
            }
            //* Actualizar estado con los datos obtenidos
            if (data) {
                setUsername(data.username || '');
                setOriginalUsername(data.username || '');
                setAvatarUrl(data.avatar_url || '');
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

        //* Confirmar acción con el usuario
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
                        //* Cerrar sesión y redirigir al usuario
                        try {
                            await signOut();
                            router.replace('/(tabs)');
                            setLoading(true);
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
            //* Actualizar datos del perfil en Supabase
            setSaving(true);
            if (!session?.user) throw new Error('No hay usuario en la sesión!');
            //* Validar nombre de usuario
            if (!username.trim()) {
                Alert.alert('Error', 'El nombre de usuario no puede estar vacío');
                return;
            }
            //* Preparar datos para la actualización
            const updates = {
                id: session.user.id,
                username: username.trim(),
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            };
            //* Realizar la actualización en la tabla 'profiles'
            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                throw error;
            }
            //* Actualizar estado local
            setOriginalUsername(username.trim());
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
        setUsername(originalUsername);
    }

    //? Renderizado si no hay sesión activa
    if (!session || !user) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}> No hay sesión activa. </Text>
                {/* Botón para redirigir al inicio de sesión */}
                <Button
                    mode="contained"
                    onPress={() => router.replace('/login')}
                    style={{ marginTop: 16 }}
                    children="Iniciar sesión"
                >
                </Button>
            </View>
        );
    }

    //? Renderizado condicional mientras se cargan los datos
    if (loading || authLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }


    //? Obtener iniciales para el avatar
    const initials = username ? username.substring(0, 2).toUpperCase() : user?.email?.substring(0, 2).toUpperCase() || '??';

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {/* Header con Avatar */}
                <View style={styles.headerSection}>
                    <Avatar.Text
                        size={100}
                        label={initials}
                        style={styles.avatar}
                    />
                    <Text style={styles.emailText}>{user?.email}</Text>
                    <Text style={styles.memberSince}>
                        Miembro desde {new Date(user?.created_at || '').toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long'
                        })}
                    </Text>
                </View>

                <Divider style={styles.divider} />

                {/* Información del Perfil */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Información del perfil</Text>

                        <TextInput
                            label="Correo electrónico"
                            value={user?.email || ''}
                            disabled
                            mode="outlined"
                            style={styles.input}
                            left={<TextInput.Icon icon="email" />}
                        />

                        <TextInput
                            label="Nombre de usuario"
                            value={username}
                            onChangeText={setUsername}
                            mode="outlined"
                            disabled={saving}
                            style={styles.input}
                            left={<TextInput.Icon icon="account" />}
                            placeholder="Ingresa tu nombre de usuario"
                        />

                        {hasChanges && (
                            <View style={styles.changesBanner}>
                                <Text style={styles.changesText}>
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
                                style={styles.saveButton}
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
                                >
                                    Cancelar
                                </Button>
                            )}
                        </View>
                    </Card.Content>
                </Card>

                {/* Sección de Cuenta */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Cuenta</Text>

                        <Button
                            mode="outlined"
                            onPress={handleLogOut}
                            disabled={saving}
                            style={styles.logoutButton}
                            icon="logout"
                            textColor="#d32f2f"
                        >
                            Cerrar sesión
                        </Button>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
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
        opacity: 0.6,
    },
    divider: {
        marginVertical: 16,
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
    changesBanner: {
        backgroundColor: '#fff3cd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
    },
    changesText: {
        color: '#856404',
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
        borderColor: '#d32f2f',
    },
});