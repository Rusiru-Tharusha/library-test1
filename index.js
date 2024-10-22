const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// PDF ගොනු සහ ඒවායේ GitHub URL
const pdfFiles = {
    'bootstrap': 'https://github.com/Rusiru-Tharusha/library-test1/raw/main/Bootstrap.pdf',
};

const client = new Client({
    authStrategy: new LocalAuth()
});

// QR කේතය පෙන්වීම
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Bot එක සූදානම් වීම දැනුම්දීම
client.on('ready', () => {
    console.log('Bot is ready!');
});

// පණිවිඩයන් සවන් දීම
client.on('message', async msg => {
    const chatId = msg.from;

    // පණිවිඩය PDF නාමයකිද කියා පරීක්ෂා කර, ගොනුව යැවීම
    if (pdfFiles[msg.body.toLowerCase()]) {
        const pdfUrl = pdfFiles[msg.body.toLowerCase()];

        try {
            const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            client.sendMessage(chatId, buffer, { sendMediaAsDocument: true, filename: `${msg.body}.pdf` });
        } catch (error) {
            console.error('Error downloading or sending the PDF:', error);
            client.sendMessage(chatId, 'සමාවන්න, ගොනුව යැවීමට අපහසුතාවයක් පවතී.');
        }
    } else {
        client.sendMessage(chatId, 'කරුණාකර Bootstrap PDF ගොනුව යවන්න "bootstrap" ලෙස ටයිප් කරන්න.');
    }
});

// Bot එක ආරම්භ කිරීම
client.initialize();
