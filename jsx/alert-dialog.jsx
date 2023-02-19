
///////////////////////////////////////////////////////////////////////////////
// Function: custom ALert DIalog
// Usage: returns value if OK Cancel buttons
// Input: value
// Return: Boolean
///////////////////////////////////////////////////////////////////////////////


//  Placement images
//  https://community.adobe.com/t5/photoshop/adding-images-to-script-ui-for-photoshop/td-p/10328043?page=1
// if (File.fs == "Macintosh"){
//     var psIcon64 = new File (app.path + '/Presets/Scripts/ps-icon.png');
// }
// var psIcon64 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adob"+
//         "e ImageReadyq\u00C9e<\x00\x00\x00\x18IDATx\u00DAb`\x18\x05\u00A3`\x14\u008C\u0082Q0\n\u00A8\x03\x00\x02\f\x00\x06T\x00\x01\u008B\u00CCR\u00FF"+
//         "\x00\x00\x00\x00IEND\u00AEB`\u0082";

// Color Profile icon
var cpIcon64 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00@\x00\x00\x00@\b\x06\x00\x00\x00\u00AAiq\u00DE\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x05OIDATx\u00DA\u00EC[Mn\u00DAP\x106(+6%7\u0080\x03D\u0081\x13\u00C4(\x07\u0088\u0091\u00BA\x07o\u00ABJMN\x00\u009C\x00\"E\u00DD\u00E2\u00EC#\u0085\x1C\u00A0\u0082\u009C \u00A0\x1E\x00z\x03\u00AF\u00B2Mg\u00ECy\u00E1\u0089\x18<\u00F3\u00FC\u00CCO\u00C8HS\u00A9-\u00D8\u009E\u00EF}3\u00F3\u00CD{\u00C6q\u00BE\u00EC\u00B8\u00AD\u00B0o\x0F\u00F4\u00F6\u00E3\u00E7X\u00FB\u00EB3\u00F8\x02|Z\u00F8}7=\x16\x00\u00DE\u00D6\u00FC\x17\x021\x01\u00BF\x070&\u00C7\b\u00C0*\x18\u00B7\u00E0\x01\u0080\x11f\u00B9_\u00F1@S\u00B7\x02\u00DE\x07\u009F\x03`\u00EDcd\u00C0\u00AAa}\u00F0M\u00EA\u00C4\u00A12`\u00D5j\u00E0/\x00\u00DE\u00F5~1`\u00F8Z#\u00BA\u00D6\u00E8_.\x1C\u00BF\u00D4\u00C8\u0081\x01\u00BAa]\u00F0\u00B9\x1F>\u00B1\x1Cp\x19\u00FE\u00F4\u00C0\u00AF\u00C0]\u00F0\u00F2\x0E\u00D8\u00D0\x06\x10\x11\u00F4&\u00A7@\u009EX\n\x1C\u0083m\u00E1\u00CD-\\\u00AD\x171%fN\u00C5\u00F0\x1A\u00F8<\u00A8'\u00EA\u00F9\u00A6@L\u00F1>\u00DD\u0090g~\u0089}OXI\u009DQ^\x1E\u00E9P\u00C8@\u00F5\x0E\u00B8\u00B8\u00E8\u00A4\x01\x00A\u00BBIB\u0087h\u00DD1`Y\x0F\u00AE\u00D7\u00B5\x07@\u00BC\u00EA\u008F\u00C6\u00F4L\x07@\x15\u00C1\u0090\u0094\u00DF\x13\u00F8H\u00E53\x011\x14\u00B1\u00CEq\x1A\u00EB\u00D4cA\x18|\u009Bnnn|\x00t\x0BI\u00F9\r4 \u00BA\u00C4\b\u008E\u00A1r\u00AC'\x15\u00C5\u00A2 \u00F8~\u00E6\u00E0\u00CDM\u00A5\x1C*\u00BF\u00A8\x16\x10\u00AD\u00B9\u00ED\u00AE\u00B2.]\u008B\u00CC\u00E0\u0087F\u00F9\u00FEq\x15'\x16\u0080x\x04\x10\u0086\x04B \x00\u00E1\x17\u00A5\u008F\x10\u0080\u00E1\u00EB\u00B5a{C\u00DA\r\u00B0\x1F\u0083\u009F\x02\u00F5O\u00D3D\u0090\u00B0\u00D7\u00EB \u00DC\bX$\u00A8\x01\u00C3W\u008F\n\u009E\u00C4&Q\u00BE\u00FA\u00A5\u00D1\x16f\u0081\u00F76\x07\u00DF{d\u00B4JdaU\u00AF\x05'\x1B\u0082\u00AF\bs>\u008C\u00E8\u00A8\x05\u00FE\u00F6\u00F7{\u0085\x1EJ\t\u009BZ\u00E1\u00EC\u00C1\u00A6\u00FCF&\u00CC \u00A0\x01\u00A5B\u009A\u00FAT\u00BA\"\u00E0\u00A4\u00C0P e1\u00E8\u00AA\n\x1E\x02w\u00C1Q\u0089\u00CDI(y\u00DA<`\u00DB:\u0098\u00DB\u00B4\u00AA\u00B7\u009CZ\u0090^\x03\u00E2v\u00C7\u00ED\u00B3\x01\x04\u00DE\x04\x0Fq\u00C5)\u00F0\u00B1\u00B0O\u00DB\u00E8\x10\x0E\u00D5\u009C4\u00FD_#\u0085\u00B9\x06\u0080X\u00E5\u00F5\x05\u00C1\u00FB\u00B4\u00EA\b\u00DA\u00CB\x16\x03\u00FF0\x00\x11\x0B\x02\u00C6\u00E7\u00BDM\f\u00B8fR\x7F5xI\u00CA\u00E4a\u008A\u00DA\u00F7\u008C\u00CF\u009Eo\x02\u00A0\u00C5\u00DA\u0081\u00F9\x18\u00FC\u00AEM\t\u00A4)\u00B5\u00E0\u00B4\r\u0094\x04\x00\u00E2\u00DC\u00E7h|\x15\u00BC\u00BB'\u00C1GjO\x13:S3\x00\u00E2\u00B13\u00CD\x06\u00B0\u00FAS\b\u00BE\u00BCG\u00C1\u00EB\u0092\x17m\u00C6(\u009C\u0089\x00pf\u00EE\u009EV+*{\x06\u0080\u00CBd@\u0082\x12\u00E4\u00A9\u00BE\u00A8\u00F0\u00D1\u00EA\u00CFM\u008A\u009Ee!\u0094\u00D9\u008AIy\u00B1\u00C1\u009ET\u00DB\u00D9q\u00C5\u00CF\x05\u0080\u008BT\u00A9\u00BB\u0094\u00B9-\u00E7\u0093X1\u00A1\u0080\u00ACo}q\u00E5/\u00E7(k\u00F7\x1A\u0080gA\u00AA\x1C$\x00\u009C\u00F9\u009E\x03\u00D4A\u0099>\x0E78)@\u00F3~\u00C3\u00F9\u00B2\u00CFa\u00EF=\u00B9\u00F0\u00A7=N\u00F9\u00EC\u00CD\u00DBe0\u00A5\u00E3h\u00E3.\x00Z\u00BD\u00A1\x1D\u00A8\u0098\u00DA\r\u00A9\u00D1\u00D4g\x01\u00DD\u00D1\u00E0\u00A6@\u00DA\x18\u00EBQ\x1A\u0084\x16F\u00DEr\u00C6k\u0084Z\u00EBv\x19ik\u00A5\b~[)\u0086\u00BB3\u00BF\u00C4-\u00C8\u00A1\x04\x00\u00D6\x04E\u00E3f\u00B8\u00C3\u00F0'\x02\u00D6.$\x00\u00A4}\u00D8\u0085:QNx\u0088m\u00DB\u00936\u008A\u00A7\u00D9?\t\x003\u00C6\x05=\u00C1\u00AEK^6\x12\u008C\u00EE\x13\t\x00\u009C}\u00FC\x16\u00A5\u00C1hG\u00B5 \u00D0\u00F2\u00BF\u00CD\u0098<\u00F9\x00`\u008Bc\u00E46\u00A6\u0081\u00BB\u00B2/\u00B0M\u00EB\x11\u00FD9\u00D3(\u00EB`\u00A6h\u00F0\u00A5\x0E\u00B1 \u00D8r-\u00E8\u00E1\u00EA\u00D30\u00D6\u00E1\u00D6\n)\x00\u009C\u0083\x05d\u0081\u00AA\x05\u00CD-u\x04\u00DC\u0084\u00EDj\x0B\u00C0i\x7Fr\x06P\x1ApVu\b \u00A8}\u00F8F\u00CE L\u00D5\u00ECA\u0095\u009FsJ=\u0082\u00FC\x0FM\x18\u00C0\u00AD\u00F0\u00D115\u00B6E\u00D2\x05y\u0081\x10_;>uRo\u00A6\u00B0k\u0085\x11\x00\u00C0\x02nn\u00E3\x03\u008D5\x10\u00EA\u008E`3\u0092\u00D9\u00EET\u00F0\x15\n\u009E\u00B3\r7\u0080\u00D5_\x18\x03 DP\x07a\x01^\u00A7\u00EFfa\u00C3\"\u00AA-\u00CB\u00F3\u00C6\u00E8-P\u00E6>D(\u00EDN\u0089\x00\x00\x0B\u0090\x01\x03\x01\bs\u00D5\x1E\u00E9\u00D5\u0095*=\u00C8BHw<^\u00D7O\u00991\u00DF\u00C7\x0E\x7F\x03\u00D6\u00E7\u00E6~\u00D24\u0098\u00C4\x02\u00D7\u00E1m\u0081\u0095\u0089\t\u0098>\u00BD\u00C2\u00E5\x1D\x06\u008E@ta|\u00AE\u00D15*\u00CEr\u00E3UU\u00E9\u0099\u00A3~\x07\u00B0\x148\x0E\u00AD\u00BA\u00EC\u00FDC|Y\u00E2\u00ECA\u00FCR\u00C6\u00C6=z\b\u00A8&\\\u0081\u00A5b\u0083\u0096J]\u0085m\x10\u00B8Gj\u00D33)\u0096\u00D2\u00D5O\x05@\x03\u00E1%C>\u00BF\u00AF4\u00A5\u0096\nV\u00ED.\u00A3\u009FS\u00D0&g\r\x18t]R\u00F8D\x00\x10\b(=\u00AD\u009C\x03\x02\b\x05\u00EA\u00E7c\x0B\u0097\x0Bi\u00E5\u008D\u00BBO\u0091\u00F9\u00D0\u00C1\x16\x04\u008F\t\u00BB2\x05/\u00DA\x11\"\u00FA6\u00F6bG(\u00D6)\u00F5\u00AC\u00C1\u008B\x00\u00D0\u00A4r\u009D\u00AB\u00B3\u00F3\x1A\u008Ap\u00A3\u00D3\u00A4\u00E0e\x06\u0080@\b\u00C1\u009B4\b-v\u00B0\u00EA]\u009B\x175\u00FE\u00CD\x10\u00800\x027\x11<&\u00B9\u00EE\u00D3\u00AA[\u00FF\u00F1d\u00E6\x1FM\x01\b]\x02\u00C2\u00B7\u00BC?0\u00A2\"W\x05\x0F\u00F2B\u00D7\u00DAo\u0086\u00A8S\x048&\u0093\u0082\u00BB\u00D2\x14 W\u00CC\u00A0?K\u00C6\u00D9\u00AC\u00B6\u0095\u00B75\u00B4m\u00B4\u00A8\u009B\u00AC\x1C\u00B1\u0087yP\u00FB\u00CB\u0098\u00F6_\u0080\x01\x00\x00M\x19K\u00A1:Pb\x00\x00\x00\x00IEND\u00AEB`\u0082"

var cpIcon32 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \b\x06\x00\x00\x00szz\u00F4\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02\u00B4IDATx\u00DA\u00C4WMn\u00D3@\x14\u00B6#V\u0088\u0085\u00D9 \u00D4\x05\u00CD\x16$D*\u00C1\u009AD\x1C\u00A0\u0089`\r\u00C9\u00B6Brr\x02\u00DB[64\x12\u0082e|\x00\u0090\u00C3\x01\x10\u00F6\t\u00DA\u008A\x03\u00D47\u00C0HU\x16]\u00D4|\u00AF~V\u00DD\u00E1\u008D\u00EDI\u00822\u00D2S\x14{f\u00BEo\u00BE\u00F77\u00B6\u00AC\x1D\x0F{[\x1B\u00E5G\u00EF}\u00FC\u00A4d\u00F6\u00E7O\u00F1.\b\u00E4\u0095\u00BF\x19l\t\u009B\u0083\u00CC\u00E9.\bTG\b\u009B\u0081H&\u00BD\u00EC\x18\u00A1,V]X\x1F66XEs\u00CFA\u00B0\u00B7\x1E\u0081\x02\u00D4\u0087\u009D\u00D3F\u00B0\u009F\u00F4T\u0098\u0099\u00D6\u00EC\u00E2\u00C0N@b\u00D8\u009E\u00C0b\u00E5\\\x03\x17\u00A0\x1E\u00AC\u00DB@u\x00\u00BB\x0F\u009B\u00C0tA\u00B8P\u0095\u00E8h\u00C0{|R\u00CF@j\"\u00FA\x1Bv\b\x0B`#\x0EFU\u0089\b$\x1C=\u0081\x1B\u00F0\u00DE\u009A\u00F18\u00E4\u00F5/Y\x15\u0095\x04)9\u0095\t\u0090\u00BF\u008B\u00C5\u008E\u00C6\u00C73\u00D8\u00815\u00B9\u00DB&{\b\u00C4\u00D5\u0090pK\x15T\x05\"\x01\u009C\x16\u00CF\u00F2\u00E7o\x07\u00B0}X\u0094\u00FFz\u0093\x1Bd\x00)2\x17\\1\u00BCM`\u00B1\u009A\n\u00B2\x138\x01;\u00EC\u00E3i\u008B`T\u0087\u00CB\u00B5@U\u00E1PU@\n8\x02w\r\u0083\u00D1\u00D2\u009Cv\u00A9<\u00EF\u00DF\x10(\n\u008B*}\x00\u00F0>\u00CB\u00B8\u00E9\u00A0\u0080L\x04b\u00D6\u009D\u00CA\u0084[\u00D2\u00FB{\x11\u00C9vb\x00\x12\u00D4\u00BCK\u00B96\x04r/(\u00AA\\\u00D5\u00B7!N\u009Fh*^\u00B1\u00F0\u00E9\u00D7\u00AD\u00F4\u0091N%7\u00AB#)\u0083\u00E4\x7F\u008F\u00D2\x05j\u00E9\u00A4\x16\u00FA\u00AC\u00A6\u00A4n\u0097\u0080\u00FD\u00E8(\u00F9'\u00FD\u00BE<<\u00C3\u00EF\u009F\u00DA&U\x1F\u00A0)\u00DC\x18\u00ABs\u00E0:_R\u00C0\x13\x14xW\u00A6\u008Af\u00C4\r\u00E9y\u00CC\u0091\u00AE\u00CE\u00F1\u00DBtC)mL\u00C7\x19\u00BBQ=\u0098\x18\u0084\u00B1\u00D0P\u00C2\r\u00C0\u00CB+\u00D9\u00B0-\u0081\u00EFj\u00C7\u00EA\u00BC\u00BE\u00E8o@b\x0E\u00FFK\u00C5-\u00D1\x11X\n\u009Bx\u00C1\u0093\u00CB@b\u00DD0N\x01\x1E\n\u00BE\u00CF$\u009Ck\x02\u00F9\u00AB0\x15N\u00DB\r\x1E_F 12 \x11\u00A3\u0082\u008E4]u\u008E\f\u00C8\u00EA\u00AEd\u0081\u00D0\u00B1zD\x02\u00EE\x18i\u00DEWK\u00ED\x04'\u009Fy{Q$t\u00D5\u0094\u00B3\u00A2\u00FEZn\u00FF\x18\u008F5\u00E57\u00E3\u009E\x1E^}\u00BBG\u00F9\u00DF\u00B5_|\u00889MI\u00F2\u008C\u00DB\u00EETw_\u00C4\u00E9\u00E3V\u00DF\x05 \u00E17\u00E47\u00B9#\u00BDzpA\u00B7\u00A3\u008F\\\u00C6\u00EB\u00AEo\x13\u0080\u0087F\x1F& 1\u00E5\u00CD\u00B5\x03\x04\x06|}\u00B3\u00D6\x05\u00D7\x16\"\x04\u00E51\u00DF\u00E5\u00D25\u00D3\u0090T:h\x02o\u00F5i\u00C6j\u00B8j\u00C7\u00D4(@\u0084\u00836\u00C0\u00C6\u00DF\u0086 \u00D2\u00E3\u00CA\u00B6Od*1\u0090r\u00D9\u008D\x01lZ3\u00AC\u00BF\x02\f\x00\u00D1\u00C1\u00F3\x07\u0099\u00D0\u009D&\x00\x00\x00\x00IEND\u00AEB`\u0082"

// Illustrator icon 64x64
var aiIcon64 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00@\x00\x00\x00@\b\x02\x00\x00\x00%\x0B\u00E6\u0089\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02\u00C9IDATx\u00DA\u00ECZ=K\x03A\x105kL\x04\u0089(~\x14\u00DAh\u00A5\u00F6ba'Z\x07\u00FC\x03\x16V\x16vV\u00F9\x03\u00FA\x17l\rX\x07\u00AC\x15+-b\u00A7\u0085\u00A6\u00D2\u00C6\x14\u00A2(\x1A\u00FC\u0096\u00F8$\u00B0.\u00B3\u0097\u00BB\u00DD\u00CD\u00EE]\x0Ev\u008A\u0090\u0084\u00BD\u00BB}3o\u00DE\u00CCN\u0092in\u008D\u00F7\u00A4\u00D9XO\u00CA-\u00F5\x00\u00B2\u00FC\u00DD\u00DA\u00C1S\u008A\u00F6].\x0EQ\x00\u00D5\u00FA\u00A7\u00A7\u0090\x07\u00E0\x01x\x00\x1E\u0080\x07\u00E0\x01x\x00\u00A6\u00BDPR6\u0098\u00CF\u0094\x16\x0B\u00AB3\u00FDx\x7F\u00F5\u00F0]:~\u00BE\u00BC\u00FFNS\x04\u00F8\u00EEa\u00B3#\u00D9rq\x18\u0090b\u008D\u00C0\u00D9\u00FAX!G\x1F\tGVj\u00EF*\u0097\u00F3\u00DD\u00B7\f\u00B7Z\u009E\u00CA+^k'\x02\u00F2\u00EEa\x0B\x139\u00E3\x1BN\x16z\u00E3\u00A3\u00D0\u00DChp\fW\u00A6\u00F3\u008Aw\u00B8}\u00F9!\u00DF\x1C\u00DD|\u00C4\x07\u00A0\u009D\u00A7\x11\x16E\f;\u00A7\r\u00F1#\u00C8\u00A3\u0095\u00C4\u009D\u00E6\x00\u00F8\u00DA\x1E[\u00DF\u00E1u\u00B4/\u00B1fy\u00FF\x01\u008B\u00C1\x1C\u00F8^k\u00F7\u009D\x02\u0080\\\u00E0\u00C1\u00FC\u00E3\u00CBgS\u00CC\x07`\u00DB>i(\u00B2\u00A8R\u00FBI\u00A0\u0090\x11\u00F7\u00EF\u009D\u00BF\u0092\\l\u0097!\u00DDR\u00C8H\x02T\u00EB_\u00A8D\u00D0rqA$%\u0080\u0093\u00C8\u008E\u00D6\u00E9\u00BC#\x00$M\u00F1`\x10Z\x04\x00\u008D'a\tH\u00E2\u00A5A\u0091\u0087\x7F\u00E5l\u00F7.\x0E\n\u0081\x1E\"\u00E3\u00E1~\u00FE\u00FA\u00BF\u0095\u0091\u00AC\u0096\u00A8\u00C7\u009A\x03\u00A4\u0082\u00B6\u00E2.G\u009Fx\u00B7\u008B\x00\u00C8\t\x10X\u0086\u00D4+Z\u00AC\x00@\f\u0091\u00EB\x10P\u00EE{\u00C2\u00A2\u0090B\u0091$\x009}C4\u00C4i\x10\u0098)\x7F\u00FA\x02\u00F9\x03\u0083n\u0092\u00F6\u00C6i\x10\f\x01\u0090=\x11\u00AF\x13\x16u]\x04\u00C8\u0086\u00E0oR\u00AD\b\x1E\u00A8\u00AD\u00BB\u0092\u00CCl\u00B8\u00FF+\u00B2\x1F&\u009A\u009Bp+A\x12\x00\u008A\u00B49?@\u00D6\x187v\u00CE\x01\u0080\f\u00A4\u00B8\x02Od\u00B5j5<\u00F2\u00D9%\x01\n\x19K\u008A\u00A3Tf\u00B1\u00ED\u00C3\u0091\u0098\u00EA\x01\u00C0\tF,\u00C0\u00BA\u0099\u00A35/q\u0092\x03\u00B2\x17e\t\x12x\u00CFH\u00B6h\u00CDK\u009C\x00 \u00FC\u00C1\u00F1e\u00ED\u00E01\u00A4\u00DB\u00E3\u00BF%\u00F2\u00CB\u00AD\x03`\u009A4\u00C8\u0091\u00F3x\u00C8b\u00943\u0088\u00A9\u00ADa\u0091\x05\x00x<\u0099aE\x0Ep\u00E4\u0092l]\u008B\u0098\x0E\x7Fr\u00A4TE\u009Ew\u00E5\x10Y?\u00DF0\u00E3\fV9z\u00CB)n]LU\x01\u00C8\u00B3\x03\u0095\u00A1\x15J/\x12\u00DD\u00E9\u00AC\u0085\u0099\u00E9O\u00B8\u0080\u0086\x07\u00CAn\x10\u0098\x19\x7F\u00E0Z\u00C5\u00C6\u00E6\u00F0\u00DA\u00ED\x01M5\u009A\u0095\u00DA\u009B\u00E8KB\u008C\u00F0\b\u00EC\u009C6D\u00F9\"\u00DAZ\u00BEx\u00AD\u00D6\u00CDI\u0095\u00E1\u00FF\u00D8\u00D2\x1A'%nW\x1B\u00E3\u009D\u008EU\u00BA\u00C4<\x00\x0F\u00C0\x03\u00F0\x00<\x00\x0F \u00D5\u00F6\u00DF\u0084\u0094\u008B\u00C3\u00E9\x06\u00E0\u00FA\u00B7 O\u00A1`\u00FB\x15`\x00\x1A\u00A2\r.v\x18\u00D5\x12\x00\x00\x00\x00IEND\u00AEB`\u0082"

var aiIcon32 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \b\x02\x00\x00\x00\u00FC\x18\u00ED\u00A3\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u0097IDATx\u00DAb\u00FC_,\u00C6@K\u00C0\u00C4@c\u00C0\x02\u00C4\u00EBo\u00FE\x00\"\u00AA\x1B\x1D\u00A8\u00CE\x01D \x0B\u009E~\u00FE{\u00EA\u00D9/\u00AA[`&\u00C5J\u008F \x1A\u00B5\u0080\u00E6\x16\u0098I\u00B1\u009DN\x12\u00BD\u0091!\x06L08\u0093)~\x00\u00D4\fe\u00BC\u00FD\x13\u00B0\u00FA\x1DfR\u00E1ec\x04'JN\u00ACi\u009D\u0089\u00A0\x03\u00E1l\ra\x16i^f4\x05\u00C0$\x0E\u00B3\u00FE79>pQdC\u00E5\u00B2/\u00BC\u00F4\rY\x04\u00E8j\u00A0\u00CFx\u00D9\u0098p\u00E5$\u00A2|\x004\x02\u00C2uV`GS\u00C0\u00C7\u00CE\b4\x1D\u00C8\u00C0\u00F4\x1Ca\x0B\u0080z\u0080\u00C1\x02d\u00EC\u00B9\u00FF\u00F3\u00D4\u00B3\u00DF\u0090\x10\x07\u009A\u0088\u00AC&N\u0097k\u0091\u009F\x00\x10\u00E1\u008Ad&\u00BC\u00E1\x03u/\u00D0tx\b`z\u0082\u00FCd\n)L\u00C0\x16\u00FC\u0082\u00F8\x00-\u00DA)\u00B5\x00\u00E2X\u0088\u00D1@;>\u00FF\u00FA\u008F\u00EC-J-\u0080\x1B\u00B4\u00F7\u00C1O\u00B8?\u0080$0\u00D5\u0093d\x07\x0B~\u00E7C\u008Au\b[\u009A\u0097\t\x1Et\u00C0h\u00A7\u00D4\x02x\x04@\x12\x12\u009A\u00DDmG\u00BFP\x14D\u009A\",\u00B8\u00D25$\u00F9\x02\x15P\u00E4\x03x\u00F8T\u00EE\u00FF\u0084\\\u00C2\u00B4;\u00F2A\u00D2;P\u00C1\u00F57\x7F\u00C8\u00F7\x01r\x0E@\x16\u0087\u00E7\x06\u00E2\u00E3\x19\u008B\x05\u00C0\u00BC\n\tw`A\x06/\u00CB\u00D0R\x14\u00D6\u0082\u008FX\x0B\u00E0\u00E1\x037\x0E\x0E>\u00FD\u00FC\x0F/\u0097\u00E0\u00A9\u0080\u00E48\x00\x06K\u00DC\u00A6\x0F\u00C8E12\u00C8\u00DE\u00F1\x11\u00E2v\u0088,0\u0086 \u00C1\u0088U1v\x0B0C\x06\u008F,~\u00C5\u00A3\u0095\u00FE\u00A0\u00B0\u0080\u0091\u00D6\u00CDw\u0080\x00\x03\x00\u00FEg\u00A5\u00DD\x05\n\u00C8\u00CA\x00\x00\x00\x00IEND\u00AEB`\u0082"

// Photoshop icon 64x64
var psIcon32 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \b\x02\x00\x00\x00\u00FC\x18\u00ED\u00A3\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u00B1IDATx\u00DAbd\u00BA\u00FA\u009F\u0081\u0096\u0080\u0089\u0081\u00C6\u0080\x05B\u00FDsR\u00A2\u0089\u00F3\u00F7\u00DD\u00A3\u00B9\x0FF-\x184\u00A9\b\x190\u00BA\x073z\u0084 \u008B\u00FC\u00FF\u00F2\u0089\u00E1\u00C2\u0089\u00FF;\u00D72\x00\x19\u0094[\u00C0 !\u00C3\u00A0o\u008Eb%\x10[\u00BB2\u00C6\u00E7\u00FF+\u008Ab\u00B8s\u008DzA\u00F4\u00E2\t\u00C3\u00C5\u0093 \x12\x02x\u00F8\u0098\u00FA\u0096\x01I\u00AAY\x00\f\u0093\x7F\u0085\u0091\u00FF\u00A2\u00EC\u00FE\x03\x1D\x0E\t\x1C\x1E>`\x00\u00A2\x07\u00A9\u0081\x05\x10\u00E1\u00B2\u0098\u00A8H\u00FE\x0F\u008C\u0080\u00A9\u00CDP\u00E3l\u00DC\u00E0\x1Eb,\u00EF\x06\u00E6U\u00C6\u00BEe@\u00C4\u00B4\u00E9\x02\u00D3\u00AC-\u00C4\u00C5\x01V\u00F0\u00F2)\u00BA\u00D3\u009Ag\u00A2E\x15\u0083\u008A\x16\x05\x16p\u00F3\u00A2\u009B\x051\u00FD\u00CB\u00A7\u00FFk\u00E7C\u0092\x06\u00A3\u00B5+\u00B9\x16\x00C#>\x1F\x1A\\\u00E0T\u00C4\b\x0Bq`<\u00FD_8\x11\u00CA&6\u0099\"\u00C5\x1E\u00C2i\x10\x13a\u00EE\x05\u00E6\fF\u0088\u009A\u00E0D\u00A8 \u008E,\u00827\u0092\u00F5\u00CD\u0081\x0E\x07%\x1B\u00B8{\u0081Q\rI\u00B5@\x7F\u00C02\x04P\r\u00D3\u00B2C\u0098\u00A9\u008B\u0094\u00A2\x02\u00E8F`\u0092\x05\u00A6W`f\u0086\x01\u0094L\x07NQ@DZ\x10\u0081\u008C\x03\x061\u00D0\x14\u00AC\u00DE\u00FF\u00F2\u00E9_\u009A\x0F\u00A8\\\x01F\x0F0\u00F3\u0083\u00CB\x18\u0090\u00FA\x0B'H\u00C8\u00C9 \u00D5x\u00CB\x1F\u0090\u00CF\u00D2|\x10^AK\u00B8\u00E4\u0097\u00A6*Z\u00A0\u00E8\u0085\u00C7<\u00B0D!\u00A1\u00B0#\x02\x00\u0093)cv-\x10\u0081\n+`\x16\u0081g1\f\u009B\u00C8\u00B4\x009\u00A5!\x07\x17Z\x04\u00E0\u00B0\x00\x18\u00A0\x10\u0087\u00E0.\u0099A1?\u00B5\x19^.\u0081*\u008C#\u00BB\u0090\u00D3\x18\u00C2\u00AF\u0090\u0086\u00D7h\u00B3e\u00D4\x02\n\x00#\u00AD\u009B\u00EF\x00\x01\x06\x005\u0096\u00B4\u00F0\u00B3\n\x1E\u00F8\x00\x00\x00\x00IEND\u00AEB`\u0082"

var psIcon64 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00@\x00\x00\x00@\b\x02\x00\x00\x00%\x0B\u00E6\u0089\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03\x1DIDATx\u00DA\u00ECZ=l\u00D3@\x18\u00BD\u00B32FY\u00A9D'\u009A\u0085,\u00ED\u00D6JE\fH-\x0B[&\u00BAT]\u00CA\u00C0P\x15\u00A90u\u00A1,\x05\u00A9\x12\x03\bX*\u0096l\u00D9XJ\u00A5\x0E\u0088J\u00EDF\x07\u00D2%0\u00B5R\u00BB\u0086\u00B0\u00FAxW\x07\u00D7\u00BE\x1F\u00F7\x12\u00DB\u00B1O\u00BAS\"\u00E5\u00C7\u00B1\u00EF\u00DD\u00F7\u00BD\u00F7\u00BD\u00EF\x1C\u00EA\u00FDd\u00C4\u00E6\u00E1\x11\u00CB\u0087\u00F5\x00*\u00E1+\u00FF\u00C1\x1D\u009B\x16\u00FE\u00E0\u00B7K!\x07\u00C0\x01p\x00\x1C\x00\x07\u00C0\x01p\x002\u00F4B\t\u00836WH\u00B5\u0096tD\u00B7\u00C3~\u009D\u0092\u008B\u00B3\u00B2\x02x\u00BAy\u00F31x^\u009C\u00B1\u00BD6k\u00EF\u0092~\u00CF\u00CE\x14\u009A\u0098\u00A4\u00CBk^\u00EB\x1B}\u00D8\u00B4\u0099\x03\u00D5\x1A}\u00F1\x06\x0F\u00BBI\u008C p\u00E6\u0094\u0084\x03\u00E2\u00B8\u00CA\u00F5\u00EB\u00B7\u00F5\x06\u009D\u009E\u0095Y\x0E\u00E6\u00B0\u00C3\u00FD\u00BC\u0099=\x12\u0080\u00CBs\u00F6\u00F9m\u00F4\x03\u0086\u00B4i\u00AE\u0080\x00\"\u0086\u00E55\u00B6\u00BDQ>\x00\u00F2\u00E8\u00F78\u00A4~O\u00D0+:\u00BFp\u00F3\u009E\x07\x02\u00F8?z\u00AC\u00DB\x19V\u00C1*\x19.\x06\x04\u0094\u00EBO\u00BD\x11#\u00F4\u00CC\x1C\u00FBq\u00A4 \u00C9\u00CC\x1CA\u00D0\u00E6\x17D-\u00C6Z\u009C\x1C\u0093\u00F6\u00AE\u00F2W\u00F9\x02\u00E0\x18\u00F6\u00DA4\n\x00c\u00EA.\x11\u00A6R\u00ADy[\x1F\th\u00A3\x131\u00A0\u00AA\u00D6\u008A\x01@P\u008F\u00A5\t\u0089\u00B3\u00DFi\x11\x01\u00A4E^\u0088\x13=\u00BB\u00D9\u00E7\x10\u0081[\u00B7e~\u00C7\u00D2C.\x0E\u00D0\u00D9\u00CB\u00F3\u00C1k]^\u008D\x0F\x00\u00A8\u00A9O**\u00CD\u008F{\u00A7\u00B8\u00CEr\x02\u00DC[\u00A4\x13\u0093E\x00\u0080 J.\u0088+c\u00E4\x00\u00F1[\u00A9J\u00F0\u00DAw\u00B8\u00CF\n\u00E0@\u00BD\u00E1=\x7F\u00AD\u0098M\u00B2\u00AE\x1B\u00AFt\u008E\x00\u00A0\u00E8\u00A8_jm\u0081\u00B5\x16\u00D2]\u00B8\u00FC\u00CB\x0F)9=R\nM\u00CF\u0086{\u00ABI5\x01\u0099\x10\u00D7rT(*\u00C7\u00ED\u00D3\x17T\u00F1\u0091\u00BB\u0088\u00DCd\x14=\u009A\u00EC\u0082\x10\x01TY\u0095\u00B6\u00F2.B\u00B2R\u00C5\x0189\u00F6\u009F-)W\u00D4\x7F\u00B7\u00A5^i(l\x00C\u00D6\u00B1\u00B1\x02\u0080\u00D3\u00DE\u00DE\u00F0\u00D7\x1Fk\u00F3\u00A1\u00DB\u00D1a\x1B\u00F4t;\u00AD\u00A1\x1A\u0089Jf\u00F3Fn|\u00FF\u00CAe\u00C7 \u00BB\u00FC\u00D5G\x1EZ6M\u00D9\n,-\x13\x04@'!\u00E1M\u00BE\u0084;4\"e\u0091\u00DF\u00EF_\rx\u0089\u00B4\x1E\u00B5e\u00E1\u00F2\x05\u00E5\u00D5(\u00A9\u00BFt?\u00E1\u00CC\u00E9\u00EE\u00D0\u00FC\u00FD\x03y\t\x1Ei\x1A.\u00FC\x1C\u00B3\u00E4\\We\u0094a\"\x15\u00BF\u00B1\x057\u00C1\x17[R'jV\x1F\u00CA\u00B13\u00D7\u00EF\u00F9\u009BO\u00C4`\u009A\x19\u00BB\u00F1\x02@\u00BA\u00EBv\u00F8\u0090E\u00A1'-m?\x00\u00AB\u0087\u00BA\u00CB\r\u009F\f\x03\u009F\u00A0w\u008B\x17\u0093\"\u00EC\u00B4A\x10\u00F8\u00B6W\u00E0\u00F3B\u00A3\u008A*&\u00A1\u008A\u00D9\u00D8\x12\x01\u0088\u00FA\u00FExG/\u0093\u00DB\x1E\x12\u00AB68\u0088Y\x04\u00CA\b\u0080\u00B7i\u00B0LYZ\tHD\u00F2\u00FD\x01\u00F3u\x05\x07\u00AEvM\u00B4\x1E\x16\u00D6\u00DA\u00C4\u008F\fe%\u00F8U#\x05?\u008D}\u00B8\u00DE\u00D5\u0082\u00E6Da\x04n\u00CA\u00F8\u00B4\u00A1\u00950\x03P\u00BE\u00E1\u00FE\u00AD\u00E2\x008\x00\x0E\u0080\x03\u00E0\x008\x00\x0E@&}\u0085\u00FB\u00F3\u00B7\x03\u0090n\u00FC\x13`\x00\u00F2\x14>Qh\u00FA\u00DB\u0093\x00\x00\x00\x00IEND\u00AEB`\u0082"

var scriptAlertResult = false;

// Custom Dialog Alert + Icon
// https://community.adobe.com/t5/photoshop/script-alert-title-alert-box/m-p/11701555#M497514
function scriptAlert(alertTitle, alertString1, alertString2, okBtn, cancelBtn, okStr, cancelStr) {
    var alertWindow = new Window("dialog", undefined, undefined, {resizeable: false});
        alertWindow.text = alertTitle;
        alertWindow.alignment = ["right", "top"];
        // alertWindow.titleLayout = ['right', 'center'];
        // alertWindow.title = alertTitle; // Not working OSX
        alertWindow.preferredSize.width = 400;
        // alertWindow.preferredSize.height = 250;
        alertWindow.orientation = "column";
        alertWindow.alignChildren = ["fill", "top"];
        alertWindow.spacing = 0;
        alertWindow.margins = 20;
   
    var alertGrp = alertWindow.add("group");
        alertGrp.preferredSize.width = 400;
        alertGrp.orientation = "row";
        alertGrp.spacing = 20;
        alertGrp.margins = 0;
        alertGrp.alignChildren = ["left", "top"];
    
    var iconImg = alertGrp.add("image", undefined, cpIcon64); //aiIcon64
        iconImg.image = cpIcon64; //aiIcon64
        iconImg.spacing = 0; 
        // iconImg.size = [0,0,140, 140];       

    var alertText = alertGrp.add("group");
        alertText.preferredSize.width = 375;
        alertText.orientation = "column";
        alertText.alignChildren = ["fill", "top"];
        alertText.spacing = 0; 
        alertText.margins = 0;
        // alertText.alignment = ["left", "top"];
        // alertStringSize1 = alertText.add("statictext", undefined, alertString1, {properties: {name: "alertText", multiline: true}});
        alertStringSize1 = alertText.add("statictext", undefined, alertString1, {name: "alertText", multiline: true});
        // alertStringSize1.preferredSize.width = 240;
        alertStringSize1.preferredSize.height = 40;   
        // alertStringSize1.graphics.font = "dialog:13";
        // alertStringSize1.graphics.font = ScriptUI.newFont ("dialog", "Bold", 18);
        alertStringSize2 = alertText.add("statictext", undefined, alertString2, {name: "alertText", multiline: true});
        alertStringSize2.preferredSize.height = 45;   
        // alertStringSize2.graphics.font = "dialog:13";
        // alertStringSize1.graphics.size = 60;   
        // alertStringSize2.text = "dialog:13";

    var buttonGrp = alertWindow.add("group");
        buttonGrp.preferredSize.width = 400;
        buttonGrp.orientation = "row";
        buttonGrp.alignChildren = ["fill", "top"];
        buttonGrp.spacing = 10;
        buttonGrp.margins = [0,20,0,0]; //0; //


    if (cancelBtn) {
        var cancelButton = buttonGrp.add("button", undefined, undefined, {name: "cancelButton"});
            cancelButton.text = cancelStr;
            cancelButton.alignment = ["right", "top"];
            cancelButton.graphics.font = "dialog:13";

        cancelButton.onClick = function(){
            alertWindow.close();
        }
    }
    if (okBtn) {
        var okButton = buttonGrp.add("button", undefined, undefined, {name: "okButton"});
            okButton.text = okStr;
            okButton.alignment = ["right", "top"];
            okButton.graphics.font = "dialog:13";
            okButton.active = true;

        okButton.onClick = function(){
            scriptAlertResult = true;
            alertWindow.close();
        }
    }
    
    alertWindow.show();
}

// scriptAlert("Alert window title", "Alert text string 1", "Alert text string 2", true, true);
