let citas = [];
let editandoId = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarCitas();
    
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (editandoId) {
            actualizarCita();
        } else {
            agregarCita();
        }
    });
});

function formatearTelefono(t) {
    const soloDigitos = String(t).replace(/\D/g, '');
    return soloDigitos.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}

function validarDatos() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const fechaNacimiento = document.getElementById('FechaNacimiento').value.trim();
    const dni = document.getElementById('DNI').value.trim();
    const fechaCita = document.getElementById('fecha').value.trim();
    const hora = document.getElementById('Hora').value.trim();
    
    const regexNombre = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/;
    if (!regexNombre.test(nombre)) {
        alert('El nombre solo debe contener letras');
        return false;
    }
    
    if (!regexNombre.test(apellidos)) {
        alert('Los apellidos solo deben contener letras');
        return false;
    }
    
    const regexTelefono = /^\d{9}$/;
    if (!regexTelefono.test(telefono)) {
        alert('El teléfono debe contener exactamente 9 dígitos');
        return false;
    }
    
    const regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regexFecha.test(fechaNacimiento)) {
        alert('La fecha de nacimiento debe tener el formato DD/MM/AAAA');
        return false;
    }
    
    const partesF = fechaNacimiento.split('/');
    const fechaNac = new Date(partesF[2], partesF[1] - 1, partesF[0]);
    if (fechaNac > new Date()) {
        alert('La fecha de nacimiento no puede ser futura');
        return false;
    }
    
    const regexDNI = /^\d{8}[A-Z]$/i;
    if (!regexDNI.test(dni)) {
        alert('El DNI debe tener 8 dígitos seguidos de una letra');
        return false;
    }
    
    if (!regexFecha.test(fechaCita)) {
        alert('La fecha de cita debe tener el formato DD/MM/AAAA');
        return false;
    }
    
    const partesCita = fechaCita.split('/');
    const fechaCitaObj = new Date(partesCita[2], partesCita[1] - 1, partesCita[0]);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaCitaObj < hoy) {
        alert('La fecha de cita no puede ser anterior a hoy');
        return false;
    }
    
    const regexHora = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!regexHora.test(hora)) {
        alert('La hora debe tener el formato HH:MM (ej: 09:30)');
        return false;
    }
    
    return true;
}

function agregarCita() {
    if (!validarDatos()) {
        return;
    }
    
    const cita = {
        id: Date.now(),
        nombre: document.getElementById('nombre').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        fechaNacimiento: document.getElementById('FechaNacimiento').value.trim(),
        dni: document.getElementById('DNI').value.trim().toUpperCase(),
        fechaCita: document.getElementById('fecha').value.trim(),
        hora: document.getElementById('Hora').value.trim(),
        observaciones: document.getElementById('mensaje').value.trim()
    };
    
    citas.push(cita);
    guardarCitas();
    mostrarCitas();
    
    document.getElementById('contactForm').reset();
    
    alert('Cita agregada correctamente');
}

function editarCita(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        document.getElementById('nombre').value = cita.nombre;
        document.getElementById('apellidos').value = cita.apellidos;
        document.getElementById('telefono').value = cita.telefono;
        document.getElementById('FechaNacimiento').value = cita.fechaNacimiento;
        document.getElementById('DNI').value = cita.dni;
        document.getElementById('fecha').value = cita.fechaCita;
        document.getElementById('Hora').value = cita.hora;
        document.getElementById('mensaje').value = cita.observaciones;
        
        const btnSubmit = document.querySelector('.btn-submit');
        btnSubmit.textContent = 'Actualizar';
        btnSubmit.style.backgroundColor = '#28a745';
        
        editandoId = id;
        
        document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' });
    }
}

function actualizarCita() {
    if (!validarDatos()) {
        return;
    }
    
    const index = citas.findIndex(c => c.id === editandoId);
    if (index !== -1) {
        citas[index] = {
            id: editandoId,
            nombre: document.getElementById('nombre').value.trim(),
            apellidos: document.getElementById('apellidos').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            fechaNacimiento: document.getElementById('FechaNacimiento').value.trim(),
            dni: document.getElementById('DNI').value.trim().toUpperCase(),
            fechaCita: document.getElementById('fecha').value.trim(),
            hora: document.getElementById('Hora').value.trim(),
            observaciones: document.getElementById('mensaje').value.trim()
        };
        
        guardarCitas();
        mostrarCitas();
        
        document.getElementById('contactForm').reset();
        const btnSubmit = document.querySelector('.btn-submit');
        btnSubmit.textContent = 'Generar cita';
        btnSubmit.style.background = 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)';
        editandoId = null;
        
        alert('Cita actualizada correctamente');
    }
}

function mostrarCitas() {
    const tbody = document.getElementById('citasTableBody');
    tbody.innerHTML = '';
    
    if (citas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 2rem; color: #64748b; font-size: 1.1rem; font-weight: 600;">Dato vacío</td></tr>';
        return;
    }
    
    citas.forEach((cita, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align: center; font-weight: 700; color: #0369a1;">${index + 1}</td>
            <td style="text-align: center;">${cita.nombre}</td>
            <td style="text-align: center;">${cita.apellidos}</td>
            <td style="text-align: center;">${cita.dni}</td>
            <td style="text-align: center;">${cita.fechaNacimiento}</td>
            <td style="pointer-events: none; cursor: default; white-space: nowrap; text-align: center;">${formatearTelefono(cita.telefono)}</td>
            <td style="text-align: center;">${cita.fechaCita}</td>
            <td style="text-align: center;">${cita.hora}</td>
            <td style="text-align: center;">${cita.observaciones || '-'}</td>
            <td style="text-align: center;">
                <button onclick="editarCita(${cita.id})" class="btn-edit" style="margin-right: 0.5rem; padding: 0.4rem 0.8rem; background: #08c15eff; color: white; border: none; border-radius: 6px; cursor: pointer;"> Modificar</button>
                <button onclick="eliminarCita(${cita.id})" class="btn-delete" style="padding: 0.4rem 0.8rem; background: #d19cacff; color: white; border: none; border-radius: 6px; cursor: pointer;"> Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function eliminarCita(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
        citas = citas.filter(cita => cita.id !== id);
        guardarCitas();
        mostrarCitas();
    }
}

function guardarCitas() {
    localStorage.setItem('citas', JSON.stringify(citas));
}

function cargarCitas() {
    const citasGuardadas = localStorage.getItem('citas');
    if (citasGuardadas) {
        citas = JSON.parse(citasGuardadas);
        mostrarCitas();
    }
}