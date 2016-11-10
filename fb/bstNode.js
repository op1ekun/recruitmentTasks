class BSTNode {

    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }

    /**
     * Add a new value to the tree, add another node.
     *
     * @param {Number} newValue  the new value to be added to the tree
     */
    add(newValue) {

        /**
         * Recursively finds the correct parent node in the tree
         * to add a new node element with the new given value.
         *
         * Prone to call stack overflow due to lack of TCO implementation.
         * http://www.ecma-international.org/ecma-262/6.0/#sec-tail-position-calls
         *
         * http://programmers.stackexchange.com/questions/179863/performance-recursion-vs-iteration-in-javascript
         *
         * @param   {Object} parent     the current parent node
         * @param   {Number} value      the value to be added to the tree
         * @returns {Object}            the found node
         */
        function getParent(parent, value) {

            if (value < parent.value &&
                parent.left != null) {

                return getParent(parent.left, value);
            } else if (value > parent.value &&
                parent.right != null) {

                return getParent(parent.right, value);
            }

            return parent;
        }

        // always start with a root
        const currentParent = getParent(this, newValue);
        // create a new BSTNode instance
        const newBSTNode = new this.constructor(newValue);

        // once current parent node is known
        // append the new node to either left or right branch
        if (newValue < currentParent.value) {
            currentParent.left = newBSTNode;
        } else if (newValue > currentParent.value) {
            currentParent.right = newBSTNode;
        }
    }

    find(value) {

        function findNode(parent, node, searchedValue) {
            const result = {
                parent: node,
                current: null,
            };

            if (searchedValue < node.value &&
                node.left) {

                result.parent = node;
                result.current = node.right;

                return findNode(node, node.left, searchedValue);
            } else if (searchedValue > node.value &&
                node.right) {

                result.parent = node;
                result.current = node.right;

                return findNode(node, node.right, searchedValue);
            } else if (searchedValue === node.value) {
                result.parent = parent;
                result.current = node;
            }

            return result;
        }

        return findNode(null, this, value);
    }

    /**
     * Checks if tree contains a given value.
     *
     * @param   {Number}    value   the given value
     * @returns {Boolean}           true when the value is found
     *                              false when value is not found
     */
    contains(value) {

        /**
         * Recursively checks if the value is contained in the tree.
         *
         * Prone to call stack overflow due to lack of TCO implementation.
         * http://www.ecma-international.org/ecma-262/6.0/#sec-tail-position-calls
         *
         * http://programmers.stackexchange.com/questions/179863/performance-recursion-vs-iteration-in-javascript
         *
         * @param   {Number}    value   searched value
         * @returns {Boolean}           true when value is found
         *                              false when value is NOT found
         */
        function findValue(node, searchedValue) {

            if (searchedValue < node.value &&
                node.left) {

                return findValue(node.left, searchedValue);
            } else if (searchedValue > node.value &&
                node.right) {

                return findValue(node.right, searchedValue);
            } else if (searchedValue === node.value) {
                return true;
            }

            return false;
        }

        return findValue(this, value);
    }

    traverseInOrder(processor) {

        function inOrder(node) {

            if (node.left != null) {
                inOrder(node.left);
            }

            processor.call(this, node);

            if (node.right != null) {
                inOrder(node.right);
            }
        }

        inOrder(this);
    }

    traversePostOrder(processor) {

        function postOrder(node) {
            processor(node);

            if (node.left) {
                postOrder(node.left);
            }

            if (node.right) {
                postOrder(node.right);
            }
        }

        postOrder(this);
    }

    size() {
        let length = 0;

        this.traverseInOrder(() => {
            length++;
        });

        return length;
    }

    toArray() {
        const result = [];

        this.traverseInOrder((node) => {
            result.push(node.value);
        });

        return result;
    }

    toString() {
        return this.toArray().join();
    }

    remove(value) {
        const result = this.find(value);
        const parent = result.parent;
        const current = result.current;

        if (current) {
            // remove a leaf
            if (!current.left && !current.right) {
                if (current.value < parent.value) {
                    parent.left = null;
                } else if (current.value > parent.value) {
                    parent.right = null;
                }

            // remove a node with only one child
            } else if (current.left && !current.right) {
                parent.left = current.left;
            } else if (!current.left && current.right) {
                parent.right = current.right;
            // remove a node with two children
            } else if (current.left != null &&
                current.right != null) {

                // look for minimum successor in the right tree
                const searchedValue = current.right.toArray()[0];
                const minSuccessor = current.right.find(searchedValue);

                if (minSuccessor.parent) {
                    minSuccessor.parent.remove(searchedValue);
                } else {
                    current.right.remove(searchedValue);
                }

                current.value = searchedValue;
            }

        } else {
            console.log('CANNOT remove value - node NOT found');
        }

    }

    // invert() {

    // }

    // FIXME can't do without a pointer to the parent
    // Do I want to include parent pointer in every node?
    rotate(direction = 'left') {

    }

    // also known as reverse, which is also mistaken for invert (omigosh)
    mirror() {

        function reverse(node) {
            let tmp;

            if (node) {
                tmp = node.left;
                node.left = reverse(node.right);
            }

            if (node) {
                node.right = reverse(tmp);
            }

            return node;
        }

        return reverse(this);
    }

    // balance() {

    // }
}
