class Canvas {
    width
    height

    canvas
    context

    constructor(width, height) {
        this.width = width
        this.height = height

        this.canvas = document.getElementById('canvas')
        this.canvas.width = width
        this.canvas.height = height

        this.context = canvas.getContext('2d')
    }

    draw(image, x, y, width, height) {
        this.context.save()
        this.context.drawImage(image, x, y, width, height)
        this.context.restore()
    }

    write(text, size, align, x, y) {
        this.context.save()
        this.context.font = `${size}px font-8-bit`
        this.context.fillStyle = '#bcbcbc'
        this.context.textAlign = align
        this.context.fillText(text, x, y)
        this.context.restore()
    }

    clear(x = 0, y = 0, width = this.width, height = this.height) {
        this.context.clearRect(x, y, width, height)
    }
}

export {Canvas}
