if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target === null || target === undefined) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource !== null && nextSource !== undefined) {
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

function find(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }

    return false;
}


Bot = function (api_token) {
    this.init.apply(this, arguments);
};

Bot.prototype = {
    /**
     *
     * @param {string} api_token
     * @param {Object} update - raw object of update
     */
    init: function (api_token, update) {
        this.handlers = [];
        this.api_token = api_token;

        /**
         *
         * @type {Update|null}
         */
        this.update = new Update(update, this);
    },
    getToken: function () {
        return this.api_token;
    },
    /**
     *
     * @param {Handler} handler
     */
    addHandler: function (handler) {
        this.handlers.push(handler);
    },
    /**
     *
     * @param {Update} update
     */
    setUpdate: function (update) {
        this.update = update;
    },
    getUpdate: function () {
        return this.update;
    },
    /**
     *
     * @return {boolean}
     */
    execute: function () {
        var self = this;
        return this.handlers.some(
            /**
             *
             * @param {Handler} item
             * @param {number} index
             * @param {[]} array
             * @returns {boolean}
             */
            function (item, index, array) {
                item.setUpdate(self.getUpdate());
                if (item.check()) {
                    item.execute();
                    return true;
                }

                return false;
            });
    },
    /**
     *
     * @param {Parameters.MessageReplyMarkup} message
     */
    editMessageReplyMarkup: function (message) {
        chat_id = message.chatId || this.getUpdate().getMessage().getChatId();
        message_id = message.messageId || false;
        inline_message_id = message.inlineMessageId || false;
        reply_markup = message.replyMarkup || false;

        var payload = {
            'method': 'editMessageReplyMarkup',
        };

        if (chat_id) {
            payload.chat_id = String(chat_id);
        }

        if (message_id) {
            payload.message_id = message_id;
        }

        if (inline_message_id) {
            payload.inline_message_id = inline_message_id;
        }

        if (reply_markup) {
            payload.reply_markup = JSON.stringify(reply_markup);
        }

        var data = {
            "method": "post",
            "payload": payload
        };

        this.__request(data);
    },
    /**
     *
     * @param {Parameters.Message} message
     */
    sendMessage: function (message) {
        if (typeof message === 'undefined') {
            throw "Must set message (TelegramBotAPI.Parameters.Message)."
        }

        chatId = message.chatId || this.getUpdate().getMessage().getChatId();
        parse_mode = message.parseMode || "HTML";
        disable_web_page_preview = message.disableWebPagePreview || false;
        disable_notification = message.disableNotification || false;
        reply_to_message_id = message.replyToMessageId || false;
        reply_markup = message.replyMarkup || false;
        text = message.text || '';
        var payload = {
            'method': 'sendMessage',
            'chat_id': String(chatId),
            'text': text,
            'parse_mode': parse_mode,
        };

        if (disable_web_page_preview) {
            payload.disable_web_page_preview = disable_web_page_preview;
        }

        if (disable_notification) {
            payload.disable_notification = disable_notification;
        }

        if (reply_to_message_id) {
            payload.reply_to_message_id = reply_to_message_id;
        }

        if (reply_markup) {
            payload.reply_markup = JSON.stringify(reply_markup);
        }

        var data = {
            "method": "post",
            "payload": payload
        };

        this.__request(data);
    },
    /**
     *
     * @param {Parameters.Message} message
     */
    editMessageText: function (message) {
        chat_id = message.chatId || this.getUpdate().getMessage().getChatId();
        message_id = message.messageId || false;
        inline_message_id = message.inlineMessageId || false;
        text = message.text || '';
        parse_mode = message.parseMode || "HTML";
        disable_web_page_preview = message.disableWebPagePreview || false;
        reply_markup = message.replyMarkup || false;

        var payload = {
            'method': 'editMessageText',
            'text': text,
        };

        if (chat_id) {
            payload.chat_id = chat_id;
        }

        if (message_id) {
            payload.message_id = message_id;
        }

        if (inline_message_id) {
            payload.inline_message_id = inline_message_id;
        }

        if (parse_mode) {
            payload.parse_mode = parse_mode;
        }

        if (disable_web_page_preview) {
            payload.disable_web_page_preview = disable_web_page_preview;
        }

        if (reply_markup) {
            payload.reply_markup = JSON.stringify(reply_markup);
        }

        var data = {
            "method": "post",
            "payload": payload
        };

        this.__request(data);
    },
    __request: function (data) {
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + this.getToken() + '/', data);
        if (response.getResponseCode() !== 200) {
            MailApp.sendEmail("sgavka@gmail.com", "G&B Car Rent — Error", "", {
                htmlBody: "Status Code: " + String(response.getResponseCode()) + "<br />" +
                    "Headers: <pre><code>" + JSON.stringify(response.getAllHeaders(), null, 2) + "</code></pre><br />" +
                    "Body: " + "<br />" +
                    "<pre><code>" + response.getContentText() + "</code></pre>"
            });
        }
    },
};

Handler = function () {
    this.init.apply(this, arguments);
};

Handler.prototype = {
    init: function () {
        this.update = null;
    },
    /**
     *
     * @param {Update} update
     */
    setUpdate: function (update) {
        this.update = update;
    },
    /**
     *
     * @returns {Update|null}
     */
    getUpdate: function () {
        return this.update;
    },
    execute: function () {
    },
    check: function () {
    },
};


User = function () {
    this.init.apply(this, arguments);
};
User.prototype = {
    init: function (raw_user) {
        this.raw_user = raw_user || {};
    },
    getId: function () {
        return this.raw_user.id;
    },
    getFirsName: function () {
        return this.raw_user.first_name;
    },
};

Message = function () {
    this.init.apply(this, arguments);
};
Message.prototype = {
    init: function (raw_message) {
        this.raw_message = raw_message || {};
    },
    getText: function () {
        return this.raw_message.text;
    },
    /**
     *
     * @returns {number}
     */
    getChatId: function () {
        return this.raw_message.chat.id;
    },
    getMessageId: function () {
        return this.raw_message.message_id;
    },
    getFrom: function () {
        return new User(this.raw_message.from);
    }
};

CallbackQuery = function () {
    this.init.apply(this, arguments);
};
CallbackQuery.prototype = {
    init: function (raw_callback_query) {
        this.raw_callback_query = raw_callback_query || {};
    },
    /**
     *
     * @returns {Message}
     */
    getMessage: function () {
        return new Message(this.raw_callback_query.message);
    },
    /**
     *
     * @returns {string}
     */
    getData: function () {
        return this.raw_callback_query.data;
    }
};

Parameters = function () {
    this.init.apply(this, arguments);
};
Parameters.prototype = {
    init: function () {
    },
};

/**
 * @property {number} chatId
 * @property {string} parseMode
 * @property {boolean} disableWebPagePreview
 * @property {boolean} disableNotification
 * @property {number} replyToMessageId
 * @property {Object} replyMarkup
 * @property {string} text
 * @constructor
 */
Parameters.Message = function () {
    this.init.apply(this, arguments);
};
Parameters.Message.prototype = {
    /**
     *
     * @param {Object} obj
     * @param {number} obj.chatId
     * @param {string} obj.parseMode
     * @param {boolean} obj.disableWebPagePreview
     * @param {boolean} obj.disableNotification
     * @param {number} obj.replyToMessageId
     * @param {Object} obj.replyMarkup
     * @param {string} obj.text
     */
    init: function (obj) {
        tmpObj = Object.assign({
            text: null,
            chatId: null,
            parseMode: null,
            disableWebPagePreview: null,
            disableNotification: null,
            replyToMessageId: null,
            replyMarkup: null,
        }, obj);

        Object.assign(this, tmpObj);
    },
};

/**
 * @property {number} chatId
 * @property {number} messageId
 * @property {number} inlineMessageId
 * @property {Object} replyMarkup
 * @constructor
 */
Parameters.MessageReplyMarkup = function () {
    this.init.apply(this, arguments);
};
Parameters.MessageReplyMarkup.prototype = {
    /**
     *
     * @param {Object} obj
     * @property {number} obj.chatId
     * @property {number} obj.messageId
     * @property {number} obj.inlineMessageId
     * @property {Object} obj.replyMarkup
     */
    init: function (obj) {
        tmpObj = Object.assign({
            chatId: null,
            messageId: null,
            inlineMessageId: null,
            replyMarkup: null,
        }, obj);

        Object.assign(this, tmpObj);
    },
};


Update = function () {
    this.init.apply(this, arguments);
};
Update.prototype = {
    /**
     *
     * @param {Object} update
     * @param {Bot} bot
     */
    init: function (update, bot) {
        this.raw_update = update;
        if (this.isMessage()) {
            this.message = new Message(this.raw_update.message);
        } else {
            this.message = null;
        }
        /**
         * @name Update#bot
         * @type {Bot|null}
         */
        this.bot = bot || null;
    },
    setBot: function (bot) {
        this.bot = bot;
    },
    /**
     *
     * @returns {Bot}
     */
    getBot: function () {
        return this.bot;
    },
    isMessage: function () {
        if (this.raw_update.hasOwnProperty('message')) {
            return true;
        }

        return false;
    },
    isCallbackQuery: function () {
        if (this.raw_update.hasOwnProperty('callback_query')) {
            return true;
        }

        return false;
    },
    isCommand: function () {
        if (this.isMessage() && this.raw_update.message.hasOwnProperty('entities')) {
            var is_command = this.raw_update.message.entities.some(function (e) {
                return e.type === 'bot_command';
            });

            return is_command;
        }

        return false;
    },
    /**
     *
     * @returns {Message|boolean}
     */
    getMessage: function () {
        if (this.isMessage()) {
            return this.message;
        }

        if (this.isCallbackQuery()) {
            return this.getCallbackQuery().getMessage();
        }

        return false;
    },
    /**
     *
     * @returns {CallbackQuery|boolean}
     */
    getCallbackQuery: function () {
        if (this.isCallbackQuery()) {
            return new CallbackQuery(this.raw_update.callback_query);
        }

        return false;
    },
};

HandlerCommand = function () {
    Handler.apply(this, arguments);
};
HandlerCommand.prototype = Object.create(Handler.prototype);
HandlerCommand.prototype.constructor = HandlerCommand;
HandlerCommand.prototype.init = function (commandName, returnMessage) {
    this.commandName = commandName;
    this.returnMessage = returnMessage;
};
HandlerCommand.prototype.getCommandName = function () {
    return this.commandName;
};
HandlerCommand.prototype.check = function () {
    update = this.getUpdate();
    if (update.isCommand() && update.getMessage().getText().indexOf("/" + this.commandName) === 0) {
        return true;
    }

    return false;
};
HandlerCommand.prototype.execute = function () {
    if (typeof this.returnMessage === "function") {
        message = this.returnMessage(this);
        if (typeof message === "string") {
            message = new Parameters.Message({text: message});
        }
    } else {
        message = new Parameters.Message({text: this.returnMessage});
    }

    this.getUpdate().getBot().sendMessage(message);
};

/**
 *
 * @class
 */
HandlerCallback = function () {
    Handler.apply(this, arguments);
};
HandlerCallback.prototype = Object.create(Handler.prototype);
HandlerCallback.prototype.constructor = HandlerCommand;
HandlerCallback.prototype.init = function (queryStartWith, handlerFunction) {
    this.queryStartWith = queryStartWith;
    this.handlerFunction = handlerFunction;
};
HandlerCallback.prototype.getQueryStartWith = function () {
    return this.queryStartWith;
};
HandlerCallback.prototype.check = function () {
    update = this.getUpdate();
    if (update.isCallbackQuery() && update.getCallbackQuery().getData().indexOf(this.queryStartWith) === 0) {
        return true;
    }

    return false;
};
HandlerCallback.prototype.execute = function () {
    if (typeof this.handlerFunction === "function") {
        message = this.handlerFunction(this.getUpdate().getCallbackQuery(), this);
    } else {
        message = new Parameters.Message({text: this.handlerFunction});
    }

    this.getUpdate().getBot().sendMessage(message);
};

/**
 * @class
 */
HandlerCommandWithParams = function () {
    Handler.apply(this, arguments);
};

HandlerCommandWithParams.prototype = Object.create(Handler.prototype);
HandlerCommandWithParams.prototype.constructor = HandlerCommand;
/**
 * @param commandName
 * @param param
 * @param handlerFunction
 * @param errorHandlerFunction
 * @param {Object} options Options
 * @param {Boolean} options.exceptByFirstError
 * @param {String|RegExp} options.separator
 */
HandlerCommandWithParams.prototype.init = function (commandName, param, handlerFunction, errorHandlerFunction, options) {
    this.commandName = commandName;
    /**
     * @type {HandlerCommandWithParams.Param}
     */
    this.param = param;
    this.options = options || {};
    this.options = Object.assign({
        exceptByFirstError: false,
        separator: /\ +/,
    }, this.options);

    this.commandParams = null;

    this.returnObj = {};
    this.returnObjErrors = [];

    this.handlerFunction = handlerFunction;
    this.errorHandlerFunction = errorHandlerFunction;
};
HandlerCommandWithParams.prototype.setReturnObjParam = function (name, value) {
    this.returnObj[name] = value;
};
HandlerCommandWithParams.prototype.addReturnObjError = function (paramName, text) {
    this.returnObjErrors.push({paramName: paramName, errorText: text});
};
HandlerCommandWithParams.prototype.getCommandName = function () {
    return this.commandName;
};
HandlerCommandWithParams.prototype.check = function () {
    update = this.getUpdate();
    if (update.isCommand() && update.getMessage().getText().indexOf("/" + this.commandName) === 0) {
        return true;
    }

    return false;
};
HandlerCommandWithParams.prototype.sliceCommandParams = function (start) {
    this.commandParams = this.commandParams.slice(start);

    return this.commandParams;
};
HandlerCommandWithParams.prototype.execute = function () {
    text = this.getUpdate().getMessage().getText();
    params = text.split(this.options.separator);
    params.shift();
    this.commandParams = params;

    if (this.param.evaluate(this)) {
        message = this.handlerFunction(this.returnObj, this);
    } else {
        message = this.errorHandlerFunction(this.returnObj, this.returnObjErrors, this);
    }

    this.getUpdate().getBot().sendMessage(message);
};

HandlerCommandWithParams.Param = function () {
    this.init.apply(this, arguments);
};
HandlerCommandWithParams.Param.prototype = {
    /**
     *
     * @param {Object} options
     * @param {string} options.paramName
     * @param {string} options.errorText
     * @param {string} options.errorNotSetText
     * @param {boolean} options.mutableParams
     * @param {boolean} options.required
     * @param {string|boolean|number} options.defaultValue
     * @param {[HandlerCommandWithParams.Param]} params
     */
    init: function (options, params) {
        this.options = options || {};
        this.options = Object.assign({
            mutableParams: false,
            required: true,
            errorNotSetText: "Param is not set!",
        }, this.options);
        this.params = params || [];
    },
    /**
     *
     * @param {string} commandName
     * @return {HandlerCommandWithParams.Param|boolean}
     */
    getParamByName: function (commandName) {
        for (var i = 0; i < this.params.length; i++) {
            if (this.params[i].getParamName() === commandName) {
                return this.params[i];
            }
        }

        return false;
    },
    getParamName: function () {
        return this.options.paramName;
    },
    isRequired: function () {
        return this.options.required;
    },
    /**
     *
     * @param {[]} commandParams
     * @param {HandlerCommandWithParams} handler
     */
    evaluate: function (handler) {
        result = true;

        if (handler.commandParams.length === 0) {
            this.setNotSetError(handler);
            return false;
        }

        if (this.options.mutableParams) {
            mutableResult = {};
            for (var j = 0; j < this.getMaxCountOfParams(); j++) {
                for (var i = 0; i < this.params.length; i++) {
                    if (typeof mutableResult[this.params[i].getParamName()] !== "undefined" && mutableResult[this.params[i].getParamName()]) {
                        continue;
                    }

                    if (handler.commandParams.length !== 0 && this.params[i].check(handler)) {
                        handler.setReturnObjParam(this.params[i].getParamName(), this.params[i].evaluate(handler));
                        mutableResult[this.params[i].getParamName()] = true;
                        handler.sliceCommandParams(this.params[i].getMaxCountOfParamsToDelete());
                    } else {
                        mutableResult[this.params[i].getParamName()] = false;
                    }
                }
            }

            for (var prop in mutableResult) {
                /**
                 *
                 * @type {HandlerCommandWithParams.Param} tmpParam
                 */
                tmpParam = this.getParamByName(prop);

                if (mutableResult[prop]) {
                    result = result && mutableResult[prop];
                } else {
                    try {
                        dafault = tmpParam.getDefaultValue();
                        handler.setReturnObjParam(prop, dafault);

                        result = result && true;
                    } catch (e) {
                        if (tmpParam.isRequired()) {
                            tmpParam.setNotSetError(handler);
                            result = result && mutableResult[prop];
                        } else {
                            result = result && true;
                        }
                    }
                }
            }

            if (handler.options.exceptByFirstError && !result) {
                return false;
            }
        } else {
            for (var i = 0; i < this.params.length; i++) {
                if (handler.commandParams.length === 0) {
                    try {
                        dafault = this.params[i].getDefaultValue();
                        handler.setReturnObjParam(this.params[i].getParamName(), dafault);
                    } catch (e) {
                        if (this.params[i].isRequired()) {
                            this.params[i].setNotSetError(handler);
                            result = result && false;
                        }
                    }

                    continue;
                }

                if (this.params[i].check(handler)) {
                    handler.setReturnObjParam(this.params[i].getParamName(), this.params[i].evaluate(handler));
                    handler.sliceCommandParams(this.params[i].getMaxCountOfParamsToDelete());
                } else {
                    try {
                        dafault = this.params[i].getDefaultValue();
                        handler.setReturnObjParam(this.params[i].getParamName(), dafault);
                        handler.sliceCommandParams(this.params[i].getMaxCountOfParamsToDelete());


                        result = result && true;
                    } catch (e) {
                        if (this.params[i].isRequired()) {
                            this.params[i].setNotSetError(handler);
                            result = result && false;
                        }
                    }
                }

                if (handler.options.exceptByFirstError && !result) {
                    return false;
                }
            }
        }

        return result;
    },
    check: function (handler) {
        return true;
    },
    setErrors: function (handler) {

    },
    getDefaultValue: function () {
        if (typeof this.options.defaultValue !== 'undefined') {
            if (typeof this.options.defaultValue === "function") {
                dafaultValue = this.options.defaultValue();
            } else {
                dafaultValue = this.options.defaultValue;
            }

            return dafaultValue;
        } else {
            throw "Default value is not set.";
        }
    },
    getMaxCountOfParams: function () {
        result = 0;
        for (var i = 0; i < this.params.length; i++) {
            result += this.params[i].getMaxCountOfParams();
        }

        return result;
    },
    getMaxCountOfParamsToDelete: function () {
        return 0;
    },
    setNotSetError: function (handler) {
        if (this.options.required) {
            handler.addReturnObjError(this.options.paramName, this.options.errorNotSetText);
        }
    }
};

HandlerCommandWithParams.ParamString = function () {
    HandlerCommandWithParams.Param.apply(this, arguments);
};
HandlerCommandWithParams.ParamString.prototype = Object.create(HandlerCommandWithParams.Param.prototype);
HandlerCommandWithParams.ParamString.prototype.constructor = HandlerCommandWithParams.Param;
/**
 *
 * @param {HandlerCommandWithParams} handler
 * @returns {boolean}
 */
HandlerCommandWithParams.ParamString.prototype.check = function (handler) {
    localParam = handler.commandParams[0];

    if (isNaN(Number(localParam)) && typeof localParam === 'string') {
        return true;
    } else {
        return false;
    }
};
HandlerCommandWithParams.ParamString.prototype.evaluate = function (handler) {
    localParam = handler.commandParams[0];

    return localParam;
};
HandlerCommandWithParams.ParamString.prototype.getMaxCountOfParams = function () {
    return 1;
};
HandlerCommandWithParams.ParamString.prototype.getMaxCountOfParamsToDelete = function () {
    return 1;
};

HandlerCommandWithParams.ParamNumber = function () {
    HandlerCommandWithParams.Param.apply(this, arguments);
};
HandlerCommandWithParams.ParamNumber.prototype = Object.create(HandlerCommandWithParams.Param.prototype);
HandlerCommandWithParams.ParamNumber.prototype.constructor = HandlerCommandWithParams.Param;
HandlerCommandWithParams.ParamNumber.prototype.check = function (handler) {
    localParam = handler.commandParams[0];

    if (!isNaN(Number(localParam))) {
        return true;
    } else {
        return false;
    }
};
HandlerCommandWithParams.ParamNumber.prototype.evaluate = function (handler) {
    localParam = handler.commandParams[0];

    return Number(localParam);
};
HandlerCommandWithParams.ParamNumber.prototype.getMaxCountOfParams = function () {
    return 1;
};
HandlerCommandWithParams.ParamNumber.prototype.getMaxCountOfParamsToDelete = function () {
    return 1;
};

HandlerCommandWithParams.ParamDate = function () {
    HandlerCommandWithParams.Param.apply(this, arguments);
};
HandlerCommandWithParams.ParamDate.prototype = Object.create(HandlerCommandWithParams.Param.prototype);
HandlerCommandWithParams.ParamDate.prototype.constructor = HandlerCommandWithParams.Param;
/**
 *
 * @param {HandlerCommandWithParams} handler
 * @returns {boolean}
 */
HandlerCommandWithParams.ParamDate.prototype.check = function (handler) {
    localParam = handler.commandParams[0];

    if (localParam) {
        rx = /^(\d?\d)(?:[\/.]\d?\d(?:[\/.](?:\d\d)?\d\d)?)?$/;
        match = localParam.match(rx);

        if (match) {
            day = match[1];
            if (day <= 31 && day > 0) {
                return true;
            }
        }
    }

    return false;
};
HandlerCommandWithParams.ParamDate.prototype.evaluate = function (handler) {
    localParam = handler.commandParams[0];

    rx = /(\d?\d)(?:[\/.](\d?\d)(?:[\/.]((?:\d\d)?\d\d))?)?/;
    match = localParam.match(rx);
    date = {'day': 0, 'month': 0, 'year': 0};

    match.shift();
    if (day = match.shift()) {
        date.day = day;

        if (month = match.shift()) {
            date.month = month;

            if (year = match.shift()) {
                date.year = year;
            }
        }
    }

    now = new Date();
    if (date.year == 0) {
        date.year = now.getFullYear();
    }

    if (date.month == 0) {
        date.month = now.getMonth() + 1;
    }

    if (date.month <= 9) {
        date.month = "0" + +date.month;
    }

    if (date.day <= 9) {
        date.day = "0" + +date.day;
    }

    if (date.year.length == 2) {
        date.year = "20" + date.year;
    }

    return Utilities.formatString("%s/%s/%s", date.day, date.month, date.year);
};
HandlerCommandWithParams.ParamDate.prototype.getMaxCountOfParams = function () {
    return 1;
};
HandlerCommandWithParams.ParamDate.prototype.getMaxCountOfParamsToDelete = function () {
    return 1;
};

HandlerCommandWithParams.ParamTime = function () {
    HandlerCommandWithParams.Param.apply(this, arguments);
};
HandlerCommandWithParams.ParamTime.prototype = Object.create(HandlerCommandWithParams.Param.prototype);
HandlerCommandWithParams.ParamTime.prototype.constructor = HandlerCommandWithParams.Param;
HandlerCommandWithParams.ParamTime.prototype.check = function (handler) {
    localParam = handler.commandParams[0];

    rx = /^(\d+(?:[.,]\d+)?)([hmчм]?)$/;
    match = localParam.match(rx);
    if (match) {
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
HandlerCommandWithParams.ParamTime.prototype.evaluate = function (handler) {
    localParam = handler.commandParams[0];

    rx = /^(\d+(?:[.,]\d+)?)([hmчм]?)$/;
    match = localParam.match(rx);
    obj = {};
    obj.time = match[1];
    obj.dimension = match[2];

    if (obj.dimension == 'ч' || obj.dimension == '') {
        obj.dimension = 'h';
    }

    if (obj.dimension == 'м') {
        obj.dimension = 'm';
    }

    if (obj.dimension == 'm') {
        obj.dimension = 'h';
        obj.time = obj.time / 60;
    }

    obj.time = String(obj.time).replace(".", ",");

    return obj;
};
HandlerCommandWithParams.ParamTime.prototype.getMaxCountOfParams = function () {
    return 1;
};
HandlerCommandWithParams.ParamTime.prototype.getMaxCountOfParamsToDelete = function () {
    return 1;
};

HandlerCommandWithParams.ParamMoneyWithExchange = function () {
    HandlerCommandWithParams.Param.apply(this, arguments);
};
HandlerCommandWithParams.ParamMoneyWithExchange.prototype = Object.create(HandlerCommandWithParams.Param.prototype);
HandlerCommandWithParams.ParamMoneyWithExchange.prototype.constructor = HandlerCommandWithParams.Param;
HandlerCommandWithParams.ParamMoneyWithExchange.prototype.check = function (handler) {
    localParam = handler.commandParams[0];

    if (localParam) {
        rx = /^(\d+(?:[.,]\d+)?)(?:\*(\d+(?:[.,]\d+)?))?$/;
        match = localParam.match(rx);
        if (match) {
            return true;
        }
    }

    return false;
};
/**
 *
 * @param commandParams
 * @param handler
 * @returns {{}|*}
 */
HandlerCommandWithParams.ParamMoneyWithExchange.prototype.evaluate = function (handler) {
    localParam = handler.commandParams[0];

    rx = /^(\d+(?:[.,]\d+)?)(?:\*(\d+(?:[.,]\d+)?))?$/;
    match = localParam.match(rx);
    obj = {};
    obj.sum = match[1];
    obj.sum = obj.sum.replace(".", ",");
    obj.sumInt = obj.sum.replace(",", ".");
    if (match[2] != null) {
        obj.rate = match[2];
        obj.rate = obj.rate.replace(".", ",");
        obj.rateInt = obj.rate.replace(",", ".");
    } else {
        obj.rate = "";
        obj.rateInt = 1;
    }

    if (obj.rate !== "") {
        obj.sum = "=" + String(obj.sum) + "*" + String(obj.rate);
        obj.sumDisplay = obj.sumInt * obj.rateInt;
    } else {
        obj.sumDisplay = obj.sumInt;
    }

    return obj;
};
HandlerCommandWithParams.ParamMoneyWithExchange.prototype.getMaxCountOfParams = function () {
    return 1;
};
HandlerCommandWithParams.ParamMoneyWithExchange.prototype.getMaxCountOfParamsToDelete = function () {
    return 1;
};

HandlerCommandWithParams.ParamValueFromListWithSynonymous = function () {
    HandlerCommandWithParams.Param.apply(this, arguments);
};
HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype = Object.create(HandlerCommandWithParams.Param.prototype);
HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype.constructor = HandlerCommandWithParams.Param;
HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype.check = function (handler) {
    localParam = handler.commandParams[0];

    keys = Object.keys(this.options.valueList);

    localParam = localParam.toLowerCase();
    that = this;
    value = null;
    keys.some(function (item, index, array) {
        if (that.options.valueList[item].indexOf(localParam) !== -1) {
            value = item;

            return;
        }
    });

    if (value !== null) {
        this._value = value;
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
HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype.evaluate = function (handler) {
    localParam = handler.commandParams[0];

    return this._value;
};
HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype.getMaxCountOfParams = function () {
    return 1;
};
HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype.getMaxCountOfParamsToDelete = function () {
    return 1;
};

HandlerCommandWithParams.ParamDescription = function () {
    HandlerCommandWithParams.Param.apply(this, arguments);
};
HandlerCommandWithParams.ParamDescription.prototype = Object.create(HandlerCommandWithParams.Param.prototype);
HandlerCommandWithParams.ParamDescription.prototype.constructor = HandlerCommandWithParams.Param;
HandlerCommandWithParams.ParamDescription.prototype.check = function (handler) {
    localParam = handler.commandParams[0];

    if (handler.commandParams.length > 0) {
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
HandlerCommandWithParams.ParamDescription.prototype.evaluate = function (handler) {
    this._max_count_of_params = handler.commandParams.length;

    return handler.commandParams.join(' ');
};
HandlerCommandWithParams.ParamDescription.prototype.getMaxCountOfParams = function () {
    return this._max_count_of_params;
};
HandlerCommandWithParams.ParamDescription.prototype.getMaxCountOfParamsToDelete = function () {
    return this._max_count_of_params;
};

HandlerCommandWithParams.ParamNamed = function () {
    HandlerCommandWithParams.Param.apply(this, arguments);
};
HandlerCommandWithParams.ParamNamed.prototype = Object.create(HandlerCommandWithParams.Param.prototype);
HandlerCommandWithParams.ParamNamed.prototype.constructor = HandlerCommandWithParams.Param;
HandlerCommandWithParams.ParamNamed.prototype.check = function (handler) {
    firstParam = handler.commandParams[0];
    secondParam = handler.commandParams[1];

    if (!firstParam || !secondParam) {
        return false;
    }

    if (this.options.names.indexOf(firstParam) !== -1) {
        return this.options.param.check({commandParams: [secondParam]});
    }

    return false;
};
/**
 *
 * @param commandParams
 * @param handler
 * @returns {{}|*}
 */
HandlerCommandWithParams.ParamNamed.prototype.evaluate = function (handler) {
    return this.options.param.evaluate({commandParams: [handler.commandParams[1]]});
};
HandlerCommandWithParams.ParamNamed.prototype.getMaxCountOfParams = function () {
    return 2;
};
HandlerCommandWithParams.ParamNamed.prototype.getMaxCountOfParamsToDelete = function () {
    return 2;
};

/**
 *
 * @constructor
 */
HandlerCommandWithParams.ParamPhoneNumber = function () {
    HandlerCommandWithParams.Param.apply(this, arguments);
};
HandlerCommandWithParams.ParamPhoneNumber.prototype = Object.create(HandlerCommandWithParams.Param.prototype);
HandlerCommandWithParams.ParamPhoneNumber.prototype.constructor = HandlerCommandWithParams.Param;
HandlerCommandWithParams.ParamPhoneNumber.prototype.check = function (handler) {
    localParam = handler.commandParams[0];

    if (localParam) {
        rx = /^(?:\+?(?:38))?(0\d{9,9})$/;
        match = localParam.match(rx);
        if (match) {
            return true;
        }
    }

    return false;
};
/**
 *
 * @param commandParams
 * @param handler
 * @returns {{}|*}
 */
HandlerCommandWithParams.ParamPhoneNumber.prototype.evaluate = function (handler) {
    localParam = handler.commandParams[0];

    rx = /^(?:\+?(?:38))?(0\d{9,9})$/;
    match = localParam.match(rx);
    number = match[1];

    return '38' + number;
};
HandlerCommandWithParams.ParamPhoneNumber.prototype.getMaxCountOfParams = function () {
    return 1;
};
HandlerCommandWithParams.ParamPhoneNumber.prototype.getMaxCountOfParamsToDelete = function () {
    return 1;
};
