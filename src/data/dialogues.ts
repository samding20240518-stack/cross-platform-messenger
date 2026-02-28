// 对话数据结构
export interface MessageData {
  type: 'npc' | 'player' | 'choice'
  content: string
  burnAfter?: number  // 阅后即焚秒数
  isClue?: boolean
  clueId?: string
  nextDelay?: number  // 下一条消息延迟（毫秒）
  options?: string[]  // 选择项（当type为choice时）
}

export interface DialogueData {
  npcId: string
  npcName: string
  platform: string
  messages: MessageData[]
}

// 第一章对话数据
const chapter1Dialogues: Record<string, DialogueData> = {
  'whatsapp-informant_a': {
    npcId: 'informant_a',
    npcName: '匿名线人',
    platform: 'whatsapp',
    messages: [
      {
        type: 'npc',
        content: '你...你是那个调查员吗？',
        nextDelay: 1500
      },
      {
        type: 'choice',
        content: '',
        options: ['是的，我是调查员', '你是谁？', '你掌握什么信息？'],
        nextDelay: 500
      },
      {
        type: 'npc',
        content: '听着，我知道是谁干的...',
        burnAfter: 8,
        isClue: true,
        clueId: 'ip-part1',
        nextDelay: 2000
      },
      {
        type: 'npc',
        content: '但我不能说太多...这里不安全',
        nextDelay: 1500
      },
      {
        type: 'choice',
        content: '',
        options: ['你要什么条件？', '在哪里见面？', '继续说吧'],
        nextDelay: 500
      },
      {
        type: 'npc',
        content: '去Telegram找 "黑客X"...',
        burnAfter: 10,
        isClue: true,
        clueId: 'cipher-key',
        nextDelay: 1000
      },
      {
        type: 'npc',
        content: '他手里有另一半信息...🔥',
        burnAfter: 5,
        nextDelay: 500
      },
      {
        type: 'npc',
        content: '【对方已离线】',
        nextDelay: 0
      }
    ]
  },

  'telegram-hacker_x': {
    npcId: 'hacker_x',
    npcName: '黑客X',
    platform: 'telegram',
    messages: [
      {
        type: 'npc',
        content: '哼，你就是那个调查员？',
        nextDelay: 2000
      },
      {
        type: 'choice',
        content: '',
        options: ['线人A让我来的', '我来拿信息', '你知道什么？'],
        nextDelay: 500
      },
      {
        type: 'npc',
        content: '想要信息？先证明你不是菜鸟',
        nextDelay: 1500
      },
      {
        type: 'npc',
        content: '凯撒密码 +3: dwwdfn dw gawn',
        burnAfter: 15,
        isClue: true,
        clueId: 'ip-part2',
        nextDelay: 3000
      },
      {
        type: 'choice',
        content: '答案是什么？',
        options: ['attack at dawn', 'dwwdfn dw gawn', '我不知道'],
        nextDelay: 500
      },
      {
        type: 'npc',
        content: '算你及格...完整的IP是 192.168.1.100',
        burnAfter: 8,
        nextDelay: 1500
      },
      {
        type: 'npc',
        content: '去Discord找那个公会成员，他知道时间',
        nextDelay: 1000
      }
    ]
  },

  'discord-guild_member': {
    npcId: 'guild_member',
    npcName: '游戏公会成员',
    platform: 'discord',
    messages: [
      {
        type: 'npc',
        content: '嘿，听说你在调查那件事？',
        nextDelay: 1500
      },
      {
        type: 'choice',
        content: '',
        options: ['是的，你有线索吗？', '你知道Phantom吗？', '昨晚发生了什么？'],
        nextDelay: 500
      },
      {
        type: 'npc',
        content: '我昨晚看到有个人在群里发了奇怪的消息...',
        nextDelay: 2000
      },
      {
        type: 'npc',
        content: '时间大概是凌晨3点左右',
        burnAfter: 10,
        isClue: true,
        clueId: 'time-stamp',
        nextDelay: 1500
      },
      {
        type: 'choice',
        content: '',
        options: ['还有别的吗？', '那个人是谁？', '什么奇怪的消息？'],
        nextDelay: 500
      },
      {
        type: 'npc',
        content: '那个人叫自己 "Phantom"',
        burnAfter: 8,
        isClue: true,
        clueId: 'suspect-name',
        nextDelay: 1000
      },
      {
        type: 'npc',
        content: '对了，检查你的邮箱，应该有系统日志',
        nextDelay: 1000
      }
    ]
  },

  'email-system': {
    npcId: 'system',
    npcName: '系统通知',
    platform: 'email',
    messages: [
      {
        type: 'npc',
        content: '【系统日志】异常访问检测',
        nextDelay: 1000
      },
      {
        type: 'npc',
        content: '来源IP: 192.168.xxx.xxx',
        nextDelay: 1500
      },
      {
        type: 'npc',
        content: '地理位置: 新加坡数据中心',
        burnAfter: 12,
        isClue: true,
        clueId: 'location',
        nextDelay: 1000
      },
      {
        type: 'npc',
        content: '【日志结束】',
        nextDelay: 500
      },
      {
        type: 'npc',
        content: '📧 新邮件 - 来自：匿名',
        nextDelay: 2000
      },
      {
        type: 'npc',
        content: '你收集到所有线索了吗？去侦探笔记本整合它们吧！',
        nextDelay: 0
      }
    ]
  }
}

// 获取对话数据
export function getDialogue(chapter: string, npcId: string, platform: string): DialogueData | null {
  const key = `${platform}-${npcId}`
  
  if (chapter === 'chapter1') {
    return chapter1Dialogues[key] || null
  }
  
  return null
}

// 导出所有对话供预加载
export function getAllDialogues(): Record<string, DialogueData> {
  return chapter1Dialogues
}
