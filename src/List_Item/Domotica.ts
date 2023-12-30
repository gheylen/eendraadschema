class Domotica extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Domotica";      // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = "Domotica";     // Set Tekst to "Domotica" when the item is cleared
        this.keys[23][2] = "";             // Set Adres/tekst to "" when the item is cleared
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Kring"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5)
               +  ", Tekst (nieuwe lijn = \"|\"): " + this.stringToHTML(15,30)
               +  ", Adres/tekst: " + this.stringToHTML(23,5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement; // = new SVGelement();
        var strlines = htmlspecialchars(this.keys[15][2]).split("|");

        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"horizontal");

        // We voorzien altijd minimaal een kader van 80 en zeker genoeg voor de tekst in het Domotica-symbool
        let minwidth = 80;
        for (let str of strlines) minwidth = Math.max(minwidth, svgTextWidth(htmlspecialchars(str),10,'font-weight="bold"') + 15); //15 padding
        minwidth += 20; //Ruimte voor leiding links
        if ((mySVG.xright + mySVG.xleft) <=minwidth) mySVG.xright = (minwidth - mySVG.xleft);

        // We voorzien altijd verticale ruimte, zelfs als de kinderen nog niet gedefinieerd zijn
        let extraplace = 15 * Math.max(strlines.length-2,0);
        mySVG.yup = Math.max(mySVG.yup+20, 25) + extraplace / 2.0;
        mySVG.ydown = Math.max(mySVG.ydown, 25) + extraplace / 2.0;

        // We tekenen kader en aansluitende lijn links
        let width = (mySVG.xleft + mySVG.xright - 20);

        mySVG.data += '<rect x="' + (20) + '" width="' + (width) +
                      '" y="' + (mySVG.yup-20-extraplace/2.0) + '" height="' + (40 + extraplace) + '" stroke="black" stroke-width="2" fill="white" />';
        
        mySVG.data += '<line x1="1" x2="20" y1="' + (mySVG.yup) + '" y2="' + (mySVG.yup) + '" stroke="black" />';
        
        // We plaatsen de tekst in het kader
        let outputstr_common:string = '<text style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="bold" ';
        for (let i = 0; i<strlines.length; i++) {
            let dispy = mySVG.yup + 3 - extraplace / 2.0 - (strlines.length > 1 ? 7.5 : 0) + 15 * i;
            mySVG.data += outputstr_common + ' x="' + (21 + width/2) + '" y="' + (dispy) + '">' + strlines[i] + '</text>';
        }

        // Forceer 1 pixel links en de rest rechts
        mySVG.xright = mySVG.xleft + mySVG.xright - 1;
        mySVG.xleft = 1; //we leave one pixel for the bold kring-line at the left

        // Plaats adres onderaan indien niet leeg en indien er actieve kinderen zijn
        if (!(/^\s*$/.test(this.keys[23][2]))) { // Controleer of adres leeg is
            mySVG.data += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="' + (mySVG.yup+mySVG.ydown+10)
              + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[23][2]) + '</text>';
              mySVG.ydown += 15;
        }

        return(mySVG);
    }

}