import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

export default function Paso8Diagnostico() {
  const navigate = useNavigate();
  const { placedElements, selectedFloors, houseWidth, houseLength } = useSimulator();

  const router = placedElements.find((el) => el.itemId === 'router');
  const repeater = placedElements.find((el) => el.itemId === 'mesh-repeater');
  const rooms = placedElements.filter((el) => el.type === 'room');

  // WhatsApp link generator with pre-filled message
  const whatsappNumber = '51999999999'; // Número oficial de asesoría WIN
  const whatsappMessage = encodeURIComponent(
    `¡Hola WIN! Acabo de armar mi propuesta en el simulador para mi hogar de ${selectedFloors} piso(s) (${houseWidth * houseLength} m²). Deseo consultar las promociones y descuentos disponibles para contratar mi plan de 100% Fibra Óptica ${repeater ? '+ Repetidor Mesh WIN' : ''}.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <article className="step-view flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full px-2 sm:px-4 py-2" id="step-view-7">
      <div>
        {/* Step Indicator Header */}
        <div className="flex items-center space-x-3 mb-5">
          <span className="w-9 h-9 rounded-full bg-[#ff5500] text-white font-extrabold flex items-center justify-center text-base shadow-sm">
            7
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Propuesta Final y Diagnóstico de Cobertura
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Resumen técnico de la señal de tu hogar y beneficios exclusivos para tu instalación WIN.
            </p>
          </div>
        </div>

        {/* 1. Diagnóstico de Cobertura Status Banner */}
        {repeater ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center space-x-3 mb-6 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-sm">
              ✓
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <h4 className="text-sm font-bold text-emerald-950">
                  Diagnóstico: Cobertura 100% Óptima en toda la casa
                </h4>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-full">
                  Red Mesh Wi-Fi 6 Activa
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Tu configuración con <b>Router WIN</b> en {router?.snappedWall || router?.roomName || 'sala'} y <b>Repetidor Mesh</b> en {repeater.snappedWall || repeater.roomName || 'piso superior'} garantiza más de 300 Mbps simétricos en todas las habitaciones sin zonas muertas.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-300/90 rounded-2xl p-4 flex items-center space-x-3 mb-6 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-[#ff5500] text-white flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-sm">
              ⚠️
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <h4 className="text-sm font-bold text-amber-950">
                  Diagnóstico: Cobertura Parcial (75%)
                </h4>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                  Se recomienda Repetidor
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                En viviendas de {selectedFloors} piso(s) ({houseWidth * houseLength} m²), las habitaciones más alejadas sufrirán atenuación por paredes. Te sugerimos solicitar un Repetidor Mesh con descuento especial.
              </p>
            </div>
          </div>
        )}

        {/* 2. Main 2-Column Grid: Summary & Plan vs WhatsApp & Promos Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Resumen Técnico del Hogar y Plan WIN */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff5500] block mb-1">
                Equipamiento y Plan sugerido
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Plan WIN Fibra 100% Simétrica</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Misma velocidad de subida y bajada, cero lag en videollamadas, juegos y streaming 4K.
              </p>
            </div>

            {/* Checklist of features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 border-y border-slate-100 text-xs text-slate-700">
              <div className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-[#ff5500] font-bold flex items-center justify-center text-xs">✓</span>
                <span className="font-semibold">Router ONUs Wi-Fi 6 de alta potencia</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-[#ff5500] font-bold flex items-center justify-center text-xs">✓</span>
                <span className="font-semibold">Fibra óptica dedicada hasta el hogar</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-[#ff5500] font-bold flex items-center justify-center text-xs">✓</span>
                <span className="font-semibold">Instalación y cableado profesional</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-[#ff5500] font-bold flex items-center justify-center text-xs">✓</span>
                <span className="font-semibold">{repeater ? 'Repetidor Mesh WIN incluido' : 'Soporte técnico premium 24/7'}</span>
              </div>
            </div>

            {/* Technical Home Summary Pills */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Datos de tu simulación:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Pisos</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedFloors}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Área Total</span>
                  <span className="font-extrabold text-slate-900 text-sm">{houseWidth * houseLength} m²</span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Ambientes</span>
                  <span className="font-extrabold text-slate-900 text-sm">{rooms.length || 'Completos'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: WhatsApp VIP Contact & Exclusive Promotions */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Promo Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
              
              {/* Background decorative halo */}
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-extrabold uppercase tracking-wider text-emerald-100">
                  <span>🎁</span>
                  <span>Promoción Exclusiva</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black leading-snug tracking-tight">
                  ¿Quieres aprovechar nuestras promociones y descuentos?
                </h3>

                <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed">
                  Contáctate de inmediato por WhatsApp con un <b>asesor oficial de WIN</b> para congelar tu tarifa especial, bono de velocidad y costo de instalación rebajado.
                </p>
              </div>

              <div className="relative z-10 pt-5 mt-2 border-t border-white/20">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 bg-white hover:bg-emerald-50 active:scale-[0.98] text-emerald-800 font-black text-sm rounded-2xl shadow-lg transition duration-200 flex items-center justify-center space-x-3 group cursor-pointer"
                >
                  {/* WhatsApp SVG Icon */}
                  <svg className="w-6 h-6 text-[#25D366] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.155-.544-1.874-.777-3.08-2.684-3.174-.808-.094-.124-.755-1.004-.755-1.917 0-.913.48-1.363.65-1.547.172-.184.375-.23.5-.23.125 0 .25.001.359.006.115.006.269-.044.421.323.156.376.532 1.299.578 1.393.047.094.078.204.016.328-.063.125-.094.203-.188.312-.094.11-.197.245-.282.329-.094.094-.192.196-.083.383.11.188.487.804 1.045 1.301.719.64 1.325.839 1.512.933.188.094.297.078.406-.047.11-.125.469-.547.594-.735.125-.187.25-.156.422-.093.172.062 1.094.516 1.282.609.188.094.312.141.359.219.047.078.047.453-.097.858z" />
                    <path d="M12.012 2.002c-5.509 0-9.989 4.478-9.99 9.984 0 1.761.459 3.482 1.332 5.001l-1.415 5.172 5.303-1.391c1.464.798 3.116 1.218 4.77 1.218 5.509 0 9.99-4.479 9.99-9.985 0-5.507-4.48-9.985-9.99-9.985zm0 18.172c-1.498 0-2.966-.403-4.249-1.164l-.305-.182-3.153.827.842-3.076-.2-.318c-.838-1.334-1.282-2.887-1.282-4.475 0-4.502 3.663-8.165 8.169-8.165 4.505 0 8.168 3.663 8.168 8.165 0 4.503-3.663 8.168-8.19 8.168z" />
                  </svg>
                  <span>Chatear con un Asesor WIN</span>
                </a>
                <span className="block text-[11px] text-emerald-100 text-center mt-2 font-medium">
                  ⚡ Respuesta inmediata • WhatsApp Oficial WIN
                </span>
              </div>
            </div>

            {/* Quality Guarantee Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-center space-x-3 text-xs text-slate-600">
              <span className="text-2xl">🔒</span>
              <div>
                <h5 className="font-bold text-slate-800">Garantía WIN Residencial</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sin letras chicas, conexión 100% fibra simétrica garantizada de extremo a extremo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-10 pb-4 border-t border-slate-100 pt-5">
        <button
          type="button"
          className="px-7 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 font-bold rounded-full transition cursor-pointer text-sm"
          onClick={() => navigate('/paso-6')}
        >
          Atrás (Cobertura)
        </button>
        <button
          type="button"
          className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full shadow-md transition cursor-pointer text-sm flex items-center space-x-2"
          onClick={() => navigate('/')}
        >
          <span>Finalizar simulación</span>
          <span>🏠</span>
        </button>
      </div>
    </article>
  );
}
