<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">

    <!-- Main Content -->
    <div class="container mx-auto px-6 py-12 sm:px-10 lg:px-16 flex flex-col items-center min-h-screen">

      <!-- Hero Section -->
      <div class="text-center w-full max-w-3xl mx-auto mt-10 mb-14 animate-fade-in-up">
        <div class="inline-flex items-center justify-center p-1.5 mb-8 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
          <span class="px-4 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold tracking-wide uppercase mr-2">Novedad</span>
          <span class="text-gray-500 text-sm pr-4">Nuevas herramientas de conversión JSON 🚀</span>
        </div>

        <h1 class="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-5">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
            ORIOL tools
          </span>
        </h1>

        <p class="text-lg sm:text-xl text-gray-500 mb-6 max-w-2xl mx-auto font-normal leading-relaxed">
          Tu suite definitiva de herramientas. Transforma, genera y optimiza tus datos en segundos.
        </p>
      </div>

      <!-- Tools Section -->
      <div class="w-full max-w-6xl mx-auto pb-16">

        <!-- Excel Tools -->
        <div class="flex items-center gap-3 mb-6">
          <div class="h-7 w-1 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-800 tracking-wide">Herramientas Excel</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">

          <!-- Excel to JSON Card -->
          <div
            @click="$router.push('/excel-to-json')"
            class="pa-4 group relative bg-white border border-gray-100 rounded-2xl  hover:border-emerald-200 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1"
          >
            <!-- Top accent bar -->
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>

            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between mb-6">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md transform group-hover:rotate-3 group-hover:scale-105 transition-all duration-300">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors duration-300">
                  <svg class="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              <h3 class="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300">Excel a JSON</h3>
              <p class="text-gray-500 text-base leading-relaxed mb-6 flex-grow">
                Convierte tus hojas de cálculo Excel en estructuras JSON precisas. Soporte completo para múltiples hojas y opciones de formato avanzado.
              </p>

              <div class="flex flex-wrap gap-2 mt-auto">
                <span class="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-medium">.xlsx / .xls</span>
                <span class="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-medium">Múltiples hojas</span>
                <span class="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-medium">Conversión rápida</span>
              </div>
            </div>
          </div>

          <!-- JSON to Excel Card -->
          <div
            @click="$router.push('/json-to-excel')"
            class="pa-4 group relative bg-white border border-gray-100 rounded-2xl hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1"
          >
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>

            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between mb-6">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md transform group-hover:-rotate-3 group-hover:scale-105 transition-all duration-300">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                  <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              <h3 class="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">JSON a Excel</h3>
              <p class="text-gray-500 text-base leading-relaxed mb-6 flex-grow">
                Transforma cualquier objeto o array JSON en una hoja de cálculo estructurada. Formatea datos y expórtalos al instante.
              </p>

              <div class="flex flex-wrap gap-2 mt-auto">
                <span class="px-3 py-1 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 font-medium">Arrays / Objetos</span>
                <span class="px-3 py-1 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 font-medium">Descarga directa</span>
                <span class="px-3 py-1 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 font-medium">Formateo</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Tools -->
        <div class="flex items-center gap-3 mb-6">
          <div class="h-7 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-800 tracking-wide">Más Herramientas</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          <!-- Generador SQL Card -->
          <div
            @click="$router.push('/generador-sql')"
            class="group relative bg-white border border-gray-100 rounded-2xl p-7 hover:border-purple-200 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1"
          >
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>

            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between mb-6">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md transform group-hover:rotate-3 group-hover:scale-105 transition-all duration-300">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-300">
                  <svg class="w-4 h-4 text-gray-400 group-hover:text-purple-600 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">Generador SQL</h3>
              <p class="text-gray-500 text-sm leading-relaxed flex-grow">
                Constructor visual de queries complejas de base de datos.
              </p>
            </div>
          </div>

          <!-- Próximamente Card -->
          <div class="relative bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-7 flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-gray-400 mb-1">Próximamente</h3>
            <p class="text-gray-400 text-xs leading-relaxed">Nuevas utilidades en camino.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home - Landing page
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
