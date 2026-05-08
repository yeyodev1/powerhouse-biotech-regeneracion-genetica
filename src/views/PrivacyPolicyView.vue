<script setup lang="ts">
import { onMounted } from 'vue'

// Scroll to top when component mounts
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <div class="privacy-policy">
    <div class="privacy-policy__container">
      <header class="privacy-policy__header">
        <h1 class="privacy-policy__title">Política de Privacidad</h1>
        <p class="privacy-policy__intro">
          Le damos la bienvenida a <strong>https://www.powerhousebiotech.com.</strong> Su presencia aquí demuestra la importancia que le otorga a sus datos personales. Para nosotros, su privacidad es una prioridad y nos comprometemos a protegerla. En esta política explicamos de forma clara y transparente cómo recogemos, usamos y protegemos su información.
        </p>
        <p class="privacy-policy__legal">
          De conformidad con lo dispuesto en la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP), al aceptar esta Política de Privacidad, usted otorga su consentimiento informado, expreso, libre e inequívoco para que los datos personales que proporcione a través de nuestro sitio web <strong>https://www.powerhousebiotech.com</strong> (en adelante, el "SITIO WEB") sean tratados por nuestra empresa.
        </p>
      </header>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">1. ¿Quién es el Responsable del Tratamiento de sus Datos?</h2>
        <div class="privacy-policy__company-info">
          <p><strong>Razón Social:</strong> PowerHouse Biotech</p>
          <p><strong>RUC:</strong> 0993028428001</p>
          <p><strong>Domicilio:</strong> Samborondón, Guayaquil, Ecuador</p>
          <p><strong>Correo electrónico de contacto:</strong> privacidad@powerhousebiotech.com</p>
          <p><strong>Actividad comercial:</strong> Health Decision Platform en Medicina Regenerativa — Evaluación de Viabilidad Regenerativa™.</p>
        </div>
        <p>
          La presente Política de Privacidad es válida únicamente para los datos de carácter personal obtenidos en el SITIO WEB, no siendo aplicable para aquella información recabada por terceros en otras páginas web, incluso si están enlazadas desde nuestro sitio.
        </p>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">2. ¿Qué Datos Personales Recopilamos y con Qué Finalidad?</h2>
        <p>
          Un dato personal es cualquier información que lo identifica o lo hace identificable. En nuestro SITIO WEB, recopilamos los siguientes datos:
        </p>
        <ul class="privacy-policy__list">
          <li><strong>Formularios de contacto o suscripción:</strong> Nombre, correo electrónico.</li>
          <li><strong>Proceso de compra:</strong> Nombre completo, cédula de identidad o RUC, domicilio completo, y datos de contacto para la facturación y entrega de nuestros servicios o productos.</li>
          <li><strong>Datos de navegación:</strong> Por motivos técnicos, al visitar nuestro sitio se almacena información como la dirección IP, que es asignada por su proveedor de internet.</li>
        </ul>
        
        <h3 class="privacy-policy__subsection-title">Estos datos son tratados con las siguientes finalidades:</h3>
        <ul class="privacy-policy__list">
          <li>Gestionar la Evaluación de Viabilidad Regenerativa™ y la orientación clínica derivada.</li>
          <li>Coordinar y ejecutar visitas técnicas de evaluación.</li>
          <li>Administrar nuestra lista de interesados y enviar comunicaciones sobre nuevos materiales, diseños y ofertas exclusivas.</li>
          <li>Gestionar nuestra red de afiliados y los pagos correspondientes.</li>
          <li>Responder a las consultas y requerimientos de los usuarios.</li>
        </ul>
        
        <p>
          La base que legitima el tratamiento de sus datos es su consentimiento explícito e informado, otorgado al aceptar esta política y marcar las casillas correspondientes antes de enviar un formulario o realizar una compra.
        </p>
        
        <p>
          Únicamente el titular, PowerHouse Biotech, tendrá acceso a sus datos. Le garantizamos que bajo ningún concepto estos datos serán cedidos, compartidos, transferidos ni vendidos a terceros, salvo por obligación legal expresa.
        </p>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">3. Tratamiento de Datos de Menores de Edad</h2>
        <p>
          Nuestros servicios están dirigidos a personas mayores de edad. De acuerdo con la LOPDP del Ecuador, solo las personas mayores de 15 años pueden otorgar su consentimiento para el tratamiento de sus datos personales.
        </p>
        <p>
          Si eres menor de 15 años, es obligatorio contar con el consentimiento de tus padres o tutores legales para que podamos tratar tus datos. No se registre ni proporcione sus datos si no cuenta con dicho consentimiento. Si tenemos constancia de un registro que incumpla esta condición, procederemos a eliminarlo.
        </p>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">4. Cumplimiento de la Normativa Ecuatoriana</h2>
        <p>
          PowerHouse Biotech cumple con las disposiciones de la Ley Orgánica de Protección de Datos Personales (LOPDP) y su reglamento, así como con la demás normativa ecuatoriana aplicable a los servicios de la sociedad de la información y comercio electrónico.
        </p>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">5. Medidas de Seguridad</h2>
        <p>
          Le informamos que hemos implementado las medidas de seguridad técnicas y organizativas necesarias para garantizar la integridad, confidencialidad y disponibilidad de sus datos personales, evitando su alteración, pérdida, tratamiento y/o acceso no autorizado, conforme al estado de la tecnología actual.
        </p>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">6. Ejercicio de sus Derechos</h2>
        <p>La LOPDP le concede los siguientes derechos sobre sus datos personales:</p>
        <ul class="privacy-policy__list">
          <li><strong>Acceso:</strong> Conocer qué datos suyos tenemos y cómo los tratamos.</li>
          <li><strong>Rectificación y Actualización:</strong> Corregir datos inexactos o incompletos.</li>
          <li><strong>Eliminación:</strong> Solicitar que borremos sus datos cuando ya no sean necesarios para la finalidad con que fueron recogidos.</li>
          <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos por motivos personales, siempre que la ley no obligue a dicho tratamiento.</li>
          <li><strong>Portabilidad:</strong> Recibir sus datos en un formato compatible para trasladarlos a otro responsable.</li>
          <li><strong>Suspensión del tratamiento:</strong> Solicitar un cese temporal del tratamiento de sus datos.</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, puede enviar una comunicación escrita a <strong>privacidad@powerhousebiotech.com</strong> con la referencia "Protección de Datos", especificando su solicitud, acreditando su identidad y adjuntando los justificativos pertinentes.
        </p>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">7. Enlaces a Sitios de Terceros</h2>
        <p>
          Nuestro SITIO WEB puede incluir hipervínculos a otros sitios no operados por nosotros. No nos hacemos responsables de la licitud, fiabilidad o prácticas de privacidad de dichos sitios web. Le recomendamos leer sus políticas de privacidad antes de proporcionarles su información personal.
        </p>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">8. Modificación de la Política de Privacidad</h2>
        <p>
          PowerHouse Biotech se reserva el derecho a modificar esta Política de Privacidad para adaptarla a futuras novedades legislativas, jurisprudenciales o a nuevas prácticas del sector. Cualquier modificación será publicada en esta página con una antelación razonable a su efectiva aplicación. El uso continuado del SITIO WEB después de dichos cambios implicará su aceptación.
        </p>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">9. Políticas de Cancelación</h2>
        <p>
          Usted puede cancelar su suscripción o el servicio SaaS en cualquier momento, sin penalidades, conforme a la normativa ecuatoriana aplicable, incluyendo la Ley Orgánica de Defensa del Consumidor del Ecuador.
        </p>

        <h3 class="privacy-policy__subsection-title">Proceso de cancelación</h3>
        <ul class="privacy-policy__list">
          <li>Acceda a su cuenta y diríjase a la sección “Suscripción” o “Facturación”.</li>
          <li>Seleccione “Cancelar suscripción” y confirme la solicitud.</li>
          <li>Alternativamente, puede solicitar la cancelación enviando un correo al contacto indicado en este documento con el asunto “Cancelación de Servicio”.</li>
        </ul>

        <h3 class="privacy-policy__subsection-title">Plazos de efectividad</h3>
        <p>
          La cancelación es efectiva de manera inmediata desde su solicitud. En planes con renovación automática, puede elegir que la cancelación surta efecto al final del ciclo de facturación vigente para mantener acceso hasta esa fecha.
        </p>

        <h3 class="privacy-policy__subsection-title">Reembolsos y créditos proporcionales</h3>
        <ul class="privacy-policy__list">
          <li>Reembolsos completos aplican ante cargos duplicados o errores de cobro.</li>
          <li>Podrán otorgarse créditos proporcionales por el período no utilizado a partir de la fecha de solicitud, cuando el plan lo permita y no existan servicios personalizados ya entregados.</li>
          <li>El procesamiento de reembolsos o créditos se realiza en un plazo máximo de 10 días hábiles, sujeto a los tiempos de la pasarela de pago correspondiente.</li>
        </ul>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">10. Devoluciones y Reembolsos</h2>
        <p>
          Las devoluciones se rigen por las condiciones aplicables a servicios digitales. Nos comprometemos a tratar cada solicitud de manera transparente y conforme a la normativa vigente.
        </p>

        <h3 class="privacy-policy__subsection-title">Condiciones de aplicación</h3>
        <ul class="privacy-policy__list">
          <li>Errores de facturación o cobros no autorizados.</li>
          <li>Indisponibilidad prolongada del servicio atribuible al proveedor, no derivada de causas de fuerza mayor.</li>
          <li>Incumplimiento material de las funcionalidades contratadas, debidamente acreditado.</li>
        </ul>

        <h3 class="privacy-policy__subsection-title">Proceso para solicitar reembolso</h3>
        <ul class="privacy-policy__list">
          <li>Envíe su solicitud al correo de contacto indicado en este documento con el asunto “Solicitud de Reembolso”.</li>
          <li>Incluya: nombre completo, correo registrado, referencia de pago, fecha del cargo y una descripción clara del motivo.</li>
          <li>Adjunte comprobantes (factura, capturas del cargo o evidencia técnica del incidente, si corresponde).</li>
        </ul>

        <h3 class="privacy-policy__subsection-title">Plazos de procesamiento</h3>
        <p>
          Evaluaremos su solicitud y le notificaremos la resolución en un plazo máximo de 10 días hábiles. De proceder, el reembolso se cursará por la misma pasarela o método de pago utilizado, sujeto a sus tiempos operativos.
        </p>

        <h3 class="privacy-policy__subsection-title">Excepciones</h3>
        <ul class="privacy-policy__list">
          <li>Servicios de consultoría ya prestados o personalizados entregados.</li>
          <li>Promociones marcadas expresamente como “no reembolsables”.</li>
          <li>Comisiones, cargos de terceros o impuestos ajenos al proveedor.</li>
        </ul>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">11. Alcance y Limitaciones del Servicio</h2>
        <p>
          Nuestro servicio es exclusivamente digital; no incluye garantías físicas ni bienes tangibles. El servicio se presta “tal cual”, con soporte razonable, actualizaciones y mejoras continuas. No garantizamos resultados específicos, ya que estos dependen de factores externos y del uso que realice el usuario.
        </p>
      </section>

      <section class="privacy-policy__section">
        <h2 class="privacy-policy__section-title">12. Responsabilidades y Derechos de las Partes</h2>
        <ul class="privacy-policy__list">
          <li><strong>Del proveedor:</strong> Brindar acceso al servicio, mantener medidas de seguridad acordes al estado de la técnica, ofrecer soporte en tiempos razonables y cumplir la normativa aplicable.</li>
          <li><strong>Del usuario:</strong> Hacer uso lícito del servicio, mantener actualizados sus datos de pago, respetar los términos de uso, no vulnerar derechos de terceros y proteger sus credenciales.</li>
          <li>Ambas partes reconocen que en caso de controversia se actuará conforme a la normativa ecuatoriana aplicable y los mecanismos de resolución amistosa antes de escalar a instancias formales.</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.privacy-policy {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .privacy-policy {
    padding: 1rem 0;
  }
}

.privacy-policy__container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .privacy-policy__container {
    padding: 0 1rem;
  }
}

.privacy-policy__header {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .privacy-policy__header {
    padding: 2rem 1.5rem;
    margin-bottom: 1.5rem;
  }
}

.privacy-policy__title {
  font-family: 'Poppins', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: #D4A373;
  margin-bottom: 1.5rem;
  text-align: center;
}

@media (max-width: 768px) {
  .privacy-policy__title {
    font-size: 2.2rem;
    margin-bottom: 1rem;
  }
}

.privacy-policy__intro {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #4A5568;
  margin-bottom: 1.5rem;
  text-align: justify;
}

@media (max-width: 768px) {
  .privacy-policy__intro {
    font-size: 1rem;
    line-height: 1.6;
  }
}

.privacy-policy__legal {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #4A5568;
  font-style: italic;
  background: rgba(212, 163, 115, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #D4A373;
  text-align: justify;
}

@media (max-width: 768px) {
  .privacy-policy__legal {
    font-size: 0.9rem;
    padding: 1rem;
  }
}

.privacy-policy__section {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .privacy-policy__section {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
}

.privacy-policy__section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #BC6C25;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(188, 108, 37, 0.2);
}

@media (max-width: 768px) {
  .privacy-policy__section-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
}

.privacy-policy__subsection-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #4A5568;
  margin: 1.5rem 0 1rem 0;
}

@media (max-width: 768px) {
  .privacy-policy__subsection-title {
    font-size: 1.1rem;
    margin: 1rem 0 0.8rem 0;
  }
}

.privacy-policy__company-info {
  background: rgba(212, 163, 115, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.privacy-policy__company-info p {
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
  color: #4A5568;
}

.privacy-policy__company-info p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .privacy-policy__company-info {
    padding: 1rem;
  }
}

.privacy-policy__list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.privacy-policy__list li {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #4A5568;
  margin-bottom: 0.8rem;
  padding-left: 1.5rem;
  position: relative;
  text-align: justify;
}

.privacy-policy__list li::before {
  content: '•';
  color: #D4A373;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}

@media (max-width: 768px) {
  .privacy-policy__list li {
    font-size: 0.9rem;
    padding-left: 1.2rem;
  }
}

.privacy-policy p {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #4A5568;
  margin-bottom: 1rem;
  text-align: justify;
}

@media (max-width: 768px) {
  .privacy-policy p {
    font-size: 0.9rem;
    line-height: 1.5;
  }
}

.privacy-policy p strong {
  color: #BC6C25;
  font-weight: 600;
}
</style>
