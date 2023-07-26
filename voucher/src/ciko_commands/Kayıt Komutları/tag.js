const { PermissionFlagsBits } = require("discord.js");
const ciko_config = require("../../../ciko_config");
const client = global.client;
const db = client.db;
module.exports = {
    name: "tag",
    usage: "tag",
    aliases: ["tags", "taglar"],
    execute: async (client, message, args, ciko_embed) => {
        let tagData = (await db.get("five-tags")) || [];
        if (!tagData.length > 0)
            return message
                .reply({
                    embeds: [
                        ciko_embed.setDescription(
                            `> **Bu Sunucuda Tag Bulunmamakta!**`
                        ),
                    ],
                })
                .sil(5);
        return message.reply({
            content: `> ${tagData.map((cikom) => `**${cikom}**`).join(",")}`,
        });
    },
};
