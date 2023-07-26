const { PermissionFlagsBits } = require("discord.js");
const ciko_config = require("../../../ciko_config");
const client = global.client;
const db = client.db;
module.exports = {
    name: "isim",
    usage: "isim [@ciko / ID] <isim> <yaş>",
    aliases: ["i", "nickname"],
    execute: async (client, message, args, ciko_embed) => {
        var member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);
        var name = args[1];
        var age = args[2];
        let staffData = (await db.get("five-register-staff")) || [];
        if (!staffData.length > 0)
            throw new SyntaxError("Kayıt Yetkilisi Ayarlı Değil!");
        if (
            !staffData.some((ciko) => message.member.roles.cache.get(ciko)) &&
            !message.member.permissions.has(PermissionFlagsBits.Administrator)
        )
            return message
                .reply({
                    embeds: [
                        ciko_embed.setDescription(
                            `> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`
                        ),
                    ],
                })
                .sil(5);
        const kyapan = await client.users.fetch(message.author.id);
        if (!member)
            return message
                .reply({
                    embeds: [
                        ciko_embed.setDescription(
                            `> **Geçerli Bir User Belirt!**`
                        ),
                    ],
                })
                .sil(5);
        if (member.id == message.author.id)
            return message
                .reply({
                    embeds: [
                        ciko_embed.setDescription(
                            `> **Kendine İşlem Uygulayamazsın!**`
                        ),
                    ],
                })
                .sil(5);
        if (member.user.bot)
            return message
                .reply({
                    embeds: [
                        ciko_embed.setDescription(
                            `> **Bir Bot'a İşlem Uygulayamazsın!**`
                        ),
                    ],
                })
                .sil(5);
        if (!name)
            return message
                .reply({
                    embeds: [
                        ciko_embed.setDescription(
                            `> **Geçerli Bir İsim Belirt!**`
                        ),
                    ],
                })
                .sil(5);
        if (name.lenght > 12)
            return message
                .reply({
                    embeds: [
                        ciko_embed.setDescription(
                            `> **İsim uzunluğu 12'den Büyük Olamaz!**`
                        ),
                    ],
                })
                .sil(5);
        if (age && isNaN(age))
            return message
                .reply({
                    embeds: [
                        ciko_embed.setDescription(
                            `> **Yaşı Lütfen Sayı İle Belirt!**`
                        ),
                    ],
                })
                .sil(5);
        if (age && age < ciko_config.minageAge)
            return message
                .reply({
                    s: [
                        ciko_embed.setDescription(
                            `> **Kullanıcının Yaşı Geçerli Yaştan Küçük!**`
                        ),
                    ],
                })
                .sil(5);
        let Name2 =
            name.toLocaleLowerCase()[0].toUpperCase() +
            name.toLocaleLowerCase().substring(1);
        db.push(
            `isimler-${member.id}`,
            `\`${ciko_config.tagSymbol} ${Name2}${
                age ? ` ${ciko_config.symbolciko} ${age}` : ""
            }\` (İsim Değiştirme <t:${Math.floor(Date.now() / 1000)}> - ${
                kyapan.tag
            })`
        );
        db.push(
            `kayıtlar-${message.author.id}`,
            `\`${ciko_config.tagSymbol} ${Name2}${
                age ? ` ${ciko_config.symbolciko} ${age}` : ""
            }\` ${member.user.tag} (İsim Değiştirme <t:${Math.floor(
                Date.now() / 1000
            )}>)`
        );
        await message.guild.members.cache
            .get(member.id)
            .setNickname(
                `${ciko_config.tagSymbol} ${Name2}${
                    age ? ` ${ciko_config.symbolciko} ${age}` : ""
                }`
            );
        message.reply({
            embeds: [
                ciko_embed.setDescription(
                    `> **Kullanıcının İsmi \`${ciko_config.tagSymbol} ${Name2}${
                        age ? ` ${ciko_config.symbolciko} ${age}` : ""
                    }\` Olarak Değiştirildi!**`
                ),
            ],
        });
    },
};
