<template>
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
    <div class="w-full max-w-7xl">
      <!-- Header Section -->
      <div class="text-center mb-16 animate-fade-in">
        <!-- Icon with glow effect -->
        <div class="flex items-center justify-center mb-8">
          <div class="relative">
            <div class="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div class="relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 leading-tight">
          oriolexcel
        </h1>
        
        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl text-gray-600 mb-4 font-light">
          Convierte y transforma tus datos fácilmente
        </p>
        
        <!-- Decorative line -->
        <div class="flex items-center justify-center gap-4 mt-8">
          <div class="h-px w-20 bg-gradient-to-r from-transparent to-blue-500"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div class="h-px w-20 bg-gradient-to-l from-transparent to-blue-500"></div>
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16 px-4">
        <!-- Convertidor de Excel Card -->
        <div 
          @click="$router.push('/excel-to-json')"
          class="group relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden p-6"
        >
          <!-- Content -->
          <div class="relative">
            <!-- Icon -->
            <div class="flex items-center justify-center mb-4">
              <div class="relative">
                <div class="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div class="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Title and description -->
            <h2 class="text-2xl font-bold text-gray-800 mb-3 text-center group-hover:text-blue-600 transition-colors duration-300">
              Convertidor de Excel
            </h2>
            <p class="text-gray-600 text-center mb-6 text-base leading-relaxed">
              Convierte entre Excel y JSON de forma rápida y sencilla. Soporta múltiples formatos y opciones avanzadas.
            </p>

            <!-- Button -->
            <button
              @click.stop="$router.push('/excel-to-json')"
              class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-base"
            >
              <span>Ir a Convertidor</span>
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <!-- Animated bottom border -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>

        <!-- Generador SQL Card -->
        <div 
          @click="$router.push('/generador-sql')"
          class="group relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden p-6"
        >
          <!-- Content -->
          <div class="relative">
            <!-- Icon -->
            <div class="flex items-center justify-center mb-4">
              <div class="relative">
                <div class="absolute inset-0 bg-purple-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div class="relative bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Title and description -->
            <h2 class="text-2xl font-bold text-gray-800 mb-3 text-center group-hover:text-purple-600 transition-colors duration-300">
              Generador SQL
            </h2>
            <p class="text-gray-600 text-center mb-6 text-base leading-relaxed">
              Genera consultas SQL de forma rápida y sencilla. Crea queries complejas con facilidad.
            </p>

            <!-- Button -->
            <button
              @click.stop="$router.push('/generador-sql')"
              class="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-base"
            >
              <span>Ir a Generador</span>
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <!-- Animated bottom border -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="bg-gray-50 rounded-3xl shadow-lg border border-gray-200 p-8 sm:p-10 lg:p-12">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-center gap-4 mb-10">
          <div class="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-2xl shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center sm:text-left">
            Funcionalidades disponibles
          </h3>
        </div>
        
        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div class="group bg-white hover:bg-blue-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-gray-800 mb-2 text-lg">Excel a JSON</h4>
                <p class="text-gray-600 leading-relaxed">Convierte archivos Excel (.xlsx, .xls) a formato JSON con opciones avanzadas</p>
              </div>
            </div>
          </div>
          
          <!-- Feature 2 -->
          <div class="group bg-white hover:bg-blue-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-gray-800 mb-2 text-lg">JSON a Excel</h4>
                <p class="text-gray-600 leading-relaxed">Convierte archivos JSON a formato Excel con búsqueda integrada en tiempo real</p>
              </div>
            </div>
          </div>
          
          <!-- Feature 3 -->
          <div class="group bg-white hover:bg-blue-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-gray-800 mb-2 text-lg">Generador SQL</h4>
                <p class="text-gray-600 leading-relaxed">Crea consultas SQL de forma rápida y sencilla con interfaz intuitiva</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Página de inicio - contenido específico
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>
