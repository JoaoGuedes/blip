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

//Lazy loading formatter
(function() {

    var listener,       //Holders listener
        placeholder,    //Holds lazy loading array
        index=0,        //Starting index
        numItems = 18,  //Load these items on every iteration
        scroll,         //Total scrolling distance run
        body,           //Body height
        TOLERANCE = 5; //IE workaround

    var scrollHandler = function(event, callback) {
        scroll = (document.body.scrollTop || window.pageYOffset) + window.innerHeight;
        body = document.body.clientHeight;
        hasReachedBottom = Math.abs(body - scroll) < Math.abs(TOLERANCE);
        if (hasReachedBottom) {  //If bottom of page was reached, trigger callback
            callback();
        }
    };

    rivets.formatters.lazy_load = function(array) {

        placeholder = array.slice(0, index+numItems);

        if (!listener) {                                        //If listener isn't installed...
            var callback = function() {
                index += numItems;                              //Add items to be fetched
                array.splice(0,0);                              //Refresh array
                if (array.length === placeholder.length) {      //All items loaded, remove listener
                    document.removeEventListener('scroll', listener);
                }
            };
            listener = function(event) {
                return scrollHandler(event, callback);
            };
            document.addEventListener('scroll', listener);      //Install listener
        }

        return placeholder;
    };

})();
