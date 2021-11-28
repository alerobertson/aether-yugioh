export function modalEnable(animation_time = 1000) {
    let modal_container = document.querySelector('#modal')
    modal_container.classList.add('active')
    modal_container.classList.add('opening')
    setTimeout(() => {
        modal_container.classList.add('open')
        modal_container.classList.remove('opening')
    }, animation_time)

    setTimeout(() => {
        //modalClose()
    }, 3000)
}

export function modalClose(animation_time = 1000) {
    let modal_container = document.querySelector('#modal')
    modal_container.classList.remove('open')
    modal_container.classList.add('closing')
    setTimeout(() => {
        modal_container.classList.remove('closing')
        modal_container.classList.remove('active')
    }, animation_time)
}


/*
    options = {
        body: HTML Content
        click_events: [
            {
                selector: '.craft-card_option.disenchant',
                event: () => {
                    this.disenchant(card_info.id)
                }
            }
        ]
    }
*/
export function modalOpen(options, animation_time = 1000) {
    let element = document.createElement("div")
    let modal_container = document.querySelector('#modal')

    element.classList.add("modal")
    let element_content = document.createElement("div")
    element_content.classList.add("modal_content")
    element_content.innerHTML = options.body
    element.appendChild(element_content) 
    while(modal_container.firstChild) {
        modal_container.removeChild(modal_container.firstChild);
    }
    modal_container.appendChild(element)

    if(options.click_events) {
        options.click_events.forEach((click_event) => {
            let target = document.querySelector(click_event.selector)
            if(target) {
                target.addEventListener("click", click_event.callback)
            }
        })
    }

    modalEnable(animation_time)
}