exports.run = {
   usage: ['profile'],
   use: 'mention or reply',
   category: 'user info',
   async: async (m, {
      client,
      text,
      isPrefix,
      blockList
   }) => {
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@` [1]) : text
      if (!text && !m.quoted) return client.reply(m.chat, Func.texted('bold', `π© Mention or Reply chat target.`), m)
      if (isNaN(number)) return client.reply(m.chat, Func.texted('bold', `π© Invalid number.`), m)
      if (number.length > 15) return client.reply(m.chat, Func.texted('bold', `π© Invalid format.`), m)
      let pic = await Func.fetchBuffer('./media/image/default.jpg')
      try {
         if (text) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch (e) {} finally {
         let target = global.db.users.find(v => v.jid == user)
         if (typeof target == 'undefined') return client.reply(m.chat, Func.texted('bold', `π© Can't find user data.`), m)
         try {
            pic = await Func.fetchBuffer(await client.profilePictureUrl(user, 'image'))
         } catch (e) {} finally {
            let blocked = blockList.includes(user) ? true : false
            let now = new Date() * 1
            let lastseen = (target.lastseen == 0) ? 'Never' : Func.toDate(now - target.lastseen)
            let usebot = (target.usebot == 0) ? 'Never' : Func.toDate(now - target.usebot)
            let caption = `δΉ  *U S E R - P R O F I L E*\n\n`
            caption += `	β¦ *Limit* : ${Func.formatNumber(target.limit)}\n`
            caption += `	β¦ *Hitstat* : ${Func.formatNumber(target.hit)}\n`
            caption += `	β¦ *Warning* : ${((m.isGroup) ? (typeof global.db.groups.find(v => v.jid == m.chat).member[user] != 'undefined' ? global.db.groups.find(v => v.jid == m.chat).member[user].warning : 0) + ' / 5' : target.warning + ' / 5')}\n\n`
            caption += `δΉ  *U S E R - S T A T U S*\n\n`
            caption += `	β¦ *Blocked* : ${(blocked ? 'β' : 'Γ')}\n`
            caption += `	β¦ *Banned* : ${(new Date - target.banTemp < global.timer) ? Func.toTime(new Date(target.banTemp + global.timer) - new Date()) + ' (' + ((global.timer / 1000) / 60) + ' min)' : target.banned ? 'β' : 'Γ'}\n`
            caption += `	β¦ *Use In Private* : ${(global.db.chats.map(v => v.jid).includes(user) ? 'β' : 'Γ')}\n`
            caption += `	β¦ *Premium* : ${(target.premium ? 'β' : 'Γ')}\n`
            caption += `	β¦ *Expired* : ${target.expired == 0 ? '-' : Func.timeReverse(target.expired - new Date() * 1)}\n\n`
            caption += global.footer
            client.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               thumbnail: pic
            })
         }
      }
   },
   error: false,
   cache: true,
   location: __filename
}