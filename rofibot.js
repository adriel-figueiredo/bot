require("dotenv").config();

// Configurações Discord
const {
  Client,
  IntentsBitField,
  ActivityType,
  EmbedBuilder,
  Collection,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageCollector,
  Partials,
  Events,
  time,
  VoiceStateManager,
} = require("discord.js");

const token =
  "MTI1MTc2MDAzNjk2ODAwOTgxOA.GtwKxg.y8ZsC54k5koIUWU4NtrVVU_smRvWfTloceQFds";

const client = new Client({
  intents: [
    IntentsBitField.Flags.DirectMessageTyping,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.GuildWebhooks,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildIntegrations,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.DirectMessageReactions,
  ],
});

const { chromium } = require("playwright");

const { createClient } = require("@supabase/supabase-js")

const supabaseurl = 'https://nnzgphdzrlethvswjlqx.supabase.co';
const supabasechave = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uemdwaGR6cmxldGh2c3dqbHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5MDU1ODksImV4cCI6MjAzNjQ4MTU4OX0.Mpq1vGcWnCmPsHsbHBkY58_K7mNufKsH2Nunxf2k5y4';
const supabase = createClient(supabaseurl, supabasechave);

let iddobot;

client.on(Events.ClientReady, (c) => {
  iddobot = client.user.id;
  console.log(`🤖 Bot Online 🤖`);
});

const prefixo = "r!";

client.on(Events.MessageCreate, async (mensagem) => {
  if (mensagem.content.startsWith(prefixo)) {
    const tirarprefixo = mensagem.content.split(prefixo);
    const comando = tirarprefixo[1].toLowerCase();

    // Funções para facilitar

    const tempopadraodedeletar = 10000;

    async function deletarmensagem() {
      try {
        await mensagem.delete();
      } catch (erro) { }
    }

    setTimeout(deletarmensagem, tempopadraodedeletar);

    async function naotemperm(permissaoquenaotem) {
      try {
        let msg = await mensagem.reply(
          `You don't have the permission: ${permissaoquenaotem}`
        );
        setTimeout(async () => {
          try {
            await msg.delete();
          } catch (erro) { }
          return;
        }, tempopadraodedeletar);
      } catch (erro) { }
    }

    async function falarquedeutudocerto() {
      try {
        let msg = await mensagem.reply(`✔ All done ✔`);
        setTimeout(async () => {
          try {
            await msg.delete();
          } catch (erro) { }
          return;
        }, tempopadraodedeletar);
      } catch (erro) { }
    }

    async function comandonaoencontrado() {
      try {
        let msg = await mensagem.reply(
          `The command you wanted to execute was not found`
        );
        setTimeout(async () => {
          try {
            await msg.delete();
          } catch (erro) { }
          return;
        }, tempopadraodedeletar);
      } catch (erro) { }
    }

    async function aconteceuerro(erro, comando) {
      try {
        var msg;
        if (comando) {
          msg = await mensagem.reply(
            `An error occurred when executing the command '${comando}': ${erro}`
          );
        } else {
          msg = await mensagem.reply(
            `An error occurred when executing: ${erro}`
          );
        }
        setTimeout(async () => {
          try {
            await msg.delete();
          } catch (erro) { }
          return;
        }, tempopadraodedeletar);
      } catch (erro) { }
    }

    async function membronaoencontrado(idnaoencontrado) {
      try {
        let naoachou = await mensagem.reply(
          `The member with the ID ${idnaoencontrado} was not found`
        );
        setTimeout(async () => {
          try {
            await naoachou.delete();
          } catch (erro) { }
          return;
        }, tempopadraodedeletar);
      } catch (erro) { }
    }

    async function avisodefalarnocanalcerto(comandosendoexecutado) {
      try {
        let aviso = await mensagem.reply(
          `The command must be executed on the ${comandosendoexecutado} channel.`
        );
        setTimeout(async () => {
          try {
            await aviso.delete();
          } catch (erro) { }
          return;
        }, tempopadraodedeletar);
      } catch (erro) { }
    }

    async function gerarcontractid() {
      let contractid = "";
      for (let i = 0; i < 7; i++) {
        contractid += Math.floor(Math.random() * 10);
      }
      return contractid;
    }

    // Comandos de Moderação

    try {
      if (comando.startsWith("del")) {
        const comandosendoexecutado = "del";

        if (mensagem.member.permissions.has("MANAGE_MESSAGES")) {
          try {
            const localizar = comando.split(comandosendoexecutado);
            let numerodemensagensparadeletar = localizar[1].match(/(\d+)/g)[0];

            try {
              await mensagem.channel.bulkDelete(
                Number(numerodemensagensparadeletar)
              );
              falarquedeutudocerto();
            } catch (error) {
              aconteceuerro(error, comandosendoexecutado);
            }
          } catch (erro) {
            console.log(erro);
            try {
              aconteceuerro(erro, comandosendoexecutado);
            } catch (erro) { }
          }
        } else {
          try {
            naotemperm("MANAGE_MESSAGES");
          } catch (erro) {
            aconteceuerro(erro, comandosendoexecutado);
          }
        }
        return;
      }

      const canaldesanctions = await mensagem.guild.channels.fetch("1057435567845036070")

      if (comando.startsWith("ban")) {
        const comandosendoexecutado = "ban";

        if (mensagem.member.permissions.has("BAN_MEMBERS")) {
          try {
            console.log("Banindo...")
            let quantidadedemoraquitos = mensagem.content.match(/([\d]+)/g)[0];
            console.log("1")
            let iddoroblox = mensagem.content.match(/([\d]+)/g)[1];
            console.log("2")
            let tempocomparenteses = mensagem.content.match(/\(([\s\S]+)\)/g)[0]
            console.log("3")
            let mencao = mensagem.mentions.members.first()
            console.log("4")
            let motivocomparenteses = mensagem.content.match(/\[([\s\S]+)\]/g)[0]
            console.log("5")
            let motivo = motivocomparenteses.slice(1, -1)
            console.log("6")
            let tempo = tempocomparenteses.slice(1, -1)
            console.log("7")

            if (quantidadedemoraquitos === "0" || quantidadedemoraquitos === 0) {
            console.log("8")
              quantidadedemoraquitos = "infinite"
            }
            console.log("9")

            console.log(mencao.user.id)
            console.log("10")

            if (mencao) {
            console.log("11")
              try {
                await supabase.from("Bails").insert({
                  idroblox: iddoroblox,
                  iddiscord: mencao.user.id,
                  motivo: motivo,
                  bail: quantidadedemoraquitos,
                  tempo: tempo
                })
                console.log("12")
                const embed = new EmbedBuilder()
                  .setColor("#fd3535")
                  .setAuthor({
                    name: `${mencao.user.displayName}`
                  })
                  .setDescription(`The user ${mencao} got banned from ROFI

Reason: ${motivo}
Time: ${tempo}
Bail: ${quantidadedemoraquitos} moraquitos`)
                  .setTimestamp()
                  .setFooter({
                    text: "[ROFI] Roblox Organized Federation International",
                    iconURL: "https://iili.io/JrPnL2n.png",
                  });
                  console.log("13")

                await canaldesanctions.send({
                  embeds: [embed]
                });
                console.log("14")

                await mencao.ban({ reason: motivo });
                console.log("15")

                await falarquedeutudocerto();
                console.log("16")
              } catch (error) {
                console.log("17")
                console.log(error)
                console.log("18")
                await aconteceuerro(error, comandosendoexecutado)
                console.log("19")
              }
            } else {
              try {
                console.log("20")
                aconteceuerro("The mention was not found ...?", comandosendoexecutado);
              } catch (erro) {
                console.log("21")
                console.log(erro)
                aconteceuerro(erro, comandosendoexecutado);
              }
            }
          } catch (erro) {
            console.log("22")
            console.log(erro);
            aconteceuerro(erro, comandosendoexecutado);
          }
        } else {
          try {
            naotemperm("BAN_MEMBERS");
          } catch (erro) {
            aconteceuerro(erro, comandosendoexecutado);
          }
        }
        return;
      }

      if (comando.startsWith("unban")) {
        const comandosendoexecutado = "unban";

        if (mensagem.member.permissions.has("BAN_MEMBERS")) {
          try {
            let iddodiscord = mensagem.content.match(/([\d]+)/g)[0];
            let motivocomparenteses = mensagem.content.match(/\(([\s\S]+)\)/g)[0]
            let motivo = motivocomparenteses.slice(1, -1)

            if (iddodiscord) {
              try {
                const { data, error } = await supabase.from("Bails").select("*").eq("iddiscord", iddodiscord).single()

                console.log(data)

                const browser = await chromium.launch();
                const context = await browser.newContext();
                const page = await context.newPage();

                const id = data.idroblox;

                await page.goto(`https://www.roblox.com/users/${id}/profile`);

                await page.waitForSelector(".profile-display-name");

                const text = await page.textContent(".profile-display-name");
                let textosemarroba = text.split("@")[1];
                console.log(textosemarroba);
                await browser.close();

                await supabase.from("Bails").delete().eq("iddiscord", iddodiscord)
                await mensagem.guild.members.unban(`${iddodiscord}`)

                const embed = new EmbedBuilder()
                  .setColor("#73b947")
                  .setAuthor({
                    name: `${textosemarroba}`
                  })
                  .setDescription(`The user ${textosemarroba} got unbanned from ROFI

Reason: ${motivo}`)
                  .setTimestamp()
                  .setFooter({
                    text: "[ROFI] Roblox Organized Federation International",
                    iconURL: "https://iili.io/JrPnL2n.png",
                  });

                await canaldesanctions.send({
                  embeds: [embed]
                });
                await falarquedeutudocerto();
              } catch (error) {
                await aconteceuerro(error, comandosendoexecutado)
              }
            } else {
              try {
                await membronaoencontrado(id);
              } catch (erro) {
                await aconteceuerro(erro, comandosendoexecutado);
              }
            }
          } catch (erro) {
            console.log(erro);
            try {
              const localizar = comando.split(comandosendoexecutado);
              let id = localizar[1].match(/(\d+)/g)[0];
              await membronaoencontrado(id);
            } catch (erro) {
              await aconteceuerro(erro, comandosendoexecutado);
            }
          }
        } else {
          try {
            naotemperm("BAN_MEMBERS");
          } catch (erro) {
            aconteceuerro(erro, comandosendoexecutado);
          }
        }
        return;
      }

      if (comando.startsWith("bans")) {
        const comandosendoexecutado = "bans";

        if (mensagem.member.permissions.has("BAN_MEMBERS")) {
          try {
            try {
              const { data, error } = await supabase.from("Bails").select("*")

              console.log(data)

              let mensagemparaserenviada = `Bans Syntax:\nDiscord ID\nRoblox ID\nReason\nBail\nBail Time\n\n`

              for (const informacao of data) {
                mensagemparaserenviada = mensagemparaserenviada + `Ban: \n${informacao.iddiscord}\n${informacao.idroblox}\n${informacao.motivo}\n${informacao.bail}\n${informacao.tempo}\n\n`
              }

              const embed = new EmbedBuilder()
                .setColor("#000000")
                .setDescription(mensagemparaserenviada)
                .setTimestamp()
                .setFooter({
                  text: "[ROFI] Roblox Organized Federation International",
                  iconURL: "https://iili.io/JrPnL2n.png",
                });

              await mensagem.reply({
                embeds: [embed]
              });
              await falarquedeutudocerto();
            } catch (error) {
              await aconteceuerro(error, comandosendoexecutado)
            }

          } catch (erro) {
            console.log(erro);
            try {
              const localizar = comando.split(comandosendoexecutado);
              let id = localizar[1].match(/(\d+)/g)[0];
              await membronaoencontrado(id);
            } catch (erro) {
              await aconteceuerro(erro, comandosendoexecutado);
            }
          }
        } else {
          try {
            naotemperm("BAN_MEMBERS");
          } catch (erro) {
            aconteceuerro(erro, comandosendoexecutado);
          }
        }
        return;
      }

      if (comando.startsWith("kick")) {
        const comandosendoexecutado = "kick";

        if (mensagem.member.permissions.has("KICK_MEMBERS")) {
          try {
            let homem = await mensagem.mentions.members.first()
            let motivo = mensagem.content.match(/\(([\s\S]+)\)/g);

            if (homem) {
              try {
                await homem.kick({ reason: motivo[0] });
                await falarquedeutudocerto();
              } catch (error) {
                try {
                  await homem.kick();
                  await falarquedeutudocerto();
                } catch (erro) {
                  await membronaoencontrado("MENTION_ID");
                }
              }
            }
          } catch (erro) {
            console.log(erro);
            aconteceuerro(erro, comandosendoexecutado);
          }
        } else {
          try {
            naotemperm("KICK_MEMBERS");
          } catch (erro) {
            aconteceuerro(erro, comandosendoexecutado);
          }
        }

        return;
      }

      if (comando.startsWith("mute")) {
        const comandosendoexecutado = "mute";

        if (mensagem.member.permissions.has("MODERATE_MEMBERS")) {
          try {
            let homem = await mensagem.mentions.members.first()
            let tempo = mensagem.content.match(/\(([\s\S]+)\)/g)[1];

            if (homem) {
              try {
                await homem.timeout(tempo * 60 * 1000);
                await falarquedeutudocerto();
              } catch (error) {
                await aconteceuerro(error, comandosendoexecutado);
              }
            }
          } catch (erro) {
            console.log(erro);
            aconteceuerro(erro, comandosendoexecutado);
          }
        } else {
          try {
            naotemperm("MODERATE_MEMBERS");
          } catch (erro) { }
        }

        return;
      }

      if (comando.startsWith("unmute")) {
        const comandosendoexecutado = "unmute";

        if (mensagem.member.permissions.has("MODERATE_MEMBERS")) {
          try {
            let homem = await mensagem.mentions.members.first()

            if (homem) {
              try {
                await homem.timeout(null);
                await falarquedeutudocerto();
              } catch (error) {
                await aconteceuerro(error, comandosendoexecutado);
              }
            }
          } catch (erro) {
            console.log(erro);
            aconteceuerro(erro, comandosendoexecutado);
          }
        } else {
          try {
            naotemperm("MODERATE_MEMBERS");
          } catch (erro) { }
        }

        return;
      }

      if (comando.startsWith("msg")) {
        const comandosendoexecutado = "msg";

        if (mensagem.member.permissions.has("ADMINISTRATOR")) {
          try {
            const localizar = comando.split(comandosendoexecutado);
            let id = localizar[1].match(/(\d+)/g)[0];
            let mensagemepegarngc = mensagem.content.match(/(\(([\s\S]+)\))/g);

            console.log(mensagemepegarngc)

            let mensagemparamandar = mensagemepegarngc[0].slice(1, -1)

            console.log(mensagemparamandar)

            try {
              const channel = await mensagem.guild.channels.fetch(id);
              await channel.send(mensagemparamandar);
              await falarquedeutudocerto();
            } catch (erro) {
              try {
                const homem = await mensagem.guild.members.fetch(id);
                await homem.send(mensagemparamandar);
                await falarquedeutudocerto();
              } catch (error) {
                try {
                  await aconteceuerro(
                    `O canal ou o membro (talvez com DM fechada) com o id ${id} não foram encontrados`
                  );
                } catch (erro) {
                  await aconteceuerro(erro, comandosendoexecutado);
                }
              }
            }
          } catch (erro) {
            console.log(erro);
            try {
              const localizar = comando.split(comandosendoexecutado);
              let id = localizar[1].match(/(\d+)/g)[0];
              aconteceuerro(
                `O canal ou o membro (talvez com DM fechada) com o id ${id} não foram encontrados`
              );
            } catch (erro) {
              aconteceuerro(erro, comandosendoexecutado);
            }
          }
        } else {
          try {
            naotemperm("ADMINISTRATOR");
          } catch (erro) { }
        }

        return;
      }
    } catch (erro) {
      aconteceuerro(erro);
    }

    // Comandos de Contratação

    try {
      if (comando.startsWith("freeagent")) {
        const comandosendoexecutado = "freeagent";

        if (mensagem.channel.id !== "1057435568063119436") {
          try {
            await avisodefalarnocanalcerto(comandosendoexecutado);
            return;
          } catch (erro) { }
          return;
        }

        try {
          let mensagemdocomando = mensagem.content.slice(3 + comandosendoexecutado.length)

          var canalfreeagent = await mensagem.guild.channels.fetch(
            "1125911015339610142"
          );

          try {
            const embed = new EmbedBuilder()
              .setColor("#000000")
              .setTitle(`Free Agent de ${mensagem.author.displayName}`)
              .setDescription(mensagemdocomando)
              .setThumbnail(mensagem.author.displayAvatarURL())
              .setTimestamp();

            await canalfreeagent.send({
              content: `${mensagem.author}`,
              embeds: [embed],
            });

            await falarquedeutudocerto();
          } catch (error) {
            aconteceuerro(error, comandosendoexecutado);
          }
        } catch (erro) {
          console.log(erro);
          try {
            await aconteceuerro(erro, comandosendoexecutado);
          } catch (erro) { }
        }

        return;
      }

      if (comando.startsWith("help")) {
        const comandosendoexecutado = "help";

        try {
          try {
            const embed = new EmbedBuilder()
              .setColor("#000000")
              .setTitle(`Commands`)
              .setDescription(`- r!freeagent YOUR_POSITIONS
YOUR_POSITIONS can be anything at any length

- r!del NUMBER_OF_MESSAGES
NUMBER_OF_MESSAGES need to be a number
The bot cannot delete messages that are too old

- r!ban MORAQUITO_QUANTITY ROBLOX_USER_ID (SPECIFY_ANY_TIME) @MENTION_THE_PERSON [SPECIFY_THE_REASON]
The MORAQUITO_QUANTITY needs to be a number, and theres limited options of numbers that you can specify
The ROBLOX_USER_ID is the Roblox User ID of the person that you want to ban
The SPECIFY_ANY_TIME needs to be in (), if you want, it can be a text
MENTION_THE_PERSON is the person that you want to ban
SPECIFY_THE_REASON is a text, needs to be in [],
These options are **REQUIRED**

- r!unban DISCORD_USER_ID (SPECIFY_THE_REASON)
The DISCORD_USER_ID needs to be the Discord User ID of the person that you want to unban
SPECIFY_THE_REASON is a text, needs to be in ()

- r!bans
Shows you every ban that is active

- r!kick @MENTION_SOMEONE (SPECIFY_THE_REASON)
MENTION_SOMEONE is the person you want to kick
SPECIFY_THE_REASON is **OPTIONAL**
SPECIFY_THE_REASON needs to be in ()

- r!mute @MENTION_SOMEONE TIME_IN_MINUTES
MENTION_SOMEONE is the person you want to mute
The THE_TIME_IN_MINUTES is the amount of minutes that you want this person to be muted

- r!unmute @MENTION_SOMEONE
MENTION_SOMEONE is the person you want to unmute

- r!msg CHANNEL_ID_OR_DISCORD_USER_ID (MESSAGE_TO_BE_SENT)
The CHANNEL_ID_OR_DISCORD_USER_ID can be a Channel ID, or can be a Discord User ID
The MESSAGE_TO_BE_SENT is the message thats going to be sent to a Channel or Discord User
MESSAGE_TO_BE_SENT needs to be in ()

- r!scouting MESSAGE_TO_BE_SENT
The MESSAGE_TO_BE_SENT can be any message with any length
MESSAGE_TO_BE_SENT can have emojis

- r!contract YOUR_TEAM USER_STATUS @MENTION_SOMEONE
MENTION_SOMEONE is the person that you want to contract
YOUR_TEAM is your team without spaces (Example: Atlético_De_Madrid)
USER_STATUS is the position or role that the MENTION_SOMEONE is going to have`)
              .setThumbnail(client.user.displayAvatarURL())
              .setTimestamp();

            await mensagem.reply({
              content: `${mensagem.author}`,
              embeds: [embed],
            });

            return
          } catch (error) {
            aconteceuerro(error, comandosendoexecutado);
          }
        } catch (erro) {
          console.log(erro);
          try {
            await aconteceuerro(erro, comandosendoexecutado);
          } catch (erro) { }
        }

        return;
      }

      // Só técnico ou assistente pode dar os comandos abaixo:

      if (
        mensagem.member.roles.cache.has("1057435567081652262") ||
        mensagem.member.roles.cache.has("1058092662839853066")
      ) {
        if (comando.startsWith("scouting")) {
          const comandosendoexecutado = "scouting";

          if (mensagem.channel.id !== "1057435568063119436") {
            try {
              await avisodefalarnocanalcerto(comandosendoexecutado);
              return;
            } catch (erro) { }
            return;
          }

          try {
            let mensagemdocomando = mensagem.content.slice(3 + comandosendoexecutado.length)

            var canalfreeagent = await mensagem.guild.channels.fetch(
              "1057435568277037058"
            );

            try {
              const embed = new EmbedBuilder()
                .setColor("#008000")
                .setAuthor({
                  name: `${mensagem.author.displayName}`,
                  iconURL: mensagem.author.displayAvatarURL(),
                })
                .setDescription(mensagemdocomando)
                .setTimestamp()
                .setFooter({
                  text: "[ROFI] Roblox Organized Federation International",
                  iconURL: "https://iili.io/JrPnL2n.png",
                });

              await canalfreeagent.send({
                content: `${mensagem.author}`,
                embeds: [embed],
              });
              await falarquedeutudocerto();
            } catch (error) {
              await aconteceuerro(error, comandosendoexecutado);
            }
          } catch (erro) {
            console.log(erro);
            try {
              await aconteceuerro(erro, comandosendoexecutado);
            } catch (erro) { }
          }

          return;
        }

        if (comando.startsWith("contract")) {
          const comandosendoexecutado = "contract";

          if (mensagem.channel.id !== "1057435568063119436") {
            try {
              await avisodefalarnocanalcerto(comandosendoexecutado);
              return;
            } catch (erro) { }
            return;
          }

          try {
            const localizar = comando.split(comandosendoexecutado);
            var pessoamencionada = mensagem.mentions.users.first();
            let timedocomando = localizar[1].match(/([A-z])\w+/g)[0];
            let statusdocomando = localizar[1].match(/([A-z])\w+/g)[1];

            var canalfreeagent = await mensagem.guild.channels.fetch(
              "1057435568277037058"
            );

            try {
              var contractdid = await gerarcontractid();

              const embed1 = new EmbedBuilder()
                .setTitle("Team Contract")
                .setDescription(
                  `Do you agree to join the ${timedocomando} team with ${statusdocomando} Status?
                
                ⚠️ | When accepting this contract, it is important to recognize the risks involved. Possible challenges may arise, requiring flexibility and resilience. Understanding the potential risks is crucial to making informed decisions and facing obstacles with determination and preparedness.`
                )
                .addFields(
                  { name: "Contract ID", value: contractdid, inline: true },
                  {
                    name: "Contractor",
                    value: `${mensagem.author}`,
                    inline: true,
                  },
                  {
                    name: "Contractor User ID",
                    value: mensagem.author.id,
                    inline: true,
                  },
                  {
                    name: "Status",
                    value: `*${statusdocomando.toUpperCase()}*`,
                    inline: true,
                  },
                  {
                    name: "Player",
                    value: `${pessoamencionada}`,
                    inline: true,
                  },
                  {
                    name: "Team",
                    value: timedocomando.toUpperCase(),
                    inline: true,
                  }
                )
                .setColor("#ffffff")
                .setTimestamp()
                .setFooter({
                  text: "[ROFI] Roblox Organized Federation International",
                  iconURL: "https://iili.io/JrPnL2n.png",
                });

              var mensagemenviada = await pessoamencionada.send({
                embeds: [embed1],
              });
              await mensagemenviada.react("✅");
              await mensagemenviada.react("❌");

              falarquedeutudocerto();
            } catch (error) {
              aconteceuerro(error, comandosendoexecutado);
            }
          } catch (erro) {
            console.log(erro);
            try {
              aconteceuerro(erro, comandosendoexecutado);
            } catch (erro) { }
          }

          return;
        }
      } else {
        await naotemperm("Manager or Assistant");
      }
    } catch (erro) {
      aconteceuerro(erro);
    }

    comandonaoencontrado();
  }
});

client.on(Events.MessageReactionAdd, async (reacao, homem) => {
  if (homem.id === iddobot) {
    return;
  }

  setTimeout(async () => {
    try {
      let embed = await reacao.message.embeds[0];

      if (embed && embed !== null && embed !== undefined) {
        setTimeout(async () => {
          try {
            var contratadorid = "";
            var contractid = "";
            var team = "";
            var status = "";

            await embed.fields.forEach((field, index) => {
              try {
                if (field.name === "Contractor User ID") {
                  contratadorid = field.value;
                }
                if (field.name === "Contract ID") {
                  contractid = field.value;
                }
                if (field.name === "Team") {
                  team = field.value;
                }
                if (field.name === "Status") {
                  status = field.value;
                }
              } catch (erro) {
                console.log(erro);
              }
            });

            var guild = await client.guilds.fetch("1057435567035535441");
            var contractlogs = await guild.channels.fetch("1237901696932249690");
            var tecnicopramandar = await guild.members.fetch(contratadorid);

            setTimeout(async () => {
              if (status === null || status === undefined) {
                status = "Player";
              }

              if (reacao.emoji.name === "✅") {
                try {
                  let embedfalandoqueaceitou = new EmbedBuilder()
                    .setTitle("Team Contract")
                    .setDescription(
                      `I ${homem} agree to join the **__${team.toUpperCase()}__** team effective. During your tenure, you are committed to fulfilling assigned responsibilities and contributing to the team's collective objectives`
                    )
                    .setColor("#0dff00")
                    .addFields(
                      { name: "Contract ID", value: contractid, inline: true },
                      {
                        name: "Contractor",
                        value: `${tecnicopramandar}`,
                        inline: true,
                      },
                      {
                        name: "Contractor User ID",
                        value: `${tecnicopramandar.id}`,
                        inline: true,
                      },
                      {
                        name: "Team",
                        value: `**__${team.toUpperCase()}__**`,
                        inline: true,
                      },
                      { name: "Player", value: `${homem}`, inline: true },
                      {
                        name: "Status",
                        value: `*${status.toUpperCase()}*`,
                        inline: true,
                      }
                    )
                    .setTimestamp()
                    .setFooter({
                      text: "[ROFI] Roblox Organized Federation International",
                      iconURL: "https://iili.io/JrPnL2n.png",
                    });

                  let embedcontractlogs = new EmbedBuilder()
                    .setTitle("Team Contract")
                    .setDescription(
                      `I ${homem} agree to join the **__${team.toUpperCase()}__** team effective. During your tenure, you are committed to fulfilling assigned responsibilities and contributing to the team's collective objectives`
                    )
                    .setColor("#ffffff")
                    .setTimestamp()
                    .addFields(
                      { name: "Contract ID", value: contractid, inline: true },
                      {
                        name: "Contractor",
                        value: `${tecnicopramandar}`,
                        inline: true,
                      },
                      {
                        name: "Contractor User ID",
                        value: `${tecnicopramandar.id}`,
                        inline: true,
                      },
                      {
                        name: "Team",
                        value: `**__${team.toUpperCase()}__**`,
                        inline: true,
                      },
                      { name: "Player", value: `${homem}`, inline: true },
                      {
                        name: "Status",
                        value: `*${status.toUpperCase()}*`,
                        inline: true,
                      }
                    )
                    .setFooter({
                      text: "[ROFI] Roblox Organized Federation International",
                      iconURL: "https://iili.io/JrPnL2n.png",
                    });

                  await tecnicopramandar.send({
                    content: `📡 | ${homem} , ContractID: ${contractid}, has **__accepted__** ${tecnicopramandar} contract.`,
                    embeds: [embedfalandoqueaceitou],
                  });
                  await contractlogs.send({
                    content: `📡 | ${homem} , ContractID: ${contractid}, has **__accepted__** ${tecnicopramandar} contract.`,
                    embeds: [embedcontractlogs],
                  });

                  try {
                    await reacao.message.delete();
                  } catch(erro) {console.log(erro)}
                } catch (erro) {
                  console.log(erro);
                }
              }
              if (reacao.emoji.name === "❌") {
                try {
                  let embedfalandoquerecusou = new EmbedBuilder()
                    .setTitle("Team Contract")
                    .setDescription(
                      `${homem} didn't wanted to join your ${team} team. We are sorry!`
                    )
                    .setColor("#ff0000")
                    .setTimestamp()
                    .setFooter({
                      text: "[ROFI] Roblox Organized Federation International",
                      iconURL: "https://iili.io/JrPnL2n.png",
                    });

                  await tecnicopramandar.send({ embeds: [embedfalandoquerecusou] });

                  try {
                    await reacao.message.delete();
                  } catch(erro) {console.log(erro)}
                } catch (erro) {
                  console.log(erro);
                }
              }
            }, 2000);
          } catch (erro) {
            console.log(erro);
          }
        }, 2500);
      }
    } catch (erro) {
      console.log(erro);
    }
  }, 3000);
});

client.login(token).catch((err) => {
  console.log(`Erro quando foi logar o bot: `, err);
});

client.on(Events.Debug, (mensagem) => {
  console.log(mensagem);
});

// 24/7

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/bails", async (req, res) => {
  const { idroblox } = req.headers

  const { data, error } = await supabase.from("Bails").select("*").eq("idroblox", String(idroblox)).single()

  let ignorar1 = []
  let ignorar2 = {}

  if (data && data !== null && data !== undefined && data !== ignorar1 && data !== ignorar2) {
    console.log(data)
    const conteudopraenviar = {
      motivo: data.motivo,
      valordabail: data.bail,
      tempo: data.tempo
    }
    console.log(conteudopraenviar)
    await res.send(conteudopraenviar).status(200)
  } else {
    await res.send("N")
  }
})

app.post("/pagarbail", async (req, res) => {
  const { idroblox, valordabail } = req.body

  console.log(`Coisas recebidas da URL de pagarbail: ${idroblox}, ${valordabail}`)

  const { data, error } = await supabase.from("Bails").select("*").eq("idroblox", String(idroblox)).single()

  let ignorar1 = []
  let ignorar2 = {}

  let guildrofi = await client.guilds.fetch("1057435567035535441")
  let canaldebotcommands = await guildrofi.channels.fetch("1057435568063119436")

  if (data && data !== null && data !== undefined && data !== ignorar1 && data !== ignorar2) {
    console.log(data)
    if (data.bail === String(valordabail)) {

      await canaldebotcommands.send(`r!unban ${data.iddiscord} (Paid the bail)`)

      await res.send("Ok").status(200)
    } else {
      await res.send("N").status(200)
    }
  } else {
    await res.send("N").status(200)
  }
})

app.get("/", async (req, res) => {
  console.log("Online");

  const conteudo = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tudo Ok</title>
    </head>
    <body style="background-color: black;">
        <img style="width: 500px; height: 500px; display: flex; margin: auto auto;" src="https://i.imgur.com/MuaweOK.png" alt="">
    </body>
    </html>`;

  await res.send(conteudo).status(200);
});

app.listen(3156, function () {
  console.log("Iniciou");
});