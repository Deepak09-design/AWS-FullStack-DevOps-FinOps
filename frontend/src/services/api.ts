
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export interface Product {
  id: number
  name: string
  category: string
  price: number
  oldPrice: number
  rating: number
  image: string
}

export interface OrderItemRequest {
  product_id: number
  quantity: number
}

export interface OrderRequest {
  customer_name: string
  customer_email: string
  items: OrderItemRequest[]
}

export interface OrderResponse {
  message: string
  order_id: number
  customer_name: string
  total_amount: number
  status: string
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/api/products')
  return response.data
}

export const createOrder = async (
  orderData: OrderRequest
): Promise<OrderResponse> => {
  const response = await api.post<OrderResponse>(
    '/api/orders',
    orderData
  )
  return response.data
}

export const getOrders = async () => {
  const response = await api.get('/api/orders')
  return response.data
}

export default api
