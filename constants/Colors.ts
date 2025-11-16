// Colores base profesionales con excelente contraste
const tintColorLight = '#0066CC'; // azul profesional vibrante
const tintColorDark = '#4A9EFF'; // azul más claro para oscuro

export default {
  light: {
    text: '#1A1A1A', // negro casi puro con menos dureza
    background: '#FFFFFF', // blanco puro y limpio
    secondaryBackground: '#F5F5F7', // gris muy claro (estilo iOS)
    tint: tintColorLight,
    tabIconDefault: '#8E8E93', // gris medio neutro
    tabIconSelected: tintColorLight,
    tabBarColor: '#FFFFFF', // blanco limpio
    cardBackground: '#FFFFFF', // tarjetas blancas
    textSecondary: '#6C6C70', // gris para texto secundario
    button: '#0066CC', // azul primario
    secondaryButton: '#F5F5F7', // gris claro para botones secundarios
    border: '#E5E5EA', // bordes sutiles
    success: '#34C759', // verde éxito
    warning: '#FF9500', // naranja advertencia
    error: '#FF3B30', // rojo error
  },
  dark: {
    text: '#FFFFFF', // blanco puro para máximo contraste
    background: '#000000', // negro verdadero (OLED friendly)
    secondaryBackground: '#1C1C1E', // gris muy oscuro
    tint: tintColorDark,
    tabIconDefault: '#8E8E93', // gris medio
    tabIconSelected: tintColorDark,
    tabBarColor: '#1C1C1E', // gris muy oscuro
    cardBackground: '#1C1C1E', // tarjetas en gris oscuro
    textSecondary: '#EBEBF5', // blanco con 60% opacidad
    button: '#0A84FF', // azul más brillante para oscuro
    secondaryButton: '#2C2C2E', // gris oscuro para botones secundarios
    border: '#38383A', // bordes sutiles en oscuro
    success: '#32D74B', // verde más brillante
    warning: '#FF9F0A', // naranja más brillante
    error: '#FF453A', // rojo más brillante
  },
};