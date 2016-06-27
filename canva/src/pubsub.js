export default class PubSub {

    constructor() {
        // store subsribers
        this.subscribers = {};
        // start unique ids from 1
        this.uniqueId = 1;
    }

    /**
     * Subscribe a single subscribe to the notification event
     * @param  {String}   notification  a notification message
     * @param  {Function} callback      subscriber's callback
     * @return {String}   id            an alplahumeric identificator the subscriber
     *                                  used to unsubscribe
     */
    subscribe(notification, callback) {
        if (!this.subscribers[notification]) {
            this.subscribers[notification] = [];
        }

        const id = this.uniqueId.toString();
        this.uniqueId++;

        this.subscribers[notification].push({
            id,
            callback,
        });

        return id;
    }

    /**
     * Publish notification, notify all the subscribers
     * @param  {String} notification    a notification message
     * @return undefined
     */
    publish(notification, ...args) {
        const list = this.subscribers[notification];

        if (!list) {
            return;
        }

        // run callback asynchronously
        setTimeout(() => {
            // loop through the list of subcsribers
            for (let i = 0, l = list.length; i < l; i++) {
                // run the callback with sin
                list[i].callback(...args);
            }
        }, 0);
    }

    /**
     * Unsubscribe a single subscriber
     * @param  {String}  id     alphanumeric id of a subscriber
     * @return {Boolean}        true if successfully removed
     *                          false if subscriber wasn't removed
     */
    unsubscribe(id) {
        for (let notification in this.subscribers) {

            for (let i = 0, l = this.subscribers[notification].length; i < l; i++) {
                if (this.subscribers[notification][i].id === id) {
                    this.subscribers[notification].splice(i, 1);
                    return true;
                }
            }
        }

        return false;
    }
}
