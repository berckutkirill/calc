class Subsect {
    constructor(data, classParams, keyParams, dopSelects) {
        this.data = data;
        this.classParams = classParams;
        this.keyParams = keyParams;
        this.dopSelects = dopSelects ? dopSelects : [];
    }

    repairParams(form) {
        const repF = function ($el) {
            const val = JSON.parse($el.attr('data-val'));
            $el.val(val);
        };
        form.find(`.${this.classParams} select`).each(function (k, v) {
            repF($(this));
        });
        this.dopSelects.forEach(function ($el) {
            repF($el);
        })
    }
    procF($el, selected, clearVal) {
        const name = $el.attr('name');
        const isBool = isBoolSelect($el);
        let value = $el.val();

        selected[name] = [];
        if (Array.isArray(value)) {
            if (value.length === 0 && isBool) {
                selected[name] = [false];
            } else {
                for (const i in value) {
                    selected[name].push(isBool ? textToBool(value[i]) : isNumeric(value[i]) ? parseInt(value[i]) : value[i]);
                }
            }
        } else {
            selected[name].push(textToBool(isBool ? textToBool(value) : isNumeric(value) ? parseInt(value) : value));
        }
        $el.attr('data-val', JSON.stringify(value));
        if(clearVal) {
            $el.val(null);
        }
    };
    processParams(form) {
        const selected = {};
        const self =this;

        this.dopSelects.forEach(function ($el) {
            self.procF($el, selected);
        });
        $(`.${this.classParams} select`).each(function (k, v) {
            self.procF($(this), selected, true);
        });
        const it = this.data[this.keyParams].values.filter(function (item) {
            for (const i in selected) {
                const id = typeof item[i] === "object" ? item[i] !== null ? item[i]._id : item[i] : null;
                if(id === null) {
                    continue;
                }
                if (Array.isArray(selected[i]) && selected[i].indexOf(id) === -1) {
                    return false;
                }
            }
            return true;
        });
        form.find(`input[name="${this.keyParams}"]`).remove();
        it.forEach(function (item) {
            form.append(`<input type='hidden' name='${self.keyParams}' value='${item._id}' />`);
        });
    }
}

class Nodes {
    constructor(data, activeElements, filter) {
        this.data = data;
        this.onChangeCb = {};
        this.activeElements = activeElements;
        this.filter = filter;
    }

    initRelations() {
        const self = this;
        self.activeElements.forEach(function (item) {
            if (!item.node) {
                item.node = `${item.parent}_${item.child}`;
            }
            item['prefix'] = item['prefix'] ? item['prefix'] : '';
            if (self.data[item.node] && self.data[item.node].values) {
                self.setRelations(item);
                $(`#${item['prefix']}${item['parent']}`).change(function () {
                    self.setRelations(item);
                });
            }
        });
    }
    runChange(name) {
        if(this.onChangeCb[name]) {
            this.onChangeCb[name].call(this);
        }
    }
    onChange(name, func) {
        this.onChangeCb[name]= func;
    };
    filterChilds(prefix, parent, child, _id, values) {
        const el_child = $(`#${prefix}${child}`);
        const selectedValue = el_child.val();
        $(`#${prefix}${child} option`).prop('disabled', true);

        let clearSelected = true;
        values.map(function (item) {
            if (item[parent] && item[parent] === _id) {
                if (selectedValue === item[child]) {
                    clearSelected = false;
                }
                $(`#${prefix}${child} option[value="${item[child]}"]`).prop('disabled', false);
            }
        });
        if (clearSelected && selectedValue !== null) {
            el_child.val(null).change();

        }
        this.runChange(`${prefix}${child}`);
    }

    selectChilds(prefix, parent, child, _id, values) {
        $(`#${prefix}${child}`).val(null);
        values.map(function (item) {
            if (item[parent] && item[parent] === _id) {
                $(`#${prefix}${child} option[value="${item[child]}"]`).prop('selected', true);
            }
        });
    }

    setRelations(item) {
        const self = this;

        const prefix = item['prefix'];
        const parent = item['parent'];
        const child = item['child'];
        const values = self.data[item.node].values;
        const _id = $(`#${prefix}${parent}`).val();
        if (self.filter) {
            self.filterChilds(prefix, parent, child, _id, values);
        } else {
            self.selectChilds(prefix, parent, child, _id, values);
        }

    }
}

const Helper = {
    checkIsOut: function (els, target) {
        for (let i = 0; i < els.length; i++) {
            const el = els[i];
            if (el.is(target) || el.has(target).length > 0) {
                return false;
            }
        }
        return true;

    },
    closeOnOut: function (f_generator, f) {
        const self = this;
        $(document).mouseup(function (e) {
            if (self.checkIsOut(f_generator.call(this), e.target)) {
                if (f) {
                    f.call(this)
                } else {
                    el.hide();
                }
            }
        });
    },
    isDiff: function (item1, item2) {
        for (let i in item1) {
            if (item1[i] === null) {
                item1[i] = undefined;
            }
            if (JSON.stringify(item1[i]) !== JSON.stringify(item2[i])) {
                return true;
            }
        }
        return false;
    },
    post: function (url, data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                data: data,
                method: 'post'
            }).always(function (res) {
                try {
                    if (res.error) {
                        return reject(res)
                    }
                    resolve(res);
                } catch (e) {
                    reject(res)
                }
            })
        })
    }
};

class EditTable {
    constructor(table, selects, data, mainClass) {
        const self = this;
        this.data = data;
        this.mainClass = mainClass;
        this.table = table;
        this.currentTD = null;
        this.selects = selects;
        Helper.closeOnOut(function () {
            return [self.table.find('[data-code].active'), self.selects.find('.show')];
        }, function () {
            self.hideSelect();
        });
        this.init();
    }

    hideSelect() {
        this.table.find('[data-code].active').removeClass('active');
        this.selects.removeClass('show');
    }

    showSelect() {
        const self = this;
        const coordX = self.currentTD.position().left + 16;
        const coordY = self.currentTD.position().top + self.currentTD.outerHeight();
        const rowId = self.currentTD[0].dataset.id;
        const propertyCode = self.currentTD.data('code');
        for (let i = 0; i < self.selects.length; i++) {
            if (propertyCode === self.selects[i].dataset.code) {
                $(self.selects[i]).addClass('show');
                $(self.selects[i]).css({left: coordX, top: coordY});
                self.currentTD.addClass('active');
                self.setSelected($(self.selects[i]), rowId);
                break;
            }
        }
    }

    setTd(data_id, text) {
        data_id = data_id ? data_id : '';
        text = text ? text : '';
        this.currentTD.attr('data-id', data_id);
        this.currentTD.find('.text').text(text);
        if (data_id) {
            this.enableTDClear();
        }
    }

    enableTDClear() {
        this.currentTD.find('.clear').removeClass('hidden');
    }

    disableTDClear() {
        this.currentTD.find('.clear').addClass('hidden');
    }

    parseItemFromRow() {
        const tr = this.currentTD.closest('.trow');
        const item = {};
        item['_id'] = tr.attr('data-id');
        tr.find('[data-code]').each(function () {
            item[$(this).attr('data-code')] = $(this).attr('data-id') ? {
                _id: $(this).attr('data-id'),
                title: $(this).find('.text').text()
            } : null;
        });
        return item;
    }

    checkSave() {
        const item = this.parseItemFromRow();
        let changed = false;
        for (const i in this.data) {
            if (this.data[i]['_id'] === item._id) {
                changed = Helper.isDiff(item, this.data[i]);
                break;
            }
        }
        if (changed) {
            this.currentTD.closest('.trow').find('.save').removeClass('disabled');
        } else {
            this.currentTD.closest('.trow').find('.save').addClass('disabled');
        }
    }

    setListeners() {
        const self = this;
        for (let i = 0; i < self.selects.length; i++) {
            $(self.selects[i]).find('input').on('click', function (e) {
                if (self.currentTD && self.currentTD.attr('data-id') !== e.target.value) {
                    self.setTd(e.target.value, $(this).next().text());
                    self.checkSave();
                }
            });
        }
        self.table.find('.save').on('click', function (e) {
            if ($(this).hasClass('disabled')) {
                return;
            }
            self.currentTD = $(this).closest('.td');
            self.saveItem($(this));
        });
        self.table.find('.remove').on('click', function (e) {
            if ($(this).hasClass('disabled')) {
                return;
            }
            self.currentTD = $(this).closest('.td');
            self.removeItem($(this));
        })
    }

    clearTD() {
        this.setTd();
        this.disableTDClear();
        this.checkSave();
    }

    removeItem(el) {
        const self = this;
        const item = this.parseItemFromRow();
        Helper.post(`/delete${self.mainClass}`, {_id: item._id}).then(function (response) {
            self.currentTD.closest('.trow').remove();
            for (const i in self.data) {
                if (self.data[i]['_id'] === item._id) {
                    self.data.slice(i, 1);
                    break;
                }
            }
        }, function (response) {
            if (response.error) {
                el.removeClass('disabled');
                self.showError(response.message, el);
            }
        });
    }

    saveItem(el) {
        const self = this;
        const item = this.parseItemFromRow();
        const data = {};
        for (let i in item) {
            if (item[i] && item[i]['_id']) {
                data[i] = item[i]['_id'];
            } else {
                data[i] = item[i];
            }
        }
        el.addClass('disabled loading');
        Helper.post(`/update${self.mainClass}`, data).then(function (response) {
            el.removeClass('loading');
        }, function (response) {
            if (response.error) {
                el.removeClass('disabled');
                self.showError(response.message, el);
            }
        });
    }

    hideError() {
        $(".error-flash-message.text-danger").hide();
    }

    showError(message, el) {
        const self = this;
        const coordX = el.offset().left + 20;
        const coordY = el.offset().top - 20;
        const errorDiv = $(".error-flash-message.text-danger");
        errorDiv.html(message);
        errorDiv.css({
            'left': coordX + "px",
            'top': coordY + "px",
        });
        errorDiv.show();
        if (self.hideErrTimeout) {

        }
        self.hideErrTimeout = setTimeout(function () {
            self.hideError();
        }, 2000);

    }

    setSelected(c_select, val) {
        c_select.find(`input`).prop('checked', false);
        c_select.find(`input[value="${val}"]`).prop('checked', true);
    }

    init() {
        const self = this;
        self.setListeners();
        this.table.find('[data-code]').on('click', function (e) {
            const active = $(this).hasClass('active');
            self.hideSelect();
            if (e.target.classList.contains('clear')) {
                self.currentTD = $(this);
                self.clearTD();
                return;
            }

            if (!active) {
                self.currentTD = $(this);
                self.showSelect();
            }
        })
    }
}

class Loader {
    constructor() {
        this.queue = [];
    }

    run() {
        this.queue.forEach(function (farr) {
            farr[0].apply(farr[1], farr[1]);
        })
    }

    onLoad(f, ctx, args) {
        this.queue.push([f, ctx, args])
    }
}

var loader = new Loader();
Handlebars.templates = [];
const partials = ['dropdownMenu'];
Handlebars.registerHelper('lookup', function (obj, field, key) {
    if (obj[field] && obj[field][key]) {
        return obj[field][key];
    }
    return obj[field];
});
Handlebars.registerHelper('if-lookup', function (obj, field, key, opts) {
    if (obj[field] && obj[field][key]) {
        return opts.fn(this);
    }
    return opts.inverse(this);

});
Handlebars.registerHelper('if_not-lookup', function (obj, field, key, opts) {
    if (obj[field] && obj[field][key]) {
        return opts.inverse(this);
    }
    return opts.fn(this);

});

Handlebars.registerHelper('if_eq', function (field1, field2, opts) {
    if (field1 === field2) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});

function init() {
    $(".ajaxForm").on('submit', function (e) {
        e.preventDefault();
        const form = $(this);

        const action = form.attr('action') ? $(this).attr('action') : location.href;
        const beforeSendF = form.attr('before-send') ? $(this).attr('before-send') : null;
        const afterSendF = form.attr('after-send') ? $(this).attr('after-send') : null;
        if (beforeSendF) {
            executeFunctionByName(beforeSendF, window, form);
        }
        Helper.post(action, $(this).serialize()).then(function (res) {
            if (afterSendF) {
                executeFunctionByName(afterSendF, window, form);
            }
        });
    });
    const promises = [];
    partials.forEach(function (tpl) {
        promises.push(getPartial(tpl));
    });
    Promise.all(promises).then(function () {
        loader.run();
    });
    $(".js-clear-next-select").on('click', function (e) {
        e.preventDefault();
        $(this).next('select').val(null).change();
    });
}

function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    if (!functionName) {
        return;
    }
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

function toPandasFormat(data) {
    const result = {headers: [], items: []};
    for (const i in data.items) {
        const item = data.items[i];
        for (const key in item) {
            if (result.headers.indexOf(key) === -1) {
                result.headers.push(key);
            }
        }
    }
    for (const i in data.items) {
        const dataItem = data.items[i];
        const item = [];
        result.headers.forEach(function (headerItem) {
            item.push(dataItem[headerItem]);
        });
        result.items.push(item);
    }
    return result;
}

function textToBool(value) {
    if (value === null || typeof value === 'undefined' || value === 'false' || value === '') {
        value = false;
    } else if (value === 'true') {
        value = true;
    } else {
        return value;
    }
    return value;
}

function isBoolSelect(select) {
    const bools = ['true', 'false'];
    let isBool = true;
    select.find('option').each(function (k, option) {
        if (bools.indexOf(option.value) === -1) {
            isBool = false;
        }
    });
    return isBool;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


function getVariants(item, exclude) {
    exclude = exclude ? exclude : ['_id', 'title', '__v'];
    if (!item || !item.values) {
        return [];
    }
    const result = {};
    const titles = {};
    item.values.forEach(function (values) {
        for (const i in values) {
            if (values[i] === null) {
                continue;
            }
            if (exclude.indexOf(i) !== -1) {
                continue;
            }
            if (!result[i]) {
                result[i] = [];
                titles[i] = {};
            }
            const fnd = result[i].find(function (item) {
                return item._id === values[i]._id
            });
            if (!fnd) {
                if (values['title'] && values['title'][i]) {
                    titles[i][values[i]] = values['title'][i];
                }
                result[i].push(values[i]);

            }
        }
    });


    for (const i in result) {
        result[i] = result[i].map(function (item) {
            if (titles[i] && titles[i][item]) {
                return {title: titles[i][item], _id: item};
            } else {
                return item;
            }
        })
    }
    return result;
}

function getPartial(tpl) {
    return new Promise(function (resolve, reject) {
        if (Handlebars.partials[tpl]) {
            return resolve(Handlebars.compile(Handlebars.partials[tpl]));
        }
        $.ajax({
            url: `/templates/partials/${tpl}.hbs`,
            dataType: "text"
        }).done(function (data) {
            Handlebars.registerPartial(tpl, data);
            return resolve(Handlebars.compile(Handlebars.partials[tpl]));

        }).fail(function (err) {
            reject(err);
        });
    })
}

function getTemplate(tpl) {
    return new Promise(function (resolve, reject) {
        if (Handlebars.templates[tpl]) {
            return resolve(Handlebars.templates[tpl]);
        }
        $.ajax({
            url: `/templates/${tpl}.hbs`,
            dataType: "text"
        }).done(function (data) {
            Handlebars.templates[tpl] = Handlebars.compile(data);
            resolve(Handlebars.templates[tpl]);
        }).fail(function (err) {
            reject(err);
        });
    })
}

function insertAsSelects(container, item, exclude, include, cb) {
    const variants = getVariants(item);
    exclude = exclude ? exclude : ['__v', 'title'];
    include = include ? include : false;
    getTemplate('select').then(function (data) {
        for (const i in variants) {
            if ((include && include.indexOf(i) === -1) || (exclude.indexOf(i) !== -1)) {
                continue;
            }
            const ctx = {};
            ctx.title = LNG.translate(i);
            ctx.multiple = 'multiple';
            ctx.code = i;
            ctx.values = [];
            for (let j = 0; j < variants[i].length; j++) {
                const variant = variants[i][j];
                if (variant === null) {
                    continue;
                }
                if (typeof item !== 'object') {
                    ctx.values.push({_id: variant, title: variant});
                }
                variant.title = variant.title ? variant.title : variant;
                variant._id = variant._id ? variant._id : variant;
                ctx.values.push(variant);
            }


            container.append(Handlebars.templates["select"](ctx));

        }
        if (cb) {
            cb.call(this);
        }
    });
}

class ActiveFilter {
    constructor(selects, data) {
        this.selects = selects;
        this.data = data;
        this.initdata = data;
        this.state = {};
        this.init();
    }

    init() {
        const self = this;
        this.selects.forEach(($el) => {
            $el.on('change', function () {
                if ($(this).val().length === 0) {
                    delete self.state[$(this).attr('name')];
                } else {
                    self.state[$(this).attr('name')] = $(this).val();
                }
                self.filterSelects();
            })
        });

    }

    filterSelects() {
        const self = this;
        let possibleItems = JSON.parse(JSON.stringify(self.data));
        for (const key in this.state) {
            const val = this.state[key];
            self.data.forEach(function (item, index) {
                if (!item || !item[key] || val.indexOf(item[key]['_id']) === -1) {
                    possibleItems[index]['disabled'] = true;
                }
            });
        }
        possibleItems = possibleItems.filter(function (item) {
            return !item['disabled'];
        });
        const variants = getVariants({values: possibleItems});
        this.selects.forEach(function ($el) {
            const name = $el.attr('name');

            $el.find('option').prop('disabled', true);
            if (variants[name] && variants[name].length) {
                variants[name].forEach(function (item) {
                    $el.find(`option[value="${item._id}"]`).prop('disabled', false);
                })
            }
        })
    }
}

$(function () {
    init();
});