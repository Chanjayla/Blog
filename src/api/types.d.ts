export interface IArticleData {
  id: number
  title: string
  abstractContent: string
  fullContent: string
  imageURL: string
  timestamp: string | number
  author: string
  type: string
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}

export interface axiosRes {
  code: number
  data: any
}
