const formEl = document.querySelector("form")
const languageSelectorEl = document.getElementById("language-selector")
const translationOutput = document.querySelectorAll(".translation-output")
const outputTextareaEl = document.querySelector("textarea.translation-output")
console.log(outputTextareaEl)
const buttonEl = document.querySelector("button")


let isTranslated = false

formEl.addEventListener("submit", (event)=>{
    event.preventDefault()
    const formData = new FormData(formEl)
    console.log("submitted")
    if(!isTranslated) {
        isTranslated = true
        languageSelectorEl.style.display = "none"
        translationOutput.forEach(el=>el.style.display="block")
        buttonEl.textContent = "Start Over"
        translate(formData.get('text'),formData.get('language'))
            .then(translation=>{
                outputTextareaEl.value = translation
            } )

        
    } else {
        isTranslated = false
        translationOutput.forEach(el=>el.style.display="none")
        languageSelectorEl.style.display = "flex"
        buttonEl.textContent = "Translate"
    }
})

async function pingHello() {
    const res = await fetch('./api/hello')
    //const data = await res.json()
    const msg = await res.text()
    console.log(msg)
}

async function sendMessage(msg) {
    const res = await fetch('/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg})
    })

    const data = await res.json()
    console.log(data)
}

async function translate(text,language) {
    const res = await fetch('./api/translate', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify( {
            language: `${language}`,
            text: `${text}`
        })
    })
    const data = await res.json()
    return data.translation
}