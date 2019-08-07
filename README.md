# GScript Telegram Bot

# Install
GScript Telegram Bot is made available as a script library. This is how you add it to your project:

1. Select "Resources" > "Libraries..." in the Google Apps Script editor.
2. Enter the project key (`1y49W3MBj2KN57DdzSg5MYdRw3DhdSiS5585ipc4WmhLNJTF0qjeB0huQ`) in the "Find a Library" field, and choose "Select".
3. Select the highest version number, and choose `GScriptTelegramBot` as the identifier. (Do not turn on Development Mode unless you know what you are doing. The development version may not work.)
4. Press Save. You can now use the GScript Telegram Bot library in your code.

# Usage

```javascript
function doPost(e) {
    update = JSON.parse(e.postData.contents);
    // First it is necessary to initiate bot with API token and update object
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    // Next you can fill bot with handlers
    handler = new GScriptTelegramBot.HandlerCommand("test", function () {
        return "testtesttest";
    });
    bot.addHandler(handler);
    
    // Run bot
    bot.execute();
}
```

All handlers [here](#handlers).

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

## Parameters

### Parameters.Message

#### `Parameters.Message.init(obj)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|obj|Object|Raw message object|

### Parameters.MessageReplyMarkup

#### `Parameters.MessageReplyMarkup.init(obj)`

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

## Handlers

### Handler

Main (parent) object for all handlers.

#### `Handler.init()`

Different for each handler.

#### `Handler.setUpdate(update)`

Set Update object.

|Param     |Type  |Description|
|:---------|:-----|:----------|
|update|Update|Update object|

#### `Handler.getUpdate() -> Update`

#### `Handler.check() -> boolean`

Method that must to be fill in child handlers. This method needed for check if this handler is acceptable to execute in that case.

#### `Handler.execute()`

Method that must to be fill in child handlers. This method contains code to execute.

### HandlerCommand

#### `HandlerCommand.init(commandName, returnMessage)`

Handle command like `/test`. Example:
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

|Param     |Type  |Description|
|:---------|:-----|:----------|
|commandName|string|Command name|
|returnMessage|function or string|Message to return. Function must return string or `Parameters.Message` object.|

#### `HandlerCommand.getCommandName() -> string`

Get command name.

### HandlerCallback

#### `HandlerCallback.init(queryStartWith, handlerFunction)`

Handle callback query from a callback button in an inline keyboard. Example:
```javascript
function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCallback("delete_", function (callbackQuery, handler) {
        id = callbackQuery.getData().replace('delete_', '');

        return "Test: " + id;
    });
    bot.addHandler(handler);
    
    bot.execute();
}
```

|Param     |Type  |Description|
|:---------|:-----|:----------|
|queryStartWith|string|String with which begins|
|handlerFunction|function|Handler function. Function must return string or `Parameters.Message` object.|

#### `HandlerCallback.getQueryStartWith() -> string`

### HandlerCommandWithParams

#### `HandlerCommandWithParams.init(commandName, param, handlerFunction, errorHandlerFunction, options)`

Handle command with params like `/test param1 param2 param3`.
Params can be included in group, and have boolean option `mutableParams`, which decides if inside params can be mutable or not.
Example:
```javascript
function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommandWithParams("adduser",
        new TelegramBotAPI.HandlerCommandWithParams.Param({mutableParams: false, errorNotSetText: "<b>Params is not typed!</b>"}, [
            new TelegramBotAPI.HandlerCommandWithParams.ParamString({paramName: 'name',  errorNotSetText: "<b>Name is not set!</b>"}),
            new TelegramBotAPI.HandlerCommandWithParams.ParamString({paramName: 'secondName',  errorNotSetText: "<b>Second name is not set!</b>"}),
            new TelegramBotAPI.HandlerCommandWithParams.ParamDate({paramName: 'birthDate',  errorNotSetText: "<b>Birth day is not set!</b>"}),
            new TelegramBotAPI.HandlerCommandWithParams.ParamPhoneNumber({paramName: 'phoneNumber', required: false}),
        ]),
        function (obj) {
            Logger.log(obj); // => {name=Jon, secondName=Jonny, birthDate=01.01.1990, phoneNumber=380990000000}

            return "testtesttest";
        }, function (obj, errors, handler) {
            Logger.log(obj); // => {name=Jon, secondName=Jonny, birthDate=01.01.1990, phoneNumber=380990000000}
            Logger.log(errors); // => [{paramName=name, errorText=<b>Name is not set!</b>}, {paramName=secondName, errorText=<b>Second name is not set!</b>}]

            return "testtesttest";
        }
    );
    bot.addHandler(handler);
    
    bot.execute();
}
```

|Param     |Type  |Description|
|:---------|:-----|:----------|
|commandName|string|Command name|
|param|HandlerCommandWithParams.Param|Param|
|handlerFunction|function|Handler function|
|errorHandlerFunction|function|Handler error function|
|options|function|Options|

##### `handlerFunction(obj)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|obj|Object|Params|

##### `errorHandlerFunction(obj, errors, handler)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|obj|Object|Params|
|errors|[]|Errors|
|handler|HandlerCommandWithParams|Handler|


##### `options` object
|Param     |Type  |Description|
|:---------|:-----|:----------|
|exceptByFirstError|boolean|Except by first error in params. Default: `false`|
|separator|string or `RegExp`|Separator for params. Default: `/\ +/`|

#### `HandlerCommandWithParams.setReturnObjParam(name, value)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|name|string|Name|
|value|any|Value|

#### `HandlerCommandWithParams.addReturnObjError(paramName, text)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|paramName|string|Name|
|text|any|Value|

#### `HandlerCommandWithParams.getCommandName() -> string`

#### `HandlerCommandWithParams.sliceCommandParams(start) -> []`

#### Params

##### HandlerCommandWithParams.Param

Parent object for params and also handler (or group) for other params.
If you need your own param you must create child from this class.

###### `HandlerCommandWithParams.Param.init(options, params)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|options|Object|Options object|
|params|[]|Params|

###### `options` object
|Param     |Type  |Description|
|:---------|:-----|:----------|
|mutableParams|Object|Decide if params can be mutable, for example if `true`: `\adduser Jon 30` and `\adduser 30 Jon` is similar. Default: `false`|
|required|Object|If `true` return `errorNotSetText` error if param is not found. Default: `true`|
|errorNotSetText|Object|Error text|

###### `HandlerCommandWithParams.Param.getParamByName(commandName) -> HandlerCommandWithParams.Param|boolean`

###### `HandlerCommandWithParams.Param.getParamName() -> string`

###### `HandlerCommandWithParams.Param.isRequired() -> string`

###### `HandlerCommandWithParams.Param.evaluate(handler) -> boolean`

Evaluate param. Inheritance in child params.

|Param     |Type  |Description|
|:---------|:-----|:----------|
|handler|HandlerCommandWithParams|Handler|

###### `HandlerCommandWithParams.Param.check(handler) -> boolean`

Check if param is applicable. Inheritance in child params.

|Param     |Type  |Description|
|:---------|:-----|:----------|
|handler|HandlerCommandWithParams|Handler|

###### `HandlerCommandWithParams.Param.getDefaultValue() -> any`

###### `HandlerCommandWithParams.Param.getMaxCountOfParams() -> number`

Get max count of params. Inheritance in child params.

###### `HandlerCommandWithParams.Param.getMaxCountOfParamsToDelete() -> number`

Get max count of params to delete. Inheritance in child params.

###### `HandlerCommandWithParams.Param.setNotSetError(handler)`

|Param     |Type  |Description|
|:---------|:-----|:----------|
|handler|HandlerCommandWithParams|Handler|

###### How to create new param

```javascript
HandlerCommandWithParams.ParamNew = function () {
    HandlerCommandWithParams.Param.apply(this, arguments);
};
HandlerCommandWithParams.ParamNew.prototype = Object.create(HandlerCommandWithParams.Param.prototype);
HandlerCommandWithParams.ParamNew.prototype.constructor = HandlerCommandWithParams.Param;
HandlerCommandWithParams.ParamNew.prototype.check = function (handler) {
    localParam = handler.commandParams[0];
    
    if (/*check if param is correct*/) {
        return true;
    }

    return false;
};
/**
 *
 * @param commandParams
 * @param handler
 * @returns {{}|*}
 */
HandlerCommandWithParams.ParamNew.prototype.evaluate = function (handler) {
    localParam = handler.commandParams[0];

    // prepare param

    return localParam; // and return final value
};
HandlerCommandWithParams.ParamNew.prototype.getMaxCountOfParams = function () {
    return 1; // return number of params in command
};
HandlerCommandWithParams.ParamNew.prototype.getMaxCountOfParamsToDelete = function () {
    return 1; // return number of params in command (to delete from initial array)
};

```

##### HandlerCommandWithParams.ParamString

Param handle that is string.

Example:
```javascript
// /adduser Jon

function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommandWithParams("adduser",
        new TelegramBotAPI.HandlerCommandWithParams.Param({mutableParams: false, errorNotSetText: "<b>Params is not typed!</b>"}, [
            new TelegramBotAPI.HandlerCommandWithParams.ParamString({paramName: 'name',  errorNotSetText: "<b>Name is not set!</b>"}),
        ]),
        function (obj) {
            Logger.log(obj); // => {name=Jon}

            return "testtesttest";
        }, function (obj, errors, handler) {
            Logger.log(obj); // => {}
            Logger.log(errors); // => [{paramName=name, errorText=<b>Name is not set!</b>}]

            return "testtesttest";
        }
    );
    bot.addHandler(handler);
    
    bot.execute();
}
```

##### HandlerCommandWithParams.ParamNumber

Param handle that is number.

Example:
```javascript
// /adduser 55

function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommandWithParams("adduser",
        new TelegramBotAPI.HandlerCommandWithParams.Param({mutableParams: false, errorNotSetText: "<b>Params is not typed!</b>"}, [
            new TelegramBotAPI.HandlerCommandWithParams.ParamNumber({paramName: 'number',  errorNotSetText: "<b>Number is not set!</b>"}),
        ]),
        function (obj) {
            Logger.log(obj); // => {number=55}

            return "testtesttest";
        }, function (obj, errors, handler) {
            Logger.log(obj); // => {}
            Logger.log(errors); // => [{paramName=number, errorText=<b>Number is not set!</b>}]

            return "testtesttest";
        }
    );
    bot.addHandler(handler);
    
    bot.execute();
}
```

##### HandlerCommandWithParams.ParamDate

Param handle that is date.
If is set only day, month and year is set current.
If is set only day and month, year is set current.

Date format: `dd.mm.yyyy`, `dd/mm/yyyy`.

Example:
```javascript
// /adduser 01.01.1990
// /adduser 01/01/1990
// /adduser 01/01
// /adduser 01

function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommandWithParams("adduser",
        new TelegramBotAPI.HandlerCommandWithParams.Param({mutableParams: false, errorNotSetText: "<b>Params is not typed!</b>"}, [
            new TelegramBotAPI.HandlerCommandWithParams.ParamDate({paramName: 'date',  errorNotSetText: "<b>Date is not set!</b>"}),
        ]),
        function (obj) {
            Logger.log(obj); // => {date=55}

            return "testtesttest";
        }, function (obj, errors, handler) {
            Logger.log(obj); // => {}
            Logger.log(errors); // => [{paramName=date, errorText=<b>Date is not set!</b>}]

            return "testtesttest";
        }
    );
    bot.addHandler(handler);
    
    bot.execute();
}
```

##### HandlerCommandWithParams.ParamTime

Param handle that is time. Date format: `nubmer[hmчм]`. Return hours in number format.

Example:
```javascript
// /adduser 2
// /adduser 2h
// /adduser 30m
// /adduser 0.5h

function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommandWithParams("adduser",
        new TelegramBotAPI.HandlerCommandWithParams.Param({mutableParams: false, errorNotSetText: "<b>Params is not typed!</b>"}, [
            new TelegramBotAPI.HandlerCommandWithParams.ParamTime({paramName: 'time',  errorNotSetText: "<b>Time is not set!</b>"}),
        ]),
        function (obj) {
            Logger.log(obj); // => {time={time=2, dimension=h}}

            return "testtesttest";
        }, function (obj, errors, handler) {
            Logger.log(obj); // => {}
            Logger.log(errors); // => [{paramName=time, errorText=<b>Time is not set!</b>}]

            return "testtesttest";
        }
    );
    bot.addHandler(handler);
    
    bot.execute();
}
```

##### HandlerCommandWithParams.ParamMoneyWithExchange

Param handle that is time. Date format: `nubmer[hmчм]`. Return hours in number format.

Example:
```javascript
// /adduser 300
// /adduser 300*25
// /adduser 300.50
// /adduser 300.50*25.4

function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommandWithParams("adduser",
        new TelegramBotAPI.HandlerCommandWithParams.Param({mutableParams: false, errorNotSetText: "<b>Params is not typed!</b>"}, [
            new TelegramBotAPI.HandlerCommandWithParams.ParamMoneyWithExchange({paramName: 'money',  errorNotSetText: "<b>Money is not set!</b>"}),
        ]),
        function (obj) {
            Logger.log(obj); // => {money={sum==300,5*25,4, sumInt=7632.7, rate=25,4, rateInt=25.4, sumDisplay=7632.7}}

            return "testtesttest";
        }, function (obj, errors, handler) {
            Logger.log(obj); // => {}
            Logger.log(errors); // => [{paramName=money, errorText=<b>Money is not set!</b>}]

            return "testtesttest";
        }
    );
    bot.addHandler(handler);
    
    bot.execute();
}
```

##### HandlerCommandWithParams.ParamValueFromListWithSynonymous

Param handle a synonymous from a list.

Example:
```javascript
// /adduser sub
// /adduser s
// /adduser Subaru
// /adduser peu

function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommandWithParams("adduser",
        new TelegramBotAPI.HandlerCommandWithParams.Param({mutableParams: false, errorNotSetText: "<b>Params is not typed!</b>"}, [
            new TelegramBotAPI.HandlerCommandWithParams.ParamValueFromListWithSynonymous({
                paramName: 'car',
                errorNotSetText: "<b>Car is not set!</b>",
                valueList: {'Subaru': ['sub', 's'], 'Peugeot': ['peu', 'p']}
            }),
        ]),
        function (obj) {
            Logger.log(obj); // => {car=Subaru}

            return "testtesttest";
        }, function (obj, errors, handler) {
            Logger.log(obj); // => {}
            Logger.log(errors); // => [{paramName=car, errorText=<b>Car is not set!</b>}]

            return "testtesttest";
        }
    );
    bot.addHandler(handler);
    
    bot.execute();
}
```

##### HandlerCommandWithParams.ParamDescription

Handle all words to end of params.

Example:
```javascript
// /adduser Description description description description description

function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommandWithParams("adduser",
        new TelegramBotAPI.HandlerCommandWithParams.Param({mutableParams: false, errorNotSetText: "<b>Params is not typed!</b>"}, [
            new TelegramBotAPI.HandlerCommandWithParams.ParamDescription({paramName: 'description',  errorNotSetText: "<b>Description is not set!</b>"}),
        ]),
        function (obj) {
            Logger.log(obj); // => {description=Description description description description description}

            return "testtesttest";
        }, function (obj, errors, handler) {
            Logger.log(obj); // => {}
            Logger.log(errors); // => [{paramName=description, errorText=<b>Description is not set!</b>}]

            return "testtesttest";
        }
    );
    bot.addHandler(handler);
    
    bot.execute();
}
```

##### HandlerCommandWithParams.ParamNamed

Handle param with name.

Example:
```javascript
// /adduser name value
// /adduser n value

function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommandWithParams("adduser",
        new TelegramBotAPI.HandlerCommandWithParams.Param({mutableParams: false, errorNotSetText: "<b>Params is not typed!</b>"}, [
            new TelegramBotAPI.HandlerCommandWithParams.ParamNamed({
                paramName: 'named',
                param: new TelegramBotAPI.HandlerCommandWithParams.ParamString({paramName: 'string'}),
                names: ['name', 'n'],
                errorNotSetText: "<b>Named is not set!</b>"
            }),
        ]),
        function (obj) {
            Logger.log(obj); // => {named=value}

            return "testtesttest";
        }, function (obj, errors, handler) {
            Logger.log(obj); // => {}
            Logger.log(errors); // => [{paramName=named, errorText=<b>Named is not set!</b>}]

            return "testtesttest";
        }
    );
    bot.addHandler(handler);
    
    bot.execute();
}
```

##### HandlerCommandWithParams.ParamPhoneNumber

Handle param with phone number. For Ukraine numbers.

Example:
```javascript
// /adduser 38099000000000
// /adduser +38099000000000
// /adduser 099000000000
// /adduser 99000000000

function doPost(e) {
    update = JSON.parse(e.postData.contents);
    bot = new GScriptTelegramBot.Bot("API_TOKEN", update);
    
    handler = new GScriptTelegramBot.HandlerCommandWithParams("adduser",
        new TelegramBotAPI.HandlerCommandWithParams.Param({mutableParams: false, errorNotSetText: "<b>Params is not typed!</b>"}, [
            new TelegramBotAPI.HandlerCommandWithParams.ParamPhoneNumber({paramName: 'phone', errorNotSetText: "<b>Phone is not typed!</b>"}),
        ]),
        function (obj) {
            Logger.log(obj); // => {phone=38099000000000}

            return "testtesttest";
        }, function (obj, errors, handler) {
            Logger.log(obj); // => {}
            Logger.log(errors); // => [{paramName=phone, errorText=<b>Phone is not set!</b>}]

            return "testtesttest";
        }
    );
    bot.addHandler(handler);
    
    bot.execute();
}
```