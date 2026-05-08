<script setup lang="ts">
import { onMounted } from 'vue'

// Scroll to top when component mounts
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <div class="legal-notice">
    <div class="legal-notice__container">
      <header class="legal-notice__header">
        <h1 class="legal-notice__title">Aviso Legal - Términos de Uso del Sitio y Condiciones de Contratación</h1>
        <p class="legal-notice__subtitle">Última actualización el 05 de Mayo del 2025</p>
      </header>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">1. AVISO LEGAL Y TÉRMINOS DE USO</h2>
        <p>PowerHouse Biotech es denominado en este documento como el PROVEEDOR y usted el CLIENTE quién recibe nuestros productos o servicios (gratuitos o de pago)</p>
        <p>Puedo garantizarte que te encuentras en un espacio 100 % seguro, para ello debes saber:</p>
        
        <h3 class="legal-notice__subsection-title">1.1. DATOS IDENTIFICATIVOS DEL RESPONSABLE</h3>
        <p>Tal y como recoge la normativa vigente, le informo que:</p>
        <ul>
          <li>Mi denominación social es: PowerHouse Biotech</li>
          <li>Mi domicilio social se encuentra en Dirección: Samborondón, Guayaquil, Ecuador</li>
          <li>Email: legal@powerhousebiotech.com</li>
          <li>Mi Servicios profesionales es: Health Decision Platform en Medicina Regenerativa</li>
        </ul>

        <h3 class="legal-notice__subsection-title">1.2. FINALIDAD DE LA PÁGINA WEB</h3>
        <p>Los servicios prestados por el responsable de la página web son los siguientes:</p>
        <ol>
          <li>Evaluación de Viabilidad Regenerativa™ y orientación clínica regenerativa.</li>
          <li>La venta de materiales y acabados de alta gama.</li>
          <li>Gestionar la lista de interesados y usuarios adscritos a la web.</li>
          <li>Contenido educativo sobre medicina regenerativa, biomarcadores y prevención clínica. La información publicada NO sustituye al médico tratante ni constituye diagnóstico clínico individual.</li>
          <li>Dirigir su red de colaboradores así como la gestión de pagos de los mismos</li>
        </ol>

        <h3 class="legal-notice__subsection-title">1.3. USUARIOS</h3>
        <p>El acceso y/o uso de este sitio web atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, los presentes términos de uso, no obstante, por el mero uso de la página web no significa el inicio de relación laboral/comercial alguna.</p>

        <h3 class="legal-notice__subsection-title">1.4. USO DEL SITIO WEB Y CAPTURA DE INFORMACIÓN</h3>
        
        <h4 class="legal-notice__subsubsection-title">1.4.1 USO DEL SITIO WEB</h4>
        <p>La página web proporciona el acceso a artículos, informaciones, servicios y datos (en adelante, "los contenidos") propiedad de PowerHouse Biotech. El USUARIO asume la responsabilidad del uso de la web.</p>
        
        <p>El USUARIO se compromete a hacer un uso adecuado de los contenidos que ofrece a través de su web y con carácter enunciativo pero no limitativo, a no emplearlos para:</p>
        <ul>
          <li>(a) incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público;</li>
          <li>(b) difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos;</li>
          <li>(c) provocar daños en los sistemas físicos y lógicos de la web, de sus proveedores o de terceras personas, introducir o difundir en la red virus informáticos o cualesquiera otros sistemas físicos o lógicos que sean susceptibles de provocar los daños anteriormente mencionados;</li>
          <li>(d) intentar acceder y, en su caso, utilizar las cuentas de correo electrónico de otros usuarios y modificar o manipular sus mensajes.</li>
        </ul>

        <p>PowerHouse Biotech se reserva el derecho de retirar todos aquellos comentarios y aportaciones que vulneren el respeto a la dignidad de la persona, que sean discriminatorios, xenófobos, racistas, pornográficos, que atenten contra la juventud o la infancia, el orden o la seguridad pública o que, a su juicio, no resultaran adecuados para su publicación.</p>

        <h4 class="legal-notice__subsubsection-title">1.4.2 CAPTURA DE INFORMACIÓN</h4>
        <ul>
          <li>Formulario de contacto, donde el USUARIO deberá rellenar el campo de correo electrónico, asunto y nombre.</li>
          <li>Formulario de suscripción, rellenando el USUARIO los campos necesarios para la suscripción a la web con los campos de nombre, y email</li>
          <li>Formulario de venta, rellenando el USUARIO los campos necesarios para la venta con los campos de nombre, email, dirección y DNI.</li>
        </ul>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">2. PROPIEDAD INTELECTUAL E INDUSTRIAL</h2>
        <p>PowerHouse Biotech por sí o como cesionario, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.), titularidad de PowerHouse Biotech o bien de sus licenciantes. Todos los derechos reservados.</p>
        
        <p>Cualquier uso no autorizado previamente por PowerHouse Biotech será considerado un incumplimiento grave de los derechos de propiedad intelectual o industrial del autor.</p>
        
        <p>Queda terminantemente prohibido compartir la licencia para uso con más personas, cada licencia es personal e intransferible reservándonos cuantas acciones civiles y penales nos asistan en aras de salvaguardar nuestros derechos, todo ello bajo apercibimiento de incurrir en un delito contra la propiedad intelectual.</p>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">3. EXCLUSIÓN DE GARANTÍAS Y RESPONSABILIDAD</h2>
        <p>PowerHouse Biotech no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: por errores u omisiones en los contenidos, por falta de disponibilidad del sitio web, – el cual realizará paradas periódicas por mantenimientos técnicos – así como por la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.</p>
        
        <p>Usted comprende y acepta que el valor que obtendrá del Programa será en proporción al nivel de esfuerzo que realice; su nivel de comprensión; su experiencia, habilidades, nivel de deseo y disposición para tomar acciones con respecto a la información proporcionada; y factores externos como eventos mundiales, condiciones del mercado, empleo, relaciones y otras incógnitas.</p>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">4. MODIFICACIONES</h2>
        <p>PowerHouse Biotech se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su web, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su web.</p>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">5. POLÍTICA DE ENLACES</h2>
        <p>Las personas o entidades que pretendan realizar o realicen un hiperenlace desde una página web de otro portal de Internet a la web de PowerHouse Biotech deberá someterse las siguientes condiciones:</p>
        <ol>
          <li>No se permite la reproducción total o parcial de ninguno de los servicios ni contenidos del sitio web sin la previa autorización expresa de PowerHouse Biotech</li>
          <li>No se establecerán deep-links ni enlaces IMG o de imagen, ni frames con la web de PowerHouse Biotech sin su previa autorización expresa.</li>
          <li>No se establecerá ninguna manifestación falsa, inexacta o incorrecta sobre la web de PowerHouse Biotech, ni sobre los servicios o contenidos de la misma.</li>
        </ol>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">6. DERECHO DE EXCLUSIÓN</h2>
        <p>PowerHouse Biotech se reserva el derecho a denegar o retirar el acceso al portal y/o los servicios ofrecidos sin necesidad de preaviso, a instancia propia o de un tercero, a aquellos usuarios que incumplan las presentes Condiciones Generales de Uso.</p>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">7. CONDICIONES DE VENTA</h2>
        <p>Las presentes condiciones generales tienen por objeto regular expresamente las condiciones aplicables a los procesos de contratación llevados a cabo por los usuarios "Cliente" de los servicios de asesoría y construcción ofrecido por parte de PowerHouse Biotech a través de su sitio web.</p>
        
        <p>Para proceder al pago, el cliente tiene a su disposición los siguientes medios:</p>
        <p>Visa/Mastercard/American Express; el usuario deberá proporcionar el nombre del titular de la tarjeta, el número, la fecha de caducidad y el CVV.</p>
        
        <p>Toda la información será tramitada a través de pasarelas de pagos externa a PowerHouse Biotech como Stripe o similares.</p>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">8. LEY APLICABLE Y JURISDICCIÓN</h2>
        <p>La relación entre PowerHouse Biotech y el CLIENTE se regirá por la normativa de Ecuador y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Guayaquil, salvo que la Ley aplicable disponga otra cosa.</p>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">9. CAUSAS DE DISOLUCIÓN DEL CONTRATO</h2>
        <ol>
          <li>PUEDE CANCELAR ACUERDOS Y CONTRATOS FIRMADOS CON PowerHouse Biotech EN CUALQUIER MOMENTO ANTES DE LA MEDIANOCHE DEL TERCER DÍA DESPUÉS DE LA FECHA QUE HAGA EL PRIMER PAGO.</li>
          <li>En el caso de una reclamación o disputa, primero hablará con nosotros de buena fe y ambas partes se comprometen a intentar alcanzar un acuerdo de forma dialogada y satisfactoria para ambas partes antes de acudir a realizar una reclamación formal.</li>
        </ol>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">10. RECLAMACIONES Y DUDAS</h2>
        <p>PowerHouse Biotech informa que existen hojas de reclamación a disposición de usuarios y clientes pudiendo remitir un correo a legal@powerhousebiotech.com indicando su nombre y apellidos, el servicio o producto adquirido y exponiendo los motivos de su reclamación.</p>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">11. POLÍTICAS DE CANCELACIÓN</h2>
        <p>
          El USUARIO puede cancelar su suscripción o cualquier servicio SaaS en cualquier momento, sin penalidades, conforme a la normativa aplicable en Ecuador, incluyendo la Ley Orgánica de Defensa del Consumidor.
        </p>
        <h3 class="legal-notice__subsection-title">Proceso de cancelación</h3>
        <ul>
          <li>Acceder a su cuenta y dirigirse a “Suscripción” o “Facturación”.</li>
          <li>Seleccionar “Cancelar suscripción” y confirmar la solicitud.</li>
          <li>Alternativamente, enviar un correo al contacto indicado en este documento con el asunto “Cancelación de Servicio”.</li>
        </ul>
        <h3 class="legal-notice__subsection-title">Plazos de efectividad</h3>
        <p>
          La cancelación es efectiva de manera inmediata desde la solicitud. En planes con renovación automática, el USUARIO puede optar por que surta efecto al finalizar el ciclo de facturación vigente para mantener acceso hasta esa fecha.
        </p>
        <h3 class="legal-notice__subsection-title">Reembolsos y créditos proporcionales</h3>
        <ul>
          <li>Se otorgan reembolsos completos ante cargos duplicados o errores de cobro.</li>
          <li>Podrán otorgarse créditos proporcionales por el tiempo no utilizado desde la fecha de solicitud, cuando el plan lo permita y no existan servicios personalizados ya entregados.</li>
          <li>El procesamiento de reembolsos o créditos se realiza en un plazo máximo de 10 días hábiles, sujeto a los tiempos de la pasarela de pago.</li>
        </ul>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">12. DEVOLUCIONES Y REEMBOLSOS</h2>
        <p>
          Las devoluciones aplican a servicios digitales conforme a la normativa ecuatoriana. Todas las solicitudes se evaluarán de forma objetiva y transparente.
        </p>
        <h3 class="legal-notice__subsection-title">Condiciones de aplicación</h3>
        <ul>
          <li>Errores de facturación o cobros no autorizados.</li>
          <li>Indisponibilidad prolongada del servicio atribuible al proveedor, no derivada de fuerza mayor.</li>
          <li>Incumplimiento material de las funcionalidades contratadas, debidamente acreditado.</li>
        </ul>
        <h3 class="legal-notice__subsection-title">Proceso para solicitar reembolso</h3>
        <ul>
          <li>Enviar la solicitud al correo de contacto indicado en este documento con el asunto “Solicitud de Reembolso”.</li>
          <li>Incluir: nombre completo, correo registrado, referencia de pago, fecha del cargo y descripción del motivo.</li>
          <li>Adjuntar comprobantes (factura, evidencia del cargo o evidencia técnica del incidente, si aplica).</li>
        </ul>
        <h3 class="legal-notice__subsection-title">Plazos de procesamiento</h3>
        <p>
          La evaluación y notificación de la resolución se realizará en un plazo máximo de 10 días hábiles. De proceder, el reembolso se cursará por el mismo método de pago utilizado, sujeto a los tiempos de la pasarela.
        </p>
        <h3 class="legal-notice__subsection-title">Excepciones</h3>
        <ul>
          <li>Servicios de consultoría ya prestados o personalizados entregados.</li>
          <li>Promociones marcadas como “no reembolsables”.</li>
          <li>Comisiones de terceros o impuestos ajenos al proveedor.</li>
        </ul>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">13. ALCANCE Y LIMITACIONES DEL SERVICIO</h2>
        <p>
          El servicio es exclusivamente digital; no incluye garantías físicas ni bienes tangibles. Se provee con soporte razonable, actualizaciones y mejoras continuas, sin garantía de resultados específicos, los cuales dependen de factores externos y del uso del USUARIO.
        </p>
      </section>

      <section class="legal-notice__section">
        <h2 class="legal-notice__section-title">14. RESPONSABILIDADES Y DERECHOS DE LAS PARTES</h2>
        <ul>
          <li><strong>Del proveedor:</strong> Proveer acceso al servicio, mantener medidas de seguridad acordes a la técnica, ofrecer soporte razonable y cumplir la normativa aplicable.</li>
          <li><strong>Del USUARIO:</strong> Usar el servicio de forma lícita, mantener datos de pago actualizados, respetar los términos de uso, no vulnerar derechos de terceros y proteger sus credenciales.</li>
          <li>En caso de controversias, las partes procurarán una resolución amistosa y, de ser necesario, se someterán a la normativa ecuatoriana aplicable.</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;
@use '../styles/fonts.modules.scss' as fonts;

.legal-notice {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem 0;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    @media (max-width: 768px) {
      margin: 0 1rem;
      border-radius: 8px;
    }
  }

  &__header {
    background: linear-gradient(135deg, #D4A373 0%, #BC6C25 100%);
    color: white;
    padding: 3rem 2rem;
    text-align: center;

    @media (max-width: 768px) {
      padding: 2rem 1rem;
    }
  }

  &__title {
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 1.8rem;
    }

    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }

  &__subtitle {
    font-size: 1.1rem;
    opacity: 1;
    margin: 0;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.95);

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  &__section {
    padding: 2.5rem 2rem;
    border-bottom: 1px solid #e9ecef;

    &:last-child {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      padding: 2rem 1rem;
    }

    @media (max-width: 480px) {
      padding: 1.5rem 1rem;
    }
  }

  &__section-title {
    font-family: 'Poppins', sans-serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: #D4A373;
    margin: 0 0 1.5rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #D4A373;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.3rem;
    }
  }

  &__subsection-title {
    font-family: 'Poppins', sans-serif;
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
    margin: 2rem 0 1rem 0;

    @media (max-width: 768px) {
      font-size: 1.2rem;
      margin: 1.5rem 0 0.8rem 0;
    }
  }

  &__subsubsection-title {
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: #555;
    margin: 1.5rem 0 1rem 0;

    @media (max-width: 768px) {
      font-size: 1.1rem;
      margin: 1.2rem 0 0.8rem 0;
    }
  }

  p {
    font-size: 1rem;
    line-height: 1.7;
    color: #555;
    margin: 0 0 1rem 0;
    text-align: justify;

    @media (max-width: 768px) {
      font-size: 0.95rem;
      line-height: 1.6;
      text-align: left;
    }
  }

  ul,
  ol {
    margin: 1rem 0;
    padding-left: 2rem;

    @media (max-width: 768px) {
      padding-left: 1.5rem;
    }

    li {
      font-size: 1rem;
      line-height: 1.7;
      color: #555;
      margin: 0.5rem 0;

      @media (max-width: 768px) {
        font-size: 0.95rem;
        line-height: 1.6;
      }
    }
  }

  strong {
    color: #BC6C25;
    font-weight: 600;
  }
}
</style>
