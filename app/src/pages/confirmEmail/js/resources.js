// import browserConfig from "../../../browserConfig";

/*
export async function confirmEmail(confirmEmailToken) {
    
    // По какому адресу буду делать запрос на регистрацию пользователя
    const {serverOrigin, isDevelopment} = browserConfig
    const apiUrl = serverOrigin + '/api/v1/users/confirmEmail/' + confirmEmailToken
    
    // Параметры запроса
    const options = {
        method: 'GET'
    }
    
    // Сделаю запрос на сервер и полученные данные помещу в serverRes
    const serverRes = await fetch(apiUrl, options)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.log(err))
    
    /!* Если в serverRes будет объект с успешным статусом, то показать уведомление с просьбой подтвердить почту:
    {
        "status": "success",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6...",
        "data": {
            "user": {
                "name": "Andrew Kozinsky",
                "email": "andkozinskiy@yandex.ru",
            }
        }
    }*!/
    if(serverRes.status === 'success') {
        
        // Если нахожусь в режиме разработке, то поставить токен в LocalStorage
        if(isDevelopment) {
            localStorage.setItem('authToken', serverRes.token)
        }
        
        return true
    }
    
    return false
}*/
