// Paleta de colores premium y profesional inspirada en cafetería de lujo
// Diseñada para excelente contraste, accesibilidad y estética moderna

const tintColorLight = '#8B5E34'; // Marrón café intenso y elegante
const tintColorDark = '#D4A574';  // Dorado cálido para contraste

export default {
  light: {
    // Textos
    text: '#2C1810',              // Marrón oscuro casi negro (café tostado)
    textSecondary: '#8B7355',     // Marrón medio cálido
    
    // Fondos
    background: '#FFF8F0',        // Crema suave (color de leche en café)
    secondaryBackground: '#F5E6D3', // Beige arena claro
    cardBackground: '#FFFFFF',    // Blanco puro para tarjetas
    
    // Marca y acciones
    tint: tintColorLight,
    button: '#8B5E34',           // Marrón café rico
    secondaryButton: '#F5E6D3',  // Beige claro
    
    // Navegación
    tabIconDefault: '#A69080',   // Marrón gris neutro
    tabIconSelected: tintColorLight,
    tabBarColor: '#FFFFFF',      // Blanco limpio
    
    // Elementos UI
    border: '#E5D4C1',           // Beige arena para bordes sutiles
    divider: '#EFE4D6',          // Divisor muy sutil
    
    // Estados
    success: '#5C8F3E',          // Verde oliva (té verde)
    warning: '#D97706',          // Ámbar tostado
    error: '#C44536',            // Terracota (arcilla)
    info: '#7B6B5D',             // Marrón grisáceo
    
    // Acentos especiales
    accent: '#D4A574',           // Dorado cálido (caramelo)
    accentLight: '#E5C29F',      // Dorado muy claro
    highlight: '#FFF5E6',        // Amarillo crema muy suave
    
    // Sombras y overlays
    shadow: 'rgba(44, 24, 16, 0.08)',
    overlay: 'rgba(44, 24, 16, 0.4)',
  },
  
  dark: {
    // Textos
    text: '#F1F5F9',             // Blanco humo (vapor de café)
    textSecondary: '#94A3B8',    // Gris azulado suave
    
    // Fondos
    background: '#0F172A',       // Azul negro profundo (noche)
    secondaryBackground: '#1E293B', // Azul gris oscuro
    cardBackground: '#1E293B',   // Gris azul para tarjetas
    
    // Marca y acciones
    tint: tintColorDark,
    button: '#D4A574',           // Dorado cálido brillante
    secondaryButton: '#334155',  // Gris azul medio
    
    // Navegación
    tabIconDefault: '#64748B',   // Gris azul medio
    tabIconSelected: tintColorDark,
    tabBarColor: '#1E293B',      // Gris azul oscuro
    
    // Elementos UI
    border: '#334155',           // Gris azul para bordes
    divider: '#293548',          // Divisor sutil
    
    // Estados
    success: '#6EE7B7',          // Verde menta brillante
    warning: '#FBBF24',          // Ámbar brillante
    error: '#F87171',            // Rojo coral suave
    info: '#60A5FA',             // Azul cielo
    
    // Acentos especiales
    accent: '#F59E0B',           // Ámbar vibrante
    accentLight: '#FCD34D',      // Amarillo dorado
    highlight: '#1E3A5F',        // Azul oscuro destacado
    
    // Sombras y overlays
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};
