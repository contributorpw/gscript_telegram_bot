# GScript Telegram Bot

# Install
Script Id: `1y49W3MBj2KN57DdzSg5MYdRw3DhdSiS5585ipc4WmhLNJTF0qjeB0huQ`.

Example:
```javascript
function doPost(e) {
  update = JSON.parse(e.postData.contents);
  bot = new GScriptTelegramBot.TelegramBotAPI.Bot("API_TOKEN", update);
  
  handler = new GScriptTelegramBot.TelegramBotAPI.HandlerCommand("test", function () {
    return "testtesttest";
  });
  bot.addHandler(handler);
  
  bot.execute();
}
```