export async function setupDatabase() {
    return useFetch("/api/database/setup")
}

export async function resetDatabase() {
    return useFetch("/api/database/reset")
}