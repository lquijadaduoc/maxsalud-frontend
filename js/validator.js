const Validator = {
    validateEdad(edad) {
        const num = parseInt(edad);
        return !isNaN(num) && num >= 0 && num <= 120;
    },
    
    validateRangoEdad(desde, hasta) {
        const desdeNum = parseInt(desde);
        const hastaNum = parseInt(hasta);
        
        if (!this.validateEdad(desdeNum) || !this.validateEdad(hastaNum)) {
            return {
                valid: false,
                message: 'Las edades deben estar entre 0 y 120 años'
            };
        }
        
        if (desdeNum > hastaNum) {
            return {
                valid: false,
                message: 'La edad "Desde" no puede ser mayor que la edad "Hasta"'
            };
        }
        
        return { valid: true };
    },
    
    validateMorosidad(valor) {
        const valoresPermitidos = ['TODOS', 'SI', 'NO'];
        return valoresPermitidos.includes(valor);
    },
    
    validateForm(formData) {
        const errors = [];
        
        // Validar rango de edad
        const rangoValidation = this.validateRangoEdad(formData.edadDesde, formData.edadHasta);
        if (!rangoValidation.valid) {
            errors.push(rangoValidation.message);
        }
        
        // Validar morosidad
        if (!this.validateMorosidad(formData.tieneMorosidad)) {
            errors.push('Valor de morosidad no válido');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
};
    
    /**
     * Muestra el estado de validación en tiempo real
     */
    updateValidationStatus(value) {
        const statusDiv = document.getElementById('validationStatus');
        
        if (!value || value.trim() === '') {
            statusDiv.innerHTML = `
                <div class="text-muted">
                    <i class="bi bi-info-circle me-2"></i>
                    Complete los parámetros para ver el estado de validación
                </div>
            `;
            return;
        }
        
        const validation = this.validateTipoReporte(value);
        
        if (validation.valid) {
            statusDiv.innerHTML = `
                <div class="alert alert-success mb-0">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    <strong>Parámetros válidos</strong>
                    <ul class="mb-0 mt-2">
                        <li>Tipo de reporte: <code>${validation.value}</code></li>
                        <li>Formato: VARCHAR2 </li>
                        <li>Valor permitido: </li>
                    </ul>
                </div>
            `;
        } else {
            statusDiv.innerHTML = `
                <div class="alert alert-danger mb-0">
                    <i class="bi bi-x-circle-fill me-2"></i>
                    <strong>Errores de validación:</strong>
                    <ul class="mb-0 mt-2">
                        ${validation.errors.map(err => `<li>${err}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
};
