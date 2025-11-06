const tintColorLight = '#6B3E26ff'; // café cálido
const tintColorDark = '#E5D1C8ff'; // crema cálida ligeramente más clara para el tema oscuro

export default {
  light: {
    text: '#2B2B2Bff', // carbón suave
    background: '#FAF7F4ff', // crema muy clara
    secondaryBackground: '#F5F2EEff', // beige claro
    tint: tintColorLight,
    tabIconDefault: '#8E8E8Eff', // gris neutro
    tabIconSelected: tintColorLight,
    tabBarColor: '#FFFFFFFF', // blanco limpio
    cardBackground: '#FFFFFFFF', // tarjetas blancas para limpieza visual
    textSecondary: '#6B6B6Bff', // gris secundario
    button: '#4B2E23ff', // espresso oscuro (primario)
    secondaryButton: '#C77B51ff', // acento cálido
  },
  dark: {
    text: '#F6F2EEff', // texto claro atenuado, un poco más brillante
    background: '#3F3734ff', // fondo menos oscuro (más claro que antes)
    secondaryBackground: '#423935ff', // fondo secundario suavizado y más claro
    tint: tintColorDark,
    tabIconDefault: '#D8D2CEff', // íconos más suaves
    tabIconSelected: tintColorDark,
    tabBarColor: '#403832ff', // barra de pestañas menos contrastada y más clara
    cardBackground: '#635046ff', // tarjeta en marrón medio atenuado y más clara
    textSecondary: '#ECE3DDff', // texto secundario claro
    button: '#B0897Bff', // botón primario ligeramente más claro
    secondaryButton: '#9B7F6Aff', // botón secundario atenuado y más claro
  },
};
