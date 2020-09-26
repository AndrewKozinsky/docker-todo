import React, {useState} from 'react'
import Button from "../button"
import s from './css/radioButtonsGroup.scss'


function RadioButtonsGroup(props) {
    let {
        btnsPropsArr = [], // массив с настройками кнопок
        current = 0 // Если первой должна быть подсвечена не первая кнопка, то нужно передать какая
    } = props
    
    // Какая кнопка сейчас активна
    const [activeBtn, setActiveBtn] = useState(+current)
    
    // Создам массив кнопок
    const buttons = btnsPropsArr.map( (btnProps, i) => {
        const btnPropsFixed = {...btnProps, key: i}
        
        // При щелчке запускать и указанный обработчик щелчка и переключать активную кнопку
        btnPropsFixed.onClick = function () {
            if(btnProps.onClick) btnProps.onClick()
            setActiveBtn(i)
        }
        
        // Неактивным кнопкам нужно передать свойство mode1
        btnPropsFixed.mode1 = activeBtn !== i
        
        return <Button {...btnPropsFixed} />
    })
    
    return <div className={s.group}>{buttons}</div>
}


export default RadioButtonsGroup