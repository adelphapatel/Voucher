const {
    EmbedBuilder,
    Partials,
    resolveColor,
    Client,
    Collection,
    GatewayIntentBits,
    ActivityType,
    OAuth2Scopes,
} = require("discord.js");
const ciko_config = require("./ciko_config");
const client = (global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.GuildScheduledEvent,
    ],
    presence: {
        activities: [
            {
                name:
                    ciko_config && ciko_config.botDurum.length > 0
                        ? ciko_config.botDurum
                        : "Caylay ♡",
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/ciko_chan",
            },
        ],
        status: "idle",
    },
}));

const { YamlDatabase } = require("five.db");
const db = (client.db = new YamlDatabase());

const { readdir } = require("fs");
const commands = (client.commands = new Collection());
const aliases = (client.aliases = new Collection());

readdir("./src/ciko_commands/", (err, files) => {
    if (err) console.error(err);
    files.forEach((f) => {
        readdir("./src/ciko_commands/" + f, (err2, files2) => {
            if (err2) console.log(err2);
            files2.forEach((file) => {
                let ciko_prop = require(`./src/ciko_commands/${f}/` + file);
                console.log(`🧮 [CIKO - COMMANDS] ${ciko_prop.name} Yüklendi!`);
                commands.set(ciko_prop.name, ciko_prop);
                ciko_prop.aliases.forEach((alias) => {
                    aliases.set(alias, ciko_prop.name);
                });
            });
        });
    });
});

readdir("./src/ciko_events", (err, files) => {
    if (err) return console.error(err);
    files
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
            let ciko_prop = require(`./src/ciko_events/${file}`);
            if (!ciko_prop.conf) return;
            client.on(ciko_prop.conf.name, ciko_prop);
            console.log(`📚 [CIKO _ EVENTS] ${ciko_prop.conf.name} Yüklendi!`);
        });
});

Collection.prototype.array = function () {
    return [...this.values()];
};

const { emitWarning } = process;
process.emitWarning = (warning, ...args) => {
    if (args[0] === "ExperimentalWarning") {
        return;
    }
    if (
        args[0] &&
        typeof args[0] === "object" &&
        args[0].type === "ExperimentalWarning"
    ) {
        return;
    }
    return emitWarning(warning, ...args);
};

Promise.prototype.sil = function (time) {
    if (this)
        this.then((s) => {
            if (s.deletable) {
                setTimeout(async () => {
                    s.delete().catch((e) => {});
                }, time * 1000);
            }
        });
};

client
    .login(ciko_config.token)
    .then(() => console.log(`🟢 ${client.user.tag} Başarıyla Giriş Yaptı!`))
    .catch((ciko_err) =>
        console.log(`🔴 Bot Giriş Yapamadı / Sebep: ${ciko_err}`)
    );
