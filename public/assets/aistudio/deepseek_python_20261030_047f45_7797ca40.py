import streamlit as st
import pandas as pd

# --- CONFIGURACIÓN DE PÁGINA ---
st.set_page_config(page_title="Gestión Documental Integral", page_icon="🏛️", layout="wide")

# --- ESTILOS CSS (Solo para mejorar tipografía, sin forzar fondos) ---
st.markdown("""
    <style>
    h1, h2, h3 { color: #1f4e79; }
    </style>
""", unsafe_allow_html=True)

# --- BARRA LATERAL ---
st.sidebar.title("🏛️ Panel de Control")
st.sidebar.markdown("Informe Técnico Integrado: **ISO 30301 + AGN + ISO 31000**")
st.sidebar.markdown("---")
seccion = st.sidebar.radio("Navegación:", [
    "1. Resumen Ejecutivo", 
    "2. Articulación de Normas (Matriz)", 
    "3. Caso Práctico (Los 5 Pasos)",
    "4. Gestión del Riesgo"
])

# ==========================================
# SECCIÓN 1: RESUMEN EJECUTIVO
# ==========================================
if seccion == "1. Resumen Ejecutivo":
    st.title("Resumen Ejecutivo: Intervención de Fondos Acumulados")
    st.markdown("Este panel sintetiza la convergencia técnica para el saneamiento del pasivo archivístico.")
    
    # KPIs usando st.metric (Nativo, se adapta al modo claro/oscuro)
    col1, col2, col3, col4 = st.columns(4)
    col1.metric(label="Volumen Documental", value="1.500 m.l.", help="Fondos acumulados en proceso de intervención")
    col2.metric(label="Plazo Legal AGN", value="90 días", help="Plazo improrrogable según Acuerdo 004 de 2013")
    col3.metric(label="Afectación Biológica", value="15%", help="Requiere aislamiento preventivo con hoja testigo")
    col4.metric(label="Normas Integradas", value="3 Normas", help="ISO 30301 (SGD) + AGN (TVD) + ISO 31000 (Riesgo)")

    st.markdown("---")
    
    col_izq, col_der = st.columns(2)
    with col_izq:
        st.subheader("Periodos Históricos Identificados")
        st.info("**Periodo I (1991–1995):** Estructura inicial por Direcciones Generales.\n\n"
                "**Periodo II (1995–2000):** Primera reestructuración con Subdirecciones Técnicas.\n\n"
                "**Periodo III (2000–2010):** Segunda reestructuración con Módulos Especializados.")
    with col_der:
        st.subheader("Retos del Caso Práctico")
        st.warning("1. **Aislamiento Biológico:** 15% del fondo requiere tratamiento urgente (hongos/insectos).\n\n"
                   "2. **Convalidación:** Radicación estricta ante el AGN sin superar los 90 días.\n\n"
                   "3. **Trazabilidad:** Creación de 3 FUIDs independientes por cada periodo histórico.")

# ==========================================
# SECCIÓN 2: ARTICULACIÓN DE NORMAS
# ==========================================
elif seccion == "2. Articulación de Normas (Matriz)":
    st.title("Matriz de Convergencia Institucional")
    st.markdown("La clave del informe es cómo se conectan las tres normas. Aquí está el flujo lógico:")
    
    data = {
        "Fase del Proceso": ["1. Diagnóstico y Contexto", "2. Planificación (PAI)", "3. Ejecución y Registro", "4. Valoración y TVD", "5. Gobernanza y Cierre"],
        "ISO 30301 (SGD)": ["Cláusulas 4.1, 4.2, 4.3\n(Análisis de contexto)", "Cláusulas 6.1, 6.2, 7.1-7.5\n(Riesgos y Objetivos)", "Capítulo 8 y Anexo A\n(Operación y Control)", "Cláusula 8.2 y Anexo A\n(Disposición final)", "Capítulos 5, 9 y 10\n(Liderazgo y Mejora)"],
        "Metodología AGN (TVD)": ["Pasos 1 y 2\n(Historia y Diagnóstico)", "Paso 3\n(Plan Archivístico - PAI)", "Paso 4\n(Clasificación, FUID, Foliación)", "Pasos 4 y 5\n(Valoración y Propuesta TVD)", "Acuerdo 004/2013\n(Aprobación y Convalidación)"],
        "NTC-ISO 31000 (Riesgo)": ["Cláusulas 5.4.1 y 6.3\n(Alcance y Contexto)", "Cláusula 6.5.3\n(Planes de Tratamiento)", "Cláusulas 6.4.2 y 6.4.3\n(Identificación de Riesgos)", "Cláusula 6.4.4\n(Valoración del Riesgo)", "Cláusulas 6.6 y 6.7\n(Seguimiento y Registro)"]
    }
    df = pd.DataFrame(data)
    # CORRECCIÓN: Se eliminó use_container_width y se usa hide_index
    st.dataframe(df, hide_index=True)
    
    st.info("💡 **Para el expositor:** Mencione que ninguna norma trabaja sola. El diagnóstico del AGN es el mismo contexto de la ISO 30301, y a su vez, son los riesgos a evaluar por la ISO 31000.")

# ==========================================
# SECCIÓN 3: CASO PRÁCTICO
# ==========================================
elif seccion == "3. Caso Práctico (Los 5 Pasos)":
    st.title("Desarrollo Operativo del Caso Práctico")
    st.markdown("Aplicación real de la metodología sobre un fondo de 1.500 m.l. (1991-2010).")
    
    with st.expander("🔍 Paso 1: Diagnóstico Inicial y de Contexto (ISO 30301 + AGN)", expanded=True):
        st.write("Se registra un volumen de **1.500 m.l.**. Se identifica un **15% de afección biológica activa**. Se reconstruye la normatividad de creación y supresión para los 3 periodos institucionales.")
        
    with st.expander("🛡️ Paso 2: Evaluación de Riesgos (NTC-ISO 31000)", expanded=False):
        st.write("Asignación de **Dueños del Riesgo (Risk Owners)**:")
        st.markdown("""
        *   **Riesgo Biológico:** Líder de Salud Ocupacional. (Tratamiento: Aislamiento y EPP nivel 3).
        *   **Riesgo de Pérdida de Memoria:** Asesor Jurídico. (Tratamiento: Mesas de valoración).
        *   **Riesgo de Incumplimiento (90 días):** Director del Proyecto. (Tratamiento: Monitoreo semanal).
        """)
        
    with st.expander("📂 Paso 3: Ejecución y FUIDs (AGN - Radicado 2-2015-02615)", expanded=False):
        st.write("Clasificación orgánica, depuración, aislamiento biológico con **hoja testigo**, y foliación.")
        st.success("Creación obligatoria de **3 FUIDs independientes** (uno por cada periodo histórico).")
        
    with st.expander("📝 Paso 4: Aprobación y Convalidación (90 Días)", expanded=False):
        st.write("**Aprobación Interna:** Acta de Comité Interno No. 005 y Resolución Institucional No. 0420.")
        st.write("**Convalidación Oficial:** Radicación ante el AGN. Se logra el Concepto Técnico dentro de la ventana de **90 días**.")
        
    with st.expander("♻️ Paso 5: Integración y Cierre (ISO 30301)", expanded=False):
        st.write("Migración de los datos de los FUIDs al software del SGD. Eliminación del pasivo archivístico y establecimiento de controles para evitar nuevos fondos acumulados.")

# ==========================================
# SECCIÓN 4: GESTIÓN DEL RIESGO
# ==========================================
elif seccion == "4. Gestión del Riesgo":
    st.title("Análisis de Riesgos del Caso Práctico")
    st.markdown("Basado en la Cláusula 6 de la NTC-ISO 31000:2018.")
    
    riesgos_data = {
        "Riesgo Identificado": ["Biológico (Salubridad)", "Pérdida de Memoria Legal e Histórica", "Incumplimiento Normativo (Plazo)"],
        "Análisis (Probabilidad / Consecuencia)": ["Alta / Severa", "Media / Crítica", "Media / Moderada"],
        "Dueño del Riesgo (Risk Owner)": ["Líder de Salud Ocupacional", "Asesor Jurídico y Líder de Gestión", "Director del Proyecto Archivístico"],
        "Tratamiento (Cláusula 6.5)": ["Aislamiento, EPP Nivel 3, Hoja Testigo", "Mesas de valoración previas a la TVD", "Monitoreo semanal y revisión previa a radicación"]
    }
    df_riesgos = pd.DataFrame(riesgos_data)
    
    # Usar dataframe en lugar de table para mejor renderizado en pantallas
    st.dataframe(df_riesgos, hide_index=True)
    
    st.info("**Nota para el expositor:** Es crucial resaltar que la asignación del 'Dueño del Riesgo' (Cláusula 5.4.3) es lo que permite que el plan de tratamiento funcione en la realidad.")