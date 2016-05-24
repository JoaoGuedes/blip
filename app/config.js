rivets.configure({
    // Attribute prefix in templates
    prefix: 'data-rv' //HTML5 W3C compliant
});

rivets.binders.src = function(el, value) {                          //Bind element source to this value
    el.src = value;
};

rivets.formatters.prepend = function(value, prepend) {              //Prepends value with prepend string
    return prepend + value;
};

rivets.formatters.append = function(value, append) {              //Appends value with append string
    return value + append;
};

rivets.formatters.negate = function(value) {
    return !value;
};

rivets.formatters.filter = function(array, field, value) {          //Filter array by search string
    if (!value) {
        return array;
    }
    return array.filter(function(item) {
        return item[field].toUpperCase().indexOf(value.toUpperCase()) !== -1;
    });
};

rivets.formatters.filter_if = function(array, field, condition) {   //Filter all games if false or my games if true
    if (!array) {
        return;
    }

    if (!condition) {
        return array;
    }

    return array.filter(function(item) {
        return item[field] === condition;
    });
};
