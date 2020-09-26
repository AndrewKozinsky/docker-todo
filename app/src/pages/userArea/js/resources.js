import {setUser} from "../../../store/actions"


/**
 * Обработчик отправки формы
 * @param {Function} dispatch — диспатчер экшен-функции.
 */
export async function setUserDataToStore(dispatch) {
    
    try {
        // По какому адресу буду делать запрос на получение данных пользователя
        const apiUrl = '/api/v1/users/me'
    
        // Параметры запроса
        const options = { method: 'GET' }
    
        // Сделаю запрос на сервер и полученные данные помещу в serverRes
        const serverRes = await fetch(apiUrl, options)
            .then(res => res.json())
            .then(res => res)
            .catch(err => new Error('Something went wrong'))
    
        if(serverRes.status === 'success') {
            // Получить данные пользователя
            const {name, email} = serverRes.data.user
        
            // Поставить их в Хранилище
            dispatch( setUser(name, email) )
        }
    }
    catch (err) {
    
    }
    
    
    
    
    
    
    
    
    
    
}