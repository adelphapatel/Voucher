const { PermissionFlagsBits } = require("discord.js");
const ciko_config = require("../../../ciko_config");
const client = global.client;
const db = client.db;
module.exports = {
    name: "yardım",
    usage: "yardım",
    aliases: ["help", "yardm", "helps"],
    execute: async (client, message, args, ciko_embed) => {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
            return message
                .reply({
                    embeds: [
                        ciko_embed.setDescription(
                            `> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`
                        ),
                    ],
                })
                .sil(5);

        let commandsFive = client.commands
            .filter((cikom) => cikom.usage)
            .map(
                (fivesocikom) =>
                    `> \`${ciko_config.prefix}${fivesocikom.usage}\``
            )
            .join("\n");

        message.reply({
            embeds: [
                ciko_embed
                    .setDescription(`${commandsFive}`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setTitle(`Yardım Menüsü`)
                    .setURL(`https://linktr.ee/sayinciko`),
            ],
        });
    },
};
