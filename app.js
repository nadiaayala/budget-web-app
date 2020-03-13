//Model
var budgetController = (function(){
    var Expense = function(description, value){
        this.description = description;
        this.value = value;
    }

    var Income = function(description, value){
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        }
    }

    return {
        addItem: function(type, description, val){
            var newItem;
            if (type == 'exp'){
                newItem = new Expense(description, val);
            }
            else if (type == 'inc') {
                newItem = new Income(description, val);
            }
            data.allItems[type].push(newItem);
        },
        returnData: function(){
            return data;
        }
    }

})();

//View
var UIController = (function(){

})();

//Controller
var controller = (function(budgetCtrl, UICtrl){
    document.querySelector('.add__btn').addEventListener('click', function(){
        console.log('Add clicked');
        
        //1. Get the field input data
        let type = document.querySelector('.add__type').value;
        console.log(type);
        let desc = document.querySelector('.add__description').value;
        let val = document.querySelector('.add__value').value;

        //2.Add the item to the budget controller
        budgetCtrl.addItem(type, desc, val);
        console.log(budgetCtrl.returnData());
    
        //3.Add the item to the UI

        //4. Calculate the budget

        //5.Display the budget on the UI
    });
})(budgetController, UIController);


// console.log(document.querySelector('.add'));
// console.log(document.getElementById('addButton'));

