Handlebars.templates = [];

function init() {
    $(".ajaxForm").on('submit', function (e) {
        e.preventDefault();
        const form = $(this)

        const action = form.attr('action') ? $(this).attr('action') : location.href;
        const beforeSendF = form.attr('before-send') ? $(this).attr('before-send') : null;
        const afterSendF = form.attr('after-send') ? $(this).attr('after-send') : null;
        executeFunctionByName(beforeSendF, window, form);
        $.ajax({
            url: action,
            data: $(this).serialize(),
            method: 'post'
        }).always(function (res) {
            executeFunctionByName(afterSendF, window, form);
        })
    });
}
function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}
$(function () {
    init();
})

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

function initRelations(activeElements) {
    activeElements.forEach(function (item) {
        if (!item.node) {
            item.node = `${item.parent}_${item.child}`;
        }
        if (data[item.node] && data[item.node].values) {
            setRelations(item);
            $(`#${item['prefix']}${item['parent']}`).change(function () {
                setRelations(item);
            });
        }
    });
}

function setRelations(item) {
    const prefix = item['prefix'];
    const parent = item['parent'];
    const child = item['child'];
    const values = data[item.node].values;
    const _id = $(`#${prefix}${parent}`).val();

    $(`#${prefix}${child}`).val(null);
    values.map(function (item) {
        if (item[parent] && item[parent] === _id) {
            $(`#${prefix}${child} option[value="${item[child]}"]`).prop('selected', true);
        }
    });
}

function getVariants(item, exclude) {
    exclude = exclude ? exclude : ['_id', 'title'];
    if (!item || !item.values) {
        return [];
    }
    const result = {};
    const titles = {};
    item.values.forEach(function (values) {
        for (const i in values) {
            if (exclude.indexOf(i) !== -1) {
                continue;
            }
            if (!result[i]) {
                result[i] = [];
                titles[i] = {};
            }
            if (result[i].indexOf(values[i]) === -1) {
                if(values['title'] && values['title'][i]) {
                    titles[i][values[i]] = values['title'][i];
                }
                result[i].push(values[i]);

            }
        }
    });


    for(const i in result) {
        result[i] = result[i].map(function(item) {
            if(titles[i] && titles[i][item]) {
                return {title: titles[i][item], _id: item};
            } else {
                return item;
            }
        })
    }
    return result;
}

function getTemplate(tpl) {
    return new Promise(function (resolve, reject) {
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
function insertAsSelects(container, item, exclude) {
    const variants = getVariants(item);
    exclude = exclude ? exclude : ['__v', 'title'];
    getTemplate('select').then(function (data) {
        for (const i in variants) {
            if (exclude.indexOf(i) !== -1) {
                continue;
            }
            const ctx = {};
            ctx.title = LNG[i];
            ctx.multiple = 'multiple';
            ctx.code = i;
            ctx.values = variants[i].map(function (item) {
                if(typeof item !== 'object') {
                    return {_id: item, title:item}
                }
                item.title = item.title ? item.title : item;
                item._id = item._id ? item._id : item;
                return item;
            });
            container.append(Handlebars.templates["select"](ctx));
        }
    });
}

class Subsect {
    constructor(data, classParams, keyParams) {
        this.data = data;
        this.classParams = classParams;
        this.keyParams = keyParams;
    }
    repairParams(form) {
        form.find(`.${this.classParams} select`).each(function (k, v) {
            const val = JSON.parse($(this).attr('data-val'));
            $(this).val(val);
        })
    }
    processParams(form) {
        const selected = {};
        $(`.${this.classParams} select`).each(function (k, v) {
            const name = $(this).attr('name');
            const isBool = isBoolSelect($(this));
            let value = $(this).val();

            selected[name] = [];
            if(Array.isArray(value)) {
                if(value.length === 0 && isBool) {
                    selected[name] = [false];
                } else {
                    for(const i in value) {
                        selected[name].push(isBool ? textToBool(value[i]) : isNumeric(value[i]) ? parseInt(value[i]): value[i]);
                    }
                }
            } else {
                selected[name].push(textToBool(isBool ? textToBool(value) : isNumeric(value) ? parseInt(value): value));
            }
            $(this).attr('data-val', JSON.stringify(value));
            $(this).val(null);
        });
        const it = this.data[this.keyParams].values.filter(function (item) {
            for (const i in selected) {
                if (Array.isArray(selected[i]) && selected[i].indexOf(item[i]) === -1) {
                    return false;
                }
            }
            return true;
        });
        form.find(`input[name="${this.keyParams}"]`).remove();
        const self = this;
        it.forEach(function (item) {
            form.append(`<input type='hidden' name='${self.keyParams}' value='${item._id}' />`);
        });
    }
}