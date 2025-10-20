const API = {
    async buscarPacientes(filtros) {
        try {
            // Construir la URL con parámetros
            const params = new URLSearchParams();
            
            if (filtros.edadDesde !== null && filtros.edadDesde !== undefined) {
                params.append('edadDesde', filtros.edadDesde);
            }
            
            if (filtros.edadHasta !== null && filtros.edadHasta !== undefined) {
                params.append('edadHasta', filtros.edadHasta);
            }
            
            if (filtros.tipoSalud) {
                params.append('tipoSalud', filtros.tipoSalud);
            }
            
            if (filtros.tieneMorosidad) {
                params.append('tieneMorosidad', filtros.tieneMorosidad);
            }
            
            const url = `${CONFIG.API_BASE_URL}/buscar?${params.toString()}`;
            console.log('Fetching from:', url);
            
            const response = await fetch(url);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const responseData = await response.json();
            console.log('Response received:', responseData);
            
            return responseData;
            
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

