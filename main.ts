/**
 * Provides functions to control any SSD1306 OLED 0.96" from a Calliope Mini.
 */

// Maincode from https://github.com/Banbury/pxt-calliope-oled96
// MIT License Copyright (c) 2018 Banbury Copyright (c) 2018 Banbury
// Thanks to Supereugen for ExtendedCharactersCode
// https://github.com/SuperEugen/pxt-calliope-grove-ssd1327/blob/master/pxt-calliope-grove-ssd1327.ts
// MIT License Copyright (c) 2018 Ingo Hoffmann
// Changes by kleinswelt 13.08.2019
// MIT License Copyright (c) 2019 Michael Klein

//% color=#9FEE9E icon="\uf108" block="SSD1306 OLED torbenh"
namespace oledssd1306t {
    /**
     * Setzt das Display zurück und löscht es.
     * Sollte beim Start des Programms verwendet werden.
     */
    //% blockId=oledssd1306t_init_display
    //% block="initialisiere Display"
    // initdisplaycodes from https://gist.githubusercontent.com/pulsar256/564fda3b9e8fc6b06b89/raw/4bb559d4088e42f7b4859a8533be920434818617/ssd1306_init.c
    export function initDisplay(): void {
        cmd(0xAE);  // Set display OFF		
        cmd(0xD5);  // Set Display Clock Divide Ratio / OSC Frequency 0xD4
        cmd(0x80);  // Display Clock Divide Ratio / OSC Frequency 
        cmd(0xA8);  // Set Multiplex Ratio
        cmd(0x3F);  // Multiplex Ratio for 128x64 (64-1)
        cmd(0xD3);  // Set Display Offset
        cmd(0x00);  // Display Offset
        cmd(0x40);  // Set Display Start Line
        cmd(0x8D);  // Set Charge Pump
        cmd(0x14);  // Charge Pump (0x10 External, 0x14 Internal DC/DC)
        cmd(0xA1);  // Set Segment Re-Map
        cmd(0xC8);  // Set Com Output Scan Direction
        cmd(0xDA);  // Set COM Hardware Configuration
        cmd(0x12);  // COM Hardware Configuration
        cmd(0x81);  // Set Contrast
        cmd(0xCF);  // Contrast
        cmd(0xD9);  // Set Pre-Charge Period
        cmd(0xF1);  // Set Pre-Charge Period (0x22 External, 0xF1 Internal)
        cmd(0xDB);  // Set VCOMH Deselect Level
        cmd(0x40);  // VCOMH Deselect Level
        cmd(0xA4);  // Set all pixels OFF
        cmd(0xA6);  // Set display not inverted
        cmd(0xAF);  // Set display On
        clearDisplay();
    }

    /**
     * Löscht das gesamte Display.
     */
    //% blockId=oledssd1306t_clear_display
    //% block="lösche Display"
    export function clearDisplay() {
        cmd(DISPLAY_OFF);   //display off
        for (let j = 0; j < 4; j++) {
            setTextXY(j, 0);
            {
                for (let i = 0; i < 8; i++)  //clear all columns
                {
                    putChar(' ');
                }
            }
        }
        cmd(DISPLAY_ON);    //display on
        setTextXY(0, 0);
    }

    /**
     * Löscht einen Buchstabenbereich beginnend an der
     * Cursorposition.
     * @param n Number of characters to delete
     */
    //% blockId=oledssd1306t_clear_range
    //% block="lösche %n| Zeichen"
    export function clearRange(n: number) {
        for (let i = 0; i < n; i++) {
            putChar(' ');
        }
    }

    /**
     * Bewegt den Cursor an eine neue Position.
     */
    //% row.min=0 row.max=7 
    //% column.min=0 column.max=15
    //% blockId=oledssd1306t_set_text
    //% block="setze Cursor auf Zeile %row| und Spalte %column"
    export function setTextXY(row: number, column: number, half: number) {
        let r = row;
        let c = column;
        if (row < 0) { r = 0 }
        if (column < 0) { c = 0 }
        if (row > 3) { r = 3 }
        if (column > 7) { c = 7 }

        cmd(0xB0 + r);            //set page address
        cmd(0x00 + (16 * c & 0x0F));  //set column lower address
        cmd(0x10 + ((16 * c >> 4) & 0x0F));   //set column higher address
    }

    /**
     * Writes a single character to the display.
     */
    function putChar(c: string, half: number) {
        let c1 = c.charCodeAt(0);
        switch (c1) {
            case 196: writeCustomChar(extendedCharacters[0], half); break;
            case 214: writeCustomChar(extendedCharacters[1], half); break;
            case 220: writeCustomChar(extendedCharacters[2], half); break;
            case 228: writeCustomChar(extendedCharacters[3], half); break;
            case 246: writeCustomChar(extendedCharacters[4], half); break;
            case 252: writeCustomChar(extendedCharacters[5], half); break;
            case 223: writeCustomChar(extendedCharacters[6], half); break;
            case 172: writeCustomChar(extendedCharacters[7], half); break;
            case 176: writeCustomChar(extendedCharacters[8], half); break;
            default:
                if (c1 < 32 || c1 > 127) //Ignore non-printable ASCII characters. This can be modified for multilingual font.
                {
                    writeCustomChar("\x00\xFF\x81\x81\x81\xFF\x00\x00", half);
                } else {
                    writeCustomChar(basicFont[c1 - 32], half);
                }
        }
    }

    /**
     * Schreibt einen String an der aktuellen Cursorposition auf das Display.
     */
    //% blockId=oledssd1306t_write_string
    //% block="schreibe %s|auf das Display"
    export function writeString(s: string, half: number) {
        for (let c of s) {
            putChar(c, half);
        }
    }

    /**
      * Schreibt eine Zahl an der aktuellen Cursorposition auf das Display.
      */
    //% blockId=oledssd1306t_write_number
    //% block="schreibe Zahl %n|auf das Display (half %half|)"
    export function writeNumber(n: number, half: number ) {
        oledssd1306t.writeString("" + n, half)
   }

    /**
     * Ändert das Display zu weißer Schrift auf schwarzem Hintergrund.
     */
    //% blockId=oledssd1306t_normal_display advanced=true
    //% block="weiss auf schwarz"
    export function normalDisplay() {
        cmd(NORMAL_DISPLAY);
    }

    /**
     * Ändert das Display zu schwarzer Schrift auf weißem Hintergrund.
     */
    //% blockId=oledssd1306t_invert_display advanced=true
    //% block="schwarz auf weiss"
    export function invertDisplay() {
        cmd(INVERT_DISPLAY);
    }

    /**
     * Dreht den Displayinhalt auf den Kopf.
     */
    //% blockId=oledssd1306t_flip_screen advanced=true
    //% block="drehe Display"
    export function flipScreen() {
        cmd(DISPLAY_OFF);
        cmd(COM_SCAN_INC);
        if (flipped) {
            cmd(0xA1)
        } else {
            cmd(0xA0);
        }
        cmd(DISPLAY_ON);
    }


    /**
     * Schaltet das Display aus.
     */
    //% blockId=oled96ssd1306t_turn_off advanced=true
    //% block="Display ausschalten"
    export function turnOff() {
        cmd(DISPLAY_OFF);
    }

    /**
     * Turns the display on.
     */
    //% blockId=oled961306t_turn_on advanced=true
    //% block="Display anschalten"
    export function turnOn() {
        cmd(DISPLAY_ON);
    }

    function doubleheight(hex: number, half: number) {
	    let ret = 0;

	    if (half == 0) {
		    if (number & 0x1) { ret |= 0x3; }
		    if (number & 0x2) { ret |= 0xc; }
		    if (number & 0x4) { ret |= 0x30; }
		    if (number & 0x8) { ret |= 0xc0; }
	    } else {
		    if (number & 0x10) { ret |= 0x3; }
		    if (number & 0x20) { ret |= 0xc; }
		    if (number & 0x40) { ret |= 0x30; }
		    if (number & 0x80) { ret |= 0xc0; }
	    }

	    return ret;
    }
    /**
     * Writes a custom character to the display
     * at the current cursor position.
     * A character is a string of 8 bytes. Each byte represesnts
     * a line of the character. The eight bits of each byte
     * represent the pixels of a line of the character.
     * Ex. "\x00\xFF\x81\x81\x81\xFF\x00\x00"
     * Only use in Javascriptmode! In Blockmode Makecode adds
     * extra backslashes.
     */
    //% blockId=oled961306t_write_custom_char advanced=true
    //% block="schreibe eigenes Zeichen %c"
    export function writeCustomChar(c: string, half: number) {
        for (let i = 0; i < 8; i++) {
            writeData(doubleheight(c.charCodeAt(i), half));
            writeData(doubleheight(c.charCodeAt(i), half));
        }
    }

    /**
     * Sendet einen Befehl an das Display.
     * Nur verwenden wenn du weißt was du tust!
     */
    //% blockId=oled961306t_send_command advanced=true
    //% block="sende Befehl %c|an Display"
    export function cmd(c: number) {
        pins.i2cWriteNumber(0x3c, c, NumberFormat.UInt16BE);
    }

    /**
     * Schreibt ein Byte auf das Display.
     * Kann verwendet werden um das Display direkt zu beschreiben.
     */
    //% blockId=oled961306t_write_data advanced=true
    //% block="sende Datenbyte %n|an Display"
    export function writeData(n: number) {
        let b = n;
        if (n < 0) { n = 0 }
        if (n > 255) { n = 255 }

        pins.i2cWriteNumber(0x3c, 0x4000 + b, NumberFormat.UInt16BE);
    }
}

