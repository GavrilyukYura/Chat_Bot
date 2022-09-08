// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        const name = [];
        const numbers = [];
        let count = 0;

        this.onMessage(async (context, next) => {
            name.push(context.activity.text);

            // By calling next() you ensure that the next BotHandler is run.
            if (name.length > 1) {
                name.length = 1;
                count++;
            }
            if (name.length === 1) {
                if (numbers.length === 0 && isNaN(Number(context.activity.text)) && count < 1) {
                    const text = `Привіт ${ name[0] }! Я вмію додавати числа введіть будь ласка перше число`;
                    await context.sendActivity(MessageFactory.text(text, text));
                }
                if (!isNaN(Number(context.activity.text))) {
                    numbers.push(Number(context.activity.text));
                } else if (isNaN(Number(context.activity.text)) && count >= 1 && context.activity.text.toLowerCase() !== 'start') {
                    const error = 'Введене значення не є числом';
                    await context.sendActivity(MessageFactory.text(error, error));
                }
                if (numbers.length === 1) {
                    const text = 'ведіть друге число';
                    await context.sendActivity(MessageFactory.text(text, text));
                }
            }
            if (numbers.length === 2 && context.activity.text.toLowerCase() !== 'start') {
                const error = `${ numbers[0] } + ${ numbers[1] } = ${ numbers[0] + numbers[1] }. Якщо божаєте вираховувати щось ще напишіть Start`;
                await context.sendActivity(MessageFactory.text(error, error));
            }
            if (context.activity.text.toLowerCase() === 'start') {
                numbers.length = 0;
                const text = 'ведіть перше число';
                await context.sendActivity(MessageFactory.text(text, text));
            }
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Привіт! Як я можу до вас звертатися?';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
