exports.run = {
   regex: /http(?:s)?:\/\/(?:www\.|mobile\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
   async: async (m, {
      client,
      body,
      users,
      setting
   }) => {
      try {
         const regex = /http(?:s)?:\/\/(?:www\.|mobile\.)?twitter\.com\/([a-zA-Z0-9_]+)/;
         const extract = body ? Func.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => v.match(regex))
            if (links.length != 0) {
               if (users.limit > 0) {
                  let limit = 1
                  if (users.limit >= limit) {
                     users.limit -= limit
                  } else return client.reply(m.chat, Func.texted('bold', `π© Your limit is not enough to use this feature.`), m)
               }
               client.sendReact(m.chat, 'π', m.key)
               let old = new Date()
               Func.hitstat('twitter', m.sender)
               links.map(async link => {
                  let json = await Api.twitter(link)
                  if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
                  let caption = `δΉ  *T W I T T E R*\n\n`
                  caption += `	β¦  *Author* : ${json.author}\n`
                  caption += `	β¦  *Likes* : ${json.like}\n`
                  caption += `	β¦  *Retweets* : ${json.retweet}\n`
                  caption += `	β¦  *Comments* : ${json.reply}\n`
                  caption += `	β¦  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
                  caption += global.footer
                  json.data.map(async v => {
                     if (/jpg|mp4/.test(v.type)) {
                        client.sendFile(m.chat, v.url, '', caption, m)
                        await Func.delay(1500)
                     } else if (v.type == 'gif') {
                        client.sendFile(m.chat, v.url, '', caption, m, {
                           gif: true
                        })
                     }
                  })
               })
            }
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   download: true
}