import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import Home from '../views/Home.vue'
import ExcelToJson from '../conversion_excel/ExcelToJson.vue'
import JsonToExcel from '../conversion_excel/JsonToExcel.vue'
import GeneradorSQL from '../generadorsql/GeneradorSQL.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/excel-to-json',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'ExcelToJson',
        component: ExcelToJson
      }
    ]
  },
  {
    path: '/json-to-excel',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'JsonToExcel',
        component: JsonToExcel
      }
    ]
  },
  {
    path: '/generador-sql',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'GeneradorSQL',
        component: GeneradorSQL
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

