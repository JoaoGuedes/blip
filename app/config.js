rivets.configure({
    // Attribute prefix in templates
    prefix: 'data-rv' //HTML5 W3C compliant
});

rivets.formatters.append = function(value, append) {    //Appends value with append string
    return value + append;
};

rivets.formatters.negate = function(value) {
    return !value;
};
