"use client"

import { Text, View } from "@/components/Themed"
import { useColorScheme } from "@/components/useColorScheme"
import { supabase } from "@/config/initSupabase"
import Colors from "@/constants/Colors"
import { useEffect, useState } from "react"
import { Alert, StyleSheet } from "react-native"
import { Button, TextInput, Menu } from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"

interface ProfileEditFormProps {
    session: any
    onSaveSuccess?: () => void
}

export default function ProfileEditForm({ session, onSaveSuccess }: ProfileEditFormProps) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [nombre, setNombre] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [genero, setGenero] = useState("")
    const [telefono, setTelefono] = useState("")
    const [hasChanges, setHasChanges] = useState(false)
    const [originalData, setOriginalData] = useState({
        nombre: "",
        apellidos: "",
        fechaNacimiento: null as Date | null,
        genero: "",
        telefono: "",
    })
    const [generoMenuVisible, setGeneroMenuVisible] = useState(false)

    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]

    // Opciones de género
    const generoOptions = [
        { label: "Masculino", value: "masculino" },
        { label: "Femenino", value: "femenino" },
        { label: "Otro", value: "otro" },
    ]

    //? Cargar perfil al montar el componente o cuando la sesión cambie
    useEffect(() => {
        if (session) getProfile()
    }, [session])

    //? Detectar cambios en los campos
    useEffect(() => {
        const hasChanges =
            nombre !== originalData.nombre ||
            apellidos !== originalData.apellidos ||
            telefono !== originalData.telefono ||
            genero !== originalData.genero ||
            fechaNacimiento?.getTime() !== originalData.fechaNacimiento?.getTime()

        setHasChanges(hasChanges)
    }, [nombre, apellidos, telefono, genero, fechaNacimiento, originalData])

    //? Función para obtener el perfil del usuario
    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error("No existe usuario en la sesión!")

            const { data, error, status } = await supabase
                .from("usuarios")
                .select("nombre, apellidos, telefono, genero, fecha_nacimiento")
                .eq("id", session.user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setNombre(data.nombre || "")
                setApellidos(data.apellidos || "")
                setTelefono(data.telefono || "")
                setGenero(data.genero || "")

                if (data.fecha_nacimiento) {
                    const fecha = new Date(data.fecha_nacimiento)
                    setFechaNacimiento(fecha)
                }

                setOriginalData({
                    nombre: data.nombre || "",
                    apellidos: data.apellidos || "",
                    telefono: data.telefono || "",
                    genero: data.genero || "",
                    fechaNacimiento: data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : null,
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert("Error", error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    //? Función para actualizar el perfil del usuario
    async function updateProfile() {
        try {
            setSaving(true)
            if (!session?.user) throw new Error("No hay usuario en la sesión!")

            if (!nombre.trim()) {
                Alert.alert("Error", "El nombre no puede estar vacío")
                return
            }

            const fechaNacimientoFormatted = fechaNacimiento ? fechaNacimiento.toISOString().split("T")[0] : null

            const updates = {
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                fecha_nacimiento: fechaNacimientoFormatted,
                genero: genero,
                telefono: telefono,
            }

            const { error } = await supabase.from("usuarios").update(updates).eq("id", session.user.id)

            if (error) {
                Alert.alert("Error", error.message)
                return
            }

            setOriginalData({
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                telefono: telefono,
                genero: genero,
                fechaNacimiento: fechaNacimiento,
            })

            Alert.alert("Éxito", "Perfil actualizado correctamente")
            onSaveSuccess?.()
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert("Error", error.message)
            }
        } finally {
            setSaving(false)
        }
    }

    //? Función para cancelar los cambios realizados
    function cancelChanges() {
        setNombre(originalData.nombre)
        setApellidos(originalData.apellidos)
        setTelefono(originalData.telefono)
        setGenero(originalData.genero)
        setFechaNacimiento(originalData.fechaNacimiento)
    }

    //? Manejar selección de fecha
    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false)
        if (selectedDate) {
            setFechaNacimiento(selectedDate)
        }
    }

    //? Obtener texto display para género
    const getGeneroDisplayText = () => {
        const option = generoOptions.find((opt) => opt.value === genero)
        return option ? option.label : "Seleccionar género"
    }

    //? Obtener texto display para fecha
    const getFechaDisplayText = () => {
        return fechaNacimiento ? fechaNacimiento.toLocaleDateString("es-MX") : "Seleccionar fecha"
    }

    if (loading) {
        return (
            <View style={{ padding: 16 }}>
                <Text>Cargando datos...</Text>
            </View>
        )
    }

    return (
        <View>
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
                        primary: colors.text,
                        background: colors.secondaryBackground,
                    },
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
                        primary: colors.text,
                        background: colors.secondaryBackground,
                    },
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
                        primary: colors.text,
                        background: colors.secondaryBackground,
                    },
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
                                primary: colors.text,
                                background: colors.secondaryBackground,
                            },
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
                            setGenero(option.value)
                            setGeneroMenuVisible(false)
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
                        primary: colors.text,
                        background: colors.secondaryBackground,
                    },
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
                <View
                    style={[
                        styles.changesBanner,
                        {
                            backgroundColor: colorScheme === "dark" ? "#daa73bff" : "#fff3cd",
                            borderLeftColor: colors.tint,
                        },
                    ]}
                >
                    <Text style={[styles.changesText, { color: colorScheme === "dark" ? colors.text : "#856404" }]}>
                        Tienes cambios sin guardar
                    </Text>
                </View>
            )}

            <Button
                mode="contained"
                onPress={updateProfile}
                loading={saving}
                disabled={!hasChanges || saving}
                style={[styles.saveButton, { backgroundColor: colorScheme === "dark" ? "#dfb49fff" : "#9b7663ff" }]}
                icon="content-save"
                textColor={colorScheme === "dark" ? "#000" : "#000"}
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
                            primary: colors.secondaryButton,
                        },
                    }}
                >
                    Cancelar
                </Button>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 12,
        borderRadius: 8,
        height: 54,
        justifyContent: "center",
    },
    selectButton: {
        marginBottom: 12,
        justifyContent: "space-between",
        borderRadius: 8,
        height: 48,
    },
    changesBanner: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    changesText: {
        fontSize: 14,
        fontWeight: "600",
    },
    saveButton: {
        color: "#fff",
        marginTop: 8,
        borderRadius: 10,
        height: 50,
        justifyContent: "center",
        alignSelf: "stretch",
    },
    cancelButton: {
        marginTop: 8,
        borderRadius: 10,
        height: 48,
        justifyContent: "center",
        alignSelf: "stretch",
    },
})
