import React from 'react'
import { Link } from "react-router-dom";
import './css/button.scss'
import './css/spinner.scss'


function Button(props) {
    const {
        text = `Text didn't pass`, // Текст на кнопке
        counter, // Счётчик на кнопке
        type, // Тип кнопки. По-умолчанию button.
        href,
        sign, // Значёк на кнопке
        mode1,
        mode2,
        onClick,
        i, // Значение атрибута key
        disabled = false, // Заблокирована ли кнопка
    } = props
    
    const attrs = {}
    
    // Тип кнопки
    attrs.type = type || 'button'
    
    // Если это ссылка, то убрать атрибут type
    if(href) delete attrs.type
    
    // Формирование классов
    let cls = 'btn'
    if(mode1) cls += ' btn--mode-1'
    if(mode2) cls += ' btn--mode-2'
    attrs.className = cls
    
    // Аттрибут href
    if(href) attrs.to = href
    
    // Атрибут onClick
    if(onClick) attrs.onClick = onClick
    
    // Аттрибут disabled
    if(disabled) attrs.disabled = true
    
    if(i) attrs.key = i
    
    // Контент
    const signEl = createSign(sign)
    const counterEl = counter ? <span className='btn__counter' key='b'>{counter}</span> : null
    const innerContent = [
        signEl,
        <span className='btn__text' key='f'>{text}</span>,
        counterEl
    ]
    
    
    return  props.tag === 'a'
        ? <Link {...attrs}>{innerContent}</Link>
        : <button {...attrs}>{innerContent}</button>
}


// sign —- значёк на кнопке. Значения: person, exit, check-all, sun, close, spinner
function createSign(sign) {
    if(!sign) return null
    if(sign === 'spinner') return createSpinner()
    
    let cls = 'btn__sign ';
    
    switch (sign) {
        case 'person':
            cls += 'btn__sign--person'
            break
        case 'exit':
            cls += 'btn__sign--exit'
            break
        case 'check-all':
            cls += 'btn__sign--check-all'
            break
        case 'sun':
            cls += 'btn__sign--sun'
            break
        case 'close':
            cls += 'btn__sign--close'
            break
        case 'notes':
            cls += 'btn__sign--notes'
            break
    }
    
    return <span className={cls} key='a' />
}

// Функция создающая элемент спиннера на кнопке
function createSpinner() {
    return (
        <div className='btnSpinnerWrapper' key='h'>
            <div className='btnSpinner'>
                <div />
            </div>
        </div>
    )
}

export default Button