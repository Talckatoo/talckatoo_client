// this is languages supported by Open Translator
// const languagesArray =
//     [
//       {
//         "language": "Afrikaans",
//         "code": "af"
//       },
//       {
//         "language": "Albanian",
//         "code": "sq"
//       },
//       {
//         "language": "Amharic",
//         "code": "am"
//       },
//       {
//         "language": "Arabic",
//         "code": "ar"
//       },
//       {
//         "language": "Armenian",
//         "code": "hy"
//       },
//       {
//         "language": "Azerbaijani",
//         "code": "az"
//       },
//       {
//         "language": "Basque",
//         "code": "eu"
//       },
//       {
//         "language": "Belarusian",
//         "code": "be"
//       },
//       {
//         "language": "Bengali",
//         "code": "bn"
//       },
//       {
//         "language": "Bosnian",
//         "code": "bs"
//       },
//       {
//         "language": "Bulgarian",
//         "code": "bg"
//       },
//       {
//         "language": "Catalan",
//         "code": "ca"
//       },
//       {
//         "language": "Cebuano",
//         "code": "ceb"
//       },
//       {
//         "language": "Chinese (Simplified)",
//         "code": "zh-CN"
//       },
//       {
//         "language": "Chinese (Traditional)",
//         "code": "zh-TW"
//       },
//       {
//         "language": "Corsican",
//         "code": "co"
//       },
//       {
//         "language": "Croatian",
//         "code": "hr"
//       },
//       {
//         "language": "Czech",
//         "code": "cs"
//       },
//       {
//         "language": "Danish",
//         "code": "da"
//       },
//       {
//         "language": "Dutch",
//         "code": "nl"
//       },
//       {
//         "language": "English",
//         "code": "en"
//       },
//       {
//         "language": "Esperanto",
//         "code": "eo"
//       },
//       {
//         "language": "Estonian",
//         "code": "et"
//       },
//       {
//         "language": "Finnish",
//         "code": "fi"
//       },
//       {
//         "language": "French",
//         "code": "fr"
//       },
//       {
//         "language": "Frisian",
//         "code": "fy"
//       },
//       {
//         "language": "Galician",
//         "code": "gl"
//       },
//       {
//         "language": "Georgian",
//         "code": "ka"
//       },
//       {
//         "language": "German",
//         "code": "de"
//       },
//       {
//         "language": "Greek",
//         "code": "el"
//       },
//       {
//         "language": "Gujarati",
//         "code": "gu"
//       },
//       {
//         "language": "Haitian Creole",
//         "code": "ht"
//       },
//       {
//         "language": "Hausa",
//         "code": "ha"
//       },
//       {
//         "language": "Hawaiian",
//         "code": "haw"
//       },
//       {
//         "language": "Hebrew",
//         "code": "iw"
//       },
//       {
//         "language": "Hindi",
//         "code": "hi"
//       },
//       {
//         "language": "Hmong",
//         "code": "hmn"
//       },
//       {
//         "language": "Hungarian",
//         "code": "hu"
//       },
//       {
//         "language": "Icelandic",
//         "code": "is"
//       },
//       {
//         "language": "Igbo",
//         "code": "ig"
//       },
//       {
//         "language": "Indonesian",
//         "code": "id"
//       },
//       {
//         "language": "Irish",
//         "code": "ga"
//       },
//       {
//         "language": "Italian",
//         "code": "it"
//       },
//       {
//         "language": "Japanese",
//         "code": "ja"
//       },
//       {
//         "language": "Javanese",
//         "code": "jw"
//       },
//       {
//         "language": "Kannada",
//         "code": "kn"
//       },
//       {
//         "language": "Kazakh",
//         "code": "kk"
//       },
//       {
//         "language": "Khmer",
//         "code": "km"
//       },
//       {
//         "language": "Korean",
//         "code": "ko"
//       },
//       {
//         "language": "Kurdish",
//         "code": "ku"
//       },
//       {
//         "language": "Kyrgyz",
//         "code": "ky"
//       },
//       {
//         "language": "Lao",
//         "code": "lo"
//       },
//       {
//         "language": "Latin",
//         "code": "la"
//       },
//       {
//         "language": "Latvian",
//         "code": "lv"
//       },
//       {
//         "language": "Lithuanian",
//         "code": "lt"
//       },
//       {
//         "language": "Luxembourgish",
//         "code": "lb"
//       },
//       {
//         "language": "Macedonian",
//         "code": "mk"
//       },
//       {
//         "language": "Malagasy",
//         "code": "mg"
//       },
//       {
//         "language": "Malay",
//         "code": "ms"
//       },
//       {
//         "language": "Malayalam",
//         "code": "ml"
//       },
//       {
//         "language": "Maltese",
//         "code": "mt"
//       },
//       {
//         "language": "Maori",
//         "code": "mi"
//       },
//       {
//         "language": "Marathi",
//         "code": "mr"
//       },
//       {
//         "language": "Mongolian",
//         "code": "mn"
//       },
//       {
//         "language": "Myanmar (Burmese)",
//         "code": "my"
//       },
//       {
//         "language": "Nepali",
//         "code": "ne"
//       },
//       {
//         "language": "Norwegian",
//         "code": "no"
//       },
//       {
//         "language": "Nyanja (Chichewa)",
//         "code": "ny"
//       },
//       {
//         "language": "Pashto",
//         "code": "ps"
//       },
//       {
//         "language": "Persian",
//         "code": "fa"
//       },
//       {
//         "language": "Polish",
//         "code": "pl"
//       },
//       {
//         "language": "Portuguese (Portugal, Brazil)",
//         "code": "pt"
//       },
//       {
//         "language": "Punjabi",
//         "code": "pa"
//       },
//       {
//         "language": "Romanian",
//         "code": "ro"
//       },
//       {
//         "language": "Russian",
//         "code": "ru"
//       },
//       {
//         "language": "Samoan",
//         "code": "sm"
//       },
//       {
//         "language": "Scots Gaelic",
//         "code": "gd"
//       },
//       {
//         "language": "Serbian",
//         "code": "sr"
//       },
//       {
//         "language": "Sesotho",
//         "code": "st"
//       },
//       {
//         "language": "Shona",
//         "code": "sn"
//       },
//       {
//         "language": "Sindhi",
//         "code": "sd"
//       },
//       {
//         "language": "Sinhala (Sinhalese)",
//         "code": "si"
//       },
//       {
//         "language": "Slovak",
//         "code": "sk"
//       },
//       {
//         "language": "Slovenian",
//         "code": "sl"
//       },
//       {
//         "language": "Somali",
//         "code": "so"
//       },
//       {
//         "language": "Spanish",
//         "code": "es"
//       },
//       {
//         "language": "Sundanese",
//         "code": "su"
//       },
//       {
//         "language": "Swahili",
//         "code": "sw"
//       },
//       {
//         "language": "Swedish",
//         "code": "sv"
//       },
//       {
//         "language": "Tagalog (Filipino)",
//         "code": "tl"
//       },
//       {
//         "language": "Tajik",
//         "code": "tg"
//       },
//       {
//         "language": "Tamil",
//         "code": "ta"
//       },
//       {
//         "language": "Telugu",
//         "code": "te"
//       },
//       {
//         "language": "Thai",
//         "code": "th"
//       },
//       {
//         "language": "Turkish",
//         "code": "tr"
//       },
//       {
//         "language": "Ukrainian",
//         "code": "uk"
//       },
//       {
//         "language": "Urdu",
//         "code": "ur"
//       },
//       {
//         "language": "Uzbek",
//         "code": "uz"
//       },
//       {
//         "language": "Vietnamese",
//         "code": "vi"
//       },
//       {
//         "language": "Welsh",
//         "code": "cy"
//       },
//       {
//         "language": "Xhosa",
//         "code": "xh"
//       },
//       {
//         "language": "Yiddish",
//         "code": "yi"
//       },
//       {
//         "language": "Yoruba",
//         "code": "yo"
//       },
//       {
//         "language": "Zulu",
//         "code": "zu"
//       },
//     ]

// this is languages supported by DeepL
// const languagesArray = [
//   { language: "Bulgarian", code: "BG" },
//   { language: "Chinese", code: "ZH" },
//   { language: "Czech", code: "CS" },
//   { language: "Danish", code: "DA" },
//   { language: "Dutch", code: "NL" },
//   { language: "English", code: "EN" },
//   { language: "Estonian", code: "ET" },
//   { language: "Finnish", code: "FI" },
//   { language: "French", code: "FR" },
//   { language: "German", code: "DE" },
//   { language: "Greek", code: "EL" },
//   { language: "Hungarian", code: "HU" },
//   { language: "Indonesian", code: "ID" },
//   { language: "Italian", code: "IT" },
//   { language: "Japanese", code: "JA" },
//   { language: "Korean", code: "KO" },
//   { language: "Latvian", code: "LV" },
//   { language: "Lithuanian", code: "LT" },
//   { language: "Norwegian", code: "NO" },
//   { language: "Polish", code: "PL" },
//   { language: "Portuguese", code: "PT" },
//   { language: "Romanian", code: "RO" },
//   { language: "Russian", code: "RU" },
//   { language: "Slovak", code: "SK" },
//   { language: "Slovenian", code: "SL" },
//   { language: "Spanish", code: "ES" },
//   { language: "Swedish", code: "SV" },
//   { language: "Turkish", code: "TR" },
//   { language: "Ukrainian", code: "UK" },
// ];

// this is Azure language
const languagesArray = [
  { language: "Afrikaans", code: "af" },
  { language: "Albanian", code: "sq" },
  { language: "Amharic", code: "am" },
  { language: "Arabic", code: "ar" },
  { language: "Armenian", code: "hy" },
  { language: "Assamese", code: "as" },
  { language: "Azerbaijani (Latin)", code: "az" },
  { language: "Bangla", code: "bn" },
  { language: "Bashkir", code: "ba" },
  { language: "Basque", code: "eu" },
  { language: "Bhojpuri", code: "bho" },
  { language: "Bodo", code: "brx" },
  { language: "Bosnian (Latin)", code: "bs" },
  { language: "Bulgarian", code: "bg" },
  { language: "Cantonese (Traditional)", code: "yue" },
  { language: "Catalan", code: "ca" },
  { language: "Chinese (Literary)", code: "lzh" },
  { language: "Chinese Simplified", code: "zh-Hans" },
  { language: "Chinese Traditional", code: "zh-Hant" },
  { language: "chiShona", code: "sn" },
  { language: "Croatian", code: "hr" },
  { language: "Czech", code: "cs" },
  { language: "Danish", code: "da" },
  { language: "Dari", code: "prs" },
  { language: "Divehi", code: "dv" },
  { language: "Dogri", code: "doi" },
  { language: "Dutch", code: "nl" },
  { language: "English", code: "en" },
  { language: "Estonian", code: "et" },
  { language: "Faroese", code: "fo" },
  { language: "Fijian", code: "fj" },
  { language: "Filipino", code: "fil" },
  { language: "Finnish", code: "fi" },
  { language: "French", code: "fr" },
  { language: "French (Canada)", code: "fr-ca" },
  { language: "Galician", code: "gl" },
  { language: "Georgian", code: "ka" },
  { language: "German", code: "de" },
  { language: "Greek", code: "el" },
  { language: "Gujarati", code: "gu" },
  { language: "Haitian Creole", code: "ht" },
  { language: "Hausa", code: "ha" },
  { language: "Hebrew", code: "he" },
  { language: "Hindi", code: "hi" },
  { language: "Hmong Daw (Latin)", code: "mww" },
  { language: "Hungarian", code: "hu" },
  { language: "Icelandic", code: "is" },
  { language: "Igbo", code: "ig" },
  { language: "Indonesian", code: "id" },
  { language: "Inuinnaqtun", code: "ikt" },
  { language: "Inuktitut", code: "iu" },
  { language: "Inuktitut (Latin)", code: "iu-Latn" },
  { language: "Irish", code: "ga" },
  { language: "Italian", code: "it" },
  { language: "Japanese", code: "ja" },
  { language: "Kannada", code: "kn" },
  { language: "Kashmiri", code: "ks" },
  { language: "Kazakh", code: "kk" },
  { language: "Khmer", code: "km" },
  { language: "Kinyarwanda", code: "rw" },
  { language: "Klingon", code: "tlh-Latn" },
  { language: "Klingon (plqaD)", code: "tlh-Piqd" },
  { language: "Konkani", code: "gom" },
  { language: "Korean", code: "ko" },
  { language: "Kurdish (Central)", code: "ku" },
  { language: "Kurdish (Northern)", code: "kmr" },
  { language: "Kyrgyz (Cyrillic)", code: "ky" },
  { language: "Lao", code: "lo" },
  { language: "Latvian", code: "lv" },
  { language: "Lithuanian", code: "lt" },
  { language: "Lingala", code: "ln" },
  { language: "Lower Sorbian", code: "dsb" },
  { language: "Luganda", code: "lug" },
  { language: "Macedonian", code: "mk" },
  { language: "Maithili", code: "mai" },
  { language: "Malagasy", code: "mg" },
  { language: "Malay (Latin)", code: "ms" },
  { language: "Malayalam", code: "ml" },
  { language: "Maltese", code: "mt" },
  { language: "Maori", code: "mi" },
  { language: "Marathi", code: "mr" },
  { language: "Mongolian (Cyrillic)", code: "mn-Cyrl" },
  { language: "Mongolian (Traditional)", code: "mn-Mong" },
  { language: "Myanmar", code: "my" },
  { language: "Nepali", code: "ne" },
  { language: "Norwegian", code: "nb" },
  { language: "Nyanja", code: "nya" },
  { language: "Odia", code: "or" },
  { language: "Pashto", code: "ps" },
  { language: "Persian", code: "fa" },
  { language: "Polish", code: "pl" },
  { language: "Portuguese (Brazil)", code: "pt" },
  { language: "Portuguese (Portugal)", code: "pt-pt" },
  { language: "Punjabi", code: "pa" },
  { language: "Queretaro Otomi", code: "otq" },
  { language: "Romanian", code: "ro" },
  { language: "Rundi", code: "run" },
  { language: "Russian", code: "ru" },
  { language: "Samoan (Latin)", code: "sm" },
  { language: "Serbian (Cyrillic)", code: "sr-Cyrl" },
  { language: "Serbian (Latin)", code: "sr-Latn" },
  { language: "Sesotho", code: "st" },
  { language: "Sesotho sa Leboa", code: "nso" },
  { language: "Setswana", code: "tn" },
  { language: "Sindhi", code: "sd" },
  { language: "Sinhala", code: "si" },
  { language: "Slovak", code: "sk" },
  { language: "Slovenian", code: "sl" },
  { language: "Somali (Arabic)", code: "so" },
  { language: "Spanish", code: "es" },
  { language: "Swahili (Latin)", code: "sw" },
  { language: "Swedish", code: "sv" },
  { language: "Tahitian", code: "ty" },
  { language: "Tamil", code: "ta" },
  { language: "Tatar (Latin)", code: "tt" },
  { language: "Telugu", code: "te" },
  { language: "Thai", code: "th" },
  { language: "Tibetan", code: "bo" },
  { language: "Tigrinya", code: "ti" },
  { language: "Tongan", code: "to" },
  { language: "Turkish", code: "tr" },
  { language: "Turkmen (Latin)", code: "tk" },
  { language: "Ukrainian", code: "uk" },
  { language: "Upper Sorbian", code: "hsb" },
  { language: "Urdu", code: "ur" },
  { language: "Uyghur (Arabic)", code: "ug" },
  { language: "Uzbek (Latin)", code: "uz" },
  { language: "Vietnamese", code: "vi" },
  { language: "Welsh", code: "cy" },
  { language: "Xhosa", code: "xh" },
  { language: "Yoruba", code: "yo" },
  { language: "Yucatec Maya", code: "yua" },
  { language: "Zulu", code: "zu" },
];

export default languagesArray;
