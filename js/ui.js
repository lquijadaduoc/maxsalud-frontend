const UI = {
    showLoading() {
        document.getElementById('loadingSpinner').classList.remove('d-none');
        document.getElementById('resultsSection').classList.add('d-none');
    },
    
    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('d-none');
    },
    
    renderResults(responseData) {
        this.hideLoading();
        
        if (!responseData.data || !Array.isArray(responseData.data)) {
            this.showError('La respuesta de la API no tiene el formato esperado');
            return;
        }
        
        const data = responseData.data;
        
        if (data.length === 0) {
            this.showError('No se encontraron pacientes con los filtros aplicados');
            return;
        }
        
        // Mostrar sección de resultados
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.remove('d-none');
        
        // Actualizar estadísticas
        this.updateStatistics(data);
        
        // Mostrar filtros aplicados
        this.showAppliedFilters(responseData.filtros);
        
        // Renderizar tabla
        this.renderTable(data);
        
        // Scroll suave a resultados
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    
    updateStatistics(data) {
        // Total de pacientes
        document.getElementById('totalPacientes').textContent = data.length;
        
        // Edad promedio
        const edadPromedio = data.reduce((sum, p) => sum + (p.edad || 0), 0) / data.length;
        document.getElementById('edadPromedio').textContent = Math.round(edadPromedio);
        
        // Total gastado
        const totalGastado = data.reduce((sum, p) => sum + (p.totalGastado || 0), 0);
        document.getElementById('totalGastado').textContent = `$${totalGastado.toLocaleString('es-CL')}`;
        
        // Morosos (estado contiene "MOROSO")
        const morosos = data.filter(p => p.estado && p.estado.includes('MOROSO')).length;
        document.getElementById('totalMorosos').textContent = morosos;
    },
    
    showAppliedFilters(filtros) {
        const container = document.getElementById('appliedFilters');
        const badges = [];
        
        if (filtros.edadDesde !== undefined && filtros.edadHasta !== undefined) {
            badges.push(`<span class="badge bg-info">
                <i class="bi bi-calendar-range me-1"></i>
                Edad: ${filtros.edadDesde} - ${filtros.edadHasta} años
            </span>`);
        }
        
        if (filtros.tipoSalud) {
            badges.push(`<span class="badge bg-success">
                <i class="bi bi-hospital me-1"></i>
                ${filtros.tipoSalud}
            </span>`);
        }
        
        if (filtros.tieneMorosidad) {
            const badgeClass = filtros.tieneMorosidad === 'SI' ? 'bg-danger' : 
                              filtros.tieneMorosidad === 'NO' ? 'bg-success' : 'bg-secondary';
            badges.push(`<span class="badge ${badgeClass}">
                <i class="bi bi-exclamation-triangle me-1"></i>
                Morosidad: ${filtros.tieneMorosidad}
            </span>`);
        }
        
        container.innerHTML = badges.join('');
    },
    
    renderTable(data) {
        const headers = Object.keys(data[0] || {});
        const tableHeaders = document.getElementById('tableHeaders');
        tableHeaders.innerHTML = headers.map(h => `<th>${this.formatHeader(h)}</th>`).join('');
        
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = data.map(row => `
            <tr>
                ${headers.map(h => `<td>${this.formatValue(h, row[h])}</td>`).join('')}
            </tr>
        `).join('');
    },
    
    formatHeader(header) {
        const translations = {
            'run': 'RUN',
            'dv': 'DV',
            'nombre': 'Nombre',
            'edad': 'Edad',
            'descuentoPorEdad': 'Descuento Edad',
            'tipoSalud': 'Tipo Salud',
            'planSalud': 'Plan Salud',
            'totalAtenciones': 'Atenciones',
            'totalGastado': 'Total Gastado',
            'atencionesMorosas': 'Atenciones Morosas',
            'totalMultas': 'Multas',
            'estado': 'Estado'
        };
        return translations[header] || header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    },
    
    formatValue(key, value) {
        if (value === null || value === undefined) return '-';
        
        const keyLower = key.toLowerCase();
        
        // Estado con badge
        if (keyLower === 'estado') {
            const badgeClass = value.includes('MOROSO') ? 'bg-danger' : 'bg-success';
            const displayValue = value.replace(/\?\?/g, 'Í');
            return `<span class="badge ${badgeClass}">${displayValue}</span>`;
        }
        
        // Descuentos (pueden venir como número o string con %)
        if (keyLower.includes('descuento')) {
            if (typeof value === 'string') {
                return value;
            }
            return value === 0 ? '0%' : `${value}%`;
        }
        
        // Moneda
        if ((keyLower.includes('total') || keyLower.includes('multa') || keyLower.includes('gastado')) && typeof value === 'number') {
            return `$${Number(value).toLocaleString('es-CL')}`;
        }
        
        // Limpiar caracteres raros
        if (typeof value === 'string') {
            return value.replace(/\?\?/g, 'Í');
        }
        
        return value;
    },
    
    showError(message) {
        this.hideLoading();
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.add('d-none');
        
        // Limpiar mensajes anteriores
        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) {
            console.error('No se encontró el contenedor de mensajes');
            return;
        }
        
        messageContainer.innerHTML = '';
        
        // Crear alerta bootstrap
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning alert-dismissible fade show';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-info-circle-fill fs-4 me-3"></i>
                <div>
                    <strong>Sin resultados</strong>
                    <p class="mb-0">${message}</p>
                </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        messageContainer.appendChild(alertDiv);
        
        // Scroll al mensaje
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-eliminar después de 8 segundos
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 8000);
    },
    
    showApiError(message) {
        this.hideLoading();
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.add('d-none');
        
        // Limpiar mensajes anteriores
        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) {
            console.error('No se encontró el contenedor de mensajes');
            return;
        }
        
        messageContainer.innerHTML = '';
        
        // Crear alerta de error
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                <div>
                    <strong>Error de conexión</strong>
                    <p class="mb-0">${message}</p>
                </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        messageContainer.appendChild(alertDiv);
        
        // Scroll al mensaje
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-eliminar después de 10 segundos
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 10000);
    }
};

// Función para exportar a Excel (placeholder)
function exportToExcel() {
    alert('Función de exportación en desarrollo');
}

