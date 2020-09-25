
// Функция проверяет хранится ли в браузере токен пользователя и правилен ли он
async function checkToken() {
    
    // Параметры запроса
    const options = { method: 'POST' }
    const apiUrl = '/api/v1/users/getTokenInfo'
    
    const tokenInfo = await fetch(apiUrl, options)
        .then(data => data.json())
        .then(json => json)
    
    return tokenInfo.status === 'success' ? 2 : 1
}

export {
    checkToken
}