document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Script cargado correctamente');
    
    const searchForm = document.getElementById('searchForm');
    const edadDesde = document.getElementById('edadDesde');
    const edadHasta = document.getElementById('edadHasta');
    const rangeDisplay = document.getElementById('rangeDisplay');
    
    console.log('✅ Elementos del DOM encontrados:', {
        searchForm: !!searchForm,
        edadDesde: !!edadDesde,
        edadHasta: !!edadHasta,
        rangeDisplay: !!rangeDisplay
    });
    
    // Actualizar display del rango de edad en tiempo real
    function updateRangeDisplay() {
        if (rangeDisplay) {
            rangeDisplay.textContent = `${edadDesde.value} y ${edadHasta.value}`;
        }
    }
    
    if (edadDesde && edadHasta) {
        edadDesde.addEventListener('input', updateRangeDisplay);
        edadHasta.addEventListener('input', updateRangeDisplay);
    }
    
    // Envío del formulario
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('🔍 Formulario enviado');
            
            // Obtener valores del formulario
            const formData = {
                edadDesde: parseInt(edadDesde.value),
                edadHasta: parseInt(edadHasta.value),
                tipoSalud: document.getElementById('tipoSalud').value,
                tieneMorosidad: document.querySelector('input[name="tieneMorosidad"]:checked').value
            };
            
            console.log('📋 Datos del formulario:', formData);
            
            // Validar el formulario (validación simple en línea)
            if (formData.edadDesde > formData.edadHasta) {
                alert('La edad "Desde" no puede ser mayor que la edad "Hasta"');
                return;
            }
            
            // Marcar campos como válidos
            edadDesde.classList.remove('is-invalid');
            edadDesde.classList.add('is-valid');
            edadHasta.classList.remove('is-invalid');
            edadHasta.classList.add('is-valid');
            
            // Realizar búsqueda
            await buscarPacientes(formData);
        });
    }
    
    // Limpiar formulario
    if (searchForm) {
        searchForm.addEventListener('reset', () => {
            setTimeout(() => {
                edadDesde.classList.remove('is-valid', 'is-invalid');
                edadHasta.classList.remove('is-valid', 'is-invalid');
                updateRangeDisplay();
                
                // Ocultar resultados
                document.getElementById('resultsSection').classList.add('d-none');
            }, 0);
        });
    }
    
    // Función para buscar pacientes
    async function buscarPacientes(filtros) {
        console.log('🚀 Iniciando búsqueda con filtros:', filtros);
        
        // Limpiar mensajes anteriores
        const messageContainer = document.getElementById('messageContainer');
        if (messageContainer) {
            messageContainer.innerHTML = '';
        }
        
        UI.showLoading();
        
        try {
            const responseData = await API.buscarPacientes(filtros);
            console.log('📥 Respuesta recibida:', responseData);
            
            if (responseData.success) {
                UI.renderResults(responseData);
            } else {
                UI.showApiError(responseData.message || 'Error al buscar pacientes');
            }
        } catch (error) {
            console.error('❌ Error:', error);
            UI.showApiError(error.message || 'Error al conectar con el servidor. Verifique que el backend esté corriendo en http://localhost:8080');
        }
    }
    
    // Inicializar display
    updateRangeDisplay();
    console.log('✅ Inicialización completada');
});

