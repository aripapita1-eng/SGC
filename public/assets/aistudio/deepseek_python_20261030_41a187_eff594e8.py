import streamlit as st
import pandas as pd
import plotly.express as px

# --- 1. CONFIGURACIÓN DE LA PÁGINA ---
st.set_page_config(page_title="Dashboard Normativo Archivístico", page_icon="📂", layout="wide")

# --- 2. ESTILOS CSS PERSONALIZADOS (Para un look de presentación) ---
st.markdown("""
    <style>
    /* Fondo general */
    .stApp { background-color: #f4f6f9; }
    /* Estilo de las métricas */
    div[data-testid="stMetric"] {
        background-color: #ffffff;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        border-left: 5px solid #1f4e79;
    }
    /* Títulos */
    h1 { color: #1f4e79; font-family: 'Arial', sans-serif; }
    h2 { color: #2e75b6; }
    h3 { color: #5b9bd5; }
    /* Tarjetas de contenedor */
    div[data-testid="stVerticalBlockBorderWrapper"] {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    </style>
    """, unsafe_allow_html=True)

# --- 3. BARRA LATERAL (NAVEGACIÓN) ---
st.sidebar.title("📂 Panel de Gestión")
st.sidebar.markdown("**Informe Técnico Integrado**")
st.sidebar.markdown("---"
                    )
opcion = st.sidebar.radio(
    "Seleccione una sección para exponer:",
    ["🏠 Resumen General", "📘 1. ISO 30301 (SGD)", "📑 2. Metodología TVD (AGN)", "⚠️ 3. Gestión del Riesgo (ISO 31000)", "🏢 4. Caso Práctico Aplicado"]
)
st.sidebar.markdown("---")
st.sidebar.caption("Desarrollado para la exposición del informe técnico.")

# ==========================================
# 1. RESUMEN GENERAL
# ==========================================
if opcion == "🏠 Resumen General":
    st.title("🏠 Resumen General del Proyecto")
    st.markdown("### Convergencia de Estándares: ISO 30301 + AGN (TVD) + ISO 31000")
    st.markdown("---")
    
    # KPIs Principales en Tarjetas
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Volumen del Fondo", "1,500 m.l.", "Documentación acumulada")
    col2.metric("Plazo Legal de Convalidación", "90 días", "Acuerdo 004/2013")
    col3.metric("Afectación Biológica", "15%", "Riesgo Crítico Detectado")
    col4.metric("Normas Integradas", "3", "ISO / AGN / ISO 31000")

    st.markdown("---")
    
    # Gráficos en Contenedores
    col_graf1, col_graf2 = st.columns(2)
    
    with col_graf1:
        with st.container(border=True):
            st.subheader("Distribución del Fondo por Periodos")
            data_periodos = pd.DataFrame({
                "Periodo Histórico": ["1991-1995", "1995-2000", "2000-2010"],
                "Estructura": ["Direcciones Generales", "Subdirecciones Técnicas", "Módulos Especializados"],
                "Años": [4, 5, 10]
            })
            # CORRECCIÓN: Gráfico horizontal para mejor lectura
            fig = px.bar(data_periodos, x="Años", y="Periodo Histórico", 
                         text="Estructura", orientation='h',
                         color="Periodo Histórico", color_discrete_sequence=px.colors.qualitative.Pastel)
            fig.update_traces(textposition='inside')
            fig.update_layout(showlegend=False, margin=dict(l=0, r=0, t=10, b=0))
            st.plotly_chart(fig, use_container_width=True) # Fallback para versiones antiguas

    with col_graf2:
        with st.container(border=True):
            st.subheader("Estado de Conservación")
            data_conservacion = pd.DataFrame({
                "Estado": ["Afectación Biológica", "En buen estado"],
                "Porcentaje": [15, 85]
            })
            fig2 = px.pie(data_conservacion, values="Porcentaje", names="Estado", 
                          color="Estado", color_discrete_map={"Afectación Biológica": "#ff6b6b", "En buen estado": "#51cf66"}, hole=0.5)
            fig2.update_layout(margin=dict(l=0, r=0, t=10, b=0))
            st.plotly_chart(fig2, use_container_width=True)

# ==========================================
# 2. ISO 30301
# ==========================================
elif opcion == "📘 1. ISO 30301 (SGD)":
    st.title("📘 ISO 30301: Sistema de Gestión para los Documentos")
    st.markdown("Establece los requisitos técnicos y gerenciales para el SGD.")
    st.markdown("---")
    
    # Distribución en 3 columnas para fácil exposición
    col1, col2, col3 = st.columns(3)
    
    with col1:
        with st.container(border=True):
            st.subheader("📌 Contexto (Cap 4)")
            st.info("**4.1 Comprensión:** Análisis de factores externos e internos.")
            st.info("**4.2 Requisitos:** Obligaciones legales y de negocio.")
            st.info("**4.3 Alcance:** Límites operativos y físicos del SGD.")
            
    with col2:
        with st.container(border=True):
            st.subheader("👑 Liderazgo y Planificación (Cap 5-6)")
            st.success("**Liderazgo (5.1):** Compromiso de la alta dirección.")
            st.success("**Política (5.2):** Directrices claras y respaldadas.")
            st.success("**Riesgos (6.1):** Gestión de la incertidumbre.")
            st.success("**Objetivos (6.2):** Metas medibles y alcanzables.")
            
    with col3:
        with st.container(border=True):
            st.subheader("⚙️ Operación y Evaluación (Cap 7-10)")
            st.warning("**Soporte (Cap 7):** Recursos y capacitación.")
            st.warning("**Operación (Cap 8):** Creación, captura y control.")
            st.warning("**Evaluación (Cap 9):** Auditoría interna.")
            st.warning("**Mejora (Cap 10):** Acciones correctivas.")

    st.markdown("---")
    with st.expander("📖 Ver Anexo A: Procesos y Controles Técnicos"):
        col_a, col_b = st.columns(2)
        with col_a:
            st.markdown("**A. Creación de Documentos**")
            st.write("1. Determinación de creación\n2. Requisitos de contenido\n3. Captura de documentos")
        with col_b:
            st.markdown("**B. Control de Documentos**")
            st.write("1. Asignación de metadatos\n2. Almacenamiento\n3. Acceso y seguridad\n4. Migración\n5. Disposición final")

# ==========================================
# 3. METODOLOGÍA TVD
# ==========================================
elif opcion == "📑 2. Metodología TVD (AGN)":
    st.title("📑 Elaboración de Tablas de Valoración Documental (TVD)")
    st.markdown("**Radicado AGN 2-2015-02615** | Enfoque para Fondos Acumulados")
    st.markdown("---")
    
    st.subheader("Metodología de Intervención (5 Fases)")
    
    # Diseño de línea de tiempo (Timeline)
    fases = [
        ("1. Compilación", "Historia institucional y marco legal."),
        ("2. Diagnóstico", "Levantamiento físico (m.l., depósitos)."),
        ("3. Plan (PAI)", "Cronograma, presupuesto, EPP."),
        ("4. Ejecución", "Clasificación, ordenación, FUID, valoración."),
        ("5. Propuesta TVD", "Formatos por periodos históricos.")
    ]
    
    cols = st.columns(5)
    for i, (titulo, desc) in enumerate(fases):
        with cols[i]:
            with st.container(border=True):
                st.markdown(f"**{titulo}**")
                st.caption(desc)
                
    st.markdown("---")
    
    # Alerta de los 90 días
    with st.container(border=True):
        st.subheader("⏱️ Flujo de Aprobación y Convalidación (Plazo Máximo: 90 Días)")
        col_ap1, col_ap2 = st.columns(2)
        with col_ap1:
            st.warning("**Paso 1: Aprobación Interna (Art. 8)**\n\n- Comité Interno de Archivo.\n- Concepto favorable.\n- Resolución o Acuerdo del Representante Legal.")
        with col_ap2:
            st.error("**Paso 2: Convalidación Oficial (Art. 11)**\n\n- Radicación ante el AGN.\n- **Plazo máximo e improrrogable: 90 días calendario.**")

# ==========================================
# 4. GESTIÓN DEL RIESGO (ISO 31000)
# ==========================================
elif opcion == "⚠️ 3. Gestión del Riesgo (ISO 31000)":
    st.title("⚠️ Marco de Gestión del Riesgo (NTC-ISO 31000:2018)")
    st.markdown("---")
    
    st.subheader("Proceso Operativo (Cláusula 6)")
    col_r1, col_r2, col_r3 = st.columns(3)
    with col_r1:
        with st.container(border=True):
            st.info("**1. Alcance y Contexto**\nDefinir límites y criterios de evaluación.")
    with col_r2:
        with st.container(border=True):
            st.info("**2. Evaluación**\nIdentificación, Análisis y Valoración del riesgo.")
    with col_r3:
        with st.container(border=True):
            st.info("**3. Tratamiento**\nEvitar, Aceptar, Eliminar, Modificar, Compartir o Retener.")
            
    st.markdown("---")
    st.subheader("Matriz de Riesgos del Caso Práctico")
    
    riesgos_data = {
        "Riesgo": ["Biológico (Salubridad)", "Pérdida de Memoria Histórica", "Incumplimiento de Plazo (90 días)"],
        "Probabilidad": ["Alta", "Media", "Media"],
        "Consecuencia": ["Severa", "Crítica", "Moderada"],
        "Dueño del Riesgo (Risk Owner)": ["Líder de Salud Ocupacional", "Asesor Jurídico", "Director del Proyecto"]
    }
    df_riesgos = pd.DataFrame(riesgos_data)
    
    # CORRECCIÓN: Uso de column_config nativo para evitar errores de Pandas versiones
    st.dataframe(
        df_riesgos, 
        hide_index=True,
        column_config={
            "Riesgo": st.column_config.TextColumn("Riesgo", width="medium"),
            "Probabilidad": st.column_config.TextColumn("Probabilidad", width="small"),
            "Consecuencia": st.column_config.TextColumn("Consecuencia", width="small"),
            "Dueño del Riesgo (Risk Owner)": st.column_config.TextColumn("Dueño del Riesgo", width="medium"),
        },
        use_container_width=True
    )

# ==========================================
# 5. CASO PRÁCTICO
# ==========================================
elif opcion == "🏢 4. Caso Práctico Aplicado":
    st.title("🏢 Caso Práctico: Intervención de Fondo Acumulado")
    
    with st.container(border=True):
        st.markdown("**Escenario:** Entidad pública con **1,500 m.l.** de documentación (1991-2010), afectada por fusiones y reestructuraciones. Un **15%** presenta afección biológica.")
    
    st.markdown("---")
    st.subheader("Desarrollo de los 5 Pasos")
    
    with st.expander("🔍 Paso 1: Diagnóstico Inicial", expanded=True):
        st.write("Inspección física bajo ISO 30301 (Cl 4.1). Identificación del 15% de afección biológica. Reconstrucción de los 3 periodos históricos.")
        
    with st.expander("🛡️ Paso 2: Evaluación de Riesgos", expanded=False):
        st.write("Designación de dueños del riesgo (Risk Owners) según ISO 31000. Tratamiento biológico inmediato y aislamiento con hoja testigo.")
        
    with st.expander("📂 Paso 3: Ejecución Archivística y FUIDs", expanded=False):
        st.write("Clasificación por los 3 periodos. Depuración, foliación y **creación de 3 FUIDs independientes**.")
        st.markdown("""
        - **Periodo I (1991–1995):** Direcciones Generales.
        - **Periodo II (1995–2000):** Subdirecciones Técnicas.
        - **Periodo III (2000–2010):** Módulos Especializados.
        """)
        
    with st.expander("📝 Paso 4: Aprobación y Convalidación (90 días)", expanded=False):
        st.write("Acta de Comité Interno No. 005 y Resolución Institucional No. 0420. Radicación ante el AGN y convalidación exitosa dentro del plazo legal de 90 días.")
        
    with st.expander("♻️ Paso 5: Integración al SGD (Cierre)", expanded=False):
        st.write("Migración de FUIDs a las aplicaciones del SGD (ISO 30301, Cl 8.3). Eliminación del pasivo archivístico e incorporación de lecciones aprendidas a la mejora continua.")
        
    st.markdown("---")
    st.success("✅ **Resultado Final:** Saneamiento institucional, preservación del patrimonio y eliminación de contingencias legales.")