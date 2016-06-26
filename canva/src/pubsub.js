export default class PubSub {

    constructor() {
        // store subsribers
        let subscribers = {};
        // start unique ids from 1
        let uniqueId    = 1;
    }

    /**
     * Subscribe a single subscribe to the notification event
     * @param  {String}   notification  a notification message
     * @param  {Function} callback      subscriber's callback
     * @return {String}   id            an alplahumeric identificator the subscriber
     *                                  used to unsubscribe               
     */
    subscribe(notification, callback) {
        if (!subscribers[notification]) {
            subscribers[notification] = [];
        }

        var id = uniqueId.toString();
        uniqueId++;

        subscribers[notification].push({
            id          : id,
            callback    : callback
        });

        return id;
    }
 
    /**
     * Publish notification, notify all the subscribers
     * @param  {String} notification    a notification message
     * @return undefined
     */
    publish(notification) {
        var _this   = this,
            list    = subscribers[notification],
            args    = Array.prototype.slice.call(arguments, 1);

        if (!list) {
            return;
        }

        // run callback asynchronously
        setTimeout(function() {
            // loop through the list of subcsribers
            for (var i = 0, l = list.length; i <l; i++) {
                // run the callback with sin
                list[i].callback.apply(_this, args);
            }
        }, 0);
    };
 
    /**
     * Unsubscribe a single subscriber
     * @param  {String}  id     alphanumeric id of a subscriber
     * @return {Boolean}        true if successfully removed
     *                          false if subscriber wasn't removed
     */
    unsubscribe(id) {
        for (var notification in subscribers) {

            for (var i = 0, l = subscribers[notification].length; i < l; i++) {
                if (subscribers[notification][i].id === id) {
                    subscribers[notification].splice(i, 1);
                    return true;
                }
            }
        }

        return false;
    };
}
