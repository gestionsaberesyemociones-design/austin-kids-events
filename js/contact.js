/* ==========================================================================
   AUSTIN KIDS EVENTS - FORMULARIO DE COTIZACIÓN (CONTACT.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quoteForm');
    const submitBtn = document.getElementById('formSubmitBtn');
    const successCard = document.getElementById('formSuccessMessage');
    const sendAnotherBtn = document.getElementById('btnSendAnother');

    // 1. FECHA MÍNIMA: Bloquear fechas pasadas
    const dateInput = document.querySelector('input[name="Event Date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // 2. PRESELECCIÓN AUTOMÁTICA DE SETUP DESDE URL (ej: /contact-us?setup=texas-ranch)
    const urlParams = new URLSearchParams(window.location.search);
    const setupParam = urlParams.get('setup');
    const setupSelect = document.querySelector('select[name="Setup Requested"]');

    if (setupParam && setupSelect) {
        const cleanParam = setupParam.toLowerCase().replace(/[^a-z]/g, '');
        for (let i = 0; i < setupSelect.options.length; i++) {
            const optValue = setupSelect.options[i].value.toLowerCase().replace(/[^a-z]/g, '');
            if (optValue && (optValue.includes(cleanParam) || cleanParam.includes(optValue))) {
                setupSelect.selectedIndex = i;
                break;
            }
        }
    }

    // 3. FORMATEO AUTOMÁTICO DE TELÉFONO (512) 123-4567
    const phoneInput = document.querySelector('input[name="Phone Number"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            
            if (value.length >= 7) {
                e.target.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length >= 4) {
                e.target.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length >= 1) {
                e.target.value = `(${value}`;
            }
        });
    }

    // 4. ENVÍO ASÍNCRONO DEL FORMULARIO
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentLang = document.body.dataset.lang || 'es';

            // Deshabilitar botón y mostrar estado de carga
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = currentLang === 'es'
                    ? '<span>Enviando tu solicitud...</span> ⏳'
                    : '<span>Sending your request...</span> ⏳';
            }

            const formData = new FormData(form);

            // Obtener valores para mostrar en el resumen de éxito
            const firstName = formData.get('First Name') || 'there';
            const setupName = formData.get('Setup Requested') || 'Kids Party Setup';
            const eventDate = formData.get('Event Date') || '';
            const location = formData.get('Event Location') || 'Private home';

            // DETECCIÓN INTELIGENTE DE ENTORNO:
            // Si abres el archivo en tu PC localmente (file:// o localhost), usa el endpoint de prueba directo.
            // Si está subido en tu hosting Namecheap (dominio web), usa send-email.php nativo.
            const isLocal = window.location.protocol === 'file:' || 
                            window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' ||
                            !window.location.hostname;

            let endpoint = new URL(form.getAttribute('action') || 'send-email.php', window.location.href).href;
            if (isLocal) {
                endpoint = 'https://formsubmit.co/ajax/gestionsaberesyemociones@gmail.com';
                formData.append('_template', 'table');
                formData.append('_subject', `🎉 Nueva Cotización (Prueba Local): ${setupName} - ${firstName}`);
            }

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Ocultar formulario y mostrar tarjeta de éxito
                    form.style.display = 'none';
                    if (successCard) {
                        const successCustomerName = document.getElementById('successCustomerName');
                        const successSetup = document.getElementById('successSetup');
                        const successDate = document.getElementById('successDate');
                        const successLocation = document.getElementById('successLocation');

                        if (successCustomerName) successCustomerName.textContent = firstName;
                        if (successSetup) successSetup.textContent = setupName;
                        if (successDate) successDate.textContent = eventDate;
                        if (successLocation) successLocation.textContent = location;
                        successCard.style.display = 'block';
                        successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    throw new Error(result.message || 'Form submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                const currentLang = document.body.dataset.lang || 'es';
                alert(currentLang === 'es'
                    ? `No pudimos enviar tu solicitud: ${error.message}`
                    : `We could not send your request: ${error.message}`);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = currentLang === 'es'
                        ? '<span class="btn-text">Solicitar cotización</span> <span class="btn-arrow">→</span>'
                        : '<span class="btn-text">Request a quote</span> <span class="btn-arrow">→</span>';
                }
            }
        });
    }

    // 5. BOTÓN ENVIAR OTRA SOLICITUD
    if (sendAnotherBtn && form && successCard) {
        sendAnotherBtn.addEventListener('click', () => {
            form.reset();
            form.style.display = 'grid';
            successCard.style.display = 'none';
            if (submitBtn) {
                const currentLang = document.body.dataset.lang || 'es';
                submitBtn.disabled = false;
                submitBtn.innerHTML = currentLang === 'es'
                    ? '<span class="btn-text">Solicitar cotización</span> <span class="btn-arrow">→</span>'
                    : '<span class="btn-text">Request a quote</span> <span class="btn-arrow">→</span>';
            }
        });
    }
});
