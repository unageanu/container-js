/**
 *
 * @param {Object} event
 */
__extend__(Envjs.defaultEventBehaviors,{

    'submit': function(event) {
        var target = event.target;
        while (target && target.nodeName !== 'FORM') {
            target = target.parentNode;
        }
        if (target && target.nodeName === 'FORM') {
            target.submit();
        }
    },
    'click': function(event) {
        // console.log('handling event target default behavior for click');
    }

});