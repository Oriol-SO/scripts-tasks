<template>
  <header class="bg-blue-50 border-b border-blue-100 sticky top-0 z-50 shadow-sm w-full">
    <div class="px-4 lg:px-6 py-4">
      <div class="flex items-center justify-center">
        <div class="flex items-center gap-6 w-full max-w-6xl">
          <!-- Logo y Título -->
          <router-link 
            to="/"
            class="flex items-center gap-3 text-gray-800 hover:text-blue-600 transition-colors group"
          >
            <div class="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold">oriolexcel</h1>
          </router-link>

          <!-- Navigation Menu -->
          <nav class="flex items-center gap-2 ml-auto">
          <!-- Excel a JSON -->
          <router-link
            to="/excel-to-json"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
              $route.path === '/excel-to-json' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg font-semibold' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="hidden md:inline">Excel a JSON</span>
          </router-link>

          <!-- JSON a Excel -->
          <router-link
            to="/json-to-excel"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
              $route.path === '/json-to-excel' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg font-semibold' 
                : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span class="hidden md:inline">JSON a Excel</span>
          </router-link>

          <!-- Generador SQL -->
          <router-link
            to="/generador-sql"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
              $route.path === '/generador-sql' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg font-semibold' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <span class="hidden md:inline">Generador SQL</span>
          </router-link>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
// Header component con navegación
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>

