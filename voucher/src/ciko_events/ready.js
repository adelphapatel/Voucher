const { joinVoiceChannel } = require("@discordjs/voice");
const client = global.client;
const db = client.db;
module.exports = () => {
    let fiveVoiceChannel = db.get("five-channel-voice");
    if (fiveVoiceChannel) {
        const ciko_kanal = client.channels.cache.get(fiveVoiceChannel);
        if (!ciko_kanal)
            return console.log(
                `${fiveVoiceChannel} ID'li Ses Kanal'ı Bulunamadı`
            );
        joinVoiceChannel({
            channelId: ciko_kanal.id,
            guildId: ciko_kanal.guild.id,
            adapterCreator: ciko_kanal.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: true,
        });
    }
};
module.exports.conf = {
    name: "ready",
};
