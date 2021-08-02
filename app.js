// Storage Controller
const storageCtrl = (function() {

    return {
        storeItem: function(newItem) {
            let items;

            if(localStorage.getItem('items') === null) {
                items = [];
                // Push the new Item;
                items.push(newItem);
                // Set localStorage
                localStorage.setItem('items', JSON.stringify(items));
            }else {
                items = JSON.parse(localStorage.getItem('items'));

                // Push new item
                items.push(newItem);

                // Reset localStorage
                localStorage.setItem('items', JSON.stringify(items))
            }
        },

        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            }else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                } 
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromStorage: function(selectedItemId) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(selectedItemId === item.id) {
                    items.splice(index, 1);
                } 
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const itemCtrl = (function() {
    // Item contructor
    const item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    // Data Structures/ State
    const data = {
        // items: [
        //     {id:0, name: "Butter Chicken", calories: 700},
        //     {id:1, name: "Rice", calories: 150},
        //     {id:2, name: "Tea", calories: 75},
        // ],

        items: storageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0,
    };


    // Public Method
    return {
        getItems: () => { return data.items; },
        
        addNewData: function(name, calories) {

            const id = function() {
                if(data.items.length > 0) {
                    return data.items[data.items.length - 1].id + 1;
                }else {
                    return 0;
                }
            };
            const newItem = new item(id(), name, calories);
            
            data.items.push(newItem);
            return newItem;
            
        },

        getTotalCalories: function() {
            let total = 0;

            data.items.forEach(function(item) {
                total += parseInt(item.calories);
            });
            
            data.totalCalories = total;

            // return total calories
            return data.totalCalories;
        },

        getItemById: function(id) {
            let found = null;

            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },

        updatedItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            
            return found;
        },

        deleteItem: function(id) {
            // Get ids
            const ids = data.items.map(function(item) {
                return item.id;
            });

            // Get the index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
        },

        clearAllItems: function() {
            data.items = [];
        },

        setCurrentItem: function(currentItem) {
            data.currentItem = currentItem;
        },

        getCurrentItem: function() {
            return data.currentItem;
        },

        logData: () => { return data; }
    }
})();

// UI Controller
const uiCtrl = (function() {

    const UISelector = {
        itemLists: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        itemTotalCalories: '.total-calories',
        clearAllBtn: '.clear-btn',
        
    };

    return {
        populateItemLists: function(items) {
            let html = '';

            items.forEach(function(item) {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `
            });

            document.querySelector(UISelector.itemLists).innerHTML = html;
        },
        
        getItemInput: function() {
            return {
                name: document.querySelector(UISelector.itemName).value,
                calories: document.querySelector(UISelector.itemCalories).value
            }
        },

        addListItem: function(item) {
            document.querySelector(UISelector.itemLists).style.display = 'block';   

            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                             </a>`;
            
            //Insert Item
            document.querySelector(UISelector.itemLists).insertAdjacentElement('beforeend', li);
        },

        updateListItem: function(newUpdatedItem) {
            let listItems = document.querySelectorAll(UISelector.listItems);

            // Turn node list form list items
            listItems = Array.from(listItems);

            listItems.forEach(function(item) {
                const itemID = item.getAttribute('id');
                
                if(itemID === `item-${newUpdatedItem.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${newUpdatedItem.name}: </strong> <em>${newUpdatedItem.calories} Calories</em>
                                                                        <a href="#" class="secondary-content">
                                                                            <i class="edit-item fa fa-pencil"></i>
                                                                        </a>`;
                }
            });
        },

        deleteListItem: function(id) {
            const itemId = `#item-${id}`;

            const item = document.querySelector(itemId);

            item.remove();
        },

        addItemToForm: function() {
            document.querySelector(UISelector.itemName).value = itemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCalories).value = itemCtrl.getCurrentItem().calories;
            uiCtrl.showEditState();
        },

        removeItem: function() {
            let listItems = document.querySelector(UISelector.listItems);

            // Converting into Array
            listItems = Array.from(listItems);

            listItems.forEach(function(item) {
                item.remove();
            });
        },

        showTotalCalories: function(calories) {
            document.querySelector(UISelector.itemTotalCalories).textContent = calories; 
        },

        clearInputFields: function() {
            document.querySelector(UISelector.itemName).value = '';
            document.querySelector(UISelector.itemCalories).value = '';
        },

        hideList: function() {
            document.querySelector(UISelector.itemLists).style.display = 'none';
        },

        clearEditState: function() {
            uiCtrl.clearInputFields();
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
        },
        
        showEditState: function() {
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },

        getSelectors: function() { return UISelector; },

    }
})();

// App Controller
const App = (function(itemCtrl, storageCtrl, uiCtrl) {

    // Load Event Listeners
    const loadEventListeners = function() {
        // Get UI selectors
        const UISelector = uiCtrl.getSelectors();

        // Add item event
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keycode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })
        
        // Edit Icon click event
        document.querySelector(UISelector.itemLists).addEventListener('click', itemEditClick)
        
        // Update item event
        document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateSubmit);
        
        // Delete item event
        document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelector.backBtn).addEventListener('click', uiCtrl.clearEditState);

        // Clear items event
        document.querySelector(UISelector.clearAllBtn).addEventListener('click', clearAllItemsClick);
    };

    const itemAddSubmit = function(e){
        console.log('Added');

        // Get form input from UI Controller
        const input = uiCtrl.getItemInput();
        
        if(input.name === '' || input.calories === '') {
            alert('Please enter the respected values');
        }else {
            const newItem = itemCtrl.addNewData(input.name, input.calories);

            // Add item in the UI
            uiCtrl.addListItem(newItem);

            // Store in local Storage
            storageCtrl.storeItem(newItem);

            // Clear input fields
            uiCtrl.clearInputFields();

            // Get total calories
            const totalCalories = itemCtrl.getTotalCalories();
            // Show total Calories
            uiCtrl.showTotalCalories(totalCalories);
        }

        e.preventDefault();
    };

    // Click edit item
    const itemEditClick = function(e) {

        if(e.target.classList.contains('edit-item')) {
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;
            
            // Parse the list id and get the id
            const listIdArray = listId.split('-');
            const mainId = parseInt(listIdArray[1]);
            
            // Get item by id
            const itemToEdit = itemCtrl.getItemById(mainId);
            
            // Set current Item
            itemCtrl.setCurrentItem(itemToEdit);

            uiCtrl.addItemToForm();
        }

        e.preventDefault();
    };

    const itemUpdateSubmit = function(e) {
        console.log('Updated');

        // Get item input
        const input = uiCtrl.getItemInput();

        // Update Item
        const updatedItem = itemCtrl.updatedItem(input.name, input.calories);

        // Update list item in UI
        uiCtrl.updateListItem(updatedItem);

        const totalCalories = itemCtrl.getTotalCalories();
        uiCtrl.showTotalCalories(totalCalories);

        // Update LocalStorage
        storageCtrl.updateItemStorage(updatedItem);

        uiCtrl.clearEditState();

        e.preventDefault();
    };

    const itemDeleteSubmit = function(e) {
        // Get current Item
        const currentItem = itemCtrl.getCurrentItem();

        // Delete from data structure
        itemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        uiCtrl.deleteListItem(currentItem.id);

        const totalCalories = itemCtrl.getTotalCalories();
        uiCtrl.showTotalCalories(totalCalories);

        // Delete from local storage
        storageCtrl.deleteItemFromStorage(currentItem.id);

        uiCtrl.clearEditState();

        e.preventDefault();
    };

    const clearAllItemsClick = function() {
        // Delete All items from data structure
        itemCtrl.clearAllItems();

        // UI Controller
        uiCtrl.removeItem();

        const totalCalories = itemCtrl.getTotalCalories();
        uiCtrl.showTotalCalories(totalCalories);

        // Hide the UI
        uiCtrl.hideList();

        // Clear from localStorage
        storageCtrl.clearItemsFromStorage();
    };

    return {
        init: function() {
            // Clear edit state
            uiCtrl.clearEditState();

            console.log("Initializing App");
            
            // Fetch Items from data structures
            const items = itemCtrl.getItems();

            // check if any items
            if(items.length === 0) {
                uiCtrl.hideList();
            }else {
                // Populate lists with items
                uiCtrl.populateItemLists(items);
            }

            // Get total calories
            const totalCalories = itemCtrl.getTotalCalories();
            // Show total Calories
            uiCtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }
})(itemCtrl, storageCtrl, uiCtrl);

App.init();
