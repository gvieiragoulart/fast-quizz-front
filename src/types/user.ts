export interface User {
    id: string
    username: string
    email: string
    name?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface UserUpdateRequest {
    username?: string
    email?: string
    password?: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
}

export interface RegisterRequest {
    email: string
    password: string
    name?: string
    username: string
}

export interface RegisterResponse {
    access_token: string
    user: User
}
