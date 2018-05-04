Handlebars.templates = [];
Handlebars.registerHelper('lookup', function(obj, field) {
    if(obj[field] && obj[field].title) {
        return obj[field].title;
    }
    return obj[field];
});
function init() {
    $(".ajaxForm").on('submit', function (e) {
        e.preventDefault();
        const form = $(this)

        const action = form.attr('action') ? $(this).attr('action') : location.href;
        const beforeSendF = form.attr('before-send') ? $(this).attr('before-send') : null;
        const afterSendF = form.attr('after-send') ? $(this).attr('after-send') : null;
        if(beforeSendF) {
            executeFunctionByName(beforeSendF, window, form);
        }
        $.ajax({
            url: action,
            data: $(this).serialize(),
            method: 'post'
        }).always(function (res) {
            if(afterSendF) {
                executeFunctionByName(afterSendF, window, form);
            }
        })
    });
}
function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    if(!functionName) {
        return;
    }
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}
$(function () {
    init();
});

function toPandasFormat(data) {
    const result  = {headers:[], items:[]};
    for (const i in data.items) {
        const item = data.items[i];
        for (const key in item) {
            if(result.headers.indexOf(key) === -1){
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

class Nodes {
    constructor(data, activeElements, filter) {
        this.data = data;
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
    filterChilds(prefix, parent, child, _id, values) {
        const selectedValue = $(`#${prefix}${child}`).val();
        $(`#${prefix}${child} option`).prop('disabled', true);

        let clearSelected = true;
        values.map(function (item) {
            if (item[parent] && item[parent] === _id) {
                if(selectedValue === item[child]) {
                    clearSelected = false;
                }
                $(`#${prefix}${child} option[value="${item[child]}"]`).prop('disabled', false);
            }
        });
        if(clearSelected) {
            $(`#${prefix}${child}`).val(null).change();
        }
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
        if(self.filter) {
            self.filterChilds(prefix, parent, child, _id, values);
        } else {
            self.selectChilds(prefix, parent, child, _id, values);
        }

    }
}