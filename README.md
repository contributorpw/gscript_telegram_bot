# GScript Telegram Bot

# Install
GScript Telegram Bot is made available as a script library. This is how you add it to your project:

1. Select "Resources" > "Libraries..." in the Google Apps Script editor.
2. Enter the project key (`1y49W3MBj2KN57DdzSg5MYdRw3DhdSiS5585ipc4WmhLNJTF0qjeB0huQ`) in the "Find a Library" field, and choose "Select".
3. Select the highest version number, and choose `GScriptTelegramBot` as the identifier. (Do not turn on Development Mode unless you know what you are doing. The development version may not work.)
4. Press Save. You can now use the GScript Telegram Bot library in your code.

Example:
```javascript
function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommand("test", function () {
    return "testtesttest";
    });
    bot.addHandler(handler);
    
    bot.execute();
}
```

# Usage

```javascript
function doPost(e) {
    update = JSON.parse(e.postData.contents);
    // First it is necessary to initiate bot with API token and update object
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    // Next you can fill bot with handlers [zxx](xxx)

    handler = new GScriptTelegramBot.HandlerCommand("test", function () {
    return "testtesttest";
    });
    bot.addHandler(handler);
    
    bot.execute();
}
```

[All handlers here.](#handlers)

# API

## Bot

### `Bot.init(api_token, update)`

Initiate bot.

|Param     |Type  |Description|
|:---------|:-----|:----------|
|api_token|string|Telegram API token|
|update|object|Object of update|

### `Bot.getToken() -> string`

Get Telegram API.

### `Bot.addHandler(handler)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|handler|Handler|Handler object|

### `Bot.setUpdate(update)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|update|Update|Update object|

### `Bot.getUpdate() -> Update`

### `Bot.execute() -> boolean`

Execute bot with established settings.

### `Bot.editMessageReplyMarkup(message)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|message|Parameters.MessageReplyMarkup|Message replay markup object|

### `Bot.sendMessage(message)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|message|Parameters.Message|Message object|

### `Bot.editMessageText(message)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|message|Parameters.MessageText|Message text object|

## Handler

### `Handler.init()`

### `Handler.setUpdate(update)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|update|Update|Update object|

### `Handler.getUpdate() -> Update`

### `Handler.execute()`

### `Handler.check()`

## User

### `User.init(raw_user)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|raw_user|Object|Raw user object|

### `User.getId() -> number`

### `User.getFirsName() -> string`

## Message

### `Message.init(raw_message)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|raw_message|Object|Raw message object|

### `Message.getText() -> string`

### `Message.getChatId() -> number`

### `Message.getMessageId() -> number`

### `Message.getFrom() -> User`

## CallbackQuery

### `CallbackQuery.init(raw_callback_query)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|raw_callback_query|Object|Raw callback query object|

### `CallbackQuery.getMessage() -> string`

### `CallbackQuery.getData() -> string`

## Parameters.Message

### `Parameters.Message.init(obj)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|obj|Object|Raw message object|

## Parameters.MessageReplyMarkup

### `Parameters.MessageReplyMarkup.init(obj)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|obj|Object|Raw message replay markup object|

## Update

### `Update.init(update, bot)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|update|Object|Raw update object|
|bot|Bot|Bot object|

### `Update.setBot(bot)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|bot|Bot|Bot object|

### `Update.getBot() -> Bot`

### `Update.isMessage() -> boolean`

### `Update.isCallbackQuery() -> boolean`

### `Update.isCommand() -> boolean`

### `Update.getMessage() -> Message|boolean`

### `Update.getCallbackQuery() -> CallbackQuery|boolean`

## HandlerCommand

### `HandlerCommand.init(commandName, returnMessage)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|commandName|string|Command name|
|returnMessage|function or string|Message to return|

### `HandlerCommand.getCommandName() -> string`

### `HandlerCommand.check() -> boolean`

### `HandlerCommand.execute()`

## HandlerCallback

### `HandlerCallback.init(queryStartWith, handlerFunction)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|queryStartWith|string|String with which begins|
|handlerFunction|function|Handler function|

### `HandlerCallback.getQueryStartWith() -> string`

### `HandlerCallback.check() -> boolean`

### `HandlerCallback.execute()`

## HandlerCommandWithParams

### `HandlerCommandWithParams.init(commandName, param, handlerFunction, errorHandlerFunction, options)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|commandName|string|Command name|
|param|HandlerCommandWithParams.Param|Param|
|handlerFunction|function|Handler function|
|errorHandlerFunction|function|Handler error function|
|options|function|Options|

### `HandlerCommandWithParams.setReturnObjParam(name, value)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|name|string|Name|
|value|any|Value|

### `HandlerCommandWithParams.addReturnObjError(paramName, text)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|paramName|string|Name|
|text|any|Value|

### `HandlerCommandWithParams.getCommandName() -> string`

### `HandlerCommandWithParams.check() -> boolean`

### `HandlerCommandWithParams.sliceCommandParams(start) -> []`

### `HandlerCommandWithParams.execute()`

## HandlerCommandWithParams.Param

### `HandlerCommandWithParams.Param.init(options, params)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|options|Object|Options object|
|params|[]|Params|

### `HandlerCommandWithParams.Param.getParamByName(commandName) -> HandlerCommandWithParams.Param|boolean`

### `HandlerCommandWithParams.Param.getParamName() -> string`

### `HandlerCommandWithParams.Param.isRequired() -> string`

### `HandlerCommandWithParams.Param.evaluate(handler) -> boolean`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|handler|HandlerCommandWithParams|Handler|

### `HandlerCommandWithParams.Param.check(handler) -> boolean`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|handler|HandlerCommandWithParams|Handler|

### `HandlerCommandWithParams.Param.getDefaultValue() -> any`

### `HandlerCommandWithParams.Param.getMaxCountOfParams() -> number`

### `HandlerCommandWithParams.Param.getMaxCountOfParamsToDelete() -> number`

### `HandlerCommandWithParams.Param.setNotSetError(handler)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|handler|HandlerCommandWithParams|Handler|

# Handlers

## HandlerCommandWithParams.ParamString

## HandlerCommandWithParams.ParamNumber

## HandlerCommandWithParams.ParamDate

## HandlerCommandWithParams.ParamTime

## HandlerCommandWithParams.ParamMoneyWithExchange

## HandlerCommandWithParams.ParamValueFromListWithSynonymous

## HandlerCommandWithParams.ParamDescription

## HandlerCommandWithParams.ParamNamed

## HandlerCommandWithParams.ParamPhoneNumber
