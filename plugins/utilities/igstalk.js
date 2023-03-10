exports.run = {
   usage: ['igstalk'],
   use: 'username',
   category: 'utilities',
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'hosico_cat'), m)
         client.sendReact(m.chat, 'π', m.key)
         let json = await Api.igstalk(args[0])
         if (!json.status) return client.reply(m.chat, Func.texted('bold', `π© Account not found.`), m)
         let caption = `δΉ  *I G - S T A L K*\n\n`
         caption += `	β¦  *Name* : ${json.data.name}\n`
         caption += `	β¦  *Username* : ${json.data.username}\n`
         caption += `	β¦  *Posts* : ${json.data.post}\n`
         caption += `	β¦  *Followers* : ${json.data.follower}\n`
         caption += `	β¦  *Followings* : ${json.data.following}\n`
         caption += `	β¦  *Bio* : ${json.data.about}\n`
         caption += `	β¦  *Private* : ${Func.switcher(json.data.private, 'β', 'Γ')}\n\n`
         caption += global.footer
         client.sendMessageModify(m.chat, caption, m, {
            ads: false,
            largeThumb: true,
            thumbnail: await Func.fetchBuffer(json.data.photo)
         })
      } catch {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}