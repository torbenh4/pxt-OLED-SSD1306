// tests go here; this will not be compiled when this package is used as a library
oledssd1306.initDisplay()
basic.forever(() => {
    oledssd1306.setTextXY(0, 0)
    oledssd1306.writeString("123abc")
    oledssd1306.setTextXY(1, 0)
    oledssd1306.writeString("ÄÖÜäöüß€°§")
    oledssd1306.setTextXY(2, 0)
    oledssd1306.writeString("" + input.temperature() + "°C")
})