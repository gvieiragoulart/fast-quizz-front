import { api } from "@/services/api"
import type { User, UserUpdateRequest } from "@/types"

const userService = {
    async getMe(): Promise<User> {
        const response = await api.get<User>("/api/users/me")
        return response.data
    },

    async updateUser(
        userId: string,
        data: UserUpdateRequest,
    ): Promise<User> {
        const response = await api.put<User>(`/api/users/${userId}`, data)
        return response.data
    },
}

export { userService }
