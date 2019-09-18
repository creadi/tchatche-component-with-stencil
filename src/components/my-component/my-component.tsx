import { Component, Event, h, EventEmitter } from '@stencil/core'
import createBot from 'tchatche'
import { BotConfig } from 'tchatche/dist/types'

const getConfig = (container: HTMLElement): BotConfig => ({
  container,
  messages: [
    {
      id: 'first',
      botSays: () => ([
        'Hello',
        'I am a bot',
        'What is your name?',
      ]),
      userAction: {
        inputType: 'input',
        placeholder: 'Type your name here',
        onSubmit: async (name: string) =>
          name.length >= 2
            ? { nextMessageId: 'second', data: { property: 'name', value: name } }
            : { nextMessageId: 'first-validation-error', data: { property: 'name', value: name } }
      },
    },
    {
      id: 'first-validation-error',
      botSays: () => ([
        'That is not your name',
        'Seriously...',
        'What is your name?',
      ]),
      userAction: {
        inputType: 'input',
        onSubmit: async (name: string) =>
          name.length >= 2
            ? { nextMessageId: 'second', data: { property: 'name', value: name } }
            : { nextMessageId: 'first-validation-error', data: { property: 'name', value: name } }
      },
    },
    {
      id: 'second',
      botSays: data => ([
        `Hello ${data.name}`,
        'You can interact with me by writing text',
        'as you just did',
        'or by clicking buttons',
        'Like this:',
        'Do you want to see the docs?'
      ]),
      userAction: {
        inputType: 'buttons',
        buttons: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        onSubmit: async ({ value, label }) =>
          value === 'yes'
            ? { isEnd: true, data: { property: 'choice', value: String(value), label } }
            : { nextMessageId: 'second-no', data: { property: 'choice', value: String(value), label } }
      },
    },
    {
      id: 'second-no',
      botSays: () => ([
        'That is all I have to say',
        'I am just a bot with no imagination',
        'You want to see the docs?',
      ]),
      userAction: {
        inputType: 'buttons',
        buttons: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        onSubmit: async ({ value, label }) => {
          const TRUE: true = true
          return value === 'yes'
            ? { isEnd: TRUE, data: { property: 'choice', value: String(value), label } }
            : { nextMessageId: 'second-no-2', data: { property: 'choice', value: String(value), label } }
        }
      },
    },
    {
      id: 'second-no-2',
      botSays: () => ([
        'You are still here?',
        'You give me no choice',
        '...',
        'Now YOU have no choice'
      ]),
      userAction: {
        inputType: 'buttons',
        buttons: [
          { value: 'yes', label: 'See the docs' },
        ],
        onSubmit: async ({ value, label }) => {
          const TRUE: true = true
          return { isEnd: TRUE, data: { property: 'choice', value: String(value), label } }
        }
      },
    }
  ]
})

@Component({
  tag: 'chat-ui',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  private container?: HTMLDivElement
  private bot?: any

  componentDidLoad() {
    this.bot = createBot(getConfig(this.container))
    this.bot.on('end', data => this.conversationEnded.emit(data))
  }

  @Event({
    eventName: 'end'
  }) conversationEnded: EventEmitter

  render() {
    return <div>
      <div ref={el => this.container = el as HTMLDivElement}></div>
    </div>
  }
}
