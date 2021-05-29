var boxParams = {
    isDragging:false,
    start:{x:0,y:0},
    end:{x:0,y:0},
    text:""
}

var element
var highlightElement 


 const init = (id) => {
     highlightElement = document.createElement("div")
     element = document.getElementById(id) 
     element.onmousedown = mouseDown
     element.onmousemove = mouseMove
     element.onmouseup = mouseUp
 }

 const mouseMove = (event) => {
    if(boxParams.isDragging){
        const element = document.elementFromPoint(event.clientX, event.clientY)
        const clientRect = element.getBoundingClientRect()
        boxParams.end = { x: event.clientX, y: clientRect.y + clientRect.height }
        highlightElement.style.left = `${boxParams.start.x}px`
        highlightElement.style.top = `${boxParams.start.y}px`
        highlightElement.style.width = `${boxParams.end.x - boxParams.start.x}px`
        highlightElement.style.height = `${boxParams.end.y - boxParams.start.y}px`
    }
}

const mouseUp = (event) => {
        boxParams.isDragging = false
        const defaultDisplayMode = highlightElement.style.display
        highlightElement.style.display = 'none'
        const startIndex = document.elementFromPoint(boxParams.start.x, boxParams.start.y).parentElement.rowIndex
        const endIndex = document.elementFromPoint(boxParams.end.x, boxParams.end.y).parentElement.rowIndex
        highlightElement.style.display = defaultDisplayMode
        const selectedCells = Array.from(document.querySelectorAll('.scan-down')).slice(startIndex, endIndex + 1)
        const fontSize = window.getComputedStyle(selectedCells[0]).getPropertyValue('font-size')
        const fontFamily = window.getComputedStyle(selectedCells[0]).getPropertyValue('font-family')
        const charWidth = getTextWidth(selectedCells[0].textContent[0], `${fontSize} ${fontFamily}`)
        boxParams.left = Math.floor(Math.abs(selectedCells[0].getBoundingClientRect().x - boxParams.start.x)/charWidth) - 1
        boxParams.right = Math.floor(Math.abs(selectedCells[selectedCells.length -1].getBoundingClientRect().x - boxParams.end.x)/charWidth)
        boxParams.text  = selectedCells.map((cell) => {
            const textLength = cell.textContent.length
            let text = cell.textContent.substring(boxParams.left, (boxParams.right > textLength) ? textLength : boxParams.right)
            return text.trim()
        }).join('\n')
}

const mouseDown = (event) => {
        const element = document.elementFromPoint(event.clientX, event.clientY)
        const clientRect = element.getBoundingClientRect()
        boxParams.start = { x: event.clientX, y: clientRect.y }  
        boxParams.isDragging = true
        highlightElement.style.opacity = 1
}

 const destroyBox = () => {
    highlightElement.style.left = '0px'
    highlightElement.style.top = '0px'
    highlightElement.style.width = '0px'
    highlightElement.style.height = '0px'
    highlightElement.style.opacity = 0
 }

 const getText = () =>{
    return boxParams.text
}

module.exports = { init,destroyBox,getText }
