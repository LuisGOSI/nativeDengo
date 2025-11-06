export const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }
    return date.toLocaleDateString("es-ES", options)
}

export const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`
}

interface StatusColor {
    background: string
    text: string
}

export const getStatusColor = (status: string): StatusColor => {
    switch (status.toLowerCase()) {
        case "entregado":
            return { background: "#e8f5e9", text: "#1b5e20" }
        case "preparando":
            return { background: "#fff3e0", text: "#e65100" }
        case "listo":
            return { background: "#e3f2fd", text: "#0d47a1" }
        case "recibido":
            return { background: "#f3e5f5", text: "#4a148c" }
        case "cancelado":
            return { background: "#ffebee", text: "#b71c1c" }
        default:
            return { background: "#eeeeee", text: "#424242" }
    }
}

export const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
        recibido: "Recibido",
        preparando: "Preparando",
        listo: "Listo",
        entregado: "Entregado",
        cancelado: "Cancelado",
    }
    return labels[status.toLowerCase()] || status
}
